const mysql = require('mysql2/promise');

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_care',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the database connection (non-blocking)
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.warn('⚠️  Database connection failed:', err.message);
    console.warn('⚠️  Server will start but database operations will fail');
    console.warn('⚠️  Make sure your database is running and .env is configured correctly');
  });

module.exports = pool;
