import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/apiClient';
import { getUser } from '../services/authStorage';
import { SearchService } from '../services/searchService';

// MNNIT Campus Default Coordinates
const MNNIT_LAT = 25.4920;
const MNNIT_LNG = 81.8636;

export function useLocalGuide() {
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [onlinePlaces, setOnlinePlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/local-guide/categories', 'GET');
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch online places fallback via OpenStreetMap / Nominatim
  const fetchOnlineFallback = useCallback(async (catName) => {
    setOnlineLoading(true);
    try {
      const searchTerm = catName || 'cafe OR restaurant OR medical';
      const results = await SearchService.findNearbyPlaces(MNNIT_LAT, MNNIT_LNG, 15000, searchTerm);

      const formatted = (results || []).slice(0, 12).map((item, idx) => {
        // Calculate distance from MNNIT
        const itemLat = parseFloat(item.lat);
        const itemLng = parseFloat(item.lon || item.lng);
        let dist = null;
        if (!isNaN(itemLat) && !isNaN(itemLng)) {
          const R = 6371;
          const dLat = ((itemLat - MNNIT_LAT) * Math.PI) / 180;
          const dLon = ((itemLng - MNNIT_LNG) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((MNNIT_LAT * Math.PI) / 180) *
              Math.cos((itemLat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          dist = (R * c).toFixed(1);
        }

        const name = (item.display_name || item.name || 'Local Spot').split(',')[0];
        const address = (item.display_name || '').split(',').slice(1, 3).join(',').trim() || 'Prayagraj';

        return {
          place_id: `online-${idx}-${Date.now()}`,
          place_name: name,
          place_description: `Discovered from OpenStreetMap directory near Teliyarganj / Prayagraj. Be the first student to review and rate this place!`,
          address,
          distance: dist ? parseFloat(dist) : 1.5,
          lat: itemLat,
          lng: itemLng,
          category_name: catName || 'General',
          price_range: '₹ - ₹₹',
          average_rating: null,
          rating_count: 0,
          reviews: [],
          isOnline: true
        };
      });

      setOnlinePlaces(formatted);
    } catch (err) {
      console.warn('Online fallback error:', err);
      setOnlinePlaces([]);
    } finally {
      setOnlineLoading(false);
    }
  }, []);

  // Fetch feeded places from database
  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();
      const endpoint = selectedCategory
        ? `/local-guide/places/${encodeURIComponent(selectedCategory)}`
        : '/local-guide/places';
      const url = user?.collegeId ? endpoint : `${endpoint}?collegeId=1`;
      const token = user ? true : null;

      const res = await apiRequest(url, 'GET', null, token);
      const fetchedPlaces = res.places || [];
      setPlaces(fetchedPlaces);

      // If no feeded places exist for this category, automatically load online places!
      if (fetchedPlaces.length === 0) {
        fetchOnlineFallback(selectedCategory);
      } else {
        setOnlinePlaces([]);
      }
    } catch (err) {
      console.error('Failed to load places:', err);
      setError(err.message || 'Failed to load places');
      // On backend failure, load online fallback
      fetchOnlineFallback(selectedCategory);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, fetchOnlineFallback]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Submit a rating + written review (optionally attach location)
  const submitRating = async (placeId, rating, reviewText = '', location = null) => {
    try {
      await apiRequest(
        `/local-guide/places/${placeId}/rating`,
        'POST',
        { rating, reviewText, location },
        true
      );
      // Refresh places to get updated rating & reviews
      await fetchPlaces();
      return { success: true };
    } catch (err) {
      console.error('Submit rating error:', err);
      return { success: false, error: err.message || 'Failed to submit rating' };
    }
  };

  // Student suggests/adds a new place
  const addPlace = async (placeData) => {
    try {
      const res = await apiRequest('/local-guide/places', 'POST', placeData, true);
      await fetchPlaces();
      return { success: true, place: res.place };
    } catch (err) {
      console.error('Add place error:', err);
      return { success: false, error: err.message || 'Failed to add place' };
    }
  };

  return {
    categories,
    places,
    onlinePlaces,
    selectedCategory,
    setSelectedCategory,
    loading,
    onlineLoading,
    error,
    submitRating,
    addPlace,
    refreshPlaces: fetchPlaces,
    fetchOnlineFallback
  };
}
