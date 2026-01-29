const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkPlacesTable() {
  try {
    console.log('🔍 Checking places table...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Check if places table exists and has data
    console.log('📊 Places table info:');
    const [tableInfo] = await connection.execute('SHOW TABLES LIKE "places"');
    console.log(`  - Table exists: ${tableInfo.length > 0 ? 'Yes' : 'No'}`);

    if (tableInfo.length > 0) {
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM places');
      console.log(`  - Total places: ${count[0].count}`);

      const [structure] = await connection.execute('DESCRIBE places');
      console.log('  - Table structure:');
      structure.forEach(col => console.log(`    * ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`));

      // Check if there are any places at all
      const [allPlaces] = await connection.execute('SELECT * FROM places LIMIT 5');
      if (allPlaces.length > 0) {
        console.log('  - Sample places:');
        allPlaces.forEach(p => console.log(`    * ${p.place_name} (category_id: ${p.category_id})`));
      }
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkPlacesTable();
