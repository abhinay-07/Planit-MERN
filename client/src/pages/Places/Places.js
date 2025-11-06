import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleMap from '../../components/Maps/GoogleMap';
import PlacesSearch from '../../components/Maps/PlacesSearch';
import { DEFAULT_CENTER, PLACE_CATEGORIES } from '../../utils/googleMaps';

const Places = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewType, setViewType] = useState('student'); // 'all' or 'student'
  const [mapView, setMapView] = useState(false); // Toggle between list and map view
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapMarkers, setMapMarkers] = useState([]);

  // Sample data - in real app, this would come from API
  const samplePlaces = [
    {
      id: 1,
      name: "Campus Cafe",
      category: "restaurant",
      description: "Popular student hangout spot with great food and affordable prices. Known for its quick service and student-friendly environment.",
      ratings: { overall: 4.5, student: 4.7 },
      reviewCount: { total: 45, student: 32 },
      priceRange: "budget",
      address: "VIT-AP Campus",
      image: "/api/placeholder/300/200",
      verified: true
    },
    {
      id: 2,
      name: "Prakasam Barrage",
      category: "tourist_attraction",
      description: "Beautiful dam and bridge offering scenic views of the Krishna River. Perfect for evening walks and photography.",
      ratings: { overall: 4.2, student: 4.1 },
      reviewCount: { total: 28, student: 15 },
      priceRange: "free",
      address: "Vijayawada",
      image: "/api/placeholder/300/200",
      verified: true
    },
    {
      id: 3,
      name: "Forum Mall",
      category: "shopping",
      description: "Large shopping mall with restaurants, shops and entertainment. Great place for weekend hangouts with friends.",
      ratings: { overall: 4.0, student: 3.9 },
      reviewCount: { total: 67, student: 23 },
      priceRange: "moderate",
      address: "Vijayawada",
      image: "/api/placeholder/300/200",
      verified: false
    },
    {
      id: 4,
      name: "Barbeque Nation",
      category: "restaurant",
      description: "Popular buffet restaurant known for its grilled items and diverse menu. Great for group celebrations.",
      ratings: { overall: 4.3, student: 4.4 },
      reviewCount: { total: 89, student: 42 },
      priceRange: "expensive",
      address: "Vijayawada",
      image: "/api/placeholder/300/200",
      verified: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Places', icon: '🏢' },
    { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
    { id: 'tourist_attraction', label: 'Attractions', icon: '🏛️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? samplePlaces 
    : samplePlaces.filter(place => place.category === selectedCategory);

  const StarRating = ({ rating, size = 'sm' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400 fill-current`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" clipPath="inset(0 50% 0 0)" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      }
    }
    return <div className="flex">{stars}</div>;
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Places</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the best restaurants, attractions, and local spots with authentic reviews from the VIT-AP community.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setViewType('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setViewType('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewType === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              VIT-AP Students Only
            </button>
          </div>
        </div>

        {/* Map/List View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setMapView(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                !mapView
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setMapView(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                mapView
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Content - Map or List View */}
        {mapView ? (
          /* Map View */
          <div className="space-y-6">
            {/* Google Maps with Places Search */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🗺️ Explore Places on Map</h3>
              
              {/* Places Search Integration */}
              <div className="mb-6">
                <PlacesSearch
                  center={mapCenter}
                  onPlaceSelect={(place) => {
                    setSelectedPlace(place);
                    setMapCenter(place.location);
                    setMapMarkers([{
                      lat: place.location.lat,
                      lng: place.location.lng,
                      title: place.name,
                      infoWindow: `
                        <div class="p-2">
                          <h4 class="font-semibold">${place.name}</h4>
                          <p class="text-sm text-gray-600">${place.address}</p>
                          ${place.rating ? `<p class="text-sm">⭐ ${place.rating} (${place.totalRatings} reviews)</p>` : ''}
                        </div>
                      `
                    }]);
                  }}
                />
              </div>

              {/* Google Map */}
              <div className="h-96 rounded-lg overflow-hidden">
                <GoogleMap
                  center={mapCenter}
                  zoom={14}
                  markers={mapMarkers}
                  onMarkerClick={(marker) => {
                    console.log('Marker clicked:', marker);
                  }}
                  showUserLocation={true}
                />
              </div>

              {/* Selected Place Info */}
              {selectedPlace && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">{selectedPlace.name}</h4>
                  <p className="text-sm text-gray-700 mb-2">{selectedPlace.address}</p>
                  {selectedPlace.rating && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span>⭐ {selectedPlace.rating}</span>
                      <span className="text-gray-500">({selectedPlace.totalRatings} reviews)</span>
                      {selectedPlace.distance && (
                        <span className="text-blue-600">• {selectedPlace.distance.toFixed(1)}km away</span>
                      )}
                    </div>
                  )}
                  <div className="mt-3">
                    <Link
                      to={`/places/google-${selectedPlace.placeId}`}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="h-48 bg-gray-300 flex items-center justify-center relative">
                  <span className="text-gray-500">Image Placeholder</span>
                  {place.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{place.name}</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                      {place.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <StarRating rating={viewType === 'student' ? place.ratings.student : place.ratings.overall} />
                    <span className="ml-2 text-sm text-gray-600">
                      {viewType === 'student' ? place.ratings.student : place.ratings.overall}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      ({viewType === 'student' ? place.reviewCount.student : place.reviewCount.total} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center mb-3 text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{place.address}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {place.description}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(place.priceRange)}`}>
                      {place.priceRange === 'free' ? 'Free' : `${place.priceRange} pricing`}
                    </span>
                    <Link
                      to={`/places/${place.id}`}
                      className="inline-flex items-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More - Only show in list view */}
        {!mapView && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Load More Places
            </button>
          </div>
        )}

        {/* Add Place CTA */}
        <div className="bg-blue-50 rounded-xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Know a great place?</h3>
          <p className="text-gray-600 mb-6">Help the community by adding new places and sharing your experiences.</p>
          <Link
            to="/places/add"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add a Place
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Places;