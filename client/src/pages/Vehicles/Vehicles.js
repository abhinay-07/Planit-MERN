import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Vehicles = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedOwnerType, setSelectedOwnerType] = useState('all');

  // Sample data - in real app, this would come from API
  const sampleVehicles = [
    {
      id: 1,
      vehicleType: "bike",
      make: "Honda",
      model: "Activa 6G",
      year: 2022,
      pricing: { hourly: 50, daily: 300 },
      ratings: { average: 4.5, count: 12 },
      owner: { name: "Raj Kumar", userType: "student", avatar: "RK" },
      location: "VIT-AP Campus",
      features: ["Helmet Included", "Good Condition", "Fuel Efficient"],
      isVerified: true,
      available: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      vehicleType: "car",
      make: "Maruti",
      model: "Swift",
      year: 2020,
      pricing: { hourly: 150, daily: 1200 },
      ratings: { average: 4.2, count: 8 },
      owner: { name: "Priya Singh", userType: "student", avatar: "PS" },
      location: "Near Campus",
      features: ["AC", "Music System", "GPS", "4 Seater"],
      isVerified: true,
      available: true,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      vehicleType: "scooter",
      make: "TVS",
      model: "Jupiter",
      year: 2021,
      pricing: { hourly: 45, daily: 280 },
      ratings: { average: 4.0, count: 6 },
      owner: { name: "Amit Patel", userType: "public", avatar: "AP" },
      location: "Vijayawada",
      features: ["Under Seat Storage", "Digital Display", "LED Lights"],
      isVerified: true,
      available: false,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      vehicleType: "bike",
      make: "Royal Enfield",
      model: "Classic 350",
      year: 2021,
      pricing: { hourly: 80, daily: 500 },
      ratings: { average: 4.7, count: 15 },
      owner: { name: "Karan Singh", userType: "student", avatar: "KS" },
      location: "VIT-AP Campus",
      features: ["Vintage Style", "Powerful Engine", "Comfortable Seat"],
      isVerified: true,
      available: true,
      image: "/api/placeholder/300/200"
    }
  ];

  const vehicleTypes = [
    { id: 'all', label: 'All Vehicles', icon: '🚗' },
    { id: 'car', label: 'Cars', icon: '🚗' },
    { id: 'bike', label: 'Bikes', icon: '🏍️' },
    { id: 'scooter', label: 'Scooters', icon: '🛵' }
  ];

  const ownerTypes = [
    { id: 'all', label: 'All Owners' },
    { id: 'student', label: 'VIT-AP Students' },
    { id: 'public', label: 'General Public' }
  ];

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'bike':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'scooter':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21l4-7 4 7M3 7h18l-2 5H5l-2-5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
    }
  };

  const StarRating = ({ rating, count }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" clipPath="inset(0 50% 0 0)" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      }
    }
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-2 text-sm text-gray-600">{rating} ({count} reviews)</span>
      </div>
    );
  };

  const filteredVehicles = sampleVehicles.filter(vehicle => {
    const typeMatch = selectedType === 'all' || vehicle.vehicleType === selectedType;
    const ownerMatch = selectedOwnerType === 'all' || vehicle.owner.userType === selectedOwnerType;
    return typeMatch && ownerMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vehicle Rentals</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rent vehicles from verified owners within the VIT-AP community for your trips.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Type Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Type</h3>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Owner Type Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Owner Type</h3>
              <div className="flex flex-wrap gap-2">
                {ownerTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedOwnerType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedOwnerType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image */}
              <div className="h-48 bg-gray-300 flex items-center justify-center relative">
                <span className="text-gray-500">Vehicle Image</span>
                {vehicle.isVerified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
                {!vehicle.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Currently Unavailable</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center mb-4">
                  {getVehicleIcon(vehicle.vehicleType)}
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {vehicle.year} • {vehicle.vehicleType}
                    </p>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {vehicle.owner.avatar}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{vehicle.owner.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.owner.userType === 'student'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.owner.userType === 'student' ? 'VIT-AP Student' : 'General Public'}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mb-4 text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{vehicle.location}</span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{vehicle.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {vehicle.ratings.count > 0 && (
                  <div className="mb-4">
                    <StarRating rating={vehicle.ratings.average} count={vehicle.ratings.count} />
                  </div>
                )}

                {/* Pricing and Action */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">₹{vehicle.pricing.hourly}/hr</p>
                    <p className="text-sm text-gray-600">₹{vehicle.pricing.daily}/day</p>
                  </div>
                  <button 
                    disabled={!vehicle.available}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      vehicle.available
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {vehicle.available ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Load More Vehicles
            </button>
            <Link
              to="/vehicles/add"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              List Your Vehicle
            </Link>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-8 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Verified Owners</h4>
                <p className="text-sm text-gray-600">All vehicle owners are verified for your safety</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Affordable Pricing</h4>
                <p className="text-sm text-gray-600">Student-friendly rates within your budget</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-gray-600">Round-the-clock assistance for any issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;