import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../config/api';

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
    { path: '/local-guide', label: 'Local Guide', icon: '📍' },
    { path: '/fare-analysis', label: 'Fares', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="h-[80px] gradient-nav flex items-center justify-between px-4 md:px-8 text-white shadow-2xl backdrop-blur-xl border-b border-white/10">
      {/* Left section: Website Logo + CampusCare & College Name */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 group" title="CampusCare Dashboard">
          <img
            src="/logos/appLogo.jpeg"
            alt="CampusCare Logo"
            className="w-11 h-11 md:w-13 md:h-13 rounded-2xl shadow-xl border border-white/30 object-cover group-hover:scale-105 transition-all p-0.5 bg-white/10 backdrop-blur-md"
            onError={(e) => {
              e.target.src = '/appLogo.jpeg';
            }}
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">CampusCare</h2>
            <p className="text-xs font-medium tracking-wide truncate max-w-[150px] sm:max-w-[220px] md:max-w-[300px] text-white/80">
              {collegeName}
            </p>
          </div>
        </Link>
      </div>

      {/* Center tabs */}
      <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar mx-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              isActive(item.path)
                ? 'bg-white/25 shadow-xl backdrop-blur-sm'
                : 'hover:bg-white/15 hover:shadow-lg'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Right section: Admin Console at end + User Profile + Logout */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {Boolean(user?.isAdmin) && (
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-300 hover:scale-105 shadow-md ${
              location.pathname.startsWith('/admin')
                ? 'bg-amber-500 text-black border-amber-300 shadow-amber-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
            }`}
            title="Administrator Moderation Console"
          >
            <span>🛡️</span>
            <span className="hidden md:inline">Admin Console</span>
          </Link>
        )}

        <Link
          to="/profile"
          title="View Profile"
          className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer border border-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${BACKEND_URL}${user.avatarUrl.startsWith('/') ? '' : '/'}${user.avatarUrl}`}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-sm font-bold">{fullName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className="text-xs font-medium text-white/80">
              {user?.isAdmin ? '👑 Admin' : user?.isModerator ? '⭐ Moderator' : 'Student'}
            </p>
          </div>
        </Link>

        {/* Mobile profile link */}
        <Link
          to="/profile"
          title="View Profile"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm"
        >
          <span>👤</span>
        </Link>

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
