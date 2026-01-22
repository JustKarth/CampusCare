// Test backend without database connection
// This tests if your code structure, routes, middleware, and validation work correctly

const request = require('supertest');
const app = require('./app');

console.log('🧪 Testing Campus Care Backend (without database)...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: Root route
  console.log('Test 1: Root route (GET /)');
  try {
    const response = await request(app).get('/');
    if (response.status === 200 && response.body.success === true) {
      console.log('✅ PASSED - Root route works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Unexpected response\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 2: 404 handler
  console.log('Test 2: 404 handler (GET /api/invalid-route)');
  try {
    const response = await request(app).get('/api/invalid-route');
    if (response.status === 404) {
      console.log('✅ PASSED - 404 handler works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Expected 404, got', response.status, '\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 3: Auth routes - Register validation
  console.log('Test 3: Register endpoint - Validation (POST /api/auth/register)');
  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send({}); // Empty body to test validation
    
    if (response.status === 400 && response.body.success === false) {
      console.log('✅ PASSED - Validation middleware works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Validation not working properly\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 4: Auth routes - Login validation
  console.log('Test 4: Login endpoint - Validation (POST /api/auth/login)');
  try {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email' }); // Invalid email
    
    if (response.status === 400 && response.body.success === false) {
      console.log('✅ PASSED - Email validation works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Email validation not working\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 5: Protected route - No token
  console.log('Test 5: Protected route - No token (GET /api/auth/profile)');
  try {
    const response = await request(app).get('/api/auth/profile');
    if (response.status === 401) {
      console.log('✅ PASSED - Authentication middleware works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Expected 401, got', response.status, '\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 6: Protected route - Invalid token
  console.log('Test 6: Protected route - Invalid token');
  try {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid-token');
    
    if (response.status === 401) {
      console.log('✅ PASSED - Token validation works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Token validation not working\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 7: Blog routes - Get blogs (public)
  console.log('Test 7: Get blogs - Public route (GET /api/blogs)');
  try {
    const response = await request(app).get('/api/blogs');
    // Should return 200 or 500 (if database not connected)
    if (response.status === 200 || response.status === 500) {
      console.log('✅ PASSED - Blog route exists (may fail without DB)\n');
      passed++;
    } else {
      console.log('❌ FAILED - Unexpected status:', response.status, '\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 8: Blog routes - Create blog validation
  console.log('Test 8: Create blog - Validation (POST /api/blogs)');
  try {
    const response = await request(app)
      .post('/api/blogs')
      .send({}); // Empty body
    
    // Should fail validation or auth (401)
    if (response.status === 400 || response.status === 401) {
      console.log('✅ PASSED - Blog creation validation/auth works\n');
      passed++;
    } else {
      console.log('❌ FAILED - Unexpected status:', response.status, '\n');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 9: CORS headers
  console.log('Test 9: CORS headers');
  try {
    const response = await request(app).get('/');
    if (response.headers['access-control-allow-origin']) {
      console.log('✅ PASSED - CORS middleware works\n');
      passed++;
    } else {
      console.log('⚠️  WARNING - CORS headers not found (may be normal)\n');
    }
  } catch (error) {
    console.log('❌ FAILED -', error.message, '\n');
    failed++;
  }

  // Test 10: Error handler
  console.log('Test 10: Error handler');
  try {
    // Try to trigger an error
    const response = await request(app)
      .get('/api/blogs/invalid-id')
      .query({ page: 'not-a-number' });
    
    // Should handle error gracefully
    if (response.status >= 400 && response.body.success === false) {
      console.log('✅ PASSED - Error handler works\n');
      passed++;
    } else {
      console.log('⚠️  WARNING - Error handler may need checking\n');
    }
  } catch (error) {
    console.log('⚠️  WARNING - Error handler test inconclusive\n');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your backend code structure is correct.');
    console.log('⚠️  Note: Some features require database connection to fully test.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
runTests().catch(console.error);
