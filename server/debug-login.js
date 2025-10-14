const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function debugLogin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB');
    
    console.log('\n🔍 DEBUGGING LOGIN ISSUE');
    console.log('='.repeat(50));
    
    // Test credentials
    const testEmail = 'admin@vitapstudent.ac.in';
    const testPassword = 'admin123';
    
    console.log(`📧 Testing Email: ${testEmail}`);
    console.log(`🔒 Testing Password: ${testPassword}`);
    
    // Step 1: Find user
    console.log('\n📋 Step 1: Finding user in database...');
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ ERROR: Admin user not found!');
      console.log('   Let me show you all users in the database:');
      
      const allUsers = await User.find().select('name email userType role');
      console.log('\n👥 ALL USERS IN DATABASE:');
      allUsers.forEach((u, index) => {
        console.log(`   ${index + 1}. ${u.name} - ${u.email} (${u.userType}/${u.role || 'user'})`);
      });
      return;
    }
    
    console.log('✅ User found!');
    console.log(`   👤 Name: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔐 Role: ${user.role}`);
    console.log(`   🎓 User Type: ${user.userType}`);
    console.log(`   ✅ Email Verified: ${user.isEmailVerified}`);
    console.log(`   ✅ Account Verified: ${user.isVerified}`);
    console.log(`   📝 Verification Status: ${user.verificationStatus}`);
    
    // Step 2: Test password comparison
    console.log('\n🔐 Step 2: Testing password...');
    console.log(`   Stored password hash: ${user.password.substring(0, 30)}...`);
    
    // Test with bcrypt.compare
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log(`   bcrypt.compare result: ${isPasswordValid}`);
    
    // Test with user.comparePassword method if it exists
    if (user.comparePassword) {
      console.log('   Testing user.comparePassword method...');
      const isPasswordValidMethod = await user.comparePassword(testPassword);
      console.log(`   user.comparePassword result: ${isPasswordValidMethod}`);
    } else {
      console.log('   ⚠️  user.comparePassword method not found');
    }
    
    // Step 3: Check if login would succeed
    console.log('\n🚪 Step 3: Login validation check...');
    
    if (!user.isEmailVerified) {
      console.log('❌ LOGIN WOULD FAIL: Email not verified');
    } else if (!isPasswordValid) {
      console.log('❌ LOGIN WOULD FAIL: Invalid password');
    } else {
      console.log('✅ LOGIN SHOULD SUCCEED: All conditions met');
    }
    
    // Step 4: Fix any issues
    console.log('\n🔧 Step 4: Fixing any issues...');
    
    let needsUpdate = false;
    
    if (!user.isEmailVerified) {
      console.log('   Fixing email verification...');
      user.isEmailVerified = true;
      needsUpdate = true;
    }
    
    if (!user.isVerified) {
      console.log('   Fixing account verification...');
      user.isVerified = true;
      needsUpdate = true;
    }
    
    if (user.verificationStatus !== 'approved') {
      console.log('   Fixing verification status...');
      user.verificationStatus = 'approved';
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await user.save();
      console.log('✅ User account updated and fixed');
    } else {
      console.log('✅ No fixes needed - account is properly configured');
    }
    
    console.log('\n🎉 DIAGNOSIS COMPLETE!');
    console.log('📧 Email: admin@vitapstudent.ac.in');
    console.log('🔒 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugLogin();