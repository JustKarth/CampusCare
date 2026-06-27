import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Searchable Place Select with working search functionality
export function SearchablePlaceSelect({ onPlaceSelect, placeholder = "Enter destination for fare analysis" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();

  // All available places
  const allPlaces = [
    {
      name: "India Gate",
      displayName: "India Gate, New Delhi, Delhi, India",
      coordinates: { lat: 28.6129, lng: 77.2295 },
      fareKey: "india-gate",
      type: "tourism",
      class: "tourism",
      keywords: ["india", "gate", "monument", "delhi", "new delhi"]
    },
    {
      name: "Red Fort",
      displayName: "Red Fort, Old Delhi, Delhi, India",
      coordinates: { lat: 28.6562, lng: 77.2410 },
      fareKey: "red-fort",
      type: "tourism",
      class: "tourism",
      keywords: ["red", "fort", "old", "delhi", "monument"]
    },
    {
      name: "Qutub Minar",
      displayName: "Qutub Minar, Mehrauli, New Delhi, Delhi, India",
      coordinates: { lat: 28.5245, lng: 77.1855 },
      fareKey: "qutub-minar",
      type: "tourism",
      class: "tourism",
      keywords: ["qutub", "minar", "mehrauli", "tower", "delhi"]
    },
    {
      name: "Lotus Temple",
      displayName: "Lotus Temple, Bahapur, New Delhi, Delhi, India",
      coordinates: { lat: 28.5535, lng: 77.2588 },
      fareKey: "lotus-temple",
      type: "tourism",
      class: "tourism",
      keywords: ["lotus", "temple", "bahapur", "worship", "delhi"]
    },
    {
      name: "Connaught Place",
      displayName: "Connaught Place, New Delhi, Delhi, India",
      coordinates: { lat: 28.6314, lng: 77.2196 },
      fareKey: "connaught-place",
      type: "commercial",
      class: "commercial",
      keywords: ["connaught", "place", "cp", "market", "shopping", "delhi"]
    },
    {
      name: "Airport",
      displayName: "Indira Gandhi International Airport, New Delhi, Delhi, India",
      coordinates: { lat: 28.5665, lng: 77.3101 },
      fareKey: "delhi-airport",
      type: "aeroway",
      class: "aeroway",
      keywords: ["airport", "ig", "indira", "gandhi", "flight", "delhi"]
    },
    {
      name: "Railway Station",
      displayName: "New Delhi Railway Station, New Delhi, Delhi, India",
      coordinates: { lat: 28.6448, lng: 77.2202 },
      fareKey: "new-delhi-railway",
      type: "railway",
      class: "railway",
      keywords: ["railway", "station", "train", "ndls", "delhi"]
    },
    {
      name: "ISBT Kashmere Gate",
      displayName: "ISBT Kashmere Gate, New Delhi, Delhi, India",
      coordinates: { lat: 28.6692, lng: 77.2298 },
      fareKey: "isbt-kashmere",
      type: "bus_station",
      class: "bus_station",
      keywords: ["isbt", "kashmere", "gate", "bus", "terminal", "delhi"]
    },
    {
      name: "Karol Bagh",
      displayName: "Karol Bagh, New Delhi, Delhi, India",
      coordinates: { lat: 28.6514, lng: 77.1904 },
      fareKey: "karol-bagh",
      type: "commercial",
      class: "commercial",
      keywords: ["karol", "bagh", "market", "shopping", "delhi"]
    },
    {
      name: "Chandni Chowk",
      displayName: "Chandni Chowk, Old Delhi, Delhi, India",
      coordinates: { lat: 28.6506, lng: 77.2303 },
      fareKey: "chandni-chowk",
      type: "commercial",
      class: "commercial",
      keywords: ["chandni", "chowk", "market", "old", "delhi"]
    },
    {
      name: "South Extension",
      displayName: "South Extension, New Delhi, Delhi, India",
      coordinates: { lat: 28.5696, lng: 77.2151 },
      fareKey: "south-extension",
      type: "commercial",
      class: "commercial",
      keywords: ["south", "extension", "market", "shopping", "delhi"]
    },
    {
      name: "Dwarka",
      displayName: "Dwarka, New Delhi, Delhi, India",
      coordinates: { lat: 28.5921, lng: 77.0438 },
      fareKey: "dwarka",
      type: "residential",
      class: "residential",
      keywords: ["dwarka", "sector", "residential", "delhi"]
    }
  ];

  // Filter places based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlaces(allPlaces);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPlaces.filter(place => {
      // Search in name
      if (place.name.toLowerCase().includes(query)) return true;
      
      // Search in display name
      if (place.displayName.toLowerCase().includes(query)) return true;
      
      // Search in keywords
      return place.keywords.some(keyword => keyword.includes(query));
    });

    setFilteredPlaces(filtered);
  }, [searchQuery]);

  // Handle place selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);
    setIsDropdownOpen(false);
    
    // Pass selected place to parent
    onPlaceSelect({
      ...place,
      submittedBy: user?.id || 'anonymous',
      userEmail: user?.email || null,
      collegeId: user?.collegeId || null,
      timestamp: new Date().toISOString()
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    if (!searchQuery) {
      setFilteredPlaces(allPlaces);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear selection
  const handleClear = () => {
    setSelectedPlace(null);
    setSearchQuery('');
    setFilteredPlaces(allPlaces);
    setIsDropdownOpen(false);
  };

  return (
    <div className="search-container">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Search icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {filteredPlaces.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <span className="text-2xl">🔍</span>
                <p className="mt-2 text-sm">No places found</p>
                <p className="text-xs">Try: India Gate, Red Fort, Airport, etc.</p>
              </div>
            ) : (
              filteredPlaces.map((place) => (
                <button
                  key={place.fareKey}
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getPlaceIcon(place.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {place.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {place.displayName}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Place Display */}
      {selectedPlace && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{getPlaceIcon(selectedPlace.type)}</span>
              <span className="text-sm font-medium text-blue-900">
                {selectedPlace.name}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && !selectedPlace && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {["India Gate", "Airport", "Connaught Place", "Red Fort"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setIsDropdownOpen(true);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                {term}
              </button>
            ))}
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
    residential: '🏘️',
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
