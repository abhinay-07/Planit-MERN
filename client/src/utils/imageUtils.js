// Image utility functions and constants

// Default/placeholder images
export const defaultImages = {
  // User avatars
  defaultAvatar: '/api/placeholder/200/200', // Placeholder service
  userPlaceholder: 'https://via.placeholder.com/200x200/e2e8f0/64748b?text=User',
  
  // Place categories
  restaurant: 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Restaurant',
  tourist: 'https://via.placeholder.com/800x600/dbeafe/3b82f6?text=Tourist+Spot',
  shopping: 'https://via.placeholder.com/800x600/fef3c7/f59e0b?text=Shopping',
  entertainment: 'https://via.placeholder.com/800x600/fce7f3/ec4899?text=Entertainment',
  
  // Vehicles
  car: 'https://via.placeholder.com/800x600/ecfdf5/10b981?text=Car',
  bike: 'https://via.placeholder.com/800x600/eff6ff/3b82f6?text=Bike',
  scooter: 'https://via.placeholder.com/600x400/fef2f2/ef4444?text=Scooter',
  
  // General
  noImage: 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=No+Image',
  loading: 'https://via.placeholder.com/400x300/e2e8f0/94a3b8?text=Loading...'
};

// Image helper functions
export const getImageUrl = (imagePath) => {
  // Handle different image sources
  if (!imagePath) return defaultImages.noImage;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  
  // Try public folder path first
  return `/assets/images/${imagePath}`;
};

// Get category default image
export const getCategoryImage = (category) => {
  const categoryImages = {
    restaurant: defaultImages.restaurant,
    'tourist-spot': defaultImages.tourist,
    shopping: defaultImages.shopping,
    entertainment: defaultImages.entertainment,
    default: defaultImages.noImage
  };
  
  return categoryImages[category] || categoryImages.default;
};

// Get vehicle type default image
export const getVehicleImage = (vehicleType) => {
  const vehicleImages = {
    car: defaultImages.car,
    bike: defaultImages.bike,
    scooter: defaultImages.scooter,
    default: defaultImages.car
  };
  
  return vehicleImages[vehicleType] || vehicleImages.default;
};

// Image optimization helper
export const getOptimizedImageUrl = (url, width = 400, height = 300, quality = 80) => {
  // For future implementation with image optimization service
  if (url.startsWith('http')) {
    return url;
  }
  return url;
};

// Lazy loading image component helper
export const createImageComponent = (src, alt, className = '', fallback = null) => {
  return {
    src: getImageUrl(src),
    alt,
    className,
    onError: (e) => {
      if (fallback) {
        e.target.src = getImageUrl(fallback);
      } else {
        e.target.src = defaultImages.noImage;
      }
    }
  };
};