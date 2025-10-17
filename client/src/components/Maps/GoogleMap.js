import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG, DEFAULT_CENTER, MAP_STYLES } from '../../utils/googleMaps';

// Map component that renders the actual Google Map
const MapComponent = ({ 
  center = DEFAULT_CENTER, 
  zoom = 14, 
  markers = [], 
  onMapClick,
  onMarkerClick,
  showUserLocation = true,
  height = '400px',
  className = ''
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: MAP_STYLES,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });

      setMap(newMap);

      // Add click listener
      if (onMapClick) {
        newMap.addListener('click', (event) => {
          onMapClick({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
        });
      }
    }
  }, [mapRef, map, center, zoom, onMapClick]);

  // Update map center when prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Get user location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.log('Could not get user location:', error);
        }
      );
    }
  }, [showUserLocation]);

  // Add user location marker
  useEffect(() => {
    if (map && userLocation && showUserLocation) {
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });
    }
  }, [map, userLocation, showUserLocation]);

  // Handle markers
  useEffect(() => {
    if (!map || !markers) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        title: markerData.title || '',
        icon: markerData.icon || undefined
      });

      // Add click listener if provided
      if (onMarkerClick) {
        marker.addListener('click', () => {
          onMarkerClick(markerData);
        });
      }

      // Add info window if content provided
      if (markerData.infoWindow) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: markerData.infoWindow
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      markersRef.current.push(marker);
    });
  }, [map, markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }} 
      className={`w-full rounded-lg ${className}`}
    />
  );
};

// Loading component
const MapLoading = () => (
  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600">Loading map...</p>
    </div>
  </div>
);

// Error component
const MapError = ({ error }) => (
  <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
    <div className="text-center text-red-600">
      <div className="text-2xl mb-2">⚠️</div>
      <p className="font-medium">Map failed to load</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  </div>
);

// Main Google Map wrapper component
const GoogleMap = (props) => {
  const renderMap = (status) => {
    switch (status) {
      case Status.LOADING:
        return <MapLoading />;
      case Status.FAILURE:
        return <MapError error="Failed to load Google Maps" />;
      case Status.SUCCESS:
        return <MapComponent {...props} />;
      default:
        return <MapLoading />;
    }
  };

  return (
    <Wrapper
      apiKey={GOOGLE_MAPS_CONFIG.apiKey}
      libraries={GOOGLE_MAPS_CONFIG.libraries}
      region={GOOGLE_MAPS_CONFIG.region}
      language={GOOGLE_MAPS_CONFIG.language}
    >
      {renderMap}
    </Wrapper>
  );
};

export default GoogleMap;