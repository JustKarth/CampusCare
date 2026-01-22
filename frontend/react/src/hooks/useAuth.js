import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, formatApiError } from '../services/apiClient';
import { setToken, setUser } from '../services/authStorage';
import { useAuth as useAuthContext } from '../context/AuthContext';

// Auth operations hook
// Replaces: auth.js login/register handlers

export function useAuthOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser: setContextUser, setToken: setContextToken } = useAuthContext();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/auth/login', 'POST', {
        email: email.trim(),
        password,
      });

      setToken(res.token);
      setUser(res.user);
      setContextToken(res.token);
      setContextUser(res.user);

      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/auth/register', 'POST', payload);
      navigate('/login');
      return { success: true };
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/auth/profile', 'GET', null, true);
      setUser(res.user);
      setContextUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    getProfile,
    loading,
    error,
  };
}
