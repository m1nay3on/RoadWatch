const crypto = require('node:crypto');
const express = require('express');
const { requireAuth, requireRole, signToken } = require('../middleware/auth');
const { Assignment, Category, Report, ReportPhoto, StatusLog, User, Verification } = require('../models');
const { hashPassword } = require('../services/seedDefaults');
const { applyListQuery } = require('../utils/listQuery');
const {
  canTransition,
  isPriority,
  validateAssignmentInput,
  validateReportInput,
  validateUserInput,
} = require('../validators/workflow');

const router = express.Router();
const passwordFields = ['password', 'passwordHash', 'password_hash', 'passwordHashValue'];
const inspectionStatuses = ['Verified', 'Needs Information', 'Rejected'];

function camelize(value) {
  if (Array.isArray(value)) return value.map(camelize);
  if (!value || typeof value !== 'object' || value instanceof Date) return value;

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key === '_id' ? key : key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    camelize(item),
  ]));
}

function plain(document) {
  return camelize(document?.toObject ? document.toObject() : document || {});
}

function safeUser(document) {
  const user = plain(document);
  delete user._id;
  for (const field of passwordFields) delete user[field];
  delete user.__v;
  if (!user.role && user.userRole) user.role = user.userRole;
  return user;
}

function publicReport(document) {
  const report = plain(document);
  report.id = report.id || report.reportId || String(report._id);
  delete report._id;
  delete report.__v;
  return report;
}

function getEmail(user) {
  return String(user.email || user.emailAddress || '').toLowerCase();
}

function passwordMatches(user, password) {
  const stored = String(user.password || user.passwordHash || user.password_hash || '');
  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$');
    const expected = Buffer.from(hash || '', 'hex');
    if (!salt || expected.length !== 64) return false;
    const actual = crypto.scryptSync(password, salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
  }
  return stored === password;
}

function createToken(user) {
  return signToken({
    email: getEmail(user),
    userId: user._id ? String(user._id) : '',
    role: user.role,
    expiresAt: Date.now() + (8 * 60 * 60 * 1000),
  });
}

function reportQueryById(id) {
  return { $or: [{ id }, { reportId: id }, { report_id: id }] };
}

function sendList(res, items, query, configuration) {
  const result = applyListQuery(items, query, configuration);
  if (result.error) return res.status(400).json({ message: result.error });
  return res.json(result.requested ? { data: result.data, pagination: result.pagination } : result.data);
}

async function canAccessReport(req, reportId) {
  if (req.auth.role !== 'Citizen') return true;
  const reportDocument = await Report.findOne(reportQueryById(reportId));
  if (!reportDocument) return false;
  const report = publicReport(reportDocument);
  return (
    String(report.reporterEmail || report.createdByEmail || '').toLowerCase() === req.auth.email ||
    String(report.citizenId || '') === req.auth.userId
  );
}

router.post('/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const candidates = await User.find({}).limit(1000);
    const user = candidates.find((candidate) => getEmail(plain(candidate)) === email);

    if (!user || !passwordMatches(plain(user), password)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const currentUser = plain(user);
    if (!currentUser.role && currentUser.userRole) currentUser.role = currentUser.userRole;
    if (!['Citizen', 'Field Inspector', 'Administrator'].includes(currentUser.role)) {
      return res.status(403).json({ message: 'This account has an unsupported role.' });
    }

    if (!String(currentUser.password || '').startsWith('scrypt$')) {
      user.password = await hashPassword(password);
      await user.save();
    }

    return res.json({ token: createToken(currentUser), user: safeUser(currentUser) });
  } catch (error) {
    return next(error);
  }
});

router.post('/auth/register', async (req, res, next) => {
  try {
    const input = req.body || {};
    const validation = validateUserInput(input);
    if (validation.error) return res.status(400).json({ message: validation.error });
    const { email, password, firstName, lastName, birthday, mobile, address } = validation.value;

    const existingUsers = await User.find({}).limit(1000);
    if (existingUsers.some((user) => getEmail(plain(user)) === email)) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      firstName,
      lastName,
      birthday,
      mobile,
      address,
      email,
      password: await hashPassword(password),
      role: 'Citizen',
      createdAt: new Date(),
    });
    return res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    return next(error);
  }
});

