import React from 'react';
import GoogleMap from '../../components/Maps/GoogleMap';
import PlacesSearch from '../../components/Maps/PlacesSearch';
import LocationPicker from '../../components/Maps/LocationPicker';
import { DEFAULT_CENTER } from '../../utils/googleMaps';

const MapsTest = () => {
  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
  };

  const handleLocationSelect = (data) => {
    console.log('Selected location:', data);
  };

  const sampleMarkers = [
    {
      lat: 16.5062,
      lng: 80.2315,
      title: 'VIT-AP Campus',
      infoWindow: '<div><h4>VIT-AP University</h4><p>Amaravati, Andhra Pradesh</p></div>'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🗺️ Google Maps Integration Test</h1>
          <p className="text-gray-600">Testing all Google Maps components</p>
        </div>

        {/* Basic Google Map */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Google Map</h2>
          <div className="h-64">
            <GoogleMap
              center={DEFAULT_CENTER}
              zoom={14}
              markers={sampleMarkers}
              showUserLocation={true}
            />
          </div>
        </div>

        {/* Places Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Places Search</h2>
          <PlacesSearch
            center={DEFAULT_CENTER}
            onPlaceSelect={handlePlaceSelect}
          />
        </div>

        {/* Location Picker */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Location Picker</h2>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            height="300px"
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Setup Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1.</strong> Get a Google Maps API key from Google Cloud Console</p>
            <p><strong>2.</strong> Enable Maps JavaScript API, Places API, and Geocoding API</p>
            <p><strong>3.</strong> Create a <code className="bg-blue-100 px-1 rounded">.env</code> file in the client directory</p>
            <p><strong>4.</strong> Add: <code className="bg-blue-100 px-1 rounded">REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here</code></p>
            <p><strong>5.</strong> Restart the development server</p>
          </div>
        </div>

        {/* Status Check */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Integration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-green-800"><strong>Components Created:</strong></p>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li>GoogleMap.js</li>
                <li>PlacesSearch.js</li>
                <li>LocationPicker.js</li>
                <li>DirectionsMap.js</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-green-800"><strong>Features Available:</strong></p>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li>Interactive Maps</li>
                <li>Places Search & Discovery</li>
                <li>Location Selection</li>
                <li>Turn-by-turn Directions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsTest;