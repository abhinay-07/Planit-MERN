const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing Login API...');
    console.log('📧 Email: admin@vitapstudent.ac.in');
    console.log('🔒 Password: admin123');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vitapstudent.ac.in',
      password: 'admin123'
    });
    
    console.log('\n✅ LOGIN SUCCESS!');
    console.log('📊 Response Status:', response.status);
    console.log('📝 Response Data:');
    console.log('   Message:', response.data.message);
    console.log('   User ID:', response.data.user.id);
    console.log('   User Name:', response.data.user.name);
    console.log('   User Email:', response.data.user.email);
    console.log('   User Role:', response.data.user.role || 'user');
    console.log('   Token:', response.data.token ? 'Generated ✅' : 'Missing ❌');
    
    console.log('\n🎉 API LOGIN TEST PASSED!');
    console.log('The login functionality is working correctly.');
    
  } catch (error) {
    console.log('\n❌ LOGIN FAILED!');
    console.log('Status:', error.response?.status || 'Network Error');
    console.log('Error:', error.response?.data?.message || error.message);
  }
}

testLogin();