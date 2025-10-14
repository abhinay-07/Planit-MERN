const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function recreateAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB');
    
    console.log('\n🗑️ Removing existing admin...');
    await User.deleteOne({ email: 'admin@vitapstudent.ac.in' });
    console.log('✅ Old admin removed');
    
    console.log('\n🔧 Creating new admin with fresh password...');
    
    // Hash password properly
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    console.log(`🔒 Plain password: ${plainPassword}`);
    console.log(`🔐 Hashed password: ${hashedPassword.substring(0, 30)}...`);
    
    // Create new admin
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@vitapstudent.ac.in',
      password: hashedPassword,
      userType: 'student',
      role: 'super_admin',
      vitapId: 'ADMIN001',
      phoneNumber: '+91-9999999999',
      isEmailVerified: true,
      isVerified: true,
      verificationStatus: 'approved',
      branch: 'Computer Science',
      year: 4,
      hostel: 'Admin Block'
    });
    
    await adminUser.save();
    console.log('✅ New admin created successfully!');
    
    // Test the password immediately
    console.log('\n🧪 Testing password immediately...');
    const testResult = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`Password test result: ${testResult ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test with saved user
    console.log('\n🔍 Testing with saved user...');
    const savedUser = await User.findOne({ email: 'admin@vitapstudent.ac.in' });
    const savedTestResult = await bcrypt.compare(plainPassword, savedUser.password);
    console.log(`Saved user password test: ${savedTestResult ? '✅ PASS' : '❌ FAIL'}`);
    
    if (savedUser.comparePassword) {
      const methodTestResult = await savedUser.comparePassword(plainPassword);
      console.log(`comparePassword method test: ${methodTestResult ? '✅ PASS' : '❌ FAIL'}`);
    }
    
    console.log('\n🎉 ADMIN RECREATION COMPLETE!');
    console.log('📧 Email: admin@vitapstudent.ac.in');
    console.log('🔒 Password: admin123');
    console.log('🔐 Role: super_admin');
    console.log('✅ Status: Ready for login');
    
  } catch (error) {
    console.error('❌ Error recreating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

recreateAdmin();