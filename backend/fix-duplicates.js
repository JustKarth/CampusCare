const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDuplicates() {
  try {
    console.log('🔧 Fixing duplicate categories and places...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Clear all categories and places
    console.log('🗑️ Clearing all categories and places...');
    await connection.execute('DELETE FROM places');
    await connection.execute('DELETE FROM local_guide_categories');
    await connection.execute('ALTER TABLE local_guide_categories AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE places AUTO_INCREMENT = 1');

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

    // Insert places fresh
    console.log('🏪 Inserting fresh places...');
    await connection.query(`
      INSERT INTO places (category_id, college_id, place_name, place_description, address, distance, website, phone) VALUES
      (1, 1, 'Civil Hospital', 'Government hospital for medical emergencies', 'Civil Lines, Prayagraj', 5.2, 'http://uphealth.up.gov.in', '0532-2466101'),
      (3, 1, 'Dominos Pizza', 'Pizza delivery and dine-in', 'MNNIT Campus Road, Prayagraj', 0.5, 'https://www.dominos.co.in', '1800-208-1234'),
      (3, 1, 'Burger King', 'Fast food restaurant', 'MNNIT Campus, Prayagraj', 0.3, 'https://www.burgerking.in', '1800-208-1234'),
      (4, 1, 'PVR Cinemas', 'Movie theater', 'Jhunsi Road, Prayagraj', 4.8, 'https://www.pvrcinemas.com', '0532-4246464'),
      (6, 1, 'Sangam City', 'Shopping and entertainment complex', 'M.G. Road, Prayagraj', 6.1, 'http://sangamcity.com', '0532-2461234'),
      (7, 1, 'More Supermarket', 'Grocery and daily needs', 'MNNIT Campus, Prayagraj', 0.2, 'https://www.morestore.com', '0532-2465678'),
      (8, 1, 'Raymond Showroom', 'Formal and casual clothing', 'Civil Lines, Prayagraj', 5.5, 'https://www.raymond.in', '0532-2468901'),
      (2, 1, 'Laptop Repair Center', 'Computer and laptop repair services', 'MNNIT Campus, Prayagraj', 0.1, '', '0532-2462345'),
      (9, 1, 'Railway Station', 'Transportation hub', 'Prayagraj Junction', 7.2, 'https://www.irctc.co.in', '139'),
      (10, 1, 'ATM - SBI', 'Bank ATM', 'MNNIT Campus, Prayagraj', 0.1, 'https://www.sbi.co.in', '1800-425-3800')
    `);

    // Check results
    const [categories] = await connection.execute('SELECT * FROM local_guide_categories ORDER BY category_name');
    const [places] = await connection.execute('SELECT p.place_name, lg.category_name FROM places p INNER JOIN local_guide_categories lg ON p.category_id = lg.category_id ORDER BY p.place_name');
    
    console.log(`✅ Now have ${categories.length} unique categories:`);
    categories.forEach(cat => console.log(`  - ${cat.category_name} (ID: ${cat.category_id})`));
    
    console.log(`\n✅ Now have ${places.length} unique places:`);
    places.forEach(p => console.log(`  - ${p.place_name} (${p.category_name})`));

    await connection.end();
    console.log('\n🎉 All duplicates fixed successfully!');
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixDuplicates();
