import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

/**
 * useFares Hook
 * Connects directly to the backend fares API for community-shared transit fares,
 * route statistics, overcharge analysis, and submission.
 */
export function useFares() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeFares, setRouteFares] = useState([]);
  const [routeStats, setRouteStats] = useState({
    overall: { total_count: 0, min_fare: null, max_fare: null, avg_fare: null },
    breakdown: []
  });
  const [recentFares, setRecentFares] = useState([]);
  const [myFares, setMyFares] = useState([]);

  // Fetch fares and stats for a specific route
  const fetchRouteFares = useCallback(async ({ fromLat, fromLng, toLat, toLng, fromName, toName }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fromLat) params.append('from_lat', fromLat);
      if (fromLng) params.append('from_lng', fromLng);
      if (toLat) params.append('to_lat', toLat);
      if (toLng) params.append('to_lng', toLng);
      if (fromName) params.append('from_name', fromName);
      if (toName) params.append('to_name', toName);

      const endpoint = `/fares?${params.toString()}`;
      const res = await apiRequest(endpoint, 'GET');

      if (res.success) {
        setRouteFares(res.fares || []);
        setRouteStats(res.stats || {
          overall: { total_count: 0, min_fare: null, max_fare: null, avg_fare: null },
          breakdown: []
        });
        return res;
      }
    } catch (err) {
      console.error('Failed to fetch route fares:', err);
      setError(err.message || 'Could not fetch fares for this route.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent platform fares
  const fetchRecentFares = useCallback(async () => {
    try {
      const res = await apiRequest('/fares/recent', 'GET');
      if (res.success) {
        setRecentFares(res.fares || []);
      }
    } catch (err) {
      console.warn('Could not fetch recent fares:', err.message);
    }
  }, []);

  // Fetch current user's submitted fares
  const fetchMyFares = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiRequest('/fares/mine', 'GET', null, true);
      if (res.success) {
        setMyFares(res.fares || []);
      }
    } catch (err) {
      console.warn('Could not fetch user fares:', err.message);
    }
  }, [user]);

  // Submit a new fare
  const submitFare = useCallback(async (fareData) => {
    setError(null);
    try {
      const res = await apiRequest('/fares', 'POST', fareData, true);
      if (res.success) {
        // Refresh recent & my fares
        fetchRecentFares();
        fetchMyFares();
        return res;
      }
    } catch (err) {
      console.error('Submit fare error:', err);
      setError(err.message || 'Failed to submit fare.');
      throw err;
    }
  }, [fetchRecentFares, fetchMyFares]);

  // Delete own fare
  const deleteFare = useCallback(async (fareId) => {
    try {
      const res = await apiRequest(`/fares/${fareId}`, 'DELETE', null, true);
      if (res.success) {
        setMyFares(prev => prev.filter(f => f.fare_id !== fareId));
        setRouteFares(prev => prev.filter(f => f.fare_id !== fareId));
        fetchRecentFares();
        return res;
      }
    } catch (err) {
      console.error('Delete fare error:', err);
      throw err;
    }
  }, [fetchRecentFares]);

  // Load initial community activity on mount
  useEffect(() => {
    fetchRecentFares();
    if (user) {
      fetchMyFares();
    }
  }, [fetchRecentFares, fetchMyFares, user]);

  return {
    loading,
    error,
    routeFares,
    routeStats,
    recentFares,
    myFares,
    fetchRouteFares,
    fetchRecentFares,
    fetchMyFares,
    submitFare,
    deleteFare
  };
}

