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

test('priority and status transitions follow the workflow rules', () => {
  assert.equal(isPriority('High'), true);
  assert.equal(isPriority('Critical'), false);
  assert.equal(canTransition('Field Inspector', 'New', 'Verified'), true);
  assert.equal(canTransition('Field Inspector', 'New', 'Closed'), false);
  assert.equal(canTransition('Administrator', 'Verified', 'Closed'), true);
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