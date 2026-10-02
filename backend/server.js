require('dotenv').config();

const crypto = require('node:crypto');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./src/routes/api');
const { seedDefaults } = require('./src/services/seedDefaults');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  const startedAt = process.hrtime.bigint();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.info(JSON.stringify({
      level: 'info',
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    }));
  });
  return next();
});
app.use('/api/reports', express.json({ limit: '36mb' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api', apiRoutes);
app.use('/api', (req, res) => res.status(404).json({
  message: 'API endpoint not found.',
  error: { code: 'NOT_FOUND', requestId: req.requestId },
}));
app.use((error, req, res, next) => {
  const status = error.status || error.statusCode || (
    error.code === 11000 ? 409 :
      error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500
  );
  const safeStatus = status >= 400 && status <= 599 ? status : 500;
  const code = safeStatus === 400 ? 'BAD_REQUEST' :
    safeStatus === 401 ? 'UNAUTHORIZED' :
      safeStatus === 403 ? 'FORBIDDEN' :
        safeStatus === 404 ? 'NOT_FOUND' :
          safeStatus === 409 ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR';
  const message = safeStatus >= 500
    ? 'An unexpected server error occurred.'
    : error.message || 'The request could not be completed.';

  console.error(JSON.stringify({
    level: 'error',
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    status: safeStatus,
    errorName: error.name,
    errorCode: error.code,
  }));
  return res.status(safeStatus).json({
    message,
    error: { code, message, requestId: req.requestId },
  });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/softeng1';
  await mongoose.connect(mongoUri);
  await seedDefaults();
  console.log(`Connected to MongoDB database ${mongoose.connection.name}`);

  if (process.env.NODE_ENV === 'production' && !process.env.AUTH_TOKEN_SECRET) {
    throw new Error('AUTH_TOKEN_SECRET must be set in production');
  }

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start API server:', error.message);
  process.exit(1);
});