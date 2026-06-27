import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';

// Hook for fetching dropdown data from database
export function useDropdownData() {
  const [courses, setCourses] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses and states in parallel
        const [coursesRes, statesRes] = await Promise.all([
          apiRequest('/courses'),
          apiRequest('/states')
        ]);

        setCourses(coursesRes.courses || []);
        setStates(statesRes.states || []);
      } catch (err) {
        setError(err.message || 'Failed to load dropdown data');
        console.error('Dropdown data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  return {
    courses,
    states,
    loading,
    error
  };
}
