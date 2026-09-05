// Script to create or promote an admin user
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] ? args[0].trim().toLowerCase() : null;
  const password = args[1] || null;
  const firstName = args[2] || 'Campus';
  const lastName = args[3] || 'Admin';

  if (!email) {
    console.log(`
==================================================
🛡️  CampusCare Admin Account Manager
==================================================
Usage:
  1. Promote existing user to Admin:
     node scripts/create-admin.js <email>

  2. Create new Admin account:
     node scripts/create-admin.js <email> <password> [first_name] [last_name]

Example:
  node scripts/create-admin.js mangodev@mnnit.ac.in
  node scripts/create-admin.js admin@mnnit.ac.in Admin@123
==================================================
`);
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_care'
  });

  try {
    // Check if user already exists
    const [existing] = await connection.execute(
      'SELECT user_id, email, first_name, last_name, is_admin FROM user_profiles WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      const user = existing[0];
      let query = 'UPDATE user_profiles SET is_admin = 1, is_moderator = 1';
      const params = [];

      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        query += ', hashed_password = ?';
        params.push(hashed);
      }

      query += ' WHERE user_id = ?';
      params.push(user.user_id);

      await connection.execute(query, params);

      console.log('\n==================================================');
      console.log(`✅ Success! User '${user.email}' is now an ADMINISTRATOR.`);
      if (password) {
        console.log(`🔑 Password updated to: ${password}`);
      }
      console.log('==================================================');
      console.log('You can now log in at http://localhost:5173/login');
      console.log(`Email:    ${user.email}`);
      console.log(`Role:     Administrator (is_admin = 1)\n`);
      return;
    }

    // If user does not exist, create new admin
    if (!password) {
      console.error(`\n❌ User '${email}' does not exist! To create a new admin, please provide a password:\n   node scripts/create-admin.js ${email} <password>\n`);
      process.exit(1);
    }

    // Get default college and course
    const [colleges] = await connection.query('SELECT college_id FROM colleges LIMIT 1');
    const [courses] = await connection.query('SELECT course_id FROM courses LIMIT 1');

    const collegeId = colleges[0]?.college_id || 1;
    const courseId = courses[0]?.course_id || 1;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertRes] = await connection.execute(
      `INSERT INTO user_profiles (
        email, hashed_password, first_name, last_name,
        reg_no, college_id, course_id, graduation_year,
        date_of_birth, is_admin, is_moderator
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        `ADMIN-${Date.now().toString().slice(-4)}`,
        collegeId,
        courseId,
        2026,
        '2000-01-01'
      ]
    );

    console.log('\n==================================================');
    console.log(`✅ Created NEW Administrator Account!`);
    console.log('==================================================');
    console.log(`User ID:  ${insertRes.insertId}`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     Super Administrator (is_admin = 1, is_moderator = 1)`);
    console.log('==================================================');
    console.log('You can now log in at http://localhost:5173/login\n');

  } catch (err) {
    console.error('Error managing admin user:', err);
  } finally {
    await connection.end();
  }
}

main();
