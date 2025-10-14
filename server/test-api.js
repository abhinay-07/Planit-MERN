// Test API endpoint directly
const testAPILogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@vitapstudent.ac.in',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Login API working correctly!');
    } else {
      console.log('❌ Login API failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testAPILogin();