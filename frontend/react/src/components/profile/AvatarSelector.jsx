import { useState } from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

// Avatar Selector component
// Allows users to select from available backend avatars
export function AvatarSelector() {
  const { availableAvatars, currentAvatar, loading, error, updateAvatar } = useAvatar();
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [updating, setUpdating] = useState(false);

  const handleAvatarSelect = async (avatarFilename) => {
    setSelectedAvatar(avatarFilename);
    setUpdating(true);
    
    const result = await updateAvatar(avatarFilename);
    
    if (!result.success) {
      // Revert selection on error
      setSelectedAvatar(currentAvatar);
    }
    
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" className="text-primary" />
        <span className="ml-2 text-text-secondary">Loading avatars...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Profile Avatar</h3>
        <p className="text-sm text-text-secondary mb-4">
          Choose an avatar to represent your profile. Images are loaded from the campus collection.
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Current Avatar Preview */}
      <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-white/10">
        <div className="text-sm font-medium text-text-primary">Current Avatar:</div>
        {currentAvatar ? (
          <div className="flex items-center gap-3">
            <img
              src={`http://localhost:5000/avatars/${currentAvatar}`}
              alt="Current avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-lg"
            />
            <span className="text-sm text-text-secondary">
              {availableAvatars.find(a => a.filename === currentAvatar)?.name || currentAvatar}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border-2 border-primary shadow-lg">
              <span className="text-2xl text-white">👤</span>
            </div>
            <span className="text-sm text-text-secondary">No avatar selected</span>
          </div>
        )}
      </div>

      {/* Avatar Selection Grid */}
      <div>
        <div className="text-sm font-medium text-text-primary mb-3">Available Avatars:</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {availableAvatars.map((avatar) => (
            <div
              key={avatar.filename}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedAvatar === avatar.filename
                  ? 'border-primary shadow-xl scale-105'
                  : 'border-white/20 hover:border-primary/50 hover:shadow-lg'
              } ${updating ? 'pointer-events-none opacity-50' : ''}`}
              onClick={() => handleAvatarSelect(avatar.filename)}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-full h-24 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-white text-xs font-medium text-center">{avatar.name}</p>
              </div>
              
              {/* Selection indicator */}
              {selectedAvatar === avatar.filename && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              
              {/* Loading overlay */}
              {updating && selectedAvatar === avatar.filename && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <LoadingSpinner size="sm" className="text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-text-secondary bg-primary/10 border border-primary/20 p-3 rounded-lg">
        <p>💡 Click on any avatar to update your profile picture. Changes are saved automatically.</p>
      </div>
    </div>
  );
}
