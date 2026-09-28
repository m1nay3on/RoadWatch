const assert = require('node:assert/strict');
const test = require('node:test');
const api = require('../src/routes/api');

test('Mongo _id remains distinct from the public report id', () => {
  const report = api.publicReport({ _id: 'mongo-id', id: 'PF-0001', created_at: '2026-09-28' });

  assert.equal(report.id, 'PF-0001');
  assert.equal(report.createdAt, '2026-09-28');
  assert.equal(Object.hasOwn(report, '_id'), false);
});

test('legacy snake_case fields normalize to frontend camelCase', () => {
  assert.deepEqual(api.camelize({ report_id: 'PF-0001', changed_at: 'today' }), {
    reportId: 'PF-0001',
    changedAt: 'today',
  });
});