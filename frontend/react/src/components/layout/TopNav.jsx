import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Top Navigation Bar
// Replaces: dashboard.html header (lines 14-31) + dashboard.js navigation logic

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : 'User';
  const collegeName = user?.collegeName || '< College Name >';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', tab: 'overview' },
    { path: '/blogs', label: 'Blogs', tab: 'profile' },
    { path: '/resources', label: 'Resources', tab: 'resources' },
    { path: '/local-guide', label: 'Local Guide', tab: 'complaints' },
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
      <nav className="flex gap-2 md:gap-5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-2 md:px-3 py-2 rounded-full text-xs md:text-sm transition-all ${
              isActive(item.path)
                ? 'bg-white/35 font-semibold'
                : 'hover:bg-white/25'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
        <span className="hidden md:inline">{fullName}</span>
        <button
          onClick={handleLogout}
          className="px-3 md:px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all hover:transform hover:-translate-y-0.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
