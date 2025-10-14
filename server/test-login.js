const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB');
    
    const email = 'admin@vitapstudent.ac.in';
    const password = 'admin123';
    
    console.log('\n🔍 Testing Login Process:');
    console.log('-'.repeat(40));
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    
    // Step 1: Find user by email
    console.log('\n📋 Step 1: Finding user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   👤 Name: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔐 Role: ${user.role}`);
    console.log(`   🎓 VIT ID: ${user.vitapId}`);
    console.log(`   ✅ Verified: ${user.isEmailVerified}`);
    
    // Step 2: Verify password
    console.log('\n🔐 Step 2: Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password!');
      console.log(`   Stored hash: ${user.password.substring(0, 20)}...`);
      
      // Test if password is stored as plain text (debugging)
      if (user.password === password) {
        console.log('⚠️  Password stored as plain text (security issue!)');
      }
      return;
    }
    
    console.log('✅ Password is valid!');
    
    // Step 3: Generate JWT token
    console.log('\n🎫 Step 3: Generating JWT token...');
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('✅ JWT token generated successfully!');
    console.log(`   Token: ${token.substring(0, 30)}...`);
    
    // Step 4: Prepare response
    console.log('\n📦 Step 4: Login response:');
    const loginResponse = {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        vitapId: user.vitapId
      },
      token
    };
    
    console.log('✅ Login Response:');
    console.log(JSON.stringify(loginResponse, null, 2));
    
    console.log('\n🎉 LOGIN TEST SUCCESSFUL!');
    console.log('The admin account is working correctly.');
    
  } catch (error) {
    console.error('❌ Login Test Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testLogin();