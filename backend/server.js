require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./src/routes/api');
const { seedDefaults } = require('./src/services/seedDefaults');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api', apiRoutes);

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