router.get('/auth/me', requireAuth, async (req, res, next) => {
  try {
    const users = await User.find({}).limit(1000);
    const user = users.find((candidate) => getEmail(plain(candidate)) === req.auth.email);
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' });
    return res.json({ user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', requireAuth, requireRole('Administrator'), async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(1000);
    return sendList(res, users.map(safeUser), req.query, {
      defaultSort: 'createdAt',
      sortFields: {
        createdAt: ['createdAt', 'created_at'],
        firstName: ['firstName', 'first_name'],
        lastName: ['lastName', 'last_name'],
        email: ['email', 'emailAddress'],
        role: ['role', 'userRole'],
      },
      filterFields: { role: ['role', 'userRole'] },
      searchFields: ['firstName', 'lastName', 'email', 'role'],
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/users', requireAuth, requireRole('Administrator'), async (req, res, next) => {
  try {
    const input = req.body || {};
    const validation = validateUserInput(input, { administrator: true });
    if (validation.error) return res.status(400).json({ message: validation.error });
    const { email, password, firstName, lastName, role, address } = validation.value;

    const existingUsers = await User.find({}).limit(1000);
    if (existingUsers.some((user) => getEmail(plain(user)) === email)) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      address,
      password: await hashPassword(password),
      createdAt: new Date(),
    });
    return res.status(201).json(safeUser(user));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    return next(error);
  }
});

router.get('/categories', requireAuth, async (req, res, next) => {
  try {
    const categories = await Category.find({ active: { $ne: false } }).sort({ name: 1, category_name: 1 });
    return sendList(res, categories.map((category) => plain(category)), req.query, {
      defaultSort: 'name',
      sortFields: { name: ['name', 'categoryName', 'category_name'] },
      filterFields: {},
      searchFields: ['name', 'categoryName', 'category_name', 'description'],
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/reports', requireAuth, async (req, res, next) => {
  try {
    let reports = await Report.find({}).sort({ createdAt: -1, created_at: -1 }).limit(2000);
    reports = reports.map(publicReport);
    if (req.auth.role === 'Citizen') {
      reports = reports.filter((report) => (
        String(report.reporterEmail || report.createdByEmail || '').toLowerCase() === req.auth.email ||
        String(report.citizenId || '') === req.auth.userId
      ));
    }
    return sendList(res, reports, req.query, {
      defaultSort: 'createdAt',
      sortFields: {
        createdAt: ['createdAt', 'created_at'],
        status: ['status'],
        priority: ['priority'],
        category: ['category', 'issue'],
        location: ['location'],
        id: ['id', 'reportId', 'report_id'],
      },
      filterFields: {
        status: ['status'],
        category: ['category', 'issue'],
        priority: ['priority'],
      },
      searchFields: ['id', 'reportId', 'reporter', 'category', 'issue', 'location', 'description', 'status'],
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/reports/:id', requireAuth, async (req, res, next) => {
  try {
    if (!await canAccessReport(req, req.params.id)) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    const report = await Report.findOne(reportQueryById(req.params.id));
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    return res.json(publicReport(report));
  } catch (error) {
    return next(error);
  }
});

router.post('/reports', requireAuth, requireRole('Citizen'), async (req, res, next) => {
  try {
    const validation = validateReportInput(req.body);
    if (validation.error) return res.status(400).json({ message: validation.error });
    const input = validation.value;

    const category = await Category.findOne({ $or: [{ category_name: input.category }, { name: input.category }] });
    if (!category || category.active === false) {
      return res.status(400).json({ message: 'Select an active report category.' });
    }

    const id = `PF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const userDocs = await User.find({}).limit(1000);
    const user = userDocs.find((candidate) => getEmail(plain(candidate)) === req.auth.email);
    const userData = safeUser(user);
    const createdAt = new Date();
    const report = await Report.create({
      id,
      report_id: id,
      citizen_id: user?._id,
      category_id: category?._id,
      issue: input.category,
      category: input.category,
      location: input.location,
      description: input.description,
      evidence: input.evidence,
      date: createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      priority: 'Medium',
      status: 'New',
      reporter: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      reporterEmail: req.auth.email,
      createdByEmail: req.auth.email,
      createdAt,
      created_at: createdAt,
    });

    await StatusLog.create({
      report_id: id,
      status: 'New',
      changed_by: user?._id,
      changed_at: new Date(),
      updatedByEmail: req.auth.email,
    });
    if (input.evidence) {
      await ReportPhoto.create({
        report_id: id,
        filename: String(input.evidence),
        uploaded_by_email: req.auth.email,
        created_at: new Date(),
      });
    }
    return res.status(201).json(publicReport(report));
  } catch (error) {
    return next(error);
  }
});

router.patch('/reports/:id/status', requireAuth, requireRole('Field Inspector', 'Administrator'), async (req, res, next) => {
  try {
    const body = req.body || {};
    const { status } = body;
    if (typeof status !== 'string') return res.status(400).json({ message: 'A report status is required.' });

    const report = await Report.findOne(reportQueryById(req.params.id));
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    const currentReport = plain(report);
    const previousStatus = currentReport.status;
    if (!canTransition(req.auth.role, previousStatus, status)) {
      return res.status(409).json({ message: `Cannot move a ${previousStatus} report to ${status}.` });
    }

    const now = new Date();
    const update = {};
    const actor = await User.findOne({ email: req.auth.email });
    if (!actor) return res.status(401).json({ message: 'Account no longer exists.' });

    if (inspectionStatuses.includes(status)) {
      const notes = typeof body.verificationNotes === 'string'
        ? body.verificationNotes.trim()
        : '';
      const priority = body.priority === undefined
        ? currentReport.priority || 'Medium'
        : body.priority;
      if (!notes || notes.length > 2000) {
        return res.status(400).json({ message: 'Inspector notes are required and must be at most 2000 characters.' });
      }
      if (!isPriority(priority)) {
        return res.status(400).json({ message: 'Priority must be Low, Medium, or High.' });
      }
      const inspectorData = plain(actor);
      update.verificationNotes = notes;
      update.priority = priority;
      update.inspectedBy = `${inspectorData.firstName || ''} ${inspectorData.lastName || ''}`.trim();
      update.inspectedByEmail = req.auth.email;
      update.inspectedAt = now;
      if (status === 'Verified') {
        update.verifiedBy = update.inspectedBy;
        update.verifiedAt = now;
      }
    }

    if (status === 'Ongoing') {
      const assignment = await Assignment.findOne({ report_id: req.params.id, status: 'Active' });
      if (!assignment) return res.status(409).json({ message: 'Assign this verified report before starting repair work.' });
      if (req.auth.role === 'Field Inspector' && assignment.assigned_to_email !== req.auth.email) {
        return res.status(403).json({ message: 'Only the assigned inspector can update this repair.' });
      }
    }

    if (status === 'Closed') {
      update.closedAt = now;
      update.closedByEmail = req.auth.email;
      if (body.completionNotes !== undefined && typeof body.completionNotes !== 'string') {
        return res.status(400).json({ message: 'Completion notes must be text.' });
      }
      const completionNotes = (body.completionNotes || '').trim();
      if (completionNotes.length > 2000) {
        return res.status(400).json({ message: 'Completion notes must be at most 2000 characters.' });
      }
      if (completionNotes) update.completionNotes = completionNotes;
    }

    report.set({ ...update, status, updatedAt: now });
    await report.save();
    await StatusLog.create({
      report_id: req.params.id,
      previousStatus,
      status,
      details: update,
      changed_by: actor._id,
      changed_at: now,
      updatedByEmail: req.auth.email,
    });

    if (inspectionStatuses.includes(status)) {
      await Verification.findOneAndUpdate(
        { report_id: req.params.id },
        {
          report_id: req.params.id,
          status,
          inspector_id: actor._id,
          inspectorEmail: req.auth.email,
          inspectedBy: update.inspectedBy,
          notes: update.verificationNotes,
          priority: update.priority,
          inspectedAt: update.inspectedAt,
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
    }
    if (status === 'Closed') {
      await Assignment.updateOne(
        { report_id: req.params.id, status: 'Active' },
        {
          $set: {
            status: 'Completed',
            completed_at: now,
            completed_by_email: req.auth.email,
            completion_notes: update.completionNotes || '',
          },
        },
      );
    }
    return res.json(publicReport(report));
  } catch (error) {
    return next(error);
  }
});

router.get('/reports/:id/status-logs', requireAuth, async (req, res, next) => {
  try {
    if (!await canAccessReport(req, req.params.id)) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    const logs = await StatusLog.find({ report_id: req.params.id }).sort({ changed_at: 1 });
    return res.json(logs.map(plain));
  } catch (error) {
    return next(error);
  }
});

router.get('/reports/:id/verification', requireAuth, async (req, res, next) => {
  try {
    if (!await canAccessReport(req, req.params.id)) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    const verification = await Verification.findOne({ report_id: req.params.id });
    if (!verification) return res.status(404).json({ message: 'Verification record not found.' });
    return res.json(plain(verification));
  } catch (error) {
    return next(error);
  }
});

router.get('/reports/:id/photos', requireAuth, async (req, res, next) => {
  try {
    if (!await canAccessReport(req, req.params.id)) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    const photos = await ReportPhoto.find({ report_id: req.params.id }).sort({ created_at: 1 });
    return res.json(photos.map(plain));
  } catch (error) {
    return next(error);
  }
});

router.get('/assignments', requireAuth, requireRole('Field Inspector', 'Administrator'), async (req, res, next) => {
  try {
    const query = req.auth.role === 'Administrator' ? {} : { assigned_to_email: req.auth.email };
    const assignments = await Assignment.find(query).sort({ assigned_at: -1 });
    return sendList(res, assignments.map(plain), req.query, {
      defaultSort: 'assignedAt',
      sortFields: {
        assignedAt: ['assignedAt', 'assigned_at'],
        status: ['status'],
        reportId: ['reportId', 'report_id'],
        assignedToEmail: ['assignedToEmail', 'assigned_to_email'],
      },
      filterFields: { status: ['status'] },
      searchFields: ['reportId', 'report_id', 'assignedToEmail', 'assigned_to_email', 'status'],
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/assignments', requireAuth, requireRole('Administrator'), async (req, res, next) => {
  try {
    const validation = validateAssignmentInput(req.body);
    if (validation.error) return res.status(400).json({ message: validation.error });
    const { reportId, assignedToEmail } = validation.value;
    const [report, inspector, administrator] = await Promise.all([
      Report.findOne(reportQueryById(reportId)),
      User.findOne({ email: assignedToEmail }),
      User.findOne({ email: req.auth.email }),
    ]);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (!['Verified', 'Ongoing'].includes(plain(report).status)) {
      return res.status(409).json({ message: 'Only verified reports can be assigned for repair.' });
    }
    if (!inspector || plain(inspector).role !== 'Field Inspector') {
      return res.status(400).json({ message: 'The assigned account must be a field inspector.' });
    }
    const assignment = await Assignment.findOneAndUpdate(
      { report_id: reportId },
      {
        report_id: reportId,
        assigned_to_email: assignedToEmail,
        crew_supervisor_id: inspector._id,
        assigned_by: administrator?._id,
        status: 'Active',
        assigned_at: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    return res.status(201).json(plain(assignment));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
module.exports.camelize = camelize;
module.exports.publicReport = publicReport;