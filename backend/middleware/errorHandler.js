// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Duplicate entry. This record already exists.';
    error = {
      statusCode: 409,
      message
    };
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    const message = 'Referenced record does not exist.';
    error = {
      statusCode: 400,
      message
    };
  }

  // MySQL connection error
  if (err.code === 'ECONNREFUSED') {
    const message = 'Database connection failed.';
    error = {
      statusCode: 500,
      message
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token.';
    error = {
      statusCode: 401,
      message
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired.';
    error = {
      statusCode: 401,
      message
    };
  }

  // Validation errors (from express-validator)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      statusCode: 400,
      message
    };
  }

  // Cast error (invalid ID format)
  if (err.name === 'CastError') {
    const message = 'Invalid ID format.';
    error = {
      statusCode: 400,
      message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
