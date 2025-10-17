// Sample usage examples for the assets folder

import React from 'react';
import OptimizedImage from '../components/Common/OptimizedImage';
import { defaultImages, getCategoryImage, getVehicleImage } from '../utils/imageUtils';

// Example 1: Using assets in Place cards
export const PlaceCardExample = ({ place }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <OptimizedImage
      src={place.image || getCategoryImage(place.category)}
      alt={place.name}
      className="w-full h-48 object-cover"
      fallback={getCategoryImage(place.category)}
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{place.name}</h3>
      <p className="text-gray-600">{place.description}</p>
    </div>
  </div>
);

// Example 2: Using assets in Vehicle cards
export const VehicleCardExample = ({ vehicle }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <OptimizedImage
      src={vehicle.image || getVehicleImage(vehicle.type)}
      alt={`${vehicle.make} ${vehicle.model}`}
      className="w-full h-48 object-cover"
      fallback={getVehicleImage(vehicle.type)}
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h3>
      <p className="text-blue-600 font-bold">₹{vehicle.pricePerDay}/day</p>
    </div>
  </div>
);

// Example 3: User avatar with fallback
export const UserAvatarExample = ({ user, size = "w-10 h-10" }) => (
  <OptimizedImage
    src={user.profilePicture || defaultImages.defaultAvatar}
    alt={`${user.name}'s profile`}
    className={`${size} rounded-full object-cover`}
    fallback={defaultImages.defaultAvatar}
  />
);

// Example 4: Logo usage
export const LogoExample = () => (
  <div className="flex items-center">
    {/* 
    When you add your logo to assets/images/logos/planit-logo.png, 
    uncomment and use this:
    
    <img 
      src={require('../assets/images/logos/planit-logo.png')} 
      alt="Plan It" 
      className="h-8 w-auto" 
    />
    */}
    
    {/* Temporary text logo */}
    <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold">
      Plan It
    </div>
  </div>
);

// Example 5: Background image usage
export const HeroSectionExample = () => (
  <div 
    className="min-h-screen bg-cover bg-center flex items-center justify-center"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${defaultImages.tourist})`
    }}
  >
    <div className="text-center text-white">
      <h1 className="text-5xl font-bold mb-4">Discover VIT-AP</h1>
      <p className="text-xl">Your local guide and trip planner</p>
    </div>
  </div>
);