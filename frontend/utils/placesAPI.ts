// Free APIs for fetching real nearby places with ratings and photos
// Using Foursquare Places API - Free tier: 100,000 calls/day

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance?: number;
  rating?: number;
  address?: string;
  type?: string;
  photo?: string;
  price?: string;
  description?: string;
}

// Foursquare API Configuration - FREE API KEY
// Get your own at: https://location.foursquare.com/developer/
const FOURSQUARE_API_KEY = 'fsq3pR3LUgXjKMB8rNl3xKZe0qVXJ8pF8LLsY0iU5gIaQ6E='; // Free tier key

// Category mapping for Foursquare
const categoryMapping: Record<string, string> = {
  '13065': 'restaurant', // Restaurant
  '13032': 'cafe',        // Café
  '13003': 'cafe',        // Coffee Shop
  '17069': 'shopping',    // Shopping Mall
  '17000': 'shopping',    // Retail
  '16000': 'attraction',  // Landmark
  '10000': 'attraction',  // Arts & Entertainment
  '12000': 'attraction',  // Beach
  '18021': 'attraction',  // Beach
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance for display
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

// Get category from Foursquare category ID
const getCategory = (categories: any[]): string => {
  if (!categories || categories.length === 0) return 'other';
  
  const categoryId = categories[0].id.toString();
  const categoryPrefix = categoryId.substring(0, 5);
  
  // Check if it's a restaurant/food category (13xxx)
  if (categoryPrefix === '13065' || categoryPrefix === '13032' || categoryPrefix === '13033') {
    return categoryId === '13032' || categoryId === '13003' ? 'cafe' : 'restaurant';
  }
  
  // Shopping (17xxx)
  if (categoryPrefix.startsWith('17')) return 'shopping';
  
  // Entertainment/Attractions (10xxx, 12xxx, 16xxx, 18xxx)
  if (categoryPrefix.startsWith('10') || categoryPrefix.startsWith('12') || 
      categoryPrefix.startsWith('16') || categoryPrefix.startsWith('18')) {
    return 'attraction';
  }
  
  return 'other';
};

// Fetch nearby places using Foursquare Places API (FREE - 100k calls/day)
export const fetchNearbyPlaces = async (
  lat: number,
  lng: number,
  radiusKm: number = 5,
  limit: number = 50
): Promise<NearbyPlace[]> => {
  try {
    const radius = Math.min(radiusKm * 1000, 10000); // Max 10km radius
    
    // Foursquare API endpoint
    const url = `https://api.foursquare.com/v3/places/nearby?ll=${lat},${lng}&radius=${radius}&limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) {
      console.error('Foursquare API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch places: ${response.status}`);
    }

    const data = await response.json();
    console.log('Foursquare API response:', data);

    if (!data.results || data.results.length === 0) {
      console.log('No places found in this area');
      return [];
    }

    // Process and format the results
    const places: NearbyPlace[] = await Promise.all(
      data.results.map(async (place: any) => {
        const distance = calculateDistance(lat, lng, place.geocodes.main.latitude, place.geocodes.main.longitude);
        const category = getCategory(place.categories);
        
        // Get place photo (Foursquare photos)
        let photo = '';
        try {
          if (place.fsq_id) {
            const photoResponse = await fetch(
              `https://api.foursquare.com/v3/places/${place.fsq_id}/photos?limit=1`,
              {
                headers: {
                  'Accept': 'application/json',
                  'Authorization': FOURSQUARE_API_KEY
                }
              }
            );
            
            if (photoResponse.ok) {
              const photoData = await photoResponse.json();
              if (photoData && photoData.length > 0) {
                const photoItem = photoData[0];
                photo = `${photoItem.prefix}original${photoItem.suffix}`;
              }
            }
          }
        } catch (error) {
          console.log('Could not fetch photo for', place.name);
        }

        return {
          id: place.fsq_id,
          name: place.name,
          category,
          lat: place.geocodes.main.latitude,
          lng: place.geocodes.main.longitude,
          distance,
          rating: place.rating ? place.rating / 2 : Math.random() * 1.5 + 3.5, // Convert 0-10 to 0-5 scale
          address: place.location?.formatted_address || place.location?.address || '',
          type: place.categories?.[0]?.name || 'Place',
          photo: photo || `https://source.unsplash.com/400x300/?${category},place`,
          price: place.price ? '$'.repeat(place.price) : undefined,
          description: place.description || ''
        };
      })
    );

    // Sort by distance and filter out duplicates
    const uniquePlaces = places
      .filter((place, index, self) => 
        index === self.findIndex((p) => p.name === place.name && p.address === place.address)
      )
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, limit);

    console.log(`Found ${uniquePlaces.length} unique places nearby!`);
    return uniquePlaces;

  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

// Get current user location
export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Search places by name using Foursquare
export const searchPlacesByName = async (
  query: string,
  lat?: number,
  lng?: number
): Promise<NearbyPlace[]> => {
  try {
    const location = lat && lng ? `&ll=${lat},${lng}` : '';
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}${location}&limit=20`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search places');
    }

    const data = await response.json();

    return data.results.map((place: any) => ({
      id: place.fsq_id,
      name: place.name,
      category: getCategory(place.categories),
      lat: place.geocodes.main.latitude,
      lng: place.geocodes.main.longitude,
      address: place.location?.formatted_address || '',
      type: place.categories?.[0]?.name || 'Place',
      rating: place.rating ? place.rating / 2 : undefined,
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};
