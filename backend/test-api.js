const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3001';

// تولید آدرس تصادفی واقعی
function generateRandomAddress() {
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// تولید نام منحصر به فرد
function generateUniqueName() {
  return `Test Business ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function runTests() {
  console.log('🧪 Starting API tests...\n');
  
  // استفاده از crypto برای آدرس واقعی
  const crypto = require('crypto');
  const TEST_ADDRESS = generateRandomAddress();
  const TEST_NAME = generateUniqueName();
  
  console.log('🔧 Generated test data:');
  console.log('   💼 Name:', TEST_NAME);
  console.log('   🛄 Address:', TEST_ADDRESS);
  
  try {
    // تست 1: Health check
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // تست 2: دریافت لیست کسب‌وکارها
    console.log('\n2️⃣ Testing business list endpoint...');
    const businessesResponse = await axios.get(`${API_URL}/api/business`);
    console.log('✅ Business list retrieved successfully');
    console.log('📊 Found businesses:', businessesResponse.data.length);
    
    // تست 3: ثبت کسب‌وکار جدید
    console.log('\n3️⃣ Testing business registration...');
    const registerResponse = await axios.post(`${API_URL}/api/business`, {
      name: TEST_NAME,
      ownerAddress: TEST_ADDRESS
    });
    console.log('✅ Business registered successfully');
    console.log('🏢 Business ID:', registerResponse.data.id);
    console.log('📋 Registered business:', registerResponse.data);
    
    // تست 4: دریافت کسب‌وکار با آدرس
    console.log('\n4️⃣ Testing business by address...');
    const businessResponse = await axios.get(`${API_URL}/api/business/${TEST_ADDRESS}`);
    console.log('✅ Business retrieved by address');
    console.log('🔍 Retrieved business:', {
      id: businessResponse.data.id,
      name: businessResponse.data.name,
      ownerAddress: businessResponse.data.ownerAddress.substring(0, 10) + '...'
    });
    
    console.log('\n🎉 All tests passed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('🔍 Error details:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // اطلاعات بیشتر برای عیب‌یابی
    if (error.response?.status === 409) {
      console.log('\n💡 Tip: This usually means the address was already registered.');
      console.log('   Try running the test again with a fresh address.');
    }
    
    process.exit(1);
  }
}

runTests();