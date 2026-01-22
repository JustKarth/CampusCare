import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';

// Resources data fetching hook
// Replaces: resources.js data fetching functions

export function useResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest('/resources', 'GET', null, true);
        setResources(res.resources || []);
      } catch (err) {
        setError(err.message || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return {
    resources,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest('/resources', 'GET', null, true);
        setResources(res.resources || []);
      } catch (err) {
        setError(err.message || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    },
  };
}
