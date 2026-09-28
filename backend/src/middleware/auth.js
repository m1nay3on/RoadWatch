const crypto = require('node:crypto');

const tokenSecret = () => process.env.AUTH_TOKEN_SECRET || 'roadwatch-local-development-secret';

function signToken(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', tokenSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const [encodedPayload, signature] = (token || '').split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', tokenSecret())
    .update(encodedPayload)
    .digest();
  const suppliedSignature = Buffer.from(signature, 'base64url');

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Authentication is required.' });
  }

  req.auth = user;
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'You do not have permission to do that.' });
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole, signToken, verifyToken };