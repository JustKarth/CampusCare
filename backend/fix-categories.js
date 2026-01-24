const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixCategories() {
  try {
    console.log('🔧 Fixing Local Guide categories...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Clear existing categories
    console.log('🗑️ Clearing existing categories...');
    await connection.execute('DELETE FROM local_guide_categories');

    // Insert categories fresh
    console.log('🌱 Inserting fresh categories...');
    await connection.query(`
      INSERT INTO local_guide_categories (category_name) VALUES
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
    console.log(`✅ Now have ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.category_name} (ID: ${cat.category_id})`));

    await connection.end();
    console.log('\n🎉 Categories fixed successfully!');
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixCategories();
