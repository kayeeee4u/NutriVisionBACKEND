const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Base URL API
const BASE_URL = 'http://localhost:5000';

// Function untuk test endpoint dengan handling error
async function testEndpoint(name, url, options = {}) {
  console.log(`\n🧪 Testing ${name}:`);
  console.log(`📡 ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await axios({ url, ...options });
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status} - ${error.response?.statusText}`);
    console.log(`💥 Message:`, error.response?.data || error.message);
    return null;
  }
}

// Main testing function
async function runAPITests() {
  console.log('🚀 Starting Nutrivision API Tests for Localhost MongoDB');
  console.log('=' .repeat(60));

  // Test 1: Health Check
  await testEndpoint(
    'Health Check',
    `${BASE_URL}/api/health`
  );

  // Test 2: Get All Foods
  await testEndpoint(
    'Get All Foods',
    `${BASE_URL}/api/nutrition/foods`
  );

  // Test 3: Lookup Specific Food
  await testEndpoint(
    'Lookup Nasi Putih',
    `${BASE_URL}/api/nutrition/lookup/nasi_putih`
  );

  // Test 4: Lookup Another Food
  await testEndpoint(
    'Lookup Ayam Goreng',
    `${BASE_URL}/api/nutrition/lookup/ayam_goreng`
  );

  // Test 5: Get Food Analysis History
  await testEndpoint(
    'Get Analysis History',
    `${BASE_URL}/api/food-analyses`
  );

  // Test 6: Model Info
  await testEndpoint(
    'Model Information',
    `${BASE_URL}/api/model-info`
  );

  // Test 7: Test Image Upload (jika ada sample image)
  const sampleImagePath = path.join(__dirname, 'sample-food.jpg');
  if (fs.existsSync(sampleImagePath)) {
    console.log(`\n🧪 Testing Image Upload Analysis:`);
    console.log(`📡 POST ${BASE_URL}/api/nutrition/analyze`);
    
    try {
      const form = new FormData();
      form.append('image', fs.createReadStream(sampleImagePath));
      
      const response = await axios.post(`${BASE_URL}/api/nutrition/analyze`, form, {
        headers: {
          ...form.getHeaders()
        },
        timeout: 30000 // 30 detik timeout untuk analisis gambar
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status} - ${error.response?.statusText}`);
      console.log(`💥 Message:`, error.response?.data || error.message);
    }
  } else {
    console.log(`\n⚠️ Skipping Image Upload Test: sample-food.jpg not found`);
    console.log(`💡 To test image upload, add a sample-food.jpg file in the project root`);
  }

  // Test 8: Test Invalid Endpoint
  await testEndpoint(
    'Invalid Endpoint (should return 404)',
    `${BASE_URL}/api/invalid-endpoint`
  );

  console.log('\n' + '='.repeat(60));
  console.log('🎉 API Testing completed!');
  console.log('\n📋 Summary:');
  console.log('✅ Health check should return status "OK"');
  console.log('✅ Foods endpoint should return 8 sample foods');
  console.log('✅ Lookup endpoints should return nutrition data');
  console.log('✅ All endpoints should have proper CORS headers');
  console.log('\n💡 Next steps:');
  console.log('1. Test with a frontend application');
  console.log('2. Add more food data via seeder');
  console.log('3. Test image upload with real food images');
}

// Cek apakah server sedang berjalan
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
    if (response.data.status === 'OK') {
      console.log('✅ Server is running and healthy');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running or not responding');
    console.log('💡 Please start the server with: npm run dev');
    return false;
  }
}

// Run tests
async function main() {
  console.log('🔍 Checking server status...');
  const serverRunning = await checkServerStatus();
  
  if (serverRunning) {
    await runAPITests();
  } else {
    process.exit(1);
  }
}

// Jalankan jika dipanggil langsung
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testEndpoint,
  runAPITests,
  checkServerStatus
};