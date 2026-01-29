import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { ProfileDropdown } from './ProfileDropdown';

// Top Navigation Bar
// Replaces: dashboard.html header (lines 14-31) + dashboard.js navigation logic

export function TopNav() {
  const location = useLocation();
  const { user } = useAuth();

  const collegeName = user?.collegeName || '< College Name >';

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠', tab: 'overview' },
    { path: '/blogs', label: 'Blogs', icon: '📝', tab: 'profile' },
    { path: '/resources', label: 'Resources', icon: '📚', tab: 'resources' },
    { path: '/local-guide', label: 'Local Guide', icon: '📍', tab: 'complaints' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="h-[70px] gradient-nav flex items-center justify-between px-4 md:px-8 text-white shadow-lg">
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-4">
        <h2 className="text-lg md:text-2xl font-bold">CampusCare</h2>
        <span className="text-xs md:text-sm opacity-90 hidden sm:inline">{collegeName}</span>
      </div>

      {/* Center tabs */}
      <nav className="flex gap-1 md:gap-2">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              to={item.path}
              className={`group relative px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition-all flex items-center gap-2 ${
                isActive(item.path)
                  ? 'bg-white/35 font-semibold'
                  : 'hover:bg-white/25'
              }`}
              title={item.label}
            >
              <span className="text-lg md:text-base">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
              
              {/* Tooltip for mobile */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none md:hidden">
                {item.label}
              </div>
            </Link>
            {/* Divider */}
            {index < navItems.length - 1 && (
              <div className="w-px h-6 bg-white/20 self-center"></div>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right section - Profile Dropdown */}
      <ProfileDropdown />
    </header>
  );
}
