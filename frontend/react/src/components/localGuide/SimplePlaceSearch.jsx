import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

// Simple Place Search component with fallback options
// Works without external APIs for testing
export function SimplePlaceSearch({ onPlaceSelect, placeholder = "Enter destination for fare analysis" }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();

  // Fallback places for testing (real places in India)
  const fallbackPlaces = [
    {
      name: "India Gate",
      displayName: "India Gate, New Delhi, Delhi, India",
      coordinates: { lat: 28.6129, lng: 77.2295 },
      fareKey: "india-gate",
      type: "tourism",
      class: "tourism"
    },
    {
      name: "Red Fort",
      displayName: "Red Fort, Old Delhi, Delhi, India",
      coordinates: { lat: 28.6562, lng: 77.2410 },
      fareKey: "red-fort",
      type: "tourism",
      class: "tourism"
    },
    {
      name: "Qutub Minar",
      displayName: "Qutub Minar, Mehrauli, New Delhi, Delhi, India",
      coordinates: { lat: 28.5245, lng: 77.1855 },
      fareKey: "qutub-minar",
      type: "tourism",
      class: "tourism"
    },
    {
      name: "Lotus Temple",
      displayName: "Lotus Temple, Bahapur, New Delhi, Delhi, India",
      coordinates: { lat: 28.5535, lng: 77.2588 },
      fareKey: "lotus-temple",
      type: "tourism",
      class: "tourism"
    },
    {
      name: "Connaught Place",
      displayName: "Connaught Place, New Delhi, Delhi, India",
      coordinates: { lat: 28.6314, lng: 77.2196 },
      fareKey: "connaught-place",
      type: "commercial",
      class: "commercial"
    },
    {
      name: "Airport",
      displayName: "Indira Gandhi International Airport, New Delhi, Delhi, India",
      coordinates: { lat: 28.5665, lng: 77.3101 },
      fareKey: "delhi-airport",
      type: "aeroway",
      class: "aeroway"
    },
    {
      name: "Railway Station",
      displayName: "New Delhi Railway Station, New Delhi, Delhi, India",
      coordinates: { lat: 28.6448, lng: 77.2202 },
      fareKey: "new-delhi-railway",
      type: "railway",
      class: "railway"
    },
    {
      name: "ISBT Kashmere Gate",
      displayName: "ISBT Kashmere Gate, New Delhi, Delhi, India",
      coordinates: { lat: 28.6692, lng: 77.2298 },
      fareKey: "isbt-kashmere",
      type: "bus_station",
      class: "bus_station"
    }
  ];

  // Simple search function (filters fallback places)
  const searchPlaces = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Filter fallback places based on query
      const filtered = fallbackPlaces.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Format suggestions
      const formattedSuggestions = filtered.map(place => ({
        ...place,
        // Add user context for fare submission
        submittedBy: user?.id || 'anonymous',
        userEmail: user?.email || null,
        collegeId: user?.collegeId || null,
        timestamp: new Date().toISOString()
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchPlaces(value);
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
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick access buttons */}
      {!query && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Quick access:</p>
          <div className="flex flex-wrap gap-2">
            {fallbackPlaces.slice(0, 4).map((place) => (
              <button
                key={place.fareKey}
                onClick={() => handlePlaceSelect(place)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                {getPlaceIcon(place.type)} {place.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !loading && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <span className="text-2xl">🔍</span>
            <p className="mt-2 text-sm">No places found</p>
            <p className="text-xs">Try using the quick access buttons above</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getPlaceIcon(type) {
  const typeMap = {
    tourism: '🏛️',
    commercial: '🏢',
    aeroway: '✈️',
    railway: '🚂',
    bus_station: '🚌',
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
