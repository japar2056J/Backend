const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

/* ===============================
   CORS CONFIGURATION
================================ */
app.use(cors({
  origin: true, // allow all origins (recommended for API backend)
  credentials: true
}));

/* ===============================
   BASIC MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===============================
   RATE LIMITER
================================ */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

/* ===============================
   REQUEST LOGGER
================================ */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ===============================
   ROOT ROUTE
================================ */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is running 🚀',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/* ===============================
   HEALTH CHECK
================================ */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* ===============================
   ROUTES
================================ */
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const componentRoutes = require('./routes/componentRoutes');
const estimationRoutes = require('./routes/estimationRoutes');
const riwayatRoutes = require('./routes/riwayatRoutes');
const kursRoutes = require('./routes/kursRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const auditRoutes = require('./routes/auditRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/estimations', estimationRoutes);
app.use('/api/riwayat', riwayatRoutes);
app.use('/api/kurs', kursRoutes);
app.use('/api/audit', auditRoutes);

/* ===============================
   404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
