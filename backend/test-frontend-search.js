async function testFrontendSearch() {
  try {
    console.log('🔍 Testing exact frontend search logic...');
    
    const lat = 25.4358;
    const lng = 81.8463;
    const radius = 50000;
    const category = 'hospital';
    
    // Test the exact query the frontend uses
    const query = 'hospital';
    console.log(`🔍 Query: "${query}"`);
    console.log(`📍 Location: ${lat}, ${lng}`);
    console.log(`📏 Radius: ${radius}m`);
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&viewbox=${lng - 0.5},${lat + 0.5},${lng + 0.5},${lat - 0.5}&bounded=1&limit=50&addressdetails=1&extratags=1`);
    const data = await response.json();
    
    console.log(`📊 Raw results: ${data.length}`);
    
    // Test the filtering logic
    const places = data.filter(place => {
      const distance = calculateDistance(lat, lng, place.lat, place.lon);
      console.log(`  - ${place.display_name}: ${distance.toFixed(0)}m`);
      
      if (distance > radius) {
        console.log(`    ❌ Too far: ${distance.toFixed(0)}m > ${radius}m`);
        return false;
      }
      
      const isHospital = (place.class === 'amenity' && place.type === 'hospital') ||
        place.display_name.toLowerCase().includes('hospital');
      
      if (!isHospital) {
        console.log(`    ❌ Not a hospital: ${place.class}.${place.type}`);
        return false;
      }
      
      console.log(`    ✅ Valid hospital: ${distance.toFixed(0)}m`);
      return true;
    });
    
    console.log(`✅ Final filtered results: ${places.length}`);
    places.forEach((place, index) => {
      const distance = calculateDistance(lat, lng, place.lat, place.lon);
      console.log(`${index + 1}. ${place.display_name} (${distance.toFixed(0)}m)`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert to meters
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

testFrontendSearch();
