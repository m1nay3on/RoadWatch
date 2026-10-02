const assert = require('node:assert/strict');
const test = require('node:test');
const {
  canTransition,
  isPriority,
  validateAssignmentInput,
  validateReportInput,
  validateUserInput,
} = require('../src/validators/workflow');

const validCitizen = {
  firstName: 'Alex',
  lastName: 'Citizen',
  email: 'alex@example.com',
  password: 'secure123',
  birthday: '1990-01-01',
  mobile: '09171234567',
  address: {
    houseNumber: '10',
    street: 'Main Street',
    barangay: 'Central',
    city: 'Quezon City',
  },
};

test('registration validates adulthood, contact, and address fields', () => {
  assert.equal(validateUserInput(validCitizen).error, undefined);
  assert.match(validateUserInput({ ...validCitizen, email: 'invalid' }).error, /valid email/i);
  assert.match(validateUserInput({ ...validCitizen, birthday: '2015-01-01' }).error, /18 years old/i);
  assert.match(validateUserInput({ ...validCitizen, address: {} }).error, /address fields/i);
  assert.match(validateUserInput({ ...validCitizen, mobile: '-------' }).error, /mobile number/i);
});

test('report input trims text and rejects non-text fields', () => {
  const result = validateReportInput({
    category: ' Road Damage ',
    location: ' Main Street ',
    description: ' A pothole ',
  });
  assert.deepEqual(result.value, {
    category: 'Road Damage',
    location: 'Main Street',
    description: 'A pothole',
    evidence: '',
  });
  assert.match(validateReportInput({ category: {}, location: 'x', description: 'y' }).error, /must be text/i);
});

test('report input accepts validated image data and rejects mismatched image types', () => {
  const pngDataUrl = `data:image/png;base64,${Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]).toString('base64')}`;
  const evidence = {
    filename: 'road-damage.png',
    contentType: 'image/png',
    dataUrl: pngDataUrl,
  };
  const result = validateReportInput({
    category: 'Road Damage',
    location: 'Main Street',
    description: 'A pothole',
    evidence,
  });

  assert.deepEqual(result.value.evidence, evidence);
  assert.match(validateReportInput({
    category: 'Road Damage',
    location: 'Main Street',
    description: 'A pothole',
    evidence: { ...evidence, contentType: 'image/jpeg' },
  }).error, /valid filename/i);
});

test('report input accepts up to five evidence photos and rejects more', () => {
  const imageBytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const photos = Array.from({ length: 5 }, (_, index) => ({
    filename: `road-damage-${index + 1}.png`,
    contentType: 'image/png',
    dataUrl: `data:image/png;base64,${imageBytes.toString('base64')}`,
  }));
  const report = {
    category: 'Road Damage',
    location: 'Main Street',
    description: 'A pothole',
  };

  assert.equal(validateReportInput({ ...report, evidence: photos }).value.evidence.length, 5);
  assert.match(validateReportInput({
    ...report,
    evidence: [...photos, photos[0]],
  }).error, /at most 5 photos/i);
});

test('priority and status transitions follow the workflow rules', () => {
  assert.equal(isPriority('High'), true);
  assert.equal(isPriority('Critical'), false);
  assert.equal(canTransition('Field Inspector', 'New', 'Verified'), true);
  assert.equal(canTransition('Field Inspector', 'New', 'Closed'), false);
  assert.equal(canTransition('Field Inspector', 'Verified', 'Ongoing'), true);
  assert.equal(canTransition('Administrator', 'Verified', 'Ongoing'), false);
  assert.equal(canTransition('Administrator', 'Verified', 'Endorsed to Engineering Office'), true);
  assert.equal(canTransition('Administrator', 'Verified', 'Closed'), false);
  assert.equal(canTransition('Administrator', 'Endorsed to Engineering Office', 'Closed'), true);
  assert.equal(canTransition('Administrator', 'New', 'Closed'), false);
});

test('assignments require a report id and valid inspector email', () => {
  assert.deepEqual(validateAssignmentInput({
    reportId: ' PF-1001 ',
    assignedToEmail: 'INSPECTOR@example.com',
  }).value, {
    reportId: 'PF-1001',
    assignedToEmail: 'inspector@example.com',
  });
  assert.match(validateAssignmentInput({ reportId: 'PF-1', assignedToEmail: 'not-an-email' }).error, /valid report ID/i);
});