import { useState, useEffect, useRef } from 'react';
import { SearchService } from '../../services/searchService';
import { useGeolocation } from '../../hooks/useGeolocation';

export function PlaceSearch({ onPlaceSelect, placeholder = "Search for places..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const { location } = useGeolocation();

  useEffect(() => {
    const searchPlaces = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await SearchService.searchPlaces(query, location, 10);
        setSuggestions(results);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPlaces, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handlePlaceClick = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  const getSuggestionIcon = (place) => {
    // Show proximity indicator with icon
    if (place.distance && place.distance < 1000) {
      return '📍'; // Very close
    } else if (place.distance && place.distance < 5000) {
      return '📍'; // Close
    } else if (place.class === 'amenity') {
      return '🏢';
    } else if (place.class === 'shop') {
      return '🛍️';
    } else if (place.class === 'tourism') {
      return '🎯';
    } else if (place.class === 'restaurant') {
      return '🍽️';
    }
    return '📍';
  };

  const getDistanceColor = (distance) => {
    if (!distance) return 'text-gray-500';
    if (distance < 1000) return 'text-green-600 font-medium'; // Very close
    if (distance < 5000) return 'text-blue-600'; // Close
    return 'text-gray-500'; // Far
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${location ? 'pl-8' : ''}`}
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          </div>
        )}
        {!loading && query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
        {location && (
          <div className="absolute left-3 top-2.5 text-green-500 text-xs">
            📍
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <div
              key={`${place.place_id}-${index}`}
              onClick={() => handlePlaceClick(place)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-0.5">{getSuggestionIcon(place)}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {place.display_name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {place.class && place.type && `${place.class} • ${place.type}`}
                  </div>
                  {place.distance && (
                    <div className={`text-xs ${getDistanceColor(place.distance)}`}>
                      {place.distance < 1000 
                        ? `${Math.round(place.distance)}m away`
                        : `${(place.distance / 1000).toFixed(1)}km away`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && !loading && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            No places found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
