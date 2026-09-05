const pool = require('../config/database');

const getCourses = async (req, res) => {
  try {
    const { collegeId, domain } = req.query;
    let query = `
      SELECT DISTINCT c.course_id, c.course_name, c.college_id, col.college_name, col.email_domain
      FROM courses c
      JOIN colleges col ON c.college_id = col.college_id
    `;
    const params = [];

    if (collegeId) {
      query += ' WHERE c.college_id = ?';
      params.push(parseInt(collegeId, 10));
    } else if (domain) {
      const cleanDomain = domain.toLowerCase().replace(/^@+/, '');
      query += ' WHERE REPLACE(col.email_domain, "@", "") = ?';
      params.push(cleanDomain);
    }

    query += ' ORDER BY col.college_name, c.course_name';
    const [rows] = await pool.execute(query, params);

    res.json({
      success: true,
      courses: rows.map((row) => ({
        id: row.course_id,
        name: row.course_name,
        collegeId: row.college_id,
        collegeName: row.college_name,
        emailDomain: row.email_domain
      }))
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses.'
    });
  }
};

const getStates = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT DISTINCT state_id, state_name FROM states ORDER BY state_name'
    );

    res.json({
      success: true,
      states: rows.map((row) => ({
        id: row.state_id,
        name: row.state_name
      }))
    });
  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching states.'
    });
  }
};

const getAvatars = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT MIN(avatar_id) as avatar_id, avatar_url FROM avatars GROUP BY avatar_url ORDER BY avatar_id'
    );

    res.json({
      success: true,
      avatars: rows.map((row) => {
        const filename = row.avatar_url.replace(/^\/?avatars\//, '');
        const name = filename.replace(/\.[^/.]+$/, '');
        return {
          id: row.avatar_id,
          url: row.avatar_url.startsWith('http') ? row.avatar_url : `/avatars/${filename}`,
          filename,
          name
        };
      })
    });
  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching avatars.'
    });
  }
};

module.exports = {
  getCourses,
  getStates,
  getAvatars
};
