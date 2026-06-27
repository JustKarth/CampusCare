const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'campus_care'
    });

    console.log('Checking database contents...\n');

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`Found ${tables.length} tables`);

    // Check avatars
    const [avatars] = await connection.execute('SELECT COUNT(*) as count FROM avatars');
    console.log(`Avatars: ${avatars[0].count}`);

    // Check states
    const [states] = await connection.execute('SELECT COUNT(*) as count FROM states');
    console.log(`States: ${states[0].count}`);

    // Check colleges
    const [colleges] = await connection.execute('SELECT COUNT(*) as count FROM colleges');
    console.log(`Colleges: ${colleges[0].count}`);

    // Check courses
    const [courses] = await connection.execute('SELECT COUNT(*) as count FROM courses');
    console.log(`Courses: ${courses[0].count}`);

    // Check academic resources
    const [resources] = await connection.execute('SELECT COUNT(*) as count FROM academic_resources');
    console.log(`Academic Resources: ${resources[0].count}`);

    // Show sample data
    const [sampleResources] = await connection.execute('SELECT resource_title FROM academic_resources LIMIT 3');
    console.log('\nSample resources:');
    sampleResources.forEach(r => console.log(`- ${r.resource_title}`));

    await connection.end();
    console.log('\nDatabase check completed!');
  } catch (error) {
    console.error('Database check failed:', error.message);
  }
}

checkDatabase();
