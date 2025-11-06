import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PlaceDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewFilter, setReviewFilter] = useState('all');

  // Sample data - in real app, this would come from API based on ID
  const place = {
    id: 1,
    name: "Campus Cafe",
    category: "restaurant",
    description: "Popular student hangout spot with great food and affordable prices. Known for their excellent sandwiches, coffee, and friendly atmosphere. The cafe offers a cozy environment perfect for studying, casual meetings, or simply enjoying a meal with friends.",
    ratings: { 
      overall: 4.5, 
      student: 4.7,
      public: 4.2
    },
    reviewCount: { 
      total: 45, 
      student: 32,
      public: 13
    },
    priceRange: "budget",
    address: {
      street: "VIT-AP Campus",
      city: "Amaravati",
      state: "Andhra Pradesh"
    },
    contact: {
      phone: "+91 9876543210",
      website: "www.campuscafe.com",
      email: "info@campuscafe.com"
    },
    operatingHours: {
      monday: { open: "08:00", close: "22:00", isOpen: true },
      tuesday: { open: "08:00", close: "22:00", isOpen: true },
      wednesday: { open: "08:00", close: "22:00", isOpen: true },
      thursday: { open: "08:00", close: "22:00", isOpen: true },
      friday: { open: "08:00", close: "23:00", isOpen: true },
      saturday: { open: "08:00", close: "23:00", isOpen: true },
      sunday: { open: "09:00", close: "22:00", isOpen: true }
    },
    amenities: ["Wi-Fi", "AC", "Outdoor Seating", "Takeaway", "Card Payment", "Digital Menu"],
    tags: ["student-friendly", "budget-friendly", "group-study", "free-wifi"],
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400",
      "/api/placeholder/600/400"
    ],
    verified: true,
    currentlyOpen: true
  };

  const StarRating = ({ rating, size = 'md', showNumber = true }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-400 fill-current`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" clipPath="inset(0 50% 0 0)" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      }
    }
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        {showNumber && <span className="ml-2 text-gray-600">{rating}</span>}
      </div>
    );
  };

  const getPriceColor = (priceRange) => {
    switch (priceRange) {
      case 'free': return 'text-green-600 bg-green-100';
      case 'budget': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'expensive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-gray-700">Home</Link></li>
            <li><span>/</span></li>
            <li><Link to="/places" className="hover:text-gray-700">Places</Link></li>
            <li><span>/</span></li>
            <li className="text-gray-900">{place.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="h-96 bg-gray-300 flex items-center justify-center relative">
                <span className="text-gray-500 text-lg">Image Gallery Placeholder</span>
                {place.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Place Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {place.category.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriceColor(place.priceRange)}`}>
                      {place.priceRange === 'free' ? 'Free' : `${place.priceRange} pricing`}
                    </span>
                    {place.currentlyOpen && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Open Now
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <StarRating rating={place.ratings.overall} size="lg" />
                <p className="text-gray-600 mt-1">Based on {place.reviewCount.total} reviews</p>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
              
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Overall</h3>
                  <StarRating rating={place.ratings.overall} size="md" />
                  <p className="text-sm text-gray-600 mt-1">{place.reviewCount.total} reviews</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">VIT-AP Students</h3>
                  <StarRating rating={place.ratings.student} size="md" />
                  <p className="text-sm text-blue-600 mt-1">{place.reviewCount.student} reviews</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-green-900 mb-2">General Public</h3>
                  <StarRating rating={place.ratings.public} size="md" />
                  <p className="text-sm text-green-600 mt-1">{place.reviewCount.public} reviews</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Write a Review
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                  View All Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-900">{place.address.street}</p>
                    <p className="text-gray-600">{place.address.city}, {place.address.state}</p>
                  </div>
                </div>

                {place.contact.phone && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${place.contact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {place.contact.phone}
                    </a>
                  </div>
                )}

                {place.contact.website && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c0-9 0-9 0-9m9-9v9" />
                    </svg>
                    <a href={`https://${place.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {place.contact.website}
                    </a>
                  </div>
                )}

                {place.contact.email && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${place.contact.email}`} className="text-blue-600 hover:text-blue-800">
                      {place.contact.email}
                    </a>
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </button>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Operating Hours</h3>
              <div className="space-y-2">
                {Object.entries(place.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-gray-700 capitalize font-medium">{day}</span>
                    <span className="text-gray-600">
                      {hours.open} - {hours.close}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {place.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;