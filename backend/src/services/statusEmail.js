const nodemailer = require('nodemailer');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function createStatusEmail(report, status, notes = '') {
  const reportId = String(report.id || report.reportId || 'Unknown');
  const issue = String(report.issue || report.category || 'Infrastructure report');
  const reporterName = String(report.reporter || 'Citizen').trim() || 'Citizen';
  const location = String(report.location || 'Not provided');
  const safeId = escapeHtml(reportId);
  const safeIssue = escapeHtml(issue);
  const safeReporterName = escapeHtml(reporterName);
  const safeLocation = escapeHtml(location);
  const safeStatus = escapeHtml(status);
  const cleanNotes = typeof notes === 'string' ? notes.trim() : '';
  const safeNotes = escapeHtml(cleanNotes);

  return {
    subject: `RoadWatch Report ${reportId} Status Update`,
    text: [
      `Hello, ${reporterName},`,
      '',
      `There is an update to your RoadWatch report.`,
      `Report ID: ${reportId}`,
      `Concern: ${issue}`,
      `Address: ${location}`,
      `Current status: ${status}`,
      ...(cleanNotes ? ['', `Additional information: ${cleanNotes}`] : []),
      '',
      'Thank you,',
      'RoadWatch',
    ].join('\n'),
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f2f5f9;font-family:Arial,sans-serif;color:#172b45;">
    <table role="presentation" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #dce4ee;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:22px 28px;background:#07152b;color:#ffffff;">
          <div style="font-size:12px;font-weight:bold;letter-spacing:2px;color:#f4a261;">ROADWATCH</div>
          <h1 style="margin:8px 0 0;font-size:22px;">Report Status Update</h1>
        </td>
      </tr>=
      <tr>
        <td style="padding:26px 28px;">
          <p style="margin:0 0 18px;font-size:16px;">Hello, <strong>${safeReporterName}</strong>,</p>
          <p style="margin:0 0 20px;color:#52647a;line-height:1.6;">There is an update to your RoadWatch report.</p>
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e7edf4;color:#64758a;width:120px;">Report ID</td><td style="padding:10px 0;border-bottom:1px solid #e7edf4;font-weight:bold;">${safeId}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e7edf4;color:#64758a;">Concern</td><td style="padding:10px 0;border-bottom:1px solid #e7edf4;">${safeIssue}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e7edf4;color:#64758a;">Address</td><td style="padding:10px 0;border-bottom:1px solid #e7edf4;">${safeLocation}</td></tr>
          </table>
          <div style="margin-top:22px;padding:15px 18px;border-left:4px solid #f4a261;border-radius:6px;background:#fff7ed;">
            <div style="margin-bottom:5px;color:#64758a;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Current Status</div>
            <strong style="font-size:17px;color:#9a4d10;">${safeStatus}</strong>
          </div>
          ${cleanNotes ? `<div style="margin-top:18px;padding:15px 18px;border:1px solid #e7edf4;border-radius:6px;"><strong style="display:block;margin-bottom:7px;">Additional information</strong><div style="color:#52647a;line-height:1.6;">${safeNotes.replace(/\n/g, '<br>')}</div></div>` : ''}
          <p style="margin:24px 0 0;color:#52647a;line-height:1.6;">Thank you,<br><strong>RoadWatch</strong></p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

async function sendReportStatusEmail(report, status, notes = '') {
  const recipient = String(report.reporterEmail || report.createdByEmail || '').trim();
  if (!recipient) {
    return { sent: false, reason: 'missing_recipient' };
  }

  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  if (!host || !from) {
    return { sent: false, reason: 'smtp_not_configured' };
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (Boolean(user) !== Boolean(pass)) {
    throw new Error('SMTP_USER and SMTP_PASS must both be configured, or both left empty.');
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid TCP port.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    ...(user ? { auth: { user, pass } } : {}),
  });
  const message = createStatusEmail(report, status, notes);
  await transporter.sendMail({
    from,
    to: recipient,
    ...message,
  });

  return { sent: true };
}

module.exports = { createStatusEmail, sendReportStatusEmail };
