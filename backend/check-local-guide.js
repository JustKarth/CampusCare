const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkLocalGuideData() {
  try {
    console.log('🔍 Checking Local Guide data...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Check categories
    console.log('📂 Checking local_guide_categories table...');
    const [categories] = await connection.execute('SELECT * FROM local_guide_categories ORDER BY category_name');
    console.log(`Found ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.category_name} (ID: ${cat.category_id})`));

    // Check places
    console.log('\n📍 Checking places table...');
    const [places] = await connection.execute('SELECT COUNT(*) as count FROM places');
    console.log(`Found ${places[0].count} places`);

    if (places[0].count > 0) {
      const [samplePlaces] = await connection.execute('SELECT place_name, category_id FROM places LIMIT 5');
      console.log('Sample places:');
      samplePlaces.forEach(p => console.log(`  - ${p.place_name} (category_id: ${p.category_id})`));
    }

    // Test the category query
    console.log('\n🔧 Testing LocalGuide.getCategories() query...');
    const [testCategories] = await connection.execute('SELECT category_id, category_name FROM local_guide_categories ORDER BY category_name');
    console.log(`Query returned ${testCategories.length} categories`);

    await connection.end();
    
    if (categories.length === 0) {
      console.log('\n❌ No categories found! Need to insert categories.');
      console.log('💡 Run: node insert-categories.js');
    } else {
      console.log('\n✅ Categories exist. Issue might be in frontend or API.');
    }
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkLocalGuideData();
