require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const User = require('./models/User');

// SET THIS TO YOUR CURRENT LOCATION (or leave as Vijayawada default)
// To place all locations near you, set USE_MY_LOCATION to true
const USE_MY_LOCATION = true; // Changed to true - places all near your location
const MY_LOCATION = {
  lat: 16.492813, // Your actual location from the error log
  lng: 80.500089  // Your actual location from the error log
};

// Default Vijayawada center if not using your location
const VIJAYAWADA_CENTER = { lat: 16.5062, lng: 80.6480 };

// Helper function to generate nearby coordinates (within ~500m-2km radius)
function generateNearbyCoordinates(centerLat, centerLng) {
  // Random offset in degrees (roughly 500m to 2km)
  const latOffset = (Math.random() - 0.5) * 0.02; // ~2.2km at equator
  const lngOffset = (Math.random() - 0.5) * 0.02;
  
  return {
    lat: centerLat + latOffset,
    lng: centerLng + lngOffset
  };
}

// Places data with actual image paths and appropriate coordinates
const placesData = [
  {
    name: 'Prakasam Barrage',
    imagePath: '/assets/images/places/Prakasam Barrage.jpg',
    description: 'A famous barrage built across the Krishna River, offering stunning views of the river and sunset. Popular picnic spot and tourist attraction.',
    category: 'tourist_attraction',
    subcategory: 'landmark',
    // Real location if not using MY_LOCATION
    realLocation: { lat: 16.5186, lng: 80.6215 },
    address: {
      street: 'Prakasam Barrage Road',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520001'
    },
    priceRange: 'budget',
    amenities: ['parking', 'viewpoint', 'photography'],
    tags: ['river', 'bridge', 'sunset', 'picnic', 'landmark']
  },
  {
    name: 'Sri Durga Malleswara Swamy Varla Devasthanam',
    imagePath: '/assets/images/places/Sri Durga Malleswara Swamy Varla Devasthanam.jpg',
    description: 'Ancient Hindu temple dedicated to Goddess Durga, located on Indrakeeladri hill. One of the most visited temples in South India.',
    category: 'religious',
    subcategory: 'temple',
    realLocation: { lat: 16.5102, lng: 80.6150 },
    address: {
      street: 'Indrakeeladri',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520001'
    },
    priceRange: 'budget',
    amenities: ['parking', 'prasadam', 'religious_shop'],
    tags: ['temple', 'hindu', 'kanaka_durga', 'spiritual', 'heritage']
  },
  {
    name: 'Bhavani Island',
    imagePath: '/assets/images/places/Bhavani Island.jpg',
    description: 'Largest river island in India, located on the Krishna River. Perfect for water sports, boat rides, and family picnics.',
    category: 'recreation',
    subcategory: 'island',
    realLocation: { lat: 16.5167, lng: 80.6530 },
    address: {
      street: 'Krishna River',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520003'
    },
    priceRange: 'moderate',
    amenities: ['water_sports', 'restaurant', 'parking', 'boating'],
    tags: ['island', 'river', 'adventure', 'family', 'picnic']
  },
  {
    name: 'ISKCON VIJAYAWADA',
    imagePath: '/assets/images/places/ISKCON VIJAYAWADA.jpg',
    description: 'Beautiful ISKCON temple with serene atmosphere. Regular spiritual discourses, cultural programs, and prasadam distribution.',
    category: 'religious',
    subcategory: 'temple',
    realLocation: { lat: 16.5041, lng: 80.6093 },
    address: {
      street: 'Auto Nagar',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520007'
    },
    priceRange: 'budget',
    amenities: ['parking', 'book_shop', 'prasadam', 'meditation_hall'],
    tags: ['temple', 'krishna', 'spiritual', 'iskcon', 'peaceful']
  },
  {
    name: 'PVP Square',
    imagePath: '/assets/images/places/PVP Square.jpg',
    description: 'Premium shopping mall with international brands, multiplex cinema, food court, and entertainment zones. Modern shopping experience.',
    category: 'shopping',
    subcategory: 'mall',
    realLocation: { lat: 16.5003, lng: 80.6468 },
    address: {
      street: 'Moghalrajpuram',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010'
    },
    priceRange: 'moderate',
    amenities: ['cinema', 'food_court', 'parking', 'atm', 'restrooms'],
    tags: ['mall', 'shopping', 'movies', 'food', 'entertainment']
  },
  {
    name: 'Trendset Mall',
    imagePath: '/assets/images/places/Trendset Mall.jpg',
    description: 'Popular shopping destination with branded stores, food court, and family entertainment center. Great for weekend shopping.',
    category: 'shopping',
    subcategory: 'mall',
    realLocation: { lat: 16.5100, lng: 80.6420 },
    address: {
      street: 'MG Road',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010'
    },
    priceRange: 'moderate',
    amenities: ['food_court', 'parking', 'kids_play_area', 'atm'],
    tags: ['mall', 'shopping', 'food', 'family', 'brands']
  },
  {
    name: 'Adventura',
    imagePath: '/assets/images/places/Adventura.jpg',
    description: 'Exciting adventure park with zip-lining, rope courses, rock climbing, and team building activities. Perfect for adventure enthusiasts.',
    category: 'recreation',
    subcategory: 'adventure_park',
    realLocation: { lat: 16.4950, lng: 80.6450 },
    address: {
      street: 'Near Kondapalli',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520013'
    },
    priceRange: 'moderate',
    amenities: ['parking', 'locker', 'safety_equipment', 'refreshments'],
    tags: ['adventure', 'sports', 'zipline', 'outdoor', 'thrill']
  },
  {
    name: 'Icon Sports',
    imagePath: '/assets/images/places/Icon sports.jpg',
    description: 'Modern sports complex with facilities for cricket, football, badminton, and gym. Coaching available for all age groups.',
    category: 'recreation',
    subcategory: 'sports_complex',
    realLocation: { lat: 16.5120, lng: 80.6380 },
    address: {
      street: 'Benz Circle',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010'
    },
    priceRange: 'moderate',
    amenities: ['parking', 'locker_room', 'cafe', 'equipment_rental'],
    tags: ['sports', 'fitness', 'coaching', 'indoor', 'outdoor']
  },
  {
    name: 'AYANA Hotel & Convention Centre',
    imagePath: '/assets/images/places/AYANA Hotel & Convention Centre.jpg',
    description: 'Luxury hotel with world-class amenities, fine dining restaurants, conference facilities, and spa. Premium hospitality experience.',
    category: 'accommodation',
    subcategory: 'hotel',
    realLocation: { lat: 16.5095, lng: 80.6520 },
    address: {
      street: 'NH 65, Gollapudi',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '521225'
    },
    priceRange: 'luxury',
    amenities: ['restaurant', 'spa', 'gym', 'pool', 'parking', 'conference_hall'],
    tags: ['hotel', 'luxury', 'dining', 'events', 'stay']
  },
  {
    name: 'Kondaveedu Fort',
    imagePath: '/assets/images/places/Kondaveedu Fort.jpg',
    description: 'Historic 14th century fort with ancient architecture and panoramic views. Popular trekking destination and heritage site.',
    category: 'tourist_attraction',
    subcategory: 'fort',
    realLocation: { lat: 16.3450, lng: 80.4580 },
    address: {
      street: 'Kondaveedu',
      city: 'Guntur District',
      state: 'Andhra Pradesh',
      pincode: '522509'
    },
    priceRange: 'budget',
    amenities: ['parking', 'guided_tours', 'viewpoint'],
    tags: ['fort', 'heritage', 'trekking', 'history', 'ruins']
  },
  {
    name: 'Lazer Ops Vijayawada',
    imagePath: '/assets/images/places/Lazer Ops Vijayawada.jpg',
    description: 'Thrilling laser tag arena with advanced equipment and multi-level gaming zones. Perfect for birthdays and group events.',
    category: 'entertainment',
    subcategory: 'gaming',
    realLocation: { lat: 16.5080, lng: 80.6440 },
    address: {
      street: 'Labbipet',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010'
    },
    priceRange: 'moderate',
    amenities: ['parking', 'party_hall', 'cafe', 'locker'],
    tags: ['gaming', 'laser_tag', 'entertainment', 'party', 'indoor']
  },
  {
    name: 'Buddhist Archaeological Museum',
    imagePath: '/assets/images/places/Buddhist Archaeological Museum.jpg',
    description: 'Museum showcasing ancient Buddhist artifacts, sculptures, and relics from Amaravati stupa. Rich historical collection.',
    category: 'educational',
    subcategory: 'museum',
    realLocation: { lat: 16.5733, lng: 80.3583 },
    address: {
      street: 'Amaravati',
      city: 'Guntur District',
      state: 'Andhra Pradesh',
      pincode: '522020'
    },
    priceRange: 'budget',
    amenities: ['parking', 'guided_tours', 'library'],
    tags: ['museum', 'buddhist', 'history', 'artifacts', 'culture']
  },
  {
    name: 'Sri Ramalingeswara Swami Vari Devasthanam',
    imagePath: '/assets/images/places/Sri Ramalingeswara Swami Vari Devasthanam.jpg',
    description: 'Ancient Shiva temple known for its architectural beauty and spiritual significance. Peaceful atmosphere for meditation and prayer.',
    category: 'religious',
    subcategory: 'temple',
    realLocation: { lat: 16.5070, lng: 80.6200 },
    address: {
      street: 'Governorpet',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520002'
    },
    priceRange: 'budget',
    amenities: ['parking', 'prasadam', 'pooja_services'],
    tags: ['temple', 'shiva', 'hindu', 'spiritual', 'architecture']
  }
];

