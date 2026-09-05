import { useState } from 'react';
import { useAvatar } from '../../hooks/useAvatar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

// Avatar Selector component
// Allows users to select from available backend avatars
export function AvatarSelector() {
  const { availableAvatars, currentAvatar, loading, error, updateAvatar, getAvatarUrl } = useAvatar();
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
        <LoadingSpinner size="md" className="text-blue-600" />
        <span className="ml-2 text-gray-600">Loading avatars...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-1">Profile Avatar</h3>
        <p className="text-sm text-text-secondary">
          Choose an avatar to represent your profile. Images are loaded from the campus collection.
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Current Avatar Preview */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10"
        style={{ backgroundColor: '#0F172A' }}>
        <div className="text-sm font-semibold text-text-secondary">Current Avatar:</div>
        {currentAvatar ? (
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(currentAvatar)}
              alt="Current avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-md"
            />
            <span className="text-sm font-semibold text-text-primary">
              {availableAvatars.find(a => a.filename === currentAvatar)?.name || currentAvatar}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-2xl text-text-secondary">👤</span>
            </div>
            <span className="text-sm text-text-secondary">No avatar selected</span>
          </div>
        )}
      </div>

      {/* Avatar Selection Grid */}
      <div>
        <div className="text-sm font-semibold text-text-primary mb-3">Available Avatars:</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {availableAvatars.map((avatar) => (
            <div
              key={avatar.filename}
              className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                selectedAvatar === avatar.filename
                  ? 'border-primary shadow-lg shadow-sky-500/25 scale-105'
                  : 'border-white/15 hover:border-primary/60 hover:shadow-md'
              } ${updating ? 'pointer-events-none opacity-50' : ''}`}
              onClick={() => handleAvatarSelect(avatar.filename)}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-full h-24 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                <p className="text-white text-xs font-semibold text-center">{avatar.name}</p>
              </div>
              
              {/* Selection indicator */}
              {selectedAvatar === avatar.filename && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              
              {/* Loading overlay */}
              {updating && selectedAvatar === avatar.filename && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                  <LoadingSpinner size="sm" className="text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-text-secondary p-3.5 rounded-xl border border-white/10 flex items-center gap-2"
        style={{ backgroundColor: '#0F172A' }}>
        <span>⚡</span>
        <p>Click on any avatar to update your profile picture. Changes are saved automatically.</p>
      </div>
    </div>
  );
}
