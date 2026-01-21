const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize database connection pool
// This ensures the database connection is established when the app starts
require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const localGuideRoutes = require('./routes/localGuideRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow frontend origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or file://)
    // In production, you should specify your frontend domain
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('file://')) {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins (change in production)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Campus Care API running',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blogs', commentRoutes);
app.use('/api/blogs', reactionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/local-guide', localGuideRoutes);

// 404 handler (must be before error handler)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
