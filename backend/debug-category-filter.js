const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugCategoryFilter() {
  try {
    console.log('🔍 Debugging category filter issue...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Check all categories
    console.log('📂 All categories in database:');
    const [categories] = await connection.execute('SELECT * FROM local_guide_categories ORDER BY category_name');
    categories.forEach(cat => console.log(`  - ${cat.category_name} (ID: ${cat.category_id})`));

    // Check all places
    console.log('\n📍 All places in database:');
    const [places] = await connection.execute(`
      SELECT p.place_name, p.category_id, lg.category_name 
      FROM places p 
      INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id 
      ORDER BY p.place_name
    `);
    places.forEach(p => console.log(`  - ${p.place_name} (${p.category_name}, ID: ${p.category_id})`));

    // Test the exact query the LocalGuide model uses for "Food"
    console.log('\n🔧 Testing LocalGuide.findByCollegeId for Food category...');
    const [foodPlaces] = await connection.execute(`
      SELECT 
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
      ORDER BY average_rating DESC, rating_count DESC
    `, [1, 'Food']);

    console.log(`Found ${foodPlaces.length} places for category "Food":`);
    foodPlaces.forEach(p => console.log(`  - ${p.place_name} (${p.category_name})`));

    // Test with category ID instead
    console.log('\n🔧 Testing with category ID for Food...');
    const foodCategory = categories.find(cat => cat.category_name === 'Food');
    if (foodCategory) {
      const [foodPlacesById] = await connection.execute(`
        SELECT 
          p.place_id, p.place_name, p.place_description, p.address,
          p.distance, p.website, p.phone, p.category_id,
          lg.category_name,
          AVG(pr.rating) as average_rating,
          COUNT(pr.rating) as rating_count
        FROM places p
        INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id
        LEFT JOIN place_rating pr ON p.place_id = pr.place_id
        WHERE p.college_id = ? AND p.category_id = ?
        GROUP BY p.place_id, p.place_name, p.place_description, p.address,
                 p.distance, p.website, p.phone, p.category_id, lg.category_name
        ORDER BY average_rating DESC, rating_count DESC
      `, [1, foodCategory.category_id]);

      console.log(`Found ${foodPlacesById.length} places for category ID ${foodCategory.category_id}:`);
      foodPlacesById.forEach(p => console.log(`  - ${p.place_name} (${p.category_name})`));
    }

    await connection.end();
    console.log('\n✅ Debug completed');
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugCategoryFilter();
