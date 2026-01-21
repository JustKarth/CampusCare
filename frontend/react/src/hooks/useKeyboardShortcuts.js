import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only activate shortcuts when not typing in inputs
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + K for search (focus search input)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Only authenticated shortcuts
      if (!isAuthenticated) return;

      // Ctrl/Cmd + D for dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // Ctrl/Cmd + B for blogs
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        navigate('/blogs');
      }

      // Ctrl/Cmd + P for profile
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        navigate('/profile');
      }

      // Ctrl/Cmd + R for resources
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        navigate('/resources');
      }

      // Ctrl/Cmd + L for local guide
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        navigate('/local-guide');
      }

      // Escape for logout (when not in modal/form)
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) {
        // Only logout on double escape
        if (e.repeat) {
          logout();
          navigate('/login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, logout, isAuthenticated]);
}
