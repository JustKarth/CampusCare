import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { getToken } from '../services/authStorage';
import { BACKEND_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

// Hook for avatar management
export function useAvatar() {
  const { user, setUser } = useAuth();
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackAvatars = [
    { name: 'Dragon', filename: 'Dragon.jpeg' },
    { name: 'Eagle', filename: 'Eagle.jpeg' },
    { name: 'Fox', filename: 'Fox.jpeg' },
    { name: 'Serpent', filename: 'Serpent.jpeg' },
    { name: 'Unicorn', filename: 'Unicorn.jpeg' }
  ];

  const getFullUrl = (urlOrFilename) => {
    if (!urlOrFilename) return null;
    if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://')) {
      return urlOrFilename;
    }
    const cleanPath = urlOrFilename.startsWith('/') ? urlOrFilename : `/avatars/${urlOrFilename}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  useEffect(() => {
    const loadAvatarData = async () => {
      try {
        setLoading(true);
        setError(null);

        let avatarsList = [];
        try {
          const res = await apiRequest('/avatars', 'GET');
          if (res.success && Array.isArray(res.avatars)) {
            avatarsList = res.avatars.map((a) => ({
              ...a,
              url: getFullUrl(a.url || a.filename)
            }));
          }
        } catch {
          avatarsList = fallbackAvatars.map((a) => ({
            ...a,
            url: `${BACKEND_URL}/avatars/${a.filename}`
          }));
        }

        // Deduplicate avatars by filename
        const uniqueAvatars = Array.from(
          new Map(avatarsList.map((a) => [a.filename.toLowerCase(), a])).values()
        );

        setAvailableAvatars(uniqueAvatars);

        // Get current user profile
        const token = getToken();
        if (token) {
          try {
            const profileRes = await apiRequest('/auth/profile', 'GET', null, true);
            const userAvatar = profileRes.user?.avatarUrl || profileRes.user?.avatar || null;
            if (userAvatar) {
              const filename = userAvatar.replace(/^\/?avatars\//, '');
              setCurrentAvatar(filename);
            }
          } catch (profileErr) {
            console.warn('Could not fetch profile:', profileErr.message);
            if (user?.avatarUrl) {
              setCurrentAvatar(user.avatarUrl.replace(/^\/?avatars\//, ''));
            }
          }
        }
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

      const res = await apiRequest('/auth/avatar', 'PUT', { avatar: avatarFilename }, true);

      setCurrentAvatar(avatarFilename);

      if (res.user && setUser) {
        setUser({
          ...user,
          ...res.user
        });
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update avatar';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getAvatarUrl = (avatarFilename) => {
    if (!avatarFilename) return null;
    return getFullUrl(avatarFilename);
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
