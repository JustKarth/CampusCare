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
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/blogs', label: 'Blogs', icon: '✍️' },
    { path: '/resources', label: 'Resources', icon: '📖' },
    { path: '/local-guide', label: 'Cultural Life', icon: '🎭' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="h-[80px] gradient-nav flex items-center justify-between px-4 md:px-8 text-white shadow-2xl backdrop-blur-xl border-b border-white/10">
      {/* Left section */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <span className="text-xl">🎓</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">CampusCare</h2>
            <span className="text-xs opacity-80 hidden sm:inline font-medium tracking-wide">{collegeName}</span>
          </div>
        </div>
      </div>

      {/* Center tabs */}
      <nav className="flex gap-1 md:gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              isActive(item.path)
                ? 'bg-white/25 shadow-xl backdrop-blur-sm'
                : 'hover:bg-white/15 hover:shadow-lg'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center">
            <span className="text-sm font-bold">{fullName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className="text-xs opacity-80">Student</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 md:px-5 py-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-xs md:text-sm backdrop-blur-sm border border-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
