import React, { useState, useEffect, useRef } from 'react';
import GoogleMap from './GoogleMap';
import { getCurrentLocation, DEFAULT_CENTER } from '../../utils/googleMaps';

const LocationPicker = ({ 
  onLocationSelect, 
  initialLocation = null,
  height = '300px',
  className = '',
  showAddressInput = true,
  placeholder = 'Search for a location...'
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [mapCenter, setMapCenter] = useState(initialLocation || DEFAULT_CENTER);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places && inputRef.current && showAddressInput) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ['formatted_address', 'geometry', 'name'],
          componentRestrictions: { country: 'in' }
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          setSelectedLocation(location);
          setMapCenter(location);
          setAddress(place.formatted_address || place.name || '');
          
          if (onLocationSelect) {
            onLocationSelect({
              location,
              address: place.formatted_address || place.name || '',
              placeDetails: place
            });
          }
        }
      });
    }
  }, [showAddressInput, onLocationSelect]);

  // Get current location
  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      setSelectedLocation(location);
      setMapCenter(location);
      
      // Reverse geocode to get address
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const formattedAddress = results[0].formatted_address;
            setAddress(formattedAddress);
            
            if (onLocationSelect) {
              onLocationSelect({
                location,
                address: formattedAddress,
                isCurrentLocation: true
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Could not get your current location. Please ensure location services are enabled.');
    } finally {
      setLoading(false);
    }
  };

  // Handle map click
  const handleMapClick = (location) => {
    setSelectedLocation(location);
    setMapCenter(location);
    
    // Reverse geocode to get address
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          
          if (onLocationSelect) {
            onLocationSelect({
              location,
              address: formattedAddress
            });
          }
        }
      });
    }
  };

  // Create markers array
  const markers = selectedLocation ? [{
    lat: selectedLocation.lat,
    lng: selectedLocation.lng,
    title: 'Selected Location',
    icon: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" fill="#ef4444" stroke="white" stroke-width="2"/>
          <circle cx="16" cy="12" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32)
    }
  }] : [];

  return (
    <div className={`space-y-4 ${className}`}>
      {showAddressInput && (
        <div className="space-y-3">
          {/* Address Search Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Getting location...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use Current Location
              </>
            )}
          </button>
        </div>
      )}

      {/* Instructions */}
      <p className="text-sm text-gray-600">
        📍 Click on the map to select a location, or search for an address above.
      </p>

      {/* Map */}
      <div className={`rounded-lg overflow-hidden border border-gray-200`} style={{ height }}>
        <GoogleMap
          center={mapCenter}
          zoom={15}
          markers={markers}
          onMapClick={handleMapClick}
          showUserLocation={false}
          height="100%"
        />
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Location Selected</p>
              <p className="text-sm text-green-700">
                {address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;