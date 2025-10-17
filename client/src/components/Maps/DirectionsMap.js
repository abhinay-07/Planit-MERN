import React, { useState, useEffect } from 'react';
import GoogleMap from './GoogleMap';
import { getCurrentLocation, calculateDistance, formatDistance } from '../../utils/googleMaps';

const DirectionsMap = ({ 
  destination, 
  destinationName = 'Destination',
  height = '400px',
  className = '',
  showDirectionsPanel = true
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');

  // Get user location and calculate directions
  useEffect(() => {
    const initializeDirections = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user's current location
        const currentLocation = await getCurrentLocation();
        setUserLocation(currentLocation);

        // Calculate directions
        if (window.google && window.google.maps) {
          const directionsService = new window.google.maps.DirectionsService();
          
          const request = {
            origin: currentLocation,
            destination: destination,
            travelMode: window.google.maps.TravelMode[travelMode],
            unitSystem: window.google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
          };

          directionsService.route(request, (result, status) => {
            if (status === 'OK' && result.routes.length > 0) {
              setDirections(result);
              
              const route = result.routes[0];
              const leg = route.legs[0];
              
              setDistance(leg.distance.text);
              setDuration(leg.duration.text);
            } else {
              setError('Could not calculate directions. Please try again.');
            }
            setLoading(false);
          });
        }
      } catch (err) {
        setError('Could not get your location. Please enable location services.');
        setLoading(false);
      }
    };

    if (destination) {
      initializeDirections();
    }
  }, [destination, travelMode]);

  // Create markers for start and end points
  const markers = [];
  
  if (userLocation) {
    markers.push({
      lat: userLocation.lat,
      lng: userLocation.lng,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#22c55e" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    });
  }

  if (destination) {
    markers.push({
      lat: destination.lat,
      lng: destination.lng,
      title: destinationName,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" fill="#ef4444" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="12" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32)
      }
    });
  }

  const travelModes = [
    { value: 'DRIVING', label: '🚗 Driving', icon: '🚗' },
    { value: 'WALKING', label: '🚶 Walking', icon: '🚶' },
    { value: 'BICYCLING', label: '🚴 Cycling', icon: '🚴' },
    { value: 'TRANSIT', label: '🚌 Transit', icon: '🚌' }
  ];

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Calculating directions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-red-600">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="font-medium">Unable to show directions</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Travel Mode Selection */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold mb-3">🗺️ Directions to {destinationName}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {travelModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTravelMode(mode.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                travelMode === mode.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Distance and Duration */}
        {distance && duration && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <span>📏</span>
              <span>{distance}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>{duration}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height }}>
        <GoogleMap
          center={userLocation || destination}
          zoom={13}
          markers={markers}
          directions={directions}
          height="100%"
        />
      </div>

      {/* Directions Panel */}
      {showDirectionsPanel && directions && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-semibold mb-3">📝 Step-by-step directions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {directions.routes[0].legs[0].steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div 
                    className="text-sm text-gray-800"
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {step.distance.text} • {step.duration.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=${travelMode.toLowerCase()}`;
            window.open(url, '_blank');
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Google Maps
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Directions to ${destinationName}`,
                text: `Get directions to ${destinationName}`,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share Directions
        </button>
      </div>
    </div>
  );
};

export default DirectionsMap;