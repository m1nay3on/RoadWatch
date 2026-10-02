const assert = require('node:assert/strict');
const test = require('node:test');
const { applyListQuery } = require('../src/utils/listQuery');

const configuration = {
  defaultSort: 'createdAt',
  sortFields: {
    createdAt: ['createdAt', 'created_at'],
    status: ['status'],
  },
  filterFields: { status: ['status'] },
  searchFields: ['id', 'description', 'status'],
};

const reports = [
  { id: 'PF-1', status: 'New', description: 'Pothole on Main Street', created_at: '2026-01-01' },
  { id: 'PF-2', status: 'Verified', description: 'Broken signal', createdAt: '2026-02-01' },
  { id: 'PF-3', status: 'New', description: 'Road damage', createdAt: '2026-03-01' },
];

test('list query preserves the legacy array response when no options are supplied', () => {
  const result = applyListQuery(reports, {}, configuration);

  assert.equal(result.requested, false);
  assert.deepEqual(result.data, reports);
});

test('list query filters, searches, sorts, and paginates', () => {
  const result = applyListQuery(reports, {
    status: 'new',
    search: 'road',
    sortBy: 'createdAt',
    order: 'asc',
    limit: '1',
  }, configuration);

  assert.deepEqual(result.data.map((report) => report.id), ['PF-3']);
  assert.deepEqual(result.pagination, {
    page: 1,
    limit: 1,
    totalItems: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
});

test('list query rejects invalid pagination and unsupported sort fields', () => {
  assert.match(applyListQuery(reports, { page: '0' }, configuration).error, /positive integer/i);
  assert.match(applyListQuery(reports, { page: '9007199254740991' }, configuration).error, /too large/i);
  assert.match(applyListQuery(reports, { sortBy: 'password' }, configuration).error, /unsupported sort/i);
});