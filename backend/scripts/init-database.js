require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  const dbName = process.env.DB_NAME || 'campus_care';
  let connection;

  try {
    console.log('📡 Connecting to MySQL server...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    // ✅ MUST use query()
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' is ready\n`);

    // ❌ REMOVE USE DATABASE
    // await connection.execute(`USE \`${dbName}\``);

    // ✅ Reconnect WITH database
    await connection.end();
    connection = await mysql.createConnection({
      ...config,
      database: dbName
    });

    // ---------- SCHEMA ----------
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '..', 'db', 'schema.sql'),
      'utf8'
    );

    console.log('🔨 Executing schema.sql...');
    await connection.query(schemaSQL); // ✅ SINGLE CALL
    console.log('✅ Schema executed successfully\n');

    // ---------- INIT DATA ----------
    const initDataPath = path.join(__dirname, '..', 'db', 'init_data.sql');

    if (fs.existsSync(initDataPath)) {
      const initDataSQL = fs.readFileSync(initDataPath, 'utf8');
      console.log('📊 Executing init_data.sql...');
      await connection.query(initDataSQL); // ✅ SINGLE CALL
      console.log('✅ Master data inserted\n');
    }

    // ---------- VERIFICATION ----------
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables`);

    const [[states]] = await connection.query('SELECT COUNT(*) count FROM states');
    console.log(`   States: ${states.count}`);

    console.log('\n🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('\n❌ Database initialization failed!');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initializeDatabase();
