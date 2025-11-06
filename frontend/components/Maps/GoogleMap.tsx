import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GOOGLE_MAPS_CONFIG, DEFAULT_CENTER, MAP_STYLES } from '../../utils/googleMaps';

interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  title?: string;
  category?: string;
  icon?: string;
  infoWindow?: string;
}

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
  onMapClick?: (location: { lat: number; lng: number }) => void;
  onMarkerClick?: (marker: MarkerData) => void;
  showUserLocation?: boolean;
  height?: string;
  className?: string;
}

// Map component that renders the actual Google Map
const MapComponent: React.FC<MapComponentProps> = ({ 
  center = DEFAULT_CENTER, 
  zoom = 14, 
  markers = [], 
  onMapClick,
  onMarkerClick,
  showUserLocation = true,
  height = '600px',
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

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
        newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          }
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
const MapLoading: React.FC = () => (
  <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600">Loading map...</p>
    </div>
  </div>
);

// Error component
const MapError: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-[600px] bg-red-50 rounded-lg border-2 border-red-300">
    <div className="text-center text-red-600 max-w-md p-6">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="font-bold text-lg mb-2">Map Failed to Load</p>
      <p className="text-sm mb-4">{error}</p>
      <div className="bg-white p-4 rounded-lg text-left text-sm">
        <p className="font-semibold mb-2">To fix this:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
          <li>Update <code className="bg-gray-100 px-1 rounded">frontend/.env</code> with your key</li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  </div>
);

// Main Google Map wrapper component
const GoogleMap: React.FC<MapComponentProps> = (props) => {
  const renderMap = (status: Status) => {
    console.log('Google Maps Status:', status);
    
    switch (status) {
      case Status.LOADING:
        return <MapLoading />;
      case Status.FAILURE:
        console.error('Google Maps failed to load - Check API key in .env file');
        return <MapError error="Google Maps API failed to load. This is likely due to an invalid or missing API key." />;
      case Status.SUCCESS:
        return <MapComponent {...props} />;
      default:
        return <MapLoading />;
    }
  };

  console.log('GoogleMap component rendering with API key:', GOOGLE_MAPS_CONFIG.apiKey?.substring(0, 10) + '...');

  return (
    <Wrapper
      apiKey={GOOGLE_MAPS_CONFIG.apiKey}
      libraries={GOOGLE_MAPS_CONFIG.libraries as any}
      region={GOOGLE_MAPS_CONFIG.region}
      language={GOOGLE_MAPS_CONFIG.language}
    >
      {renderMap}
    </Wrapper>
  );
};

export default GoogleMap;
