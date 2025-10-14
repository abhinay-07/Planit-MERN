const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createProperAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB');
    
    console.log('\n🗑️ Removing existing admin...');
    await User.deleteOne({ email: 'admin@vitapstudent.ac.in' });
    console.log('✅ Old admin removed');
    
    console.log('\n🔧 Creating new admin with PLAIN password (let mongoose hash it)...');
    
    // Create new admin with PLAIN password - let the pre('save') middleware handle hashing
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@vitapstudent.ac.in',
      password: 'admin123', // PLAIN PASSWORD - will be hashed by pre-save middleware
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
    
    console.log('🔒 Saving user (password will be auto-hashed)...');
    await adminUser.save();
    console.log('✅ New admin created successfully!');
    
    // Test the password with the saved user
    console.log('\n🧪 Testing login credentials...');
    const savedUser = await User.findOne({ email: 'admin@vitapstudent.ac.in' });
    
    console.log(`📧 Email: ${savedUser.email}`);
    console.log(`🔐 Hashed password: ${savedUser.password.substring(0, 30)}...`);
    console.log(`✅ Email verified: ${savedUser.isEmailVerified}`);
    console.log(`✅ Account verified: ${savedUser.isVerified}`);
    console.log(`🔐 Role: ${savedUser.role}`);
    
    // Test password comparison
    const passwordTest = await savedUser.comparePassword('admin123');
    console.log(`🔒 Password test: ${passwordTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (passwordTest) {
      console.log('\n🎉 SUCCESS! Admin login should work now!');
      console.log('📧 Email: admin@vitapstudent.ac.in');
      console.log('🔒 Password: admin123');
      console.log('🌐 Try logging in at: http://localhost:3000/login');
    } else {
      console.log('\n❌ Password test still failing - need to debug further');
    }
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createProperAdmin();