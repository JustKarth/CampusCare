import { useState, useEffect } from 'react';
import { SearchService } from '../../services/searchService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { PlaceSearch } from './PlaceSearch.jsx';

export function RouteCalculator({ onRouteCalculated }) {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState('foot'); // foot, car, bicycle

  const profiles = [
    { value: 'foot', label: '🚶 Walking' },
    { value: 'car', label: '🚗 Driving' },
    { value: 'bicycle', label: '🚴 Cycling' }
  ];

  useEffect(() => {
    if (location) {
      setStartPoint({
        lat: location.lat,
        lng: location.lng,
        display_name: 'Your Location'
      });
    }
  }, [location]);

  const calculateRoute = async () => {
    if (!startPoint || !endPoint) {
      alert('Please select both start and end points');
      return;
    }

    setLoading(true);
    try {
      const routeData = await SearchService.calculateRoute(
        startPoint.lat,
        startPoint.lng,
        endPoint.lat,
        endPoint.lng,
        profile
      );
      setRoute(routeData);
      
      // Pass route data to parent component
      if (onRouteCalculated) {
        onRouteCalculated(routeData);
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      alert('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const calculateRealisticDuration = (distance, profile) => {
    // Average speeds in meters per second
    const speeds = {
      foot: 1.4,    // ~5 km/h walking speed
      car: 8.3,     // ~30 km/h city driving
      bicycle: 4.2  // ~15 km/h cycling
    };
    
    const speed = speeds[profile] || speeds.foot;
    const durationSeconds = distance / speed;
    
    return durationSeconds;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatInstructions = (steps) => {
    if (!steps) return [];
    
    return steps.map((step, index) => {
      // Get instruction from maneuver or create a default one
      let instruction = step.maneuver?.instruction || '';
      
      // If no instruction, create one based on maneuver type
      if (!instruction && step.maneuver) {
        const type = step.maneuver.type || '';
        const modifier = step.maneuver.modifier || '';
        
        switch (type) {
          case 'turn':
            instruction = `Turn ${modifier}` || 'Turn';
            break;
          case 'new name':
            instruction = 'Continue';
            break;
          case 'depart':
            instruction = 'Start';
            break;
          case 'arrive':
            instruction = 'Arrive at destination';
            break;
          case 'merge':
            instruction = 'Merge';
            break;
          case 'on ramp':
            instruction = 'Take ramp';
            break;
          case 'off ramp':
            instruction = 'Take exit';
            break;
          case 'fork':
            instruction = `Take ${modifier} fork` || 'Take fork';
            break;
          case 'roundabout':
            instruction = `Take roundabout exit ${step.maneuver.exit || 1}`;
            break;
          default:
            instruction = 'Continue';
        }
      }
      
      // If still no instruction, use a generic one
      if (!instruction) {
        instruction = index === 0 ? 'Start' : index === steps.length - 1 ? 'Arrive' : 'Continue';
      }
      
      const distance = formatDistance(step.distance);
      return `${index + 1}. ${instruction} (${distance})`;
    });
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
      {/* Route Configuration */}
      <div className="space-y-3">
        {/* Start Point */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Starting Point
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">📍</span>
              <span className="text-sm">
                {startPoint ? startPoint.display_name : 'No start point'}
              </span>
            </div>
          </div>
        </div>

        {/* End Point */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <PlaceSearch
            onPlaceSelect={(place) => setEndPoint({
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
              display_name: place.display_name
            })}
            placeholder="Search for destination..."
          />
        </div>

        {/* Transport Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transport Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {profiles.map(p => (
              <button
                key={p.value}
                onClick={() => setProfile(p.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  profile === p.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateRoute}
          disabled={loading || !startPoint || !endPoint}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : '🗺️ Calculate Route'}
        </button>
      </div>

      {/* Route Results */}
      {route && route.routes && route.routes[0] && (
        <div className="space-y-3">
          {/* Route Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Route Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Distance:</span>
                <span className="ml-2 font-medium text-green-700">
                  {formatDistance(route.routes[0].distance)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium text-green-700">
                  {formatDuration(calculateRealisticDuration(route.routes[0].distance, profile))}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Profile: {profile} | Steps: {route.routes[0].legs?.[0]?.steps?.length || 0}
            </div>
          </div>

          {/* Turn-by-turn Directions */}
          {route.routes[0].legs && route.routes[0].legs[0].steps && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Directions</h3>
              <div className="space-y-2">
                {formatInstructions(route.routes[0].legs[0].steps).map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <span className="text-blue-500 font-medium mt-0.5">
                      {index + 1}.
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <details className="text-xs">
              <summary className="cursor-pointer font-medium text-gray-700">Debug Info</summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify({
                  profile,
                  distance: route.routes[0].distance,
                  osrmDuration: route.routes[0].duration,
                  realisticDuration: calculateRealisticDuration(route.routes[0].distance, profile),
                  stepsCount: route.routes[0].legs?.[0]?.steps?.length,
                  firstStep: route.routes[0].legs?.[0]?.steps?.[0]
                }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* No Route */}
      {!route && !loading && startPoint && endPoint && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-2xl">🗺️</span>
          <p className="mt-2">Click "Calculate Route" to get directions</p>
        </div>
      )}
    </div>
  );
}
