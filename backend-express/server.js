require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase, disconnectFromDatabase, getDatabaseStatus } = require('./lib/database');

// Import routes
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const productsRoutes = require('./routes/products');
const servicesRoutes = require('./routes/services');
const machinesRoutes = require('./routes/machines');
const inspectionsRoutes = require('./routes/inspections');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');
const clientLogosRoutes = require('./routes/clientLogos');
const seedRoutes = require('./routes/seed');

const app = express();
const PORT = process.env.PORT || 8001;
let server;

const defaultAllowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://saitech.co.in',
  'https://www.saitech.co.in',
  'https://saitech-frontend.vercel.app',
];

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizedAllowedOrigins = new Set(
  (allowedOrigins.length > 0 ? allowedOrigins : defaultAllowedOrigins).map((origin) => origin.replace(/\/$/, ''))
);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (normalizedAllowedOrigins.has(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ 10mb limit — base64 images के लिए
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes - all prefixed with /api
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/machines', machinesRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/client-logos', clientLogosRoutes);
app.use('/api/seed', seedRoutes);

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'SAI TECH API is running',
    status: 'healthy',
    version: '2.0.0',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    orm: 'Mongoose',
    connection: getDatabaseStatus(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  try {
    await connectToDatabase();
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`SAI TECH Backend running on http://0.0.0.0:${PORT}`);
      console.log(`Database: MongoDB (${process.env.MONGODB_DB_NAME || 'default'}) with Mongoose`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnectFromDatabase();
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    return;
  }
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();

module.exports = app;
