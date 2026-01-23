const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    console.log('🔍 Checking database contents...\n');

    // Check academic resources
    const [resources] = await connection.execute('SELECT COUNT(*) as count FROM academic_resources');
    console.log(`Academic Resources: ${resources[0].count}`);

    if (resources[0].count > 0) {
      const [sample] = await connection.execute('SELECT resource_title, resource_link FROM academic_resources LIMIT 3');
      console.log('\nSample resources:');
      sample.forEach(r => console.log(`- ${r.resource_title}`));
    }

    // Check user college
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM user_profiles');
    console.log(`\nRegistered Users: ${users[0].count}`);

    if (users[0].count > 0) {
      const [sampleUser] = await connection.execute('SELECT email, college_id FROM user_profiles LIMIT 1');
      console.log(`Sample user: ${sampleUser[0].email} (college_id: ${sampleUser[0].college_id})`);
    }

    await connection.end();

    if (resources[0].count === 0) {
      console.log('\n❌ No academic resources found! Run: node run-final-seed.js');
    } else {
      console.log('\n✅ Academic resources exist. Issue might be with backend or frontend.');
    }
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkDatabase();
