import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LeafletMap from '../components/Maps/LeafletMap';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('map');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyMode, setNearbyMode] = useState(false);

  const categories = [
    { value: 'all', label: 'All', icon: '🏛️' },
    { value: 'tourist_attraction', label: 'Tourist Spots', icon: '🗿' },
    { value: 'religious', label: 'Religious', icon: '🕉️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎮' },
    { value: 'recreation', label: 'Recreation', icon: '🎢' },
    { value: 'accommodation', label: 'Hotels', icon: '🏨' },
    { value: 'educational', label: 'Educational', icon: '📚' },
    { value: 'restaurant', label: 'Restaurants', icon: '🍽️' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const [placesRes, vehiclesRes, offersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/places${categoryParam}`),
        axios.get('http://localhost:5000/api/vehicles'),
        axios.get('http://localhost:5000/api/offers')
      ]);

      setPlaces(placesRes.data.data || []);
      setVehicles(vehiclesRes.data.data || []);
      setOffers(offersRes.data.data || []);
      
      const sortedPlaces = [...(placesRes.data.data || [])].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopPicks(sortedPlaces.slice(0, 3));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      setLocationLoading(true);
      const radius = 50; // Increased to 50 km radius to include all Vijayawada places
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      
      const response = await axios.get(
        `http://localhost:5000/api/places?lat=${lat}&lng=${lng}&radius=${radius}${categoryParam}`
      );
      
      const nearbyPlaces = response.data.data || [];
      
      if (nearbyPlaces.length === 0) {
        // If no places found nearby, fetch all places to show on map
        toast('No places within ' + radius + 'km. Showing all places.', {
          icon: 'ℹ️',
          duration: 3000
        });
        await fetchData(); // Fetch all places
        setNearbyMode(false);
      } else {
        setPlaces(nearbyPlaces);
        setNearbyMode(true);
        toast.success(`Found ${nearbyPlaces.length} places within ${radius}km`);
      }
      
      setLocationLoading(false);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      // On error, show all places instead of failing
      toast('Showing all places on map', {
        icon: 'ℹ️',
        duration: 2000
      });
      await fetchData();
      setNearbyMode(false);
      setLocationLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast.dismiss();
        fetchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        setLocationLoading(false);
        toast.dismiss();
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An error occurred while getting your location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleResetLocation = () => {
    setNearbyMode(false);
    setUserLocation(null);
    fetchData();
    toast.success('Showing all places');
  };

  const handlePlaceClick = (placeId) => {
    window.location.href = `/places/${placeId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-lg">Loading your personalized experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || 'Explorer'}! 
          </h1>
          <p className="text-blue-100">
            Discover amazing places around VIT-AP
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search places, restaurants, attractions..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              {nearbyMode ? (
                <button
                  onClick={handleResetLocation}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Show All Places
                </button>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Finding...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Near Me
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setActiveView('map')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                 Map
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                 List
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'map' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[500px]">
                <LeafletMap places={places} onPlaceClick={handlePlaceClick} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Places Nearby</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{places.length}</p>
                  </div>
                  <div className="text-4xl"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Available Vehicles</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{vehicles.length}</p>
                  </div>
                  <div className="text-4xl"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Active Offers</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">{offers.length}</p>
                  </div>
                  <div className="text-4xl"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Places</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <div
                    key={place._id}
                    onClick={() => handlePlaceClick(place._id)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      {place.images && place.images[0] ? (
                        <img 
                          src={place.images[0].url || place.images[0]} 
                          alt={place.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image load error for:', place.name, place.images[0]);
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📷</div>
                      )}
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                         {place.rating || 'N/A'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{place.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{place.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {place.location?.address || 'Location not specified'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {topPicks.length > 0 && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2"> Top Picks This Week</h2>
              <p className="text-yellow-50">Most loved places by VIT-AP community</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPicks.map((place, index) => (
                <div
                  key={place._id}
                  onClick={() => handlePlaceClick(place._id)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer relative"
                >
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">
                    {index + 1}
                  </div>
                  <div className="h-48 bg-gray-200">
                    {place.images && place.images[0] ? (
                      <img src={place.images[0].url || place.images[0]} alt={place.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl"></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{place.name}</h3>
                    <div className="flex items-center text-yellow-500 mb-2">
                      <span className="text-lg font-bold">⭐ {place.ratings?.overall?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-500 text-sm ml-2">({place.reviewCount?.total || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {offers.length > 0 && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2"> Live Offers</h2>
              <p className="text-red-50">Exclusive deals just for you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.slice(0, 6).map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl"></div>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount || 'Special'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                  <div className="text-xs text-gray-500">
                    Valid till: {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900"> Available Rentals</h2>
              <button
                onClick={() => window.location.href = '/vehicles'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All 
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.slice(0, 4).map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-32 bg-gray-200 flex items-center justify-center text-5xl"></div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">₹{vehicle.pricePerDay}/day</span>
                      {vehicle.available && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
