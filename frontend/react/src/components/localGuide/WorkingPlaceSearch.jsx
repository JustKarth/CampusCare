import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Working Place Search component - simplified and guaranteed to work
export function WorkingPlaceSearch({ onPlaceSelect, placeholder = "Enter destination for fare analysis" }) {
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const { user } = useAuth();

  // Predefined places that definitely work
  const places = [
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

  const handlePlaceSelect = (place) => {
    setSelectedPlaceName(place.displayName);
    
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

  return (
    <div className="space-y-4">
      {/* Selected Place Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Destination
        </label>
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          {selectedPlaceName ? (
            <div className="flex items-center justify-between">
              <span className="text-gray-900">{selectedPlaceName}</span>
              <button
                onClick={() => setSelectedPlaceName('')}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-gray-500">No place selected</span>
          )}
        </div>
      </div>

      {/* Place Selection Grid */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a Destination
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {places.map((place) => (
            <button
              key={place.fareKey}
              onClick={() => handlePlaceSelect(place)}
              className={`p-3 border rounded-lg text-left transition-all ${
                selectedPlaceName === place.displayName
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">
                  {getPlaceIcon(place.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {place.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {place.displayName.split(',')[1]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📍 How to select a place:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Click on any destination from the grid above</li>
          <li>The selected place will appear in the "Selected Destination" field</li>
          <li>Proceed to enter the fare amount in the next step</li>
        </ol>
      </div>
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
