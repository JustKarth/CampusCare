import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Prayagraj Place Search with comprehensive location coverage
export function PrayagrajPlaceSearch({ onPlaceSelect, placeholder = "Search for any destination in Prayagraj..." }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();

  // Comprehensive Prayagraj locations
  const allPlaces = [
    // Religious & Spiritual Sites
    {
      name: "Sangam",
      displayName: "Sangam, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4333, lng: 81.8333 },
      fareKey: "sangam",
      type: "religious",
      class: "religious",
      keywords: ["sangam", "triveni", "confluence", "ganga", "yamuna", "saraswati", "kumbh"]
    },
    {
      name: "Allahabad Fort",
      displayName: "Allahabad Fort, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "allahabad-fort",
      type: "tourism",
      class: "tourism",
      keywords: ["allahabad", "fort", "akbar", "historical", "monument"]
    },
    {
      name: "Anand Bhawan",
      displayName: "Anand Bhawan, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "anand-bhawan",
      type: "museum",
      class: "museum",
      keywords: ["anand", "bhawan", "nehru", "museum", "historical"]
    },
    {
      name: "Khusro Bagh",
      displayName: "Khusro Bagh, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "khusro-bagh",
      type: "tourism",
      class: "tourism",
      keywords: ["khusro", "bagh", "garden", "mughal", "historical"]
    },
    
    // Educational Institutions
    {
      name: "Allahabad University",
      displayName: "University of Allahabad, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "allahabad-university",
      type: "university",
      class: "university",
      keywords: ["allahabad", "university", "college", "education", "muir"]
    },
    {
      name: "MNNIT",
      displayName: "MNNIT Allahabad, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "mnnit",
      type: "university",
      class: "university",
      keywords: ["mnnit", "motilal", "nehru", "nit", "engineering", "college"]
    },
    {
      name: "IIIT Allahabad",
      displayName: "IIIT Allahabad, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "iiit-allahabad",
      type: "university",
      class: "university",
      keywords: ["iiit", "allahabad", "indian", "institute", "information", "technology"]
    },
    {
      name: "Jawahar Navodaya Vidyalaya",
      displayName: "Jawahar Navodaya Vidyalaya, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "jawahar-navodaya",
      type: "school",
      class: "school",
      keywords: ["jawahar", "navodaya", "vidyalaya", "school", "education"]
    },
    
    // Transportation Hubs
    {
      name: "Prayagraj Junction",
      displayName: "Prayagraj Junction Railway Station, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "prayagraj-junction",
      type: "railway",
      class: "railway",
      keywords: ["prayagraj", "junction", "railway", "station", "train"]
    },
    {
      name: "Civil Lines",
      displayName: "Civil Lines, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "civil-lines",
      type: "commercial",
      class: "commercial",
      keywords: ["civil", "lines", "commercial", "business", "market"]
    },
    {
      name: "Bus Station",
      displayName: "Prayagraj Bus Station, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "bus-station",
      type: "bus_station",
      class: "bus_station",
      keywords: ["bus", "station", "terminal", "transport", "roadways"]
    },
    
    // Markets & Commercial Areas
    {
      name: "Katra",
      displayName: "Katra Market, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "katra",
      type: "commercial",
      class: "commercial",
      keywords: ["katra", "market", "shopping", "commercial", "bazaar"]
    },
    {
      name: "Chowk",
      displayName: "Chowk, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "chowk",
      type: "commercial",
      class: "commercial",
      keywords: ["chowk", "market", "commercial", "shopping"]
    },
    {
      name: "Meerapur",
      displayName: "Meerapur, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "meerapur",
      type: "residential",
      class: "residential",
      keywords: ["meerapur", "residential", "area", "colony"]
    },
    
    // Healthcare
    {
      name: "SRN Hospital",
      displayName: "SRN Hospital, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "srn-hospital",
      type: "hospital",
      class: "hospital",
      keywords: ["srn", "hospital", "medical", "healthcare", "swaroop"]
    },
    {
      name: "Jeevan Jyoti Hospital",
      displayName: "Jeevan Jyoti Hospital, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "jeevan-jyoti",
      type: "hospital",
      class: "hospital",
      keywords: ["jeevan", "jyoti", "hospital", "medical", "healthcare"]
    },
    
    // Religious Sites
    {
      name: "Patalpuri Temple",
      displayName: "Patalpuri Temple, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "patalpuri-temple",
      type: "temple",
      class: "temple",
      keywords: ["patalpuri", "temple", "religious", "hindu", "worship"]
    },
    {
      name: "Alopi Devi Mandir",
      displayName: "Alopi Devi Mandir, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "alopi-devi",
      type: "temple",
      class: "temple",
      keywords: ["alopi", "devi", "mandir", "temple", "religious"]
    },
    {
      name: "Mankameshwar Temple",
      displayName: "Mankameshwar Temple, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "mankameshwar",
      type: "temple",
      class: "temple",
      keywords: ["mankameshwar", "temple", "religious", "hindu", "shiva"]
    },
    
    // Parks & Recreation
    {
      name: "Chandra Shekhar Azad Park",
      displayName: "Chandra Shekhar Azad Park, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "chandra-park",
      type: "park",
      class: "park",
      keywords: ["chandra", "shekhar", "azad", "park", "garden", "recreation"]
    },
    {
      name: "Company Garden",
      displayName: "Company Garden, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "company-garden",
      type: "park",
      class: "park",
      keywords: ["company", "garden", "park", "recreation", "botanical"]
    },
    
    // Administrative Areas
    {
      name: "Collectorate",
      displayName: "Collectorate, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "collectorate",
      type: "government",
      class: "government",
      keywords: ["collectorate", "district", "administration", "government"]
    },
    {
      name: "High Court",
      displayName: "Allahabad High Court, Prayagraj, Uttar Pradesh, India",
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: "high-court",
      type: "government",
      class: "government",
      keywords: ["high", "court", "judicial", "allahabad", "legal"]
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
                <p className="mt-2 text-sm">No places found in Prayagraj</p>
                <p className="text-xs">Try: Sangam, University, Civil Lines, etc.</p>
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
          <p className="text-xs text-gray-500 mb-2">Popular Prayagraj destinations:</p>
          <div className="flex flex-wrap gap-2">
            {["Sangam", "University", "Civil Lines", "Allahabad Fort"].map((term) => (
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
    religious: '🕉️',
    tourism: '🏛️',
    museum: '🏛️',
    university: '🎓',
    school: '🏫',
    railway: '🚂',
    bus_station: '🚌',
    commercial: '🏢',
    residential: '🏘️',
    hospital: '🏥',
    temple: '🛕',
    park: '🌳',
    government: '🏛️'
  };
  
  return typeMap[type?.toLowerCase()] || '📍';
}
