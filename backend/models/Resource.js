const pool = require('../config/database');

class Resource {
  // Get all resources for a college
  static async findByCollegeId(collegeId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      `SELECT 
        ar.resource_id, ar.resource_title, ar.resource_description, 
        ar.resource_link, ar.college_id, c.college_name
      FROM academic_resources ar
      INNER JOIN colleges c ON ar.college_id = c.college_id
      WHERE ar.college_id = ?
      ORDER BY ar.resource_id DESC
      LIMIT ? OFFSET ?`,
      [collegeId, limit, offset]
    );
    return rows;
  }

  // Get all resources (for admin/moderator)
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      `SELECT 
        ar.resource_id, ar.resource_title, ar.resource_description, 
        ar.resource_link, ar.college_id, c.college_name
      FROM academic_resources ar
      INNER JOIN colleges c ON ar.college_id = c.college_id
      ORDER BY ar.resource_id DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Get a single resource by ID
  static async findById(resourceId) {
    const [rows] = await pool.execute(
      `SELECT 
        ar.resource_id, ar.resource_title, ar.resource_description, 
        ar.resource_link, ar.college_id, c.college_name
      FROM academic_resources ar
      INNER JOIN colleges c ON ar.college_id = c.college_id
      WHERE ar.resource_id = ?`,
      [resourceId]
    );
    return rows[0] || null;
  }

  // Create a new resource
  static async create(resourceData) {
    const { college_id, resource_title, resource_description, resource_link } = resourceData;

    const [result] = await pool.execute(
      'INSERT INTO academic_resources (college_id, resource_title, resource_description, resource_link) VALUES (?, ?, ?, ?)',
      [college_id, resource_title, resource_description, resource_link]
    );

    return this.findById(result.insertId);
  }

  // Update a resource
  static async update(resourceId, updateData) {
    const { resource_title, resource_description, resource_link } = updateData;

    const [result] = await pool.execute(
      'UPDATE academic_resources SET resource_title = ?, resource_description = ?, resource_link = ? WHERE resource_id = ?',
      [resource_title, resource_description, resource_link, resourceId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(resourceId);
  }

  // Delete a resource
  static async delete(resourceId) {
    const [result] = await pool.execute(
      'DELETE FROM academic_resources WHERE resource_id = ?',
      [resourceId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Resource;
