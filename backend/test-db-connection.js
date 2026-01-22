// Test database connection script
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'campus_care'}`);
  console.log(`  Password: ${process.env.DB_PASSWORD ? '***set***' : 'NOT SET'}\n`);

  try {
    // First, try to connect without specifying database (to check if MySQL is running)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('✅ Successfully connected to MySQL server!');

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbNames = databases.map(db => db.Database);
    
    console.log('\nAvailable databases:');
    dbNames.forEach(db => console.log(`  - ${db}`));

    if (dbNames.includes(process.env.DB_NAME || 'campus_care')) {
      console.log(`\n✅ Database '${process.env.DB_NAME || 'campus_care'}' exists!`);
    } else {
      console.log(`\n❌ Database '${process.env.DB_NAME || 'campus_care'}' does NOT exist!`);
      console.log('\nTo create the database, run this SQL command:');
      console.log(`CREATE DATABASE ${process.env.DB_NAME || 'campus_care'};`);
    }

    await connection.end();
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);

    if (error.code === 'ECONNREFUSED') {
      console.log('Possible issues:');
      console.log('  1. MySQL server is not running');
      console.log('  2. Wrong host or port');
      console.log('  3. Firewall blocking connection\n');
      console.log('Solutions:');
      console.log('  - Start MySQL server');
      console.log('  - Check if MySQL is running on port', process.env.DB_PORT || 3306);
      console.log('  - Verify host:', process.env.DB_HOST || 'localhost');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Possible issues:');
      console.log('  1. Wrong username');
      console.log('  2. Wrong password');
      console.log('  3. User does not have permission\n');
      console.log('Solutions:');
      console.log('  - Check your .env file credentials');
      console.log('  - Verify MySQL username and password');
    } else if (error.code === 'ENOTFOUND') {
      console.log('Possible issues:');
      console.log('  1. Wrong host name');
      console.log('  2. DNS resolution failed\n');
      console.log('Solutions:');
      console.log('  - Use "localhost" or "127.0.0.1" for local MySQL');
    } else {
      console.log('Error code:', error.code);
      console.log('Check the error message above for details.');
    }
  }
}

testConnection();
