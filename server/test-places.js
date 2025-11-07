require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

async function testQueries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Count all places
    const count = await Place.countDocuments();
    console.log(`📊 Total places: ${count}\n`);

    if (count === 0) {
      console.log('⚠️  No places found! Run: node seed-places.js');
      process.exit(1);
    }

    // 2. Show all places with their coordinates
    console.log('📍 All places with coordinates:\n');
    const allPlaces = await Place.find({}, 'name category location');
    allPlaces.forEach((place, i) => {
      const coords = place.location?.coordinates || [];
      console.log(`${i + 1}. ${place.name}`);
      console.log(`   Category: ${place.category}`);
      console.log(`   Coordinates: [${coords[0]}, ${coords[1]}] (lng, lat)\n`);
    });

    // 3. Check if geospatial index exists
    console.log('🔍 Checking indexes...\n');
    const indexes = await Place.collection.indexes();
    const has2dsphere = indexes.some(idx => 
      idx.key && idx.key.location === '2dsphere'
    );
    
    if (has2dsphere) {
      console.log('✅ 2dsphere index exists on location field\n');
    } else {
      console.log('❌ 2dsphere index NOT found! Creating...\n');
      await Place.collection.createIndex({ location: '2dsphere' });
      console.log('✅ Created 2dsphere index\n');
    }

    // 4. Test geospatial query (Vijayawada center)
    console.log('🧪 Testing $near query (Vijayawada center: 80.6480°E, 16.5062°N)...\n');
    
    try {
      const nearbyPlaces = await Place.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [80.6480, 16.5062] // [lng, lat]
            },
            $maxDistance: 20000 // 20km in meters
          }
        }
      }).limit(5);

      console.log(`✅ Found ${nearbyPlaces.length} places within 20km:\n`);
      nearbyPlaces.forEach((place, i) => {
        console.log(`${i + 1}. ${place.name} (${place.category})`);
      });
    } catch (geoError) {
      console.log('❌ Geospatial query failed!');
      console.log('Error:', geoError.message);
      console.log('\n💡 This usually means the 2dsphere index is missing.');
      console.log('   Solution: Restart your server or run: node create-indexes.js\n');
    }

    // 5. Test with user's location (from error log)
    console.log('\n🧪 Testing with your actual location (16.4928°N, 80.5001°E)...\n');
    
    try {
      const userNearby = await Place.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [80.50008988057328, 16.492813397999583]
            },
            $maxDistance: 10000 // 10km
          }
        }
      }).limit(10);

      console.log(`✅ Found ${userNearby.length} places within 10km of your location:\n`);
      userNearby.forEach((place, i) => {
        console.log(`${i + 1}. ${place.name} (${place.category})`);
      });

      if (userNearby.length === 0) {
        console.log('\n💡 No places found within 10km. Try increasing the radius to 50km.');
      }
    } catch (geoError) {
      console.log('❌ Query failed:', geoError.message);
    }

    console.log('\n🎉 Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testQueries();
