const pool = require('../config/database');

class LocalGuide {
  // Get all places for a college
  static async findByCollegeId(collegeId, categoryId = null) {
    let query = `
      SELECT 
        p.place_id, p.place_name, p.place_description, p.address,
        p.distance, p.website, p.phone, p.category_id,
        lg.category_name,
        AVG(pr.rating) as average_rating,
        COUNT(pr.rating) as rating_count
      FROM places p
      INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id
      LEFT JOIN place_rating pr ON p.place_id = pr.place_id
      WHERE p.college_id = ?
    `;

    const params = [collegeId];

    if (categoryId) {
      query += ' AND p.category_id = ?';
      params.push(categoryId);
    }

    query += `
      GROUP BY p.place_id, p.place_name, p.place_description, p.address,
               p.distance, p.website, p.phone, p.category_id, lg.category_name
      ORDER BY average_rating DESC, rating_count DESC
    `;

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get places by category name
  static async findByCategory(collegeId, categoryName) {
    const [rows] = await pool.execute(
      `SELECT 
        p.place_id, p.place_name, p.place_description, p.address,
        p.distance, p.website, p.phone, p.category_id,
        lg.category_name,
        AVG(pr.rating) as average_rating,
        COUNT(pr.rating) as rating_count
      FROM places p
      INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id
      LEFT JOIN place_rating pr ON p.place_id = pr.place_id
      WHERE p.college_id = ? AND lg.category_name = ?
      GROUP BY p.place_id, p.place_name, p.place_description, p.address,
               p.distance, p.website, p.phone, p.category_id, lg.category_name
      ORDER BY average_rating DESC, rating_count DESC`,
      [collegeId, categoryName]
    );
    return rows;
  }

  // Get a single place by ID
  static async findById(placeId) {
    const [rows] = await pool.execute(
      `SELECT 
        p.place_id, p.place_name, p.place_description, p.address,
        p.distance, p.website, p.phone, p.category_id, p.college_id,
        lg.category_name,
        AVG(pr.rating) as average_rating,
        COUNT(pr.rating) as rating_count
      FROM places p
      INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id
      LEFT JOIN place_rating pr ON p.place_id = pr.place_id
      WHERE p.place_id = ?
      GROUP BY p.place_id, p.place_name, p.place_description, p.address,
               p.distance, p.website, p.phone, p.category_id, p.college_id, lg.category_name`,
      [placeId]
    );
    return rows[0] || null;
  }

  // Get all categories
  static async getCategories() {
    const [rows] = await pool.execute(
      'SELECT category_id, category_name FROM local_guide_categories ORDER BY category_name'
    );
    return rows;
  }

  // Add or update a rating
  static async addRating(placeId, userId, rating) {
    await pool.execute(
      'INSERT INTO place_rating (place_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
      [placeId, userId, rating, rating]
    );
    return this.findById(placeId);
  }

  // Get user's rating for a place
  static async getUserRating(placeId, userId) {
    const [rows] = await pool.execute(
      'SELECT rating FROM place_rating WHERE place_id = ? AND user_id = ?',
      [placeId, userId]
    );
    return rows[0] || null;
  }

  // Create a new place (for admin/moderator)
  static async create(placeData) {
    const {
      category_id,
      college_id,
      place_name,
      place_description,
      address,
      distance,
      website,
      phone
    } = placeData;

    const [result] = await pool.execute(
      'INSERT INTO places (category_id, college_id, place_name, place_description, address, distance, website, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, college_id, place_name, place_description, address, distance, website, phone]
    );

    return this.findById(result.insertId);
  }
}

module.exports = LocalGuide;
