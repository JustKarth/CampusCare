async function testNominatimSearch() {
  try {
    console.log('🔍 Testing Nominatim search directly...');
    
    // Test location-specific search near Prayagraj
    const lat = 25.4358;
    const lon = 81.8463;
    
    console.log(`📍 Searching near ${lat}, ${lon} (Prayagraj)`);
    
    // Test basic search with location
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hospital&viewbox=${lon-0.5},${lat+0.5},${lon+0.5},${lat-0.5}&bounded=1&limit=20`);
    const data = await response.json();
    
    console.log(`📊 Found ${data.length} hospitals near Prayagraj:`);
    data.forEach((place, index) => {
      console.log(`${index + 1}. ${place.display_name}`);
      console.log(`   Lat: ${place.lat}, Lon: ${place.lon}`);
      console.log(`   Class: ${place.class}, Type: ${place.type}`);
      console.log('');
    });
    
    // Test search for Prayagraj specifically
    console.log('\n🔍 Testing search for Prayagraj hospitals...');
    const prayagrajResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hospital Prayagraj&limit=20`);
    const prayagrajData = await prayagrajResponse.json();
    
    console.log(`📊 Found ${prayagrajData.length} hospitals in Prayagraj:`);
    prayagrajData.forEach((place, index) => {
      console.log(`${index + 1}. ${place.display_name}`);
      console.log(`   Lat: ${place.lat}, Lon: ${place.lon}`);
      console.log(`   Class: ${place.class}, Type: ${place.type}`);
      console.log('');
    });
    
    // Test broader search near location
    console.log('\n🔍 Testing broader search for amenities near Prayagraj...');
    const broadResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=amenity&viewbox=${lon-0.5},${lat+0.5},${lon+0.5},${lat-0.5}&bounded=1&limit=50`);
    const broadData = await broadResponse.json();
    
    console.log(`📊 Found ${broadData.length} amenities near Prayagraj:`);
    broadData.slice(0, 10).forEach((place, index) => {
      console.log(`${index + 1}. ${place.display_name} (${place.class})`);
    });
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
}

testNominatimSearch();
