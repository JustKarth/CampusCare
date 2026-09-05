const pool = require('../config/database');

class Fare {
  // Submit a new fare entry
  static async create({ userId, collegeId, fromPlaceName, fromLat, fromLng, toPlaceName, toLat, toLng, fareAmount, vehicleType = 'auto', notes = null }) {
    const [result] = await pool.query(
      `INSERT INTO fares (user_id, college_id, from_place_name, from_lat, from_lng, to_place_name, to_lat, to_lng, fare_amount, vehicle_type, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, collegeId, fromPlaceName, fromLat, fromLng, toPlaceName, toLat, toLng, fareAmount, vehicleType, notes]
    );
    return result.insertId;
  }

  // Get fares for a route (fuzzy match on lat/lng within radius or place name fallback)
  static async findForRoute({ fromLat, fromLng, toLat, toLng, fromName, toName, radiusDeg = 0.02 }) {
    let query = `
      SELECT 
        f.fare_id,
        f.fare_amount,
        f.vehicle_type,
        f.notes,
        f.submitted_at,
        f.from_place_name,
        f.to_place_name,
        f.from_lat,
        f.from_lng,
        f.to_lat,
        f.to_lng,
        up.first_name,
        up.last_name
      FROM fares f
      JOIN user_profiles up ON f.user_id = up.user_id
      WHERE 1=1
    `;
    const params = [];

    if (fromLat && fromLng && toLat && toLng) {
      query += `
        AND (
          (ABS(f.from_lat - ?) <= ? AND ABS(f.from_lng - ?) <= ? AND ABS(f.to_lat - ?) <= ? AND ABS(f.to_lng - ?) <= ?)
          OR (ABS(f.from_lat - ?) <= ? AND ABS(f.from_lng - ?) <= ? AND ABS(f.to_lat - ?) <= ? AND ABS(f.to_lng - ?) <= ?)
        )
      `;
      // Check forward and reverse directions
      params.push(fromLat, radiusDeg, fromLng, radiusDeg, toLat, radiusDeg, toLng, radiusDeg);
      params.push(toLat, radiusDeg, toLng, radiusDeg, fromLat, radiusDeg, fromLng, radiusDeg);
    } else if (fromName && toName) {
      query += `
        AND (
          (LOWER(f.from_place_name) LIKE LOWER(?) AND LOWER(f.to_place_name) LIKE LOWER(?))
          OR (LOWER(f.from_place_name) LIKE LOWER(?) AND LOWER(f.to_place_name) LIKE LOWER(?))
        )
      `;
      params.push(`%${fromName}%`, `%${toName}%`, `%${toName}%`, `%${fromName}%`);
    }

    query += ` ORDER BY f.submitted_at DESC LIMIT 50`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Get aggregated stats for a route
  static async getRouteStats({ fromLat, fromLng, toLat, toLng, fromName, toName, radiusDeg = 0.02 }) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (fromLat && fromLng && toLat && toLng) {
      whereClause += `
        AND (
          (ABS(from_lat - ?) <= ? AND ABS(from_lng - ?) <= ? AND ABS(to_lat - ?) <= ? AND ABS(to_lng - ?) <= ?)
          OR (ABS(from_lat - ?) <= ? AND ABS(from_lng - ?) <= ? AND ABS(to_lat - ?) <= ? AND ABS(to_lng - ?) <= ?)
        )
      `;
      params.push(fromLat, radiusDeg, fromLng, radiusDeg, toLat, radiusDeg, toLng, radiusDeg);
      params.push(toLat, radiusDeg, toLng, radiusDeg, fromLat, radiusDeg, fromLng, radiusDeg);
    } else if (fromName && toName) {
      whereClause += `
        AND (
          (LOWER(from_place_name) LIKE LOWER(?) AND LOWER(to_place_name) LIKE LOWER(?))
          OR (LOWER(from_place_name) LIKE LOWER(?) AND LOWER(to_place_name) LIKE LOWER(?))
        )
      `;
      params.push(`%${fromName}%`, `%${toName}%`, `%${toName}%`, `%${fromName}%`);
    }

    const [breakdown] = await pool.query(
      `SELECT 
        vehicle_type,
        COUNT(*) AS count,
        MIN(fare_amount) AS min_fare,
        MAX(fare_amount) AS max_fare,
        ROUND(AVG(fare_amount)) AS avg_fare
       FROM fares
       ${whereClause}
       GROUP BY vehicle_type`,
      params
    );

    const [overall] = await pool.query(
      `SELECT 
        COUNT(*) AS total_count,
        MIN(fare_amount) AS min_fare,
        MAX(fare_amount) AS max_fare,
        ROUND(AVG(fare_amount)) AS avg_fare
       FROM fares
       ${whereClause}`,
      params
    );

    return {
      overall: overall[0] || { total_count: 0, min_fare: null, max_fare: null, avg_fare: null },
      breakdown: breakdown || []
    };
  }

  // Get fares submitted by a specific user
  static async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT 
        fare_id,
        from_place_name,
        to_place_name,
        from_lat, from_lng,
        to_lat, to_lng,
        fare_amount,
        vehicle_type,
        notes,
        submitted_at
       FROM fares
       WHERE user_id = ?
       ORDER BY submitted_at DESC
       LIMIT 50`,
      [userId]
    );
    return rows;
  }

  // Delete own fare
  static async deleteOwn(fareId, userId) {
    const [result] = await pool.query(
      'DELETE FROM fares WHERE fare_id = ? AND user_id = ?',
      [fareId, userId]
    );
    return result.affectedRows > 0;
  }

  // Get recent fares across the platform
  static async getRecent(limit = 20) {
    const [rows] = await pool.query(
      `SELECT 
        f.fare_id,
        f.from_place_name,
        f.to_place_name,
        f.from_lat, f.from_lng,
        f.to_lat, f.to_lng,
        f.fare_amount,
        f.vehicle_type,
        f.notes,
        f.submitted_at,
        up.first_name,
        up.last_name
       FROM fares f
       JOIN user_profiles up ON f.user_id = up.user_id
       ORDER BY f.submitted_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = Fare;

