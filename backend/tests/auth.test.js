const assert = require('node:assert/strict');
const test = require('node:test');
const { signToken, verifyToken } = require('../src/middleware/auth');

process.env.AUTH_TOKEN_SECRET = 'test-secret-for-token-signing';

test('signed tokens validate until their expiry', () => {
  const token = signToken({ email: 'citizen@example.test', expiresAt: Date.now() + 60_000 });

  assert.equal(verifyToken(token).email, 'citizen@example.test');
});

test('expired and modified tokens are rejected', () => {
  const expired = signToken({ email: 'citizen@example.test', expiresAt: Date.now() - 1 });
  const valid = signToken({ email: 'citizen@example.test', expiresAt: Date.now() + 60_000 });

  assert.equal(verifyToken(expired), null);
  assert.equal(verifyToken(`${valid}x`), null);
});