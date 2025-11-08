import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LeafletMap = ({ places = [], onPlaceClick, center, zoom = 13 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Default center - Vijayawada area (near VIT-AP)
  const defaultCenter = center || { lat: 16.5062, lng: 80.6480 };

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map with zoom animation disabled to avoid runtime errors
      // that can occur during animated transitions when pane positions are not yet set.
      mapInstanceRef.current = L.map(mapRef.current, { zoomAnimation: false, preferCanvas: true }).setView(
        [defaultCenter.lat, defaultCenter.lng],
        zoom
      );

      // Add OpenStreetMap tiles (free!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Force a size invalidation shortly after initialization to ensure internal
      // pane positions are established (helps prevent _leaflet_pos undefined errors).
      setTimeout(() => {
        try {
          mapInstanceRef.current.invalidateSize();
        } catch (e) {
          // ignore
        }
      }, 200);
    }

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each place
    if (places && places.length > 0) {
      const bounds = [];

      places.forEach((place) => {
        // Get coordinates from place object
        let lat, lng;
        
        if (place.location && place.location.coordinates) {
          // MongoDB GeoJSON format: [longitude, latitude]
          [lng, lat] = place.location.coordinates;
        } else if (place.location && place.location.lat && place.location.lng) {
          lat = place.location.lat;
          lng = place.location.lng;
        } else if (place.lat && place.lng) {
          lat = place.lat;
          lng = place.lng;
        } else {
          // Skip places without valid coordinates
          return;
        }

        bounds.push([lat, lng]);

        // Create custom icon based on category
        const iconColor = getCategoryColor(place.category);
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${iconColor}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        // Create marker
        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstanceRef.current);

        // Create popup content with enhanced preview
        const imageUrl = place.images && place.images[0] ? (place.images[0].url || place.images[0]) : null;
        
        const popupContent = `
          <div style="min-width: 280px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
            ${imageUrl ? `
              <div style="position: relative; margin-bottom: 12px;">
                <img src="${imageUrl}" alt="${place.name}" 
                     style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; display: block;" 
                     onerror="this.style.display='none'" />
                ${place.isVerified ? `
                  <div style="position: absolute; top: 8px; right: 8px; background-color: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                    <span style="font-size: 12px;">✓</span> Verified
                  </div>
                ` : ''}
              </div>
            ` : `
              <div style="width: 100%; height: 180px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-center; margin-bottom: 12px;">
                <span style="font-size: 48px; opacity: 0.8;">📍</span>
              </div>
            `}
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.3;">
              ${place.name}
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
              ${place.category ? `
                <span style="padding: 4px 10px; background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 600; border-radius: 12px; text-transform: capitalize;">
                  ${formatCategory(place.category)}
                </span>
              ` : ''}
              ${place.ratings?.overall ? `
                <span style="padding: 4px 10px; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; border-radius: 12px;">
                  ⭐ ${place.ratings.overall.toFixed(1)}
                </span>
              ` : ''}
            </div>
            ${place.description ? `
              <p style="margin: 10px 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                ${place.description.substring(0, 120)}${place.description.length > 120 ? '...' : ''}
              </p>
            ` : ''}
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
              <button 
                onclick="window.location.href='/places/${place._id}'" 
                style="width: 100%; padding: 10px 16px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(37, 99, 235, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(37, 99, 235, 0.2)'"
              >
                View Full Details →
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Add click handler
        if (onPlaceClick) {
          marker.on('click', () => onPlaceClick(place._id));
        }

        markersRef.current.push(marker);
      });

      // Fit map to show all markers — use a non-animated fit to avoid timing issues
      if (bounds.length > 0) {
        try {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: false });
        } catch (err) {
          // fallback: set view to first marker
          const [lat, lng] = bounds[0];
          try { mapInstanceRef.current.setView([lat, lng], zoom); } catch (e) { /* ignore */ }
        }
      }
    }
  }, [places, onPlaceClick, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      className="leaflet-container"
    />
  );
};

// Helper function to get color based on category
const getCategoryColor = (category) => {
  const colors = {
    restaurant: '#ef4444',      // red
    tourist_attraction: '#8b5cf6', // purple
    shopping: '#3b82f6',        // blue
    entertainment: '#f59e0b',   // orange
    accommodation: '#10b981',   // green
    transport: '#6b7280',       // gray
    educational: '#06b6d4',     // cyan
    healthcare: '#ec4899',      // pink
    religious: '#fbbf24',       // yellow
    recreation: '#14b8a6',      // teal
    other: '#6b7280',          // gray
  };
  return colors[category] || '#6b7280';
};

// Helper function to format category names
const formatCategory = (category) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default LeafletMap;
