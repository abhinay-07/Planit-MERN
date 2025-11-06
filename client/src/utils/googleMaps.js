// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  libraries: ['places', 'geometry', 'drawing'],
  region: 'IN',
  language: 'en'
};

// Default map center (VIT-AP Campus location)
export const DEFAULT_CENTER = {
  lat: 16.5062, // VIT-AP latitude
  lng: 80.2315  // VIT-AP longitude
};

// Map styling options
export const MAP_STYLES = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  }
];

// Place categories with icons
export const PLACE_CATEGORIES = {
  restaurant: {
    name: 'Restaurants',
    icon: '🍽️',
    color: '#e74c3c',
    mapIcon: 'restaurant'
  },
  shopping: {
    name: 'Shopping',
    icon: '🛍️',
    color: '#9b59b6',
    mapIcon: 'shopping_mall'
  },
  entertainment: {
    name: 'Entertainment',
    icon: '🎬',
    color: '#3498db',
    mapIcon: 'movie_theater'
  },
  education: {
    name: 'Education',
    icon: '📚',
    color: '#2ecc71',
    mapIcon: 'school'
  },
  healthcare: {
    name: 'Healthcare',
    icon: '🏥',
    color: '#e67e22',
    mapIcon: 'hospital'
  },
  transport: {
    name: 'Transport',
    icon: '🚌',
    color: '#34495e',
    mapIcon: 'bus_station'
  },
  accommodation: {
    name: 'Hotels',
    icon: '🏨',
    color: '#f39c12',
    mapIcon: 'lodging'
  },
  other: {
    name: 'Other',
    icon: '📍',
    color: '#95a5a6',
    mapIcon: 'place'
  }
};

// Utility functions
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};