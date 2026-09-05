import { useState, useEffect, useRef } from 'react';
import { PRAYAGRAJ_HOTSPOTS } from '../../config/prayagrajPlaces';
import { SearchService } from '../../services/searchService';
import { useDebounce } from '../../hooks/useDebounce';

export function FarePlaceSearch({
  label = 'Select Location',
  placeholder = 'Search place or select hotspot...',
  selectedLocation,
  onSelectLocation,
  badgeColor = 'emerald'
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const geo = await SearchService.reverseGeocode(lat, lng);
          const name = geo?.display_name ? geo.display_name.split(',')[0] : 'Current Location';
          const area = geo?.display_name ? geo.display_name.split(',').slice(1, 3).join(',').trim() : 'Live GPS';
          const placeObj = {
            id: 'gps-' + Date.now(),
            name: `${name} (My Location)`,
            displayName: geo?.display_name || 'Current Location',
            lat,
            lng,
            icon: '📍',
            area: area || 'Current Location'
          };
          handleSelect(placeObj);
        } catch (e) {
          const placeObj = {
            id: 'gps-' + Date.now(),
            name: 'My Current Location',
            displayName: 'My Current Location',
            lat,
            lng,
            icon: '📍',
            area: 'Live GPS'
          };
          handleSelect(placeObj);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Unable to retrieve your current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Sync input with selectedLocation
  useEffect(() => {
    if (selectedLocation?.name) {
      setQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search places via Nominatim when user types custom text
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed || (selectedLocation && trimmed === selectedLocation.name)) {
      setSearchResults([]);
      return;
    }

    // Filter curated list first
    const hotspotMatches = PRAYAGRAJ_HOTSPOTS.filter(h =>
      h.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      h.shortName.toLowerCase().includes(trimmed.toLowerCase()) ||
      h.area.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (trimmed.length < 3) {
      setSearchResults(hotspotMatches);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const performSearch = async () => {
      try {
        const fullQuery = trimmed.toLowerCase().includes('prayagraj') || trimmed.toLowerCase().includes('allahabad')
          ? trimmed
          : `${trimmed}, Prayagraj`;

        const results = await SearchService.searchPlaces(fullQuery, null, 6);
        if (!isMounted) return;

        const formatted = (results || []).map(r => ({
          id: `osm-${r.place_id}`,
          name: r.display_name.split(',')[0],
          displayName: r.display_name,
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          icon: '📍',
          area: r.display_name.split(',').slice(1, 3).join(',').trim()
        }));

        // Combine hotspots + OSM results with no duplicates
        const combined = [...hotspotMatches];
        formatted.forEach(f => {
          if (!combined.some(c => Math.abs(c.lat - f.lat) < 0.002 && Math.abs(c.lng - f.lng) < 0.002)) {
            combined.push(f);
          }
        });

        setSearchResults(combined);
      } catch (err) {
        console.warn('Search error:', err);
        if (isMounted) setSearchResults(hotspotMatches);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, selectedLocation]);

  const handleSelect = (place) => {
    onSelectLocation(place);
    setQuery(place.name);
    setIsOpen(false);
  };

  const badgeStyles = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleUseCurrentLocation();
            }}
            disabled={isLocating}
            className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all flex items-center gap-1 font-semibold"
          >
            <span>{isLocating ? '⏳' : '📍'}</span>
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>
          {selectedLocation && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeStyles[badgeColor] || badgeStyles.emerald}`}>
              Selected
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-11 pr-10 bg-card/60 backdrop-blur-md rounded-xl border border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
        />

        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-base">
          {selectedLocation?.icon || '🔍'}
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isSearching && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            title="Use current GPS location"
            className="text-primary hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors text-sm"
          >
            {isLocating ? (
              <div className="w-3.5 h-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            ) : (
              '🎯'
            )}
          </button>
        </div>
      </div>

      {/* Autocomplete & Hotspots Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[9999] max-h-80 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 divide-y divide-white/5 animate-fadeIn">
          {/* Featured Quick Action: My Current Location */}
          <div className="p-1 pb-2">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-purple-600/20 hover:from-primary/30 hover:to-purple-600/30 border border-primary/30 text-white transition-all flex items-center gap-2.5 text-xs font-semibold group"
            >
              <span className="text-lg p-1.5 rounded-lg bg-primary/30 border border-primary/40 group-hover:scale-110 transition-transform">
                📍
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>{isLocating ? 'Detecting GPS position...' : 'Use My Current Location'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/40 text-primary-light uppercase">GPS</span>
                </p>
                <p className="text-[10px] text-white/60 truncate">Auto-fill real-time coordinates</p>
              </div>
              {isLocating && (
                <div className="w-3.5 h-3.5 border-2 border-primary/40 border-t-primary rounded-full animate-spin flex-shrink-0" />
              )}
            </button>
          </div>

          {/* If search query has results */}
          {searchResults.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                Search Results ({searchResults.length})
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.map((place) => (
                  <button
                    key={place.id || place.name}
                    type="button"
                    onClick={() => handleSelect(place)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-sm group"
                  >
                    <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {place.icon || '📍'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{place.name}</p>
                      {place.area && (
                        <p className="text-xs text-white/50 truncate">{place.area}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query.trim() && !isSearching ? (
            <div className="p-4 text-center text-sm text-text-secondary">
              No places found for &quot;{query}&quot;. Try typing a landmark or area name.
            </div>
          ) : (
            /* Default Hotspots Quick-Pick list */
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                <span>Popular Hotspots & Hubs</span>
                <span className="text-[10px] text-white/40 normal-case">One-click select</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                {PRAYAGRAJ_HOTSPOTS.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => handleSelect(place)}
                    className={`w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2.5 text-xs ${
                      selectedLocation?.id === place.id ? 'bg-primary/20 border border-primary/40' : ''
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{place.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{place.shortName}</p>
                      <p className="text-[10px] text-white/50 truncate">{place.area}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

