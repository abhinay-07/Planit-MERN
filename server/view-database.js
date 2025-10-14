const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const Review = require('./models/Review');
const Vehicle = require('./models/Vehicle');

async function viewDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/planit');
    console.log('✅ Connected to MongoDB successfully!');
    
    console.log('\n📊 DATABASE OVERVIEW:');
    console.log('='.repeat(50));
    
    // Count documents in each collection
    const userCount = await User.countDocuments();
    const placeCount = await Place.countDocuments();
    const reviewCount = await Review.countDocuments();
    const vehicleCount = await Vehicle.countDocuments();
    
    console.log(`👥 Users: ${userCount} documents`);
    console.log(`📍 Places: ${placeCount} documents`);
    console.log(`⭐ Reviews: ${reviewCount} documents`);
    console.log(`🚗 Vehicles: ${vehicleCount} documents`);
    
    console.log('\n👥 USERS COLLECTION:');
    console.log('-'.repeat(30));
    const users = await User.find().select('name email userType role isEmailVerified vitapId');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Type: ${user.userType}`);
      console.log(`   🔐 Role: ${user.role || 'user'}`);
      console.log(`   ✅ Verified: ${user.isEmailVerified ? 'Yes' : 'No'}`);
      if (user.vitapId) console.log(`   🎓 VIT ID: ${user.vitapId}`);
      console.log('');
    });
    
    if (placeCount > 0) {
      console.log('\n📍 PLACES COLLECTION:');
      console.log('-'.repeat(30));
      const places = await Place.find().select('name category location rating');
      places.forEach((place, index) => {
        console.log(`${index + 1}. ${place.name}`);
        console.log(`   📂 Category: ${place.category}`);
        console.log(`   📍 Location: ${place.location?.address || 'No address'}`);
        console.log(`   ⭐ Rating: ${place.rating || 'No rating'}/5`);
        console.log('');
      });
    }
    
    if (vehicleCount > 0) {
      console.log('\n🚗 VEHICLES COLLECTION:');
      console.log('-'.repeat(30));
      const vehicles = await Vehicle.find().select('name type pricePerDay available');
      vehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name}`);
        console.log(`   🚙 Type: ${vehicle.type}`);
        console.log(`   💰 Price: ₹${vehicle.pricePerDay}/day`);
        console.log(`   ✅ Available: ${vehicle.available ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    console.log('📂 DATABASE LOCATION:');
    console.log('-'.repeat(30));
    console.log('🏠 Local MongoDB Instance');
    console.log('📍 Connection: mongodb://localhost:27017/planit');
    console.log('💾 Database Name: planit');
    console.log('📁 Collections: users, places, reviews, vehicles');
    
    console.log('\n🌐 ACCESS YOUR DATABASE:');
    console.log('-'.repeat(30));
    console.log('1. MongoDB Compass (GUI): Download from https://www.mongodb.com/products/compass');
    console.log('2. MongoDB Shell: Install mongosh from https://www.mongodb.com/try/download/shell');
    console.log('3. VS Code Extension: Install "MongoDB for VS Code"');
    console.log('4. Web Interface: Use Studio 3T or Robo 3T');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

viewDatabase();