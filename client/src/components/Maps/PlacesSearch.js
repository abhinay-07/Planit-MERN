import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Phone, Globe } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG, DEFAULT_CENTER, calculateDistance, formatDistance } from '../../utils/googleMaps';

const PlacesSearch = ({ 
  onPlaceSelect, 
  center = DEFAULT_CENTER, 
  radius = 10000, // 10km default
  types = [],
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: types.length > 0 ? types : ['establishment'],
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'photos', 'rating', 'user_ratings_total', 'opening_hours', 'formatted_phone_number', 'website', 'types', 'price_level'],
          componentRestrictions: { country: 'in' }
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.place_id) {
          handlePlaceSelect(place);
        }
      });
    }
  }, [types]);

  const handlePlaceSelect = async (place) => {
    setSelectedPlace(place);
    setError(null);

    const placeData = {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      },
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      priceLevel: place.price_level,
      types: place.types || [],
      photos: place.photos ? place.photos.slice(0, 5).map(photo => ({
        url: photo.getUrl({ maxWidth: 400, maxHeight: 300 }),
        attributions: photo.html_attributions
      })) : [],
      openingHours: place.opening_hours ? {
        isOpen: place.opening_hours.isOpen(),
        periods: place.opening_hours.periods,
        weekdayText: place.opening_hours.weekday_text
      } : null,
      phoneNumber: place.formatted_phone_number,
      website: place.website,
      distance: calculateDistance(center, {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      })
    };

    if (onPlaceSelect) {
      onPlaceSelect(placeData);
    }
  };

  const searchNearbyPlaces = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: radius,
        query: query,
        type: types.length > 0 ? types[0] : undefined
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const placesData = results.slice(0, 10).map(place => ({
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            priceLevel: place.price_level,
            types: place.types || [],
            photos: place.photos ? place.photos.slice(0, 1).map(photo => ({
              url: photo.getUrl({ maxWidth: 200, maxHeight: 150 })
            })) : [],
            openingHours: place.opening_hours ? {
              isOpen: place.opening_hours.isOpen()
            } : null,
            distance: calculateDistance(center, {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            })
          }));

          setResults(placesData);
        } else {
          setError('No places found. Try a different search term.');
        }
        setLoading(false);
      });
    } catch (err) {
      setError('Failed to search places. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchNearbyPlaces();
    }
  };

  const handleSearchClick = () => {
    searchNearbyPlaces();
  };

  const renderPriceLevel = (priceLevel) => {
    if (!priceLevel) return null;
    return (
      <span className="text-green-600">
        {'₹'.repeat(priceLevel)}
        <span className="text-gray-300">{'₹'.repeat(4 - priceLevel)}</span>
      </span>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for places near VIT-AP..."
          className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <button
          onClick={handleSearchClick}
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Search Results</h3>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {results.map((place) => (
              <div
                key={place.placeId}
                onClick={() => handlePlaceSelect(place)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  {/* Place Photo */}
                  {place.photos && place.photos.length > 0 ? (
                    <img
                      src={place.photos[0].url}
                      alt={place.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  {/* Place Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 truncate">{place.name}</h4>
                      <span className="text-sm text-gray-500 ml-2">{formatDistance(place.distance)}</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.address}</p>

                    {/* Rating and Price */}
                    <div className="flex items-center space-x-4 mt-2">
                      {place.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{place.rating}</span>
                          {place.totalRatings > 0 && (
                            <span className="text-sm text-gray-500">({place.totalRatings})</span>
                          )}
                        </div>
                      )}

                      {place.priceLevel && (
                        <div className="text-sm">
                          {renderPriceLevel(place.priceLevel)}
                        </div>
                      )}

                      {place.openingHours && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${place.openingHours.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {place.openingHours.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Place Details */}
      {selectedPlace && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Place</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {selectedPlace.name}</p>
            <p><strong>Address:</strong> {selectedPlace.formatted_address}</p>
            {selectedPlace.rating && (
              <p><strong>Rating:</strong> {selectedPlace.rating} ⭐</p>
            )}
            {selectedPlace.formatted_phone_number && (
              <p><strong>Phone:</strong> {selectedPlace.formatted_phone_number}</p>
            )}
            {selectedPlace.website && (
              <p><strong>Website:</strong> 
                <a 
                  href={selectedPlace.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Visit
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesSearch;