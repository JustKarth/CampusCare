import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../services/apiClient';

// Hook for fetching home page content from database with rotating backgrounds
export function useHomeContent() {
  const [content, setContent] = useState({
    backgroundImages: [],
    currentBackgroundIndex: 0,
    overlayText: '',
    title: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch home content from database
        const response = await apiRequest('/home/content');
        
        const backgroundImages = response.backgroundImages || [];
        
        setContent({
          backgroundImages,
          currentBackgroundIndex: 0,
          overlayText: response.overlayText || '',
          title: response.title || 'Welcome to CampusCare'
        });
      } catch (err) {
        setError(err.message || 'Failed to load home content');
        console.error('Home content fetch error:', err);
        // Set fallback content
        setContent({
          backgroundImages: [],
          currentBackgroundIndex: 0,
          overlayText: 'Welcome back to CampusCare. Your complete campus companion.',
          title: 'Dashboard'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  useEffect(() => {
    // Set up periodic background rotation
    if (content.backgroundImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setContent(prev => ({
          ...prev,
          currentBackgroundIndex: (prev.currentBackgroundIndex + 1) % prev.backgroundImages.length
        }));
      }, 5000); // Change every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [content.backgroundImages.length]);

  const getCurrentBackgroundImage = () => {
    return content.backgroundImages[content.currentBackgroundIndex] || '';
  };

  return {
    content,
    loading,
    error,
    getCurrentBackgroundImage,
    setCurrentBackgroundIndex: (index) => {
      setContent(prev => ({
        ...prev,
        currentBackgroundIndex: index % prev.backgroundImages.length
      }));
    }
  };
}
