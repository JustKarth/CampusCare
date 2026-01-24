import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Fare Storage Hook
// Frontend-only storage for fare data using localStorage
export function useFareStorage() {
  const { user } = useAuth();
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);

  // Storage key based on user context
  const getStorageKey = () => {
    const userId = user?.id || 'anonymous';
    return `campuscare_fares_${userId}`;
  };

  // Load fares from localStorage on mount
  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      const storedFares = localStorage.getItem(storageKey);
      
      if (storedFares) {
        const parsedFares = JSON.parse(storedFares);
        setFares(parsedFares);
      }
    } catch (error) {
      console.error('Error loading fares from storage:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Save fares to localStorage
  const saveFares = (newFares) => {
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(newFares));
      setFares(newFares);
    } catch (error) {
      console.error('Error saving fares to storage:', error);
      throw new Error('Failed to save fare data');
    }
  };

  // Add a new fare submission
  const addFare = (fareData) => {
    return new Promise((resolve, reject) => {
      try {
        // Create unique fare entry
        const newFare = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...fareData,
          submittedAt: new Date().toISOString(),
          // Add user context if available
          user: user ? {
            id: user.id,
            email: user.email,
            collegeId: user.collegeId,
            name: [user.firstName, user.lastName].filter(Boolean).join(' ')
          } : null
        };

        const updatedFares = [...fares, newFare];
        saveFares(updatedFares);
        
        resolve(newFare);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get fares for a specific place (aggregated from all users)
  const getFaresForPlace = (placeKey) => {
    // In a real multi-user scenario, this would aggregate from multiple users
    // For now, we'll use the current user's fares as a demonstration
    return fares.filter(fare => {
      // Match by place coordinates or name
      const farePlaceKey = fare.place.fareKey || `${fare.place.coordinates?.lat}-${fare.place.coordinates?.lng}`;
      return farePlaceKey === placeKey || 
             fare.place.name === placeKey ||
             fare.place.displayName.includes(placeKey);
    });
  };

  // Get aggregated fare data for distribution analysis
  const getAggregatedFares = (placeKey) => {
    const placeFares = getFaresForPlace(placeKey);
    
    // Group fares by value (rounding to nearest integer for grouping)
    const fareGroups = {};
    placeFares.forEach(fare => {
      const roundedFare = Math.round(fare.fare);
      fareGroups[roundedFare] = (fareGroups[roundedFare] || 0) + 1;
    });

    // Convert to array format for charting
    const distribution = Object.entries(fareGroups).map(([fareAmount, userCount]) => ({
      fare: parseFloat(fareAmount),
      users: userCount
    })).sort((a, b) => a.fare - b.fare);

    return {
      distribution,
      totalFares: placeFares.length,
      averageFare: placeFares.length > 0 
        ? placeFares.reduce((sum, fare) => sum + fare.fare, 0) / placeFares.length 
        : 0,
      minFare: placeFares.length > 0 ? Math.min(...placeFares.map(f => f.fare)) : 0,
      maxFare: placeFares.length > 0 ? Math.max(...placeFares.map(f => f.fare)) : 0
    };
  };

  // Get all unique places with fares
  const getPlacesWithFares = () => {
    const uniquePlaces = {};
    
    fares.forEach(fare => {
      const placeKey = fare.place.fareKey || fare.place.name;
      if (!uniquePlaces[placeKey]) {
        uniquePlaces[placeKey] = {
          ...fare.place,
          fareCount: 0,
          latestFare: 0
        };
      }
      uniquePlaces[placeKey].fareCount++;
      uniquePlaces[placeKey].latestFare = Math.max(uniquePlaces[placeKey].latestFare, fare.fare);
    });

    return Object.values(uniquePlaces);
  };

  // Clear all fare data (for testing/reset)
  const clearAllFares = () => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setFares([]);
    } catch (error) {
      console.error('Error clearing fares:', error);
    }
  };

  // Export/Import functionality for data backup
  const exportFares = () => {
    return JSON.stringify(fares, null, 2);
  };

  const importFares = (fareData) => {
    try {
      const importedFares = JSON.parse(fareData);
      if (Array.isArray(importedFares)) {
        saveFares([...fares, ...importedFares]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing fares:', error);
      return false;
    }
  };

  return {
    fares,
    loading,
    addFare,
    getFaresForPlace,
    getAggregatedFares,
    getPlacesWithFares,
    clearAllFares,
    exportFares,
    importFares
  };
}
