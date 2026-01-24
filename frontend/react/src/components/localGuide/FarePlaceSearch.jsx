import { useState, useCallback, useRef } from 'react';
import { SearchService } from '../../services/searchService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useAuth } from '../../context/AuthContext';

// Fare Place Search component
// Enhanced place search with Nominatim integration for fare submission
export function FarePlaceSearch({ onPlaceSelect, placeholder = "Enter place for fare calculation" }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { location } = useGeolocation();
  const { user } = useAuth();
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounced search function
  const searchPlaces = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const results = await SearchService.searchPlaces(
        searchQuery, 
        location, 
        8, // Limit suggestions
        { signal: abortControllerRef.current.signal }
      );
      
      // Format suggestions for fare use
      const formattedSuggestions = results.map(place => ({
        ...place,
        displayName: place.display_name,
        coordinates: {
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon)
        },
        // Add fare-specific metadata
        fareKey: `${place.place_id || place.lat}-${place.lon}`, // Unique key for fare storage
        type: place.class || 'unknown',
        name: place.name || place.display_name.split(',')[0]
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300); // 300ms debounce
  };

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setQuery(place.displayName);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Pass selected place to parent with fare-specific data
    onPlaceSelect({
      ...place,
      // Add user context for fare submission
      submittedBy: user?.id || 'anonymous',
      userEmail: user?.email || null,
      collegeId: user?.collegeId || null,
      timestamp: new Date().toISOString()
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // Focus first suggestion if none selected
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Click outside to close suggestions
  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(handleClickOutside, 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}
        
        {/* Search icon */}
        {!loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <button
              key={`${place.fareKey}-${index}`}
              onClick={() => handlePlaceSelect(place)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getPlaceIcon(place.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {place.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {place.displayName}
                  </div>
                  {location && place.distance && (
                    <div className="text-xs text-blue-600 mt-1">
                      {formatDistance(place.distance)} away
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !loading && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <span className="text-2xl">🔍</span>
            <p className="mt-2 text-sm">No places found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getPlaceIcon(type) {
  const typeMap = {
    restaurant: '🍽️',
    hotel: '🏨',
    hospital: '🏥',
    school: '🏫',
    university: '🎓',
    bank: '🏦',
    pharmacy: '💊',
    supermarket: '🛒',
    mall: '🏬',
    fuel: '⛽',
    parking: '🅿️',
    cinema: '🎬',
    park: '🌳',
    gym: '🏋️',
    cafe: '☕',
    bar: '🍺',
    police: '🚔',
    fire_station: '🚒',
    post_office: '📮',
    library: '📚',
    museum: '🏛️',
    temple: '🛕',
    mosque: '🕌',
    church: '⛪'
  };
  
  return typeMap[type?.toLowerCase()] || '📍';
}

function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
}
