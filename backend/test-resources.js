const mysql = require('mysql2/promise');
require('dotenv').config();

async function testResourcesAPI() {
  try {
    console.log('🔍 Testing resources API data...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Test the exact query the Resource model uses
    console.log('📊 Testing findByCollegeId query...');
    const [resources] = await connection.execute(`
      SELECT 
        ar.resource_id, ar.resource_title, ar.resource_description, 
        ar.resource_link, ar.college_id, c.college_name
      FROM academic_resources ar
      INNER JOIN colleges c ON ar.college_id = c.college_id
      WHERE ar.college_id = ?
      ORDER BY ar.resource_id DESC
      LIMIT 10 OFFSET 0
    `, [1]);

    console.log(`Found ${resources.length} resources for college_id=1:`);
    resources.forEach((r, i) => {
      console.log(`${i+1}. ${r.resource_title}`);
      console.log(`   ${r.resource_description}`);
      console.log(`   ${r.resource_link}`);
      console.log(`   College: ${r.college_name}\n`);
    });

    // Test user college info
    console.log('👤 Testing user college info...');
    const [users] = await connection.execute(`
      SELECT user_id, email, college_id 
      FROM user_profiles 
      WHERE email LIKE '%@mnnit.ac.in%'
      LIMIT 1
    `);

    if (users.length > 0) {
      console.log(`User: ${users[0].email} (college_id: ${users[0].college_id})`);
    } else {
      console.log('No users found with @mnnit.ac.in email');
    }

    await connection.end();
    console.log('\n✅ Database test completed');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

testResourcesAPI();
