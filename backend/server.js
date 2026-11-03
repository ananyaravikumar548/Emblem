const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const missing = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'].filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters in production.');
}

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const brandRoutes = require('./routes/brandRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const clientBuildPath = path.resolve(__dirname, '../frontend/build');
const configuredOrigins = (process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean);
const developmentOrigins = isProduction ? [] : [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
const allowedOrigins = new Set([...developmentOrigins, ...configuredOrigins]);

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProduction) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'EMBLEM Brand Identity API', uptime: process.uptime() });
});

app.get('/api/v1/ready', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ready' : 'not_ready', database: databaseReady ? 'connected' : 'disconnected' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/brand', brandRoutes);
app.use('/api/v1', (req, res) => res.status(404).json({ error: 'API route not found.' }));

if (fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
  app.use(express.static(clientBuildPath, { maxAge: isProduction ? '1h' : 0, index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: isProduction ? 'An unexpected server error occurred.' : err.message || 'Internal Server Error' });
});

async function startServer() {
  await connectDB();
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`[EMBLEM] Listening on port ${PORT}`);
      console.log(`[EMBLEM] Health: http://localhost:${PORT}/api/v1/health`);
      resolve(server);
    });
    server.once('error', reject);

    const shutdown = (signal) => {
      console.log(`[EMBLEM] ${signal} received; shutting down.`);
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGINT', () => shutdown('SIGINT'));
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('[EMBLEM startup failed]:', error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
