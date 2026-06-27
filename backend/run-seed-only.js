const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function runSeedData() {
  try {
    console.log('🌱 Starting seed data insertion...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Run init_data.sql
    const initData = fs.readFileSync('db/init_data.sql', 'utf8');
    console.log('📊 Running init_data.sql...');
    await connection.query(initData);
    console.log('✅ init_data.sql completed');

    // Run seed_data.sql
    const seedData = fs.readFileSync('db/seed_data.sql', 'utf8');
    console.log('🌱 Running seed_data.sql...');
    await connection.query(seedData);
    console.log('✅ seed_data.sql completed');

    // Check results
    const [avatars] = await connection.execute('SELECT COUNT(*) as count FROM avatars');
    const [states] = await connection.execute('SELECT COUNT(*) as count FROM states');
    const [colleges] = await connection.execute('SELECT COUNT(*) as count FROM colleges');
    const [courses] = await connection.execute('SELECT COUNT(*) as count FROM courses');
    const [resources] = await connection.execute('SELECT COUNT(*) as count FROM academic_resources');

    console.log('\n📊 Database Summary:');
    console.log(`   Avatars: ${avatars[0].count}`);
    console.log(`   States: ${states[0].count}`);
    console.log(`   Colleges: ${colleges[0].count}`);
    console.log(`   Courses: ${courses[0].count}`);
    console.log(`   Academic Resources: ${resources[0].count}`);

    console.log('\n🎉 Seed data insertion completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Seed data insertion failed:', error.message);
    process.exit(1);
  }
}

runSeedData();
