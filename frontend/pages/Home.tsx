import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import OpenStreetMap from '../components/Maps/OpenStreetMap';
import { 
  fetchNearbyPlaces, 
  getUserLocation, 
  type NearbyPlace 
} from '../utils/placesAPI';

interface Vehicle {
  id: number;
  vehicleType: 'car' | 'bike' | 'scooter';
  make: string;
  model: string;
  year: number;
  pricing: { hourly: number; daily: number };
  ratings: { average: number; count: number };
  owner: { name: string; userType: string; avatar: string };
  location: string;
  features: string[];
  isVerified: boolean;
  available: boolean;
  image: string;
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Tab management
  const [activeTab, setActiveTab] = useState<'discover' | 'places' | 'vehicles'>('discover');
  
  // Places state
  const [viewMode, setViewMode] = useState<'map' | 'normal'>('normal');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Vehicles state
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [selectedOwnerType, setSelectedOwnerType] = useState<string>('all');

  // Sample vehicles data
  const sampleVehicles: Vehicle[] = [
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

  // Fetch user location and nearby places on mount
  useEffect(() => {
    const fetchLocationAndPlaces = async () => {
      setIsLoadingPlaces(true);
      setLocationError(null);
      
      try {
        const location = await getUserLocation();
        setUserLocation({ lat: location.lat, lng: location.lng });
        
        const places = await fetchNearbyPlaces(location.lat, location.lng);
        setNearbyPlaces(places);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setLocationError(errorMessage);
        console.error('Error fetching location and places:', errorMessage);
      } finally {
        setIsLoadingPlaces(false);
      }
    };

    fetchLocationAndPlaces();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sample places as fallback (converted to NearbyPlace format)
  const samplePlaces: NearbyPlace[] = [
    {
      id: "sample-1",
      name: "Cafe Coffee Day",
      category: "cafe",
      rating: 4.5,
      lat: 16.5062,
      lng: 80.648,
      distance: 2.5,
      type: "cafe",
      photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
    },
    {
      id: "sample-2",
      name: "Punjabi Dhaba",
      category: "restaurant",
      rating: 4.8,
      lat: 16.51,
      lng: 80.65,
      distance: 3.2,
      type: "restaurant",
      photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
    },
    {
      id: "sample-3",
      name: "City Mall",
      category: "shopping",
      rating: 4.3,
      lat: 16.515,
      lng: 80.655,
      distance: 5.1,
      type: "mall",
      photo: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop"
    },
    {
      id: "sample-4",
      name: "Beach View Point",
      category: "attraction",
      rating: 4.9,
      lat: 16.52,
      lng: 80.66,
      distance: 8.3,
      type: "viewpoint",
      photo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
    },
    {
      id: "sample-5",
      name: "Pizza Hut",
      category: "restaurant",
      rating: 4.4,
      lat: 16.508,
      lng: 80.652,
      distance: 3.8,
      type: "restaurant",
      photo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
    },
    {
      id: "sample-6",
      name: "BookStore Cafe",
      category: "cafe",
      rating: 4.6,
      lat: 16.512,
      lng: 80.648,
      distance: 4.2,
      type: "cafe",
      photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
    }
  ];

  // Use real nearby places or fall back to samples
  const displayPlaces = nearbyPlaces.length > 0 ? nearbyPlaces : samplePlaces;

  const categories = [
    { id: 'all', name: 'All Places', icon: '🌟' },
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'cafe', name: 'Cafes', icon: '☕' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'attraction', name: 'Attractions', icon: '🎭' }
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? displayPlaces 
    : displayPlaces.filter(place => place.category === selectedCategory);

  const filteredVehicles = sampleVehicles.filter(vehicle => {
    const typeMatch = selectedVehicleType === 'all' || vehicle.vehicleType === selectedVehicleType;
    const ownerMatch = selectedOwnerType === 'all' || vehicle.owner.userType === selectedOwnerType;
    return typeMatch && ownerMatch;
  });

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Discover Places",
      description: "Find the best restaurants, attractions, and local spots with authentic reviews from VIT-AP students."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      title: "Vehicle Rentals",
      description: "Rent vehicles from verified owners within the VIT-AP community for your trips."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: "Trusted Reviews",
      description: "Filter reviews to see only feedback from verified VIT-AP students for authentic opinions."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: "Local Offers",
      description: "Get access to exclusive deals and discounts at local restaurants, malls, and shops."
    }
  ];

  const stats = [
    { number: "50+", label: "Students" },
    { number: "2+", label: "Places" },
    { number: "5+", label: "Vehicles" },
    { number: "50+", label: "Reviews" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Plan It
              </motion.h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('discover')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'discover' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Discover
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('places')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'places' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Places
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('vehicles')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'vehicles' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Vehicles
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium"
            >
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">VIT-AP University</span>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <span>Student Guide</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl lg:text-7xl font-black tracking-tight text-white"
            >
              Plan It
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-white leading-relaxed max-w-2xl mx-auto"
            >
              Discover the best places around VIT-AP with <span className="text-cyan-100 font-semibold">authentic student reviews</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-900 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Places
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* View Toggle & Best Places Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatePresence mode="wait">
            {/* Discover Tab */}
            {activeTab === 'discover' && (
              <motion.div
                key="discover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Location Status Banner */}
                {nearbyPlaces.length > 0 && !locationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">📍 Real Places Loaded!</p>
                      <p className="text-sm text-green-700">Found {nearbyPlaces.length} places near your location using free OpenStreetMap data</p>
                    </div>
                  </motion.div>
                )}

                {locationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">{locationError}</p>
                      <p className="text-sm text-amber-700">Enable location access to see real nearby places</p>
                    </div>
                  </motion.div>
                )}

          {/* Header with View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Best Places Near You</h2>
              <p className="text-gray-600">Top rated spots by VIT-AP students</p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('normal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'normal' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map View
              </motion.button>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Content Views */}
          <AnimatePresence mode="wait">
            {viewMode === 'normal' ? (
              <motion.div
                key="normal-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={place.photo || `https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=300&fit=crop`}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=300&fit=crop`;
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{place.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      {place.price && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {place.price}
                        </div>
                      )}
                      {isLoadingPlaces && (
                        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-white text-sm font-medium">Loading...</div>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {place.name}
                        </h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {place.distance ? `${place.distance.toFixed(1)} km` : 'Nearby'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full capitalize font-medium">
                          {place.category}
                        </span>
                        <span className="text-xs text-gray-500">• {place.type}</span>
                      </div>
                      {place.address && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                          📍 {place.address}
                        </p>
                      )}
                      {locationError && index === 0 && (
                        <div className="mb-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          📍 Sample data - Enable location for real places
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <OpenStreetMap
                  center={userLocation ? [userLocation.lat, userLocation.lng] : [16.5062, 80.648]}
                  zoom={13}
                  markers={filteredPlaces.map(place => ({
                    id: Number(place.id.replace(/\D/g, '')) || Math.random(),
                    lat: place.lat,
                    lng: place.lng,
                    title: place.name,
                    category: place.category,
                    popupContent: `
                      <div style="padding: 12px; max-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
                        <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937;">${place.name}</h3>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                          <span style="color: #fbbf24; font-size: 18px;">★</span>
                          <span style="font-weight: 600; color: #374151;">${place.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                          <span>📍</span>
                          <span>${place.distance ? place.distance.toFixed(1) + ' km' : 'Nearby'}</span>
                        </div>
                        <div style="margin-top: 8px;">
                          <span style="background-color: #dbeafe; color: #2563eb; padding: 4px 10px; border-radius: 12px; font-size: 12px; text-transform: capitalize; font-weight: 500;">
                            ${place.category}
                          </span>
                          <span style="margin-left: 8px; color: #9ca3af; font-size: 11px;">${place.type}</span>
                        </div>
                      </div>
                    `
                  }))}
                  showUserLocation={true}
                  height="600px"
                  onMarkerClick={(marker) => {
                    console.log('Clicked marker:', marker);
                  }}
                />
                {isLoadingPlaces && (
                  <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="font-medium text-gray-700">Finding nearby places...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
              </motion.div>
            )}

            {/* Places Tab */}
            {activeTab === 'places' && (
              <motion.div
                key="places"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">All Places</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Browse all available places with detailed information and reviews
                  </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {category.icon} {category.name}
                    </motion.button>
                  ))}
                </div>

                {/* Places Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place, index) => (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={place.photo}
                            alt={place.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 flex-1">{place.name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              {place.type}
                            </span>
                          </div>
                          {place.rating && (
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(place.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{place.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {place.address && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{place.address}</p>
                          )}
                          {place.distance && (
                            <p className="text-blue-600 font-semibold text-sm mb-4">
                              📍 {place.distance.toFixed(1)} km away
                            </p>
                          )}
                          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold">
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-gray-600 text-lg">No places found in this category</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <motion.div
                key="vehicles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Vehicle Rentals</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Rent vehicles from verified owners for your trips
                  </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Type Filter */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Vehicle Type</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', label: 'All Vehicles', icon: '🚗' },
                          { id: 'car', label: 'Cars', icon: '🚗' },
                          { id: 'bike', label: 'Bikes', icon: '🏍️' },
                          { id: 'scooter', label: 'Scooters', icon: '🛵' }
                        ].map((type) => (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedVehicleType(type.id)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              selectedVehicleType === type.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.icon} {type.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Owner Type Filter */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Owner Type</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'all', label: 'All Owners' },
                          { id: 'student', label: 'Students' },
                          { id: 'public', label: 'General Public' }
                        ].map((type) => (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedOwnerType(type.id)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${
                              selectedOwnerType === type.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                        <span className="text-6xl">{vehicle.vehicleType === 'car' ? '🚗' : vehicle.vehicleType === 'bike' ? '🏍️' : '🛵'}</span>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {vehicle.year} • {vehicle.vehicleType}
                        </p>

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
                              {vehicle.owner.userType === 'student' ? 'Student' : 'General Public'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center mb-4 text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{vehicle.location}</span>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {vehicle.ratings.count > 0 && (
                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(vehicle.ratings.average) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{vehicle.ratings.average} ({vehicle.ratings.count} reviews)</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">₹{vehicle.pricing.hourly}/hr</p>
                            <p className="text-sm text-gray-600">₹{vehicle.pricing.daily}/day</p>
                          </div>
                          <button 
                            disabled={!vehicle.available}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              vehicle.available
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {vehicle.available ? 'Book Now' : 'Unavailable'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-12"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to explore and experience the best of VIT-AP surroundings
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Sign Up", desc: "Join with your VIT-AP email or as a general user" },
              { step: 2, title: "Explore", desc: "Discover places, read reviews, and plan your trips" },
              { step: 3, title: "Connect", desc: "Share experiences and connect with the community" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

