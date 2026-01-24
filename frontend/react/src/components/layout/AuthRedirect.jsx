import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Auth Redirect component
// Redirects based on authentication status
export function AuthRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
