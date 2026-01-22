import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken } from '../services/authStorage';

// Auth Context for global auth state
// Replaces: localStorage reads throughout the app

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const storedUser = getUser();
    const storedToken = getToken();
    
    setUserState(storedUser);
    setTokenState(storedToken);
    setLoading(false);
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.collegeName) {
        localStorage.setItem('collegeName', userData.collegeName);
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('collegeName');
    }
  };

  const setAuthToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('collegeName');
  };

  const value = {
    user,
    token,
    setUser,
    setToken: setAuthToken,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
