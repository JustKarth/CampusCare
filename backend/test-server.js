// Simple server test - checks if server starts and routes are registered
const app = require('./app');

console.log('🧪 Testing Campus Care Backend Structure...\n');

// Check if app is properly configured
console.log('1. Checking Express app...');
if (app && typeof app.listen === 'function') {
  console.log('   ✅ Express app is properly configured\n');
} else {
  console.log('   ❌ Express app not configured correctly\n');
  process.exit(1);
}

// Check if routes are registered
console.log('2. Checking route registration...');
const routes = app._router?.stack || [];
const routePaths = routes
  .filter(layer => layer.route)
  .map(layer => {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    return `${methods} ${layer.route.path}`;
  });

if (routePaths.length > 0) {
  console.log('   ✅ Routes registered:');
  routePaths.forEach(route => console.log(`      - ${route}`));
  console.log('');
} else {
  console.log('   ⚠️  No routes found (may be using router middleware)\n');
}

// Check middleware
console.log('3. Checking middleware stack...');
const middlewareCount = routes.filter(layer => !layer.route).length;
console.log(`   ✅ Found ${middlewareCount} middleware functions\n`);

// Test server startup
console.log('4. Testing server startup...');
const server = app.listen(0, () => {
  const port = server.address().port;
  console.log(`   ✅ Server started successfully on port ${port}\n`);
  
  console.log('5. Testing root route...');
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.success === true) {
          console.log('   ✅ Root route responds correctly');
          console.log(`   Response: ${JSON.stringify(json)}\n`);
        } else {
          console.log('   ⚠️  Root route response format unexpected\n');
        }
      } catch (e) {
        console.log('   ⚠️  Root route response is not JSON\n');
      }
      
      // Test 404
      console.log('6. Testing 404 handler...');
      const req404 = http.request({
        ...options,
        path: '/api/invalid-route'
      }, (res404) => {
        if (res404.statusCode === 404) {
          console.log('   ✅ 404 handler works correctly\n');
        } else {
          console.log(`   ⚠️  Expected 404, got ${res404.statusCode}\n`);
        }
        
        server.close(() => {
          console.log('='.repeat(50));
          console.log('✅ Backend structure test complete!');
          console.log('='.repeat(50));
          console.log('\n📝 Next steps:');
          console.log('   1. Start server: npm run dev');
          console.log('   2. Test endpoints with Postman/Thunder Client');
          console.log('   3. Connect database when ready');
          console.log('\n⚠️  Note: Full functionality requires database connection.');
        });
      });
      req404.end();
    });
  });

  req.on('error', (e) => {
    console.log(`   ❌ Error: ${e.message}\n`);
    server.close();
  });

  req.end();
});

server.on('error', (err) => {
  console.log(`   ❌ Server error: ${err.message}\n`);
});
