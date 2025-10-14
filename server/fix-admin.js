const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fixAdminAccount() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB');
    
    console.log('\n🔧 Fixing admin account...');
    
    const admin = await User.findOne({ email: 'admin@vitapstudent.ac.in' });
    
    if (!admin) {
      console.log('❌ Admin account not found!');
      return;
    }
    
    console.log('📋 Current admin status:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   ✅ isEmailVerified: ${admin.isEmailVerified}`);
    console.log(`   ✅ emailVerified: ${admin.emailVerified}`);
    console.log(`   ✅ isVerified: ${admin.isVerified}`);
    console.log(`   🔐 Role: ${admin.role}`);
    
    // Update admin account with proper verification
    admin.isEmailVerified = true;
    admin.emailVerified = true;
    admin.isVerified = true;
    admin.verificationStatus = 'approved';
    
    await admin.save();
    
    console.log('\n✅ Admin account fixed!');
    console.log('📋 Updated admin status:');
    console.log(`   ✅ isEmailVerified: ${admin.isEmailVerified}`);
    console.log(`   ✅ emailVerified: ${admin.emailVerified}`);
    console.log(`   ✅ isVerified: ${admin.isVerified}`);
    console.log(`   ✅ verificationStatus: ${admin.verificationStatus}`);
    
    console.log('\n🎉 Admin can now login successfully!');
    console.log('📧 Email: admin@vitapstudent.ac.in');
    console.log('🔒 Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixAdminAccount();