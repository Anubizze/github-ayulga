const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security & performance
// Allow serving uploaded images to frontend running on another origin (e.g. :3000 -> :5000).
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/news', require('./routes/news'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/calculator', require('./routes/calculator'));

app.get('/api/health', async (req, res) => {
  let dbStatus = 'ok';
  try {
    const db = require('./config/database');
    const conn = await db.getConnection();
    conn.release();
  } catch {
    dbStatus = 'unavailable';
  }
  res.json({
    status: 'OK',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