async function seedPlacesWithImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to be the addedBy user
    let adminUser = await User.findOne({ userType: 'admin' });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found. Looking for any user...');
      adminUser = await User.findOne();
    }

    if (!adminUser) {
      console.log('❌ No users found in database. Please create a user first.');
      process.exit(1);
    }

    console.log(`✅ Using user: ${adminUser.name} (${adminUser.email})`);

    // Determine center location
    const center = USE_MY_LOCATION ? MY_LOCATION : VIJAYAWADA_CENTER;
    console.log(`\n📍 Location Mode: ${USE_MY_LOCATION ? 'YOUR LOCATION' : 'VIJAYAWADA (REAL LOCATIONS)'}`);
    console.log(`📍 Center: Lat ${center.lat}, Lng ${center.lng}\n`);

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const placeData of placesData) {
      const existingPlace = await Place.findOne({ name: placeData.name });
      
      // Determine coordinates based on mode
      let coordinates;
      if (USE_MY_LOCATION) {
        // Generate random nearby coordinates around your location
        const nearby = generateNearbyCoordinates(center.lat, center.lng);
        coordinates = [nearby.lng, nearby.lat]; // GeoJSON format [lng, lat]
      } else {
        // Use real location from data
        coordinates = [placeData.realLocation.lng, placeData.realLocation.lat];
      }

      // Prepare place object
      const placeObject = {
        name: placeData.name,
        description: placeData.description,
        category: placeData.category,
        subcategory: placeData.subcategory,
        location: {
          type: 'Point',
          coordinates: coordinates
        },
        address: placeData.address,
        priceRange: placeData.priceRange,
        amenities: placeData.amenities,
        tags: placeData.tags,
        images: [
          {
            url: placeData.imagePath,
            caption: placeData.name,
            uploadedBy: adminUser._id
          }
        ],
        addedBy: adminUser._id,
        isVerified: true,
        ratings: {
          overall: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
          student: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          public: parseFloat((Math.random() * 2 + 3).toFixed(1))
        },
        reviewCount: {
          total: Math.floor(Math.random() * 50),
          student: Math.floor(Math.random() * 30),
          public: Math.floor(Math.random() * 20)
        },
        popularity: {
          views: Math.floor(Math.random() * 1000),
          weeklyViews: Math.floor(Math.random() * 200),
          monthlyViews: Math.floor(Math.random() * 500)
        }
      };
      
      if (existingPlace) {
        // Update existing place with image
        await Place.findByIdAndUpdate(existingPlace._id, {
          $set: {
            images: placeObject.images,
            location: placeObject.location,
            ratings: placeObject.ratings,
            reviewCount: placeObject.reviewCount
          }
        });
        console.log(`✏️  Updated: ${placeData.name} (added image & updated location)`);
        updatedCount++;
      } else {
        // Create new place
        const place = new Place(placeObject);
        await place.save();
        console.log(`✅ Added: ${placeData.name} at [${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}]`);
        addedCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Added: ${addedCount} new places`);
    console.log(`✏️  Updated: ${updatedCount} existing places`);
    console.log(`📷 All places now have images from assets folder!`);
    
    if (USE_MY_LOCATION) {
      console.log(`\n📍 All places are now near your location (${center.lat}, ${center.lng})`);
      console.log(`💡 Use "Near Me" button on /home to see them!`);
    } else {
      console.log(`\n📍 Places are at their real Vijayawada locations`);
      console.log(`💡 Change USE_MY_LOCATION to true to move them near you`);
    }
    
    console.log('\n🎉 Seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding places:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPlacesWithImages();
