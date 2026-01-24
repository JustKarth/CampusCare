import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAvatar } from '../../hooks/useAvatar';

// Profile Dropdown component
// Positioned in top-right corner with profile info and logout
export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { currentAvatar, getAvatarUrl } = useAvatar();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : 'User';
  const avatarUrl = getAvatarUrl(currentAvatar);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all hover:transform hover:-translate-y-0.5 text-white"
        title="Profile"
      >
        {/* Avatar or fallback */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
          />
        ) : (
          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
        )}
        <span className="hidden md:inline text-xs md:text-sm">{fullName}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Profile info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{fullName}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email || 'N/A'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.collegeName || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Course:</span>
                <span className="text-gray-900 font-medium">{user?.courseName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Graduation:</span>
                <span className="text-gray-900 font-medium">{user?.graduationYear || 'N/A'}</span>
              </div>
              {user?.regNo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reg No:</span>
                  <span className="text-gray-900 font-medium">{user.regNo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <Link
              to="/profile"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              📋 View Full Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
