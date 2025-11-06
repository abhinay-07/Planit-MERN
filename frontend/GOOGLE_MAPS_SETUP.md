# 🗺️ Google Maps Setup Guide

## Quick Start

The app now includes real Google Maps integration! Follow these steps to get it working:

### 1. Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API** (optional, for future features)
   - **Geocoding API** (optional, for address lookup)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure the API Key

Open `frontend/.env` and replace the dummy key with your real API key:

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Restart the Development Server

```bash
cd frontend
npm run dev
```

## Features

✅ **Interactive Map View** - Toggle between grid and map views  
✅ **Real-time Markers** - See all places on the map with custom markers  
✅ **Info Windows** - Click markers to see place details  
✅ **User Location** - Shows your current location (requires permission)  
✅ **Smooth Animations** - Framer Motion animations throughout  
✅ **Category Filtering** - Filter places by category on both views  

## API Key Security (Important!)

### For Development:
- The current setup works fine for localhost

### For Production:
1. **Restrict your API key** in Google Cloud Console:
   - Go to your API key settings
   - Add **Application restrictions**:
     - HTTP referrers (websites)
     - Add your production domain (e.g., `https://yourdomain.com/*`)
   
2. **Enable only required APIs**:
   - Maps JavaScript API (required)
   - Add others as needed

3. **Monitor usage** in Google Cloud Console to avoid unexpected charges

## Troubleshooting

### Map not loading?
- Check if your API key is correct in `.env`
- Make sure you've restarted the dev server after adding the key
- Open browser console (F12) to see any error messages
- Verify the APIs are enabled in Google Cloud Console

### "This page can't load Google Maps correctly" error?
- This means the API key is invalid or restricted
- Check your API key in Google Cloud Console
- Make sure Maps JavaScript API is enabled

### Markers not showing?
- Check browser console for errors
- Verify the coordinates in `bestPlaces` array are valid (lat/lng)

## Free Tier Limits

Google Maps Platform provides:
- **$200 free credit per month**
- Covers approximately 28,000 map loads per month
- More than enough for development and small-scale production

## Next Steps

Want to add more features?

- **Search Places**: Integrate Google Places API for searching nearby places
- **Directions**: Add route planning between locations
- **Street View**: Show street-level imagery
- **Custom Markers**: Use custom icons for different place categories
- **Clustering**: Group nearby markers when zoomed out

## Need Help?

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Get API Key Guide](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Pricing Information](https://mapsplatform.google.com/pricing/)

---

**Note**: The dummy API key included is just a placeholder. Get your own free API key from Google to use the maps feature! 🚀
