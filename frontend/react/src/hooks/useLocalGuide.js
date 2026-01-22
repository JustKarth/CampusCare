import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { getUser } from '../services/authStorage';

// Local Guide data fetching hook
// Replaces: localGuide.js data fetching functions

export function useLocalGuide() {
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest('/local-guide/categories', 'GET');
        setCategories(res.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        // Categories are optional, don't fail the whole page
      }
    };
    fetchCategories();
  }, []);

  // Fetch places when category changes
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = getUser();
        const endpoint = selectedCategory
          ? `/local-guide/places/${encodeURIComponent(selectedCategory)}`
          : '/local-guide/places';
        
<<<<<<< HEAD
        // If logged in, backend infers collegeId from token
        // Otherwise fall back to default collegeId=1
        const url = user?.collegeId ? endpoint : `${endpoint}?collegeId=1`;
        
        const res = await apiRequest(url, 'GET');
=======
        // If logged in, backend infers collegeId from token (don't add query param)
        // If not logged in, add collegeId query param
        const url = user?.collegeId ? endpoint : `${endpoint}?collegeId=1`;
        
        // Pass token if user is logged in (for optional auth)
        const token = user ? true : null;
        const res = await apiRequest(url, 'GET', null, token);
>>>>>>> main
        setPlaces(res.places || []);
      } catch (err) {
        setError(err.message || 'Failed to load places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedCategory]);

  const submitRating = async (placeId, rating) => {
    try {
      await apiRequest(`/local-guide/places/${placeId}/rating`, 'POST', { rating }, true);
      // Refresh places to update rating
      const user = getUser();
      const endpoint = selectedCategory
        ? `/local-guide/places/${encodeURIComponent(selectedCategory)}`
        : '/local-guide/places';
      const url = user?.collegeId ? endpoint : `${endpoint}?collegeId=1`;
<<<<<<< HEAD
      const res = await apiRequest(url, 'GET');
=======
      const token = user ? true : null;
      const res = await apiRequest(url, 'GET', null, token);
>>>>>>> main
      setPlaces(res.places || []);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to submit rating' };
    }
  };

  return {
    categories,
    places,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    submitRating,
  };
}
