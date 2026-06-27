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

    // Check what tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Existing tables:', tables.map(t => Object.values(t)[0]));

    // Run only the safe parts of init_data.sql
    console.log('📊 Inserting avatars...');
    await connection.query(`
      INSERT IGNORE INTO avatars (avatar_url) VALUES 
      ('/avatars/Fox.jpeg'),
      ('/avatars/Eagle.jpeg'),
      ('/avatars/Dragon.jpeg'),
      ('/avatars/Serpent.jpeg'),
      ('/avatars/Unicorn.jpeg')
    `);

    console.log('🌍 Inserting states...');
    await connection.query(`
      INSERT IGNORE INTO states (state_name) VALUES
      ('Andhra Pradesh'), ('Arunachal Pradesh'), ('Assam'), ('Bihar'), ('Chattisgarh'),
      ('Goa'), ('Gujrat'), ('Haryana'), ('Himachal Pradesh'), ('Jharkhand'),
      ('Karnataka'), ('Kerala'), ('Madhya Pradesh'), ('Maharashtra'), ('Manipur'),
      ('Meghalaya'), ('Mizoram'), ('Nagaland'), ('Odisha'), ('Punjab'),
      ('Rajasthan'), ('Sikkim'), ('Tamil Nadu'), ('Telangana'), ('Tripura'),
      ('Uttar Pradesh'), ('Uttarakhand'), ('West Bengal'), ('UT : Andaman and Nicobar Islands'),
      ('UT : Chandigarh'), ('UT : Dadra and Nagar Haveli and Daman and Diu'),
      ('UT : Delhi(NCT)'), ('UT : Jammu and Kashmir'), ('UT : Ladakh'), ('UT : Lakshadweep'), ('UT : Puducherry')
    `);

    console.log('🎓 Inserting college...');
    await connection.query(`
      INSERT IGNORE INTO colleges (college_id, email_domain, college_name, city, state_id) 
      VALUES (1, 'mnnit.ac.in', 'Motilal Nehru National Institute of Technology Allahabad', 'Prayagraj', 26)
    `);

    console.log('📚 Inserting basic courses...');
    await connection.query(`
      INSERT IGNORE INTO courses (college_id, course_name) VALUES
      (1, 'B.Tech. in Computer Science and Engineering'),
      (1, 'B.Tech. in Electronics and Communication Engineering'),
      (1, 'B.Tech. in Electrical Engineering'),
      (1, 'B.Tech. in Mechanical Engineering'),
      (1, 'B.Tech. in Chemical Engineering'),
      (1, 'B.Tech. in Civil Engineering'),
      (1, 'B.Tech. in Bio Technology'),
      (1, 'B.Tech. in Materials Engineering'),
      (1, 'B.Tech. in Production and Industrial Engineering')
    `);

    // Run seed_data.sql
    console.log('🌱 Running seed_data.sql...');
    const seedData = fs.readFileSync('db/seed_data.sql', 'utf8');
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
    console.error('Full error:', error);
    process.exit(1);
  }
}

runSeedData();
