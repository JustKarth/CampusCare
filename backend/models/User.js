const pool = require('../config/database');

class User {
  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT user_id, email, reg_no, first_name, middle_name, last_name, college_id, course_id, avatar_id, is_moderator, is_admin, created_at FROM user_profiles WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  }

  // Create a new user (for registration)
  static async create(userData) {
    const {
      email,
      hashed_password,
      reg_no,
      first_name,
      middle_name,
      last_name,
      college_id,
      course_id,
      graduation_year,
      date_of_birth,
      avatar_id = null,
      native_state_id = null,
      native_city = null
    } = userData;

    // Convert undefined to null for optional fields (MySQL doesn't accept undefined)
    const [result] = await pool.execute(
      `INSERT INTO user_profiles 
      (email, hashed_password, reg_no, first_name, middle_name, last_name, 
       college_id, course_id, graduation_year, date_of_birth, avatar_id, 
       native_state_id, native_city) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        hashed_password,
        reg_no,
        first_name,
        middle_name ?? null,
        last_name,
        college_id,
        course_id,
        graduation_year,
        date_of_birth,
        avatar_id ?? null,
        native_state_id ?? null,
        native_city ?? null
      ]
    );

    return this.findById(result.insertId);
  }

  // Update user profile
  static async update(userId, updateData) {
    const allowedFields = [
      'first_name',
      'middle_name',
      'last_name',
      'avatar_id',
      'native_state_id',
      'native_city',
      'date_of_birth'
    ];

    const fieldsToUpdate = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fieldsToUpdate.length === 0) {
      return null;
    }

    values.push(userId);

    await pool.execute(
      `UPDATE user_profiles SET ${fieldsToUpdate.join(', ')} WHERE user_id = ?`,
      values
    );

    return this.findById(userId);
  }

  // Get user with college and course info
  static async findByIdWithDetails(userId) {
    const [rows] = await pool.execute(
      `SELECT 
        u.user_id, u.email, u.reg_no, u.first_name, u.middle_name, u.last_name,
        u.college_id, u.course_id, u.graduation_year, u.avatar_id,
        u.is_moderator, u.is_admin, u.created_at,
        c.college_name, c.email_domain, c.city as college_city,
        co.course_name,
        a.avatar_url
      FROM user_profiles u
      LEFT JOIN colleges c ON u.college_id = c.college_id
      LEFT JOIN courses co ON u.course_id = co.course_id AND u.college_id = co.college_id
      LEFT JOIN avatars a ON u.avatar_id = a.avatar_id
      WHERE u.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  // Check if email domain matches a college domain
  static async findCollegeByEmailDomain(email) {
    const rawDomain = email.split('@')[1];
    if (!rawDomain) return null;

    // Accept domains stored with or without leading '@' in DB (e.g. 'mnnit.ac.in' or '@mnnit.ac.in')
    const domain = rawDomain.toLowerCase().replace(/^@+/, '');

    const [rows] = await pool.execute(
      `SELECT college_id, college_name, email_domain
       FROM colleges
       WHERE REPLACE(email_domain, '@', '') = ?`,
      [domain]
    );
    return rows[0] || null;
  }
}

module.exports = User;
