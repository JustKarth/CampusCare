const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function debugResourcesAPI() {
  try {
    console.log('🔍 Debugging resources API...\n');

    // Test 1: Database connection
    console.log('1. Testing database connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });
    console.log('✅ Database connected');

    // Test 2: JWT token verification
    console.log('\n2. Testing JWT verification...');
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNzcwMjQwMCwiZXhwIjoxNzM4MzA2ODAwfQ.test'; // Invalid token
    try {
      jwt.verify(testToken, process.env.JWT_SECRET);
      console.log('❌ JWT verification should have failed');
    } catch (err) {
      console.log('✅ JWT verification correctly failed for invalid token');
    }

    // Test 3: Resource query execution
    console.log('\n3. Testing resource query...');
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
    console.log(`✅ Query executed successfully, found ${resources.length} resources`);

    // Test 4: User query
    console.log('\n4. Testing user query...');
    const [users] = await connection.execute(`
      SELECT user_id, email, college_id 
      FROM user_profiles 
      WHERE user_id = ?
    `, [1]);
    console.log(`✅ User query executed, found ${users.length} users`);

    await connection.end();
    console.log('\n🎉 All database tests passed! Issue might be in request parsing or middleware.');

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    console.error('Full error:', error);
  }
}

debugResourcesAPI();
