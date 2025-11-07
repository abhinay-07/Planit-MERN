require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop existing indexes (optional, uncomment if needed)
    // await Place.collection.dropIndexes();
    // console.log('🗑️  Dropped existing indexes');

    // Create geospatial index
    await Place.collection.createIndex({ location: '2dsphere' });
    console.log('✅ Created 2dsphere index on location field');

    // Create text search index
    await Place.collection.createIndex({ 
      name: 'text', 
      description: 'text', 
      tags: 'text' 
    });
    console.log('✅ Created text search index');

    // List all indexes
    const indexes = await Place.collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${JSON.stringify(index.key)} (${index.name})`);
    });

    // Test a simple query
    const count = await Place.countDocuments();
    console.log(`\n📊 Total places in database: ${count}`);

    // Test geospatial query
    if (count > 0) {
      console.log('\n🧪 Testing geospatial query...');
      const testPlaces = await Place.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [80.6480, 16.5062] // Vijayawada center
            },
            $maxDistance: 20000 // 20km
          }
        }
      }).limit(5);
      
      console.log(`✅ Found ${testPlaces.length} places within 20km of Vijayawada center`);
      testPlaces.forEach((place, i) => {
        console.log(`  ${i + 1}. ${place.name} (${place.category})`);
      });
    }

    console.log('\n🎉 Index creation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();
