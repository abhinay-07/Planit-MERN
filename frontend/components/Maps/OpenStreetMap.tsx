import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MarkerData {
  id: number;
  lat: number;
  lng: number;
  title?: string;
  category?: string;
  popupContent?: string;
}

interface OpenStreetMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  showUserLocation?: boolean;
  height?: string;
  onMarkerClick?: (marker: MarkerData) => void;
}

// Custom icons for different categories
const createCustomIcon = (category: string) => {
  const colors: Record<string, string> = {
    restaurant: '#ef4444',
    cafe: '#8b5cf6',
    shopping: '#10b981',
    attraction: '#f59e0b',
    default: '#3b82f6'
  };

  const color = colors[category] || colors.default;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
        ">📍</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1); }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to update map view when center changes
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Component to show user location
const UserLocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
        </div>
      </Popup>
    </Marker>
  );
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center = [16.5062, 80.6480],
  zoom = 13,
  markers = [],
  showUserLocation = true,
  height = '600px',
  onMarkerClick
}) => {
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);

  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Could not get user location:', error);
        }
      );
    }
  }, [showUserLocation]);

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden shadow-lg relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <MapUpdater center={center} zoom={zoom} />
        
        {/* OpenStreetMap tiles - Free! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && <UserLocationMarker position={userLocation} />}

        {/* Place markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.category || 'default')}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker);
                }
              }
            }}
          >
            <Popup>
              <div 
                dangerouslySetInnerHTML={{ __html: marker.popupContent || marker.title || '' }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs z-[1000]">
        <p className="font-semibold text-gray-700">🗺️ Free OpenStreetMap</p>
        <p className="text-gray-500">No API key required!</p>
      </div>
    </div>
  );
};

export default OpenStreetMap;
