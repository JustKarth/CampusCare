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
    { path: '/local-guide', label: 'Cultural Life', tab: 'complaints' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="h-[70px] gradient-nav flex items-center justify-between px-4 md:px-8 text-white shadow-glass backdrop-blur-glass">
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-4">
        <h2 className="text-lg md:text-2xl font-bold tracking-tight">CampusCare</h2>
        <span className="text-xs md:text-sm opacity-90 hidden sm:inline font-medium">{collegeName}</span>
      </div>

      {/* Center tabs */}
      <nav className="flex gap-2 md:gap-5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 md:px-4 py-2 rounded-card text-xs md:text-sm font-medium transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-white/25 shadow-lg'
                : 'hover:bg-white/15 hover:shadow-md'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
        <span className="hidden md:inline font-medium opacity-90">{fullName}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/20 rounded-card hover:bg-white/30 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
