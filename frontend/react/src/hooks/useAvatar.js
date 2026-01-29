import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { getToken } from '../services/authStorage';

// Hook for avatar management
export function useAvatar() {
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // List of available avatars from backend
  const avatarOptions = [
    { name: 'Dragon', filename: 'Dragon.jpeg' },
    { name: 'Eagle', filename: 'Eagle.jpeg' },
    { name: 'Fox', filename: 'Fox.jpeg' },
    { name: 'Serpent', filename: 'Serpent.jpeg' },
    { name: 'Unicorn', filename: 'Unicorn.jpeg' }
  ];

  useEffect(() => {
    const loadAvatarData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user profile to see if avatar is set
        const token = getToken();
        if (token) {
          try {
            const profileRes = await apiRequest('/auth/profile', 'GET', null, true);
            setCurrentAvatar(profileRes.user.avatar || null);
          } catch (profileErr) {
            // Profile fetch failed, continue with default state
            console.warn('Could not fetch profile:', profileErr.message);
          }
        }

        // Set available avatars with full URLs
        const avatarsWithUrls = avatarOptions.map(avatar => ({
          ...avatar,
          url: `http://localhost:5000/avatars/${avatar.filename}`
        }));
        setAvailableAvatars(avatarsWithUrls);
      } catch (err) {
        setError(err.message || 'Failed to load avatars');
        console.error('Avatar loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvatarData();
  }, []);

  const updateAvatar = async (avatarFilename) => {
    try {
      setError(null);
      
      // Update avatar via API (assuming endpoint exists)
      await apiRequest('/auth/avatar', 'PUT', { avatar: avatarFilename }, true);
      
      // Update local state
      setCurrentAvatar(avatarFilename);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update avatar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getAvatarUrl = (avatarFilename) => {
    if (!avatarFilename) return null;
    const avatar = avatarOptions.find(a => a.filename === avatarFilename);
    return avatar ? `http://localhost:5000/avatars/${avatar.filename}` : null;
  };

  return {
    availableAvatars,
    currentAvatar,
    loading,
    error,
    updateAvatar,
    getAvatarUrl
  };
}
