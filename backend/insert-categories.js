const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertCategories() {
  try {
    console.log('🌱 Inserting Local Guide categories...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Insert categories
    await connection.query(`
      INSERT IGNORE INTO local_guide_categories (category_name) VALUES
      ('Healthcare'),
      ('Tech Support'),
      ('Food'),
      ('Cinema'),
      ('Arcades'),
      ('Local Hotspots'),
      ('General Stores'),
      ('Clothing'),
      ('Logistics'),
      ('Miscellaneous')
    `);

    // Check results
    const [categories] = await connection.execute('SELECT * FROM local_guide_categories ORDER BY category_name');
    console.log(`✅ Inserted ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.category_name} (ID: ${cat.category_id})`));

    await connection.end();
    console.log('\n🎉 Categories inserted successfully!');
  } catch (error) {
    console.error('❌ Insert failed:', error.message);
  }
}

insertCategories();
