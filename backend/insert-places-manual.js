const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertPlaces() {
  try {
    console.log('🌱 Inserting places manually...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'campus_care'
    });

    // Clear places first
    await connection.execute('DELETE FROM places');
    await connection.execute('ALTER TABLE places AUTO_INCREMENT = 1');

    // Get category IDs
    const [categories] = await connection.execute('SELECT * FROM local_guide_categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.category_name] = cat.category_id;
    });

    console.log('Category IDs:', categoryMap);

    // Insert places with correct category IDs
    const places = [
      { name: 'Civil Hospital', category: 'Healthcare', desc: 'Government hospital for medical emergencies', address: 'Civil Lines, Prayagraj', distance: 5.2, website: 'http://uphealth.up.gov.in', phone: '0532-2466101' },
      { name: 'Dominos Pizza', category: 'Food', desc: 'Pizza delivery and dine-in', address: 'MNNIT Campus Road, Prayagraj', distance: 0.5, website: 'https://www.dominos.co.in', phone: '1800-208-1234' },
      { name: 'Burger King', category: 'Food', desc: 'Fast food restaurant', address: 'MNNIT Campus, Prayagraj', distance: 0.3, website: 'https://www.burgerking.in', phone: '1800-208-1234' },
      { name: 'PVR Cinemas', category: 'Cinema', desc: 'Movie theater', address: 'Jhunsi Road, Prayagraj', distance: 4.8, website: 'https://www.pvrcinemas.com', phone: '0532-4246464' },
      { name: 'Sangam City', category: 'Local Hotspots', desc: 'Shopping and entertainment complex', address: 'M.G. Road, Prayagraj', distance: 6.1, website: 'http://sangamcity.com', phone: '0532-2461234' },
      { name: 'More Supermarket', category: 'General Stores', desc: 'Grocery and daily needs', address: 'MNNIT Campus, Prayagraj', distance: 0.2, website: 'https://www.morestore.com', phone: '0532-2465678' },
      { name: 'Raymond Showroom', category: 'Clothing', desc: 'Formal and casual clothing', address: 'Civil Lines, Prayagraj', distance: 5.5, website: 'https://www.raymond.in', phone: '0532-2468901' },
      { name: 'Laptop Repair Center', category: 'Tech Support', desc: 'Computer and laptop repair services', address: 'MNNIT Campus, Prayagraj', distance: 0.1, website: '', phone: '0532-2462345' },
      { name: 'Railway Station', category: 'Logistics', desc: 'Transportation hub', address: 'Prayagraj Junction', distance: 7.2, website: 'https://www.irctc.co.in', phone: '139' },
      { name: 'ATM - SBI', category: 'Miscellaneous', desc: 'Bank ATM', address: 'MNNIT Campus, Prayagraj', distance: 0.1, website: 'https://www.sbi.co.in', phone: '1800-425-3800' }
    ];

    for (const place of places) {
      const categoryId = categoryMap[place.category];
      if (categoryId) {
        await connection.execute(`
          INSERT INTO places (category_id, college_id, place_name, place_description, address, distance, website, phone) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [categoryId, 1, place.name, place.desc, place.address, place.distance, place.website, place.phone]);
        console.log(`✅ Inserted: ${place.name} (${place.category})`);
      } else {
        console.log(`❌ Category not found: ${place.category}`);
      }
    }

    // Check results
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM places');
    console.log(`\n✅ Total places inserted: ${count[0].count}`);

    await connection.end();
    console.log('\n🎉 Places inserted successfully!');
  } catch (error) {
    console.error('❌ Insert failed:', error.message);
  }
}

insertPlaces();
