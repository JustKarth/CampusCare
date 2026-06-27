const pool = require('../config/database');

const getCourses = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT course_id, course_name FROM courses ORDER BY course_name'
    );

    res.json({
      success: true,
      courses: rows.map((row) => ({
        id: row.course_id,
        name: row.course_name
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
      'SELECT state_id, state_name FROM states ORDER BY state_name'
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

module.exports = {
  getCourses,
  getStates
};
