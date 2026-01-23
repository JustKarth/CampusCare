const mysql = require('mysql2/promise');
require('dotenv').config();

async function runFinalSeed() {
  try {
    console.log('🌱 Final seed data insertion...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Insert academic resources manually
    console.log('📚 Inserting academic resources...');
    await connection.query(`
      INSERT IGNORE INTO academic_resources (college_id, resource_title, resource_description, resource_link) VALUES
      (1, 'First Year Resources', 'Resources for the students of first year across all branches', 'https://drive.google.com/drive/folders/1-2Ecfzlgj5Kr260HKx1B8pgCDtWbiDhF'),
      (1, 'Computer Science and Engineering', 'Resources for students of second, pre-final and final years of Computer Science and Engineering department', 'https://drive.google.com/drive/u/0/folders/1MLMiaW0vq0K0lWtUakqLNXjBIfSa9Nw0'),
      (1, 'Electronics and Communication Engineering', 'Resources for students of second, pre-final and final years of Electronics and Communication Engineering department', 'https://drive.google.com/drive/folders/16g1SvodQLuXZknBlNXjVJXmBMUkcmZ8V'),
      (1, 'Electrical Engineering', 'Resources for students of second, pre-final and final years of Electrical Engineering department', 'https://drive.google.com/drive/u/0/folders/1qI6i_v7dTvWirq8syp60VAo750c-xXlH'),
      (1, 'Mechanical Engineering', 'Resources for students of second, pre-final and final years of Mechanical Engineering department', 'https://drive.google.com/drive/folders/12Bv_TftkQwZtE7ho9Zzm0UXKbYx1CBeg'),
      (1, 'Civil Engineering', 'Resources for students of second, pre-final and final years of Civil Engineering department', 'https://drive.google.com/drive/folders/1Ly4pGcHli_UU1XmLgtbT6qE_EV43LYjY'),
      (1, 'Chemical Engineering', 'Resources for students of second, pre-final and final years of Chemical Engineering department', 'https://drive.google.com/drive/folders/1LS5fXhC0G5ykhd8-yl_WD4Cjj-mC6VzT'),
      (1, 'Biotechnology', 'Resources for students of second, pre-final and final years of Biotechnology department', 'https://drive.google.com/drive/u/0/folders/10Gl296BcmzT2v8oaKSQQsBthFT8USjex'),
      (1, 'Production and Industrial Engineering', 'Resources for students of second, pre-final and final years of Production and Industrial Engineering department', 'https://drive.google.com/drive/folders/1THq-Nv3vxPxsDle_HhvKeEBmroz8LWDi'),
      (1, '7th Semester Open Electives', 'Resources for the open elective courses for students in their final year', 'https://drive.google.com/drive/u/0/folders/1x534EdiyftOrjEb_KYeMXazxbvi7Qlkw')
    `);

    // Insert additional courses
    console.log('📚 Inserting additional courses...');
    await connection.query(`
      INSERT IGNORE INTO courses (college_id, course_name) VALUES
      (1, 'B.Tech. in Engineering and Computational Mechanics'),
      (1, 'M.Tech. at CSED'),
      (1, 'M.Tech. at ECED'),
      (1, 'M.Tech. at EED'),
      (1, 'M.Tech. at MED'),
      (1, 'M.Tech. at ChED'),
      (1, 'M.Tech. at CED'),
      (1, 'M.Tech. at Biotechnology Department'),
      (1, 'M.Tech. at AMD'),
      (1, 'MBA'),
      (1, 'MCA'),
      (1, 'M.Sc.'),
      (1, 'Ph.D.')
    `);

    // Check results
    const [avatars] = await connection.execute('SELECT COUNT(*) as count FROM avatars');
    const [states] = await connection.execute('SELECT COUNT(*) as count FROM states');
    const [colleges] = await connection.execute('SELECT COUNT(*) as count FROM colleges');
    const [courses] = await connection.execute('SELECT COUNT(*) as count FROM courses');
    const [resources] = await connection.execute('SELECT COUNT(*) as count FROM academic_resources');

    console.log('\n🎉 Database Setup Complete!');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Avatars: ${avatars[0].count} (needed for registration)`);
    console.log(`   ✅ States: ${states[0].count}`);
    console.log(`   ✅ Colleges: ${colleges[0].count} (MNNIT with mnnit.ac.in domain)`);
    console.log(`   ✅ Courses: ${courses[0].count} (use course_id 1-${courses[0].count} for registration)`);
    console.log(`   ✅ Academic Resources: ${resources[0].count}`);

    console.log('\n🚀 Ready for registration!');
    console.log('   Use email: yourname@mnnit.ac.in');
    console.log('   Use course_id: 1-' + courses[0].count);

    await connection.end();
  } catch (error) {
    console.error('❌ Final seed failed:', error.message);
    process.exit(1);
  }
}

runFinalSeed();
