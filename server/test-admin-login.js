const axios = require('axios');

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vitapstudent.ac.in',
      password: 'admin123'
    });

    if (response.data.token) {
      console.log('✅ Admin login successful!');
      console.log('User data:', {
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        userType: response.data.user.userType
      });

      // Test admin dashboard endpoint
      const dashboardResponse = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });

      console.log('✅ Admin dashboard access successful!');
      console.log('Dashboard stats:', dashboardResponse.data);
      
    } else {
      console.log('❌ Login failed - no token received');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAdminLogin();