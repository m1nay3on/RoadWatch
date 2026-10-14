const assert = require('node:assert/strict');
const test = require('node:test');
const { createStatusEmail } = require('../src/services/statusEmail');

test('status email greets the citizen and includes concern, address, status, and notes', () => {
  const email = createStatusEmail(
    {
      id: 'PF-1001',
      reporter: 'Alex Citizen',
      issue: 'Road damage',
      location: '10 Main Street, Quezon City',
    },
    'Needs Information',
    'Please provide a photo.',
  );

  assert.equal(email.subject, 'RoadWatch Report PF-1001 Status Update');
  assert.match(email.text, /Hello, Alex Citizen,/);
  assert.match(email.text, /Concern: Road damage/);
  assert.match(email.text, /Address: 10 Main Street, Quezon City/);
  assert.match(email.text, /Current status: Needs Information/);
  assert.match(email.text, /Please provide a photo\./);
  assert.doesNotMatch(email.text, /Previous status/);
});

test('status email escapes report and note content in HTML', () => {
  const email = createStatusEmail(
    {
      id: '<PF-1>',
      reporter: '<img src=x>',
      issue: '<img src=x>',
      location: '<script>address</script>',
    },
    'Needs Information',
    '<script>alert(1)</script>',
  );

  assert.doesNotMatch(email.html, /<script>|<img/);
  assert.match(email.html, /Hello, <strong>&lt;img src=x&gt;<\/strong>/);
  assert.match(email.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(email.html, /Previous status/);
});
