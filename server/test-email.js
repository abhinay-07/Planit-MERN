const { sendVerificationEmail } = require('./utils/emailService');
require('dotenv').config();

// Test email verification
const testEmail = async () => {
  try {
    console.log('Testing email verification system...');
    
    const testUser = {
      name: 'Test User',
      email: 'test@vitapstudent.ac.in',
      userType: 'student'
    };
    
    const verificationToken = 'test-token-123';
    
    // This will only work if you have configured email settings in .env
    const result = await sendVerificationEmail(testUser.email, testUser.name, verificationToken);
    
    if (result.success) {
      console.log('✅ Email verification system is working correctly!');
      console.log('Verification URL would be:', `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`);
    } else {
      console.log('❌ Email verification system test failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('💡 This is expected if email configuration is not set up in .env file');
  }
};

testEmail();