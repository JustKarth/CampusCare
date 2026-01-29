async function testRouteCalculation() {
  try {
    console.log('🗺️ Testing OSRM route calculation...');
    
    // Test route from MNNIT to a nearby hospital
    const startLat = 25.4358;
    const startLng = 81.8463;
    const endLat = 25.4568200;
    const endLng = 81.8466717;
    
    const profiles = ['foot', 'car', 'bicycle'];
    
    for (const profile of profiles) {
      console.log(`\n🚶 Testing ${profile} profile...`);
      
      const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`);
      const data = await response.json();
      
      console.log(`📊 Route data for ${profile}:`);
      console.log(`  Status: ${data.code}`);
      console.log(`  Routes: ${data.routes?.length || 0}`);
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        console.log(`  Distance: ${(route.distance / 1000).toFixed(2)}km`);
        console.log(`  Duration: ${(route.duration / 60).toFixed(1)}min`);
        console.log(`  Legs: ${route.legs?.length || 0}`);
        
        if (route.legs && route.legs[0]) {
          console.log(`  Steps: ${route.legs[0].steps?.length || 0}`);
          
          // Show first few steps
          if (route.legs[0].steps && route.legs[0].steps.length > 0) {
            console.log(`  First 3 steps:`);
            route.legs[0].steps.slice(0, 3).forEach((step, index) => {
              console.log(`    ${index + 1}. ${step.maneuver?.instruction || 'No instruction'} (${step.distance}m)`);
            });
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Route test failed:', error.message);
  }
}

testRouteCalculation();
