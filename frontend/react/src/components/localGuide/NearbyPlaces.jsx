import { useState, useEffect, useRef } from 'react';
import { SearchService } from '../../services/searchService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocalGuide } from '../../hooks/useLocalGuide';

export function NearbyPlaces({ onPlaceSelect, maxRadius = 50000 }) {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const { categories: dbCategories } = useLocalGuide();
  const [radius, setRadius] = useState(10000); // Default 10km
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // Start with All Categories
  const searchRef = useRef(null); // Prevent race conditions

  // Comprehensive categories combining database and OSM categories
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'restaurant', label: '🍽️ Restaurants' },
    { value: 'hotel', label: '🏨 Hotels' },
    { value: 'hospital', label: '🏥 Hospitals' },
    { value: 'healthcare', label: '🏥 Healthcare' },
    { value: 'school', label: '🏫 Schools' },
    { value: 'university', label: '🎓 Universities' },
    { value: 'bank', label: '🏦 Banks' },
    { value: 'atm', label: '💰 ATMs' },
    { value: 'pharmacy', label: '💊 Pharmacies' },
    { value: 'supermarket', label: '🛒 Supermarkets' },
    { value: 'general_stores', label: '🏪 General Stores' },
    { value: 'mall', label: '🏬 Shopping Malls' },
    { value: 'clothing', label: '👕 Clothing Stores' },
    { value: 'fuel', label: '⛽ Gas Stations' },
    { value: 'parking', label: '🅿️ Parking' },
    { value: 'cinema', label: '🎬 Cinemas' },
    { value: 'arcade', label: '🎮 Arcades' },
    { value: 'park', label: '🌳 Parks' },
    { value: 'gym', label: '🏋️ Gyms' },
    { value: 'cafe', label: '☕ Cafes' },
    { value: 'bar', label: '🍺 Bars' },
    { value: 'police', label: '🚔 Police Stations' },
    { value: 'fire_station', label: '🚒 Fire Stations' },
    { value: 'post_office', label: '📮 Post Offices' },
    { value: 'library', label: '📚 Libraries' },
    { value: 'museum', label: '🏛️ Museums' },
    { value: 'temple', label: '🛕 Temples' },
    { value: 'mosque', label: '🕌 Mosques' },
    { value: 'church', label: '⛪ Churches' }
  ];

  // Add database categories to the list
  const allCategories = [...categories];
  if (dbCategories && dbCategories.length > 0) {
    dbCategories.forEach(category => {
      // Only add if not already present
      if (!allCategories.find(cat => cat.value === category.category_name)) {
        allCategories.push({
          value: category.category_name,
          label: `📍 ${category.category_name}`
        });
      }
    });
  }

  useEffect(() => {
    if (location) {
      // Single useEffect to handle all search triggers
      searchNearbyPlaces();
    }
  }, [location, radius, selectedCategory]); // Single dependency array

  const searchNearbyPlaces = async () => {
    if (!location) return;
    
    const currentSearchId = Date.now();
    searchRef.current = currentSearchId;
    setLoading(true);
    
    console.log(`🔍 NearbyPlaces: Starting search for category: "${selectedCategory}" (${currentSearchId})`);
    
    try {
      let places = [];
      
      // If "All Categories" selected, search for popular categories
      if (!selectedCategory) {
        console.log('🔍 NearbyPlaces: Searching all categories...');
        
        // Simple search for general places
        try {
          places = await SearchService.findNearbyPlaces(
            location.lat, 
            location.lng, 
            radius, 
            null // No specific category
          );
        } catch (error) {
          console.warn('Failed to search all categories:', error);
        }
        
      } else {
        // Search for specific category
        console.log(`🔍 NearbyPlaces: Searching for category: "${selectedCategory}" around ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)} within ${radius}m`);
        
        try {
          places = await SearchService.findNearbyPlaces(
            location.lat, 
            location.lng, 
            radius, 
            selectedCategory
          );
        } catch (error) {
          console.warn(`Failed to search for ${selectedCategory}:`, error);
          
          // Fallback: search without category restriction
          try {
            console.log('🔄 NearbyPlaces: Trying fallback search...');
            places = await SearchService.findNearbyPlaces(
              location.lat, 
              location.lng, 
              radius, 
              null
            );
          } catch (fallbackError) {
            console.error('Fallback search also failed:', fallbackError);
          }
        }
      }
      
      // Final check before updating state
      if (searchRef.current === currentSearchId) {
        console.log(`📍 NearbyPlaces: Found ${places.length} nearby places (${currentSearchId})`);
        
        // Ensure places have the required properties for display
        const formattedPlaces = places.map(place => ({
          ...place,
          // Ensure we have the properties needed for display
          display_name: place.display_name || place.name || 'Unknown Place',
          class: place.class || 'unknown',
          type: place.type || 'unknown',
          distance: place.distance || 0
        }));
        
        console.log('📋 NearbyPlaces: Formatted places (first 3):', formattedPlaces.slice(0, 3));
        if (formattedPlaces.length > 0) {
          console.log('📋 NearbyPlaces: Nearest place:', formattedPlaces[0]);
        }
        setNearbyPlaces(formattedPlaces);
      }
    } catch (error) {
      console.error('NearbyPlaces: Search error:', error);
      if (searchRef.current === currentSearchId) {
        setNearbyPlaces([]);
      }
    } finally {
      if (searchRef.current === currentSearchId) {
        setLoading(false);
      }
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getPlaceIcon = (place) => {
    const type = place.type || place.class;
    const displayName = place.display_name || '';
    
    // OSM categories
    if (type.includes('restaurant')) return '🍽️';
    if (type.includes('hotel') || type.includes('guest_house')) return '🏨';
    if (type.includes('hospital')) return '🏥';
    if (type.includes('school') || type.includes('university')) return '🏫';
    if (type.includes('bank')) return '🏦';
    if (type.includes('pharmacy')) return '💊';
    if (type.includes('supermarket') || type.includes('mall')) return '🛒';
    if (type.includes('clothing')) return '👕';
    if (type.includes('fuel')) return '⛽';
    if (type.includes('parking')) return '🅿️';
    if (type.includes('cinema')) return '🎬';
    if (type.includes('park')) return '🌳';
    if (type.includes('gym')) return '🏋️';
    if (type.includes('cafe')) return '☕';
    if (type.includes('bar')) return '🍺';
    if (type.includes('police')) return '🚔';
    if (type.includes('fire_station')) return '🚒';
    if (type.includes('post_office')) return '📮';
    if (type.includes('library')) return '📚';
    if (type.includes('museum')) return '🏛️';
    if (type.includes('temple')) return '🛕';
    if (type.includes('mosque')) return '🕌';
    if (type.includes('church')) return '⛪';
    
    // Database categories - check display name
    if (displayName.toLowerCase().includes('restaurant') || displayName.toLowerCase().includes('food')) return '🍽️';
    if (displayName.toLowerCase().includes('hospital') || displayName.toLowerCase().includes('medical') || displayName.toLowerCase().includes('clinic')) return '🏥';
    if (displayName.toLowerCase().includes('hotel') || displayName.toLowerCase().includes('resort')) return '🏨';
    if (displayName.toLowerCase().includes('school') || displayName.toLowerCase().includes('college') || displayName.toLowerCase().includes('university')) return '🏫';
    if (displayName.toLowerCase().includes('bank') || displayName.toLowerCase().includes('atm')) return '🏦';
    if (displayName.toLowerCase().includes('pharmacy')) return '💊';
    if (displayName.toLowerCase().includes('supermarket') || displayName.toLowerCase().includes('grocery') || displayName.toLowerCase().includes('store')) return '🛒';
    if (displayName.toLowerCase().includes('cinema') || displayName.toLowerCase().includes('movie')) return '🎬';
    if (displayName.toLowerCase().includes('park')) return '🌳';
    if (displayName.toLowerCase().includes('gym')) return '🏋️';
    if (displayName.toLowerCase().includes('cafe')) return '☕';
    if (displayName.toLowerCase().includes('clothes') || displayName.toLowerCase().includes('fashion')) return '👕';
    if (displayName.toLowerCase().includes('fuel') || displayName.toLowerCase().includes('petrol')) return '⛽';
    if (displayName.toLowerCase().includes('parking')) return '🅿️';
    if (displayName.toLowerCase().includes('police')) return '🚔';
    if (displayName.toLowerCase().includes('temple')) return '🛕';
    if (displayName.toLowerCase().includes('mosque')) return '🕌';
    if (displayName.toLowerCase().includes('church')) return '⛪';
    
    return '📍';
  };

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
        <span className="ml-3 text-gray-600">Getting your location...</span>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠️</span>
          <div>
            <p className="text-red-800 font-medium">Location Error</p>
            <p className="text-red-600 text-sm">{locationError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {allCategories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius: {formatDistance(radius)}
          </label>
          <input
            type="range"
            min="100"
            max={maxRadius}
            step="100"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100m</span>
            <span>{formatDistance(maxRadius)}</span>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={searchNearbyPlaces}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : '🔄 Refresh Nearby Places'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
            <span className="ml-2 text-gray-600">Searching nearby...</span>
          </div>
        ) : nearbyPlaces.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl">🔍</span>
            <p className="mt-2">No nearby places found</p>
            <p className="text-sm">Try increasing the search radius or changing category</p>
            <p className="text-xs mt-2">Debug: {nearbyPlaces.length} places loaded</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-2">
              Found {nearbyPlaces.length} places
            </div>
            {nearbyPlaces.map((place, index) => (
              <div
                key={`${place.place_id || index}-${index}`}
                onClick={() => onPlaceSelect && onPlaceSelect(place)}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-1">{getPlaceIcon(place)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {place.display_name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {place.class && place.type && `${place.class} • ${place.type}`}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-blue-600">
                        {formatDistance(place.distance)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">away</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Location Info */}
      {location && (
        <div className="text-xs text-gray-500 text-center">
          📍 Searching from {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}
