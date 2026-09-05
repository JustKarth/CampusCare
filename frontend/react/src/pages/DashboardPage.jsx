import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useAuthOperations } from '../hooks/useAuth';
import { useAvatar } from '../hooks/useAvatar';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CollegeLogo } from '../components/common/CollegeLogo';

// Dashboard Page
// Replaces: dashboard.html + dashboard.js

export function DashboardPage() {
  const navigate = useNavigate();
  const { user: contextUser, setUser: setContextUser } = useAuth();
  const { getProfile } = useAuthOperations();
  const { currentAvatar, getAvatarUrl, availableAvatars } = useAvatar();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(false);

  // Fetch full profile data on mount to get graduationYear and other details
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await getProfile();
        if (result.success && result.user) {
          setUser(result.user);
          setContextUser(result.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setUser(contextUser);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.graduationYear) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine avatar URL - use user's avatar or default to first available
  const avatarUrl = currentAvatar ? getAvatarUrl(currentAvatar) : (availableAvatars.length > 0 ? availableAvatars[0].url : null);

  // Handle image error fallback
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Dashboard" 
        description="View your campus dashboard and access all CampusCare features"
        keywords="dashboard, campus, student"
      />
      <TopNav />
      <main id="main-content" className="flex-1 p-6 md:p-10 fade-in" tabIndex={-1}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* Profile Section */}
              <div 
                className="card-glass fade-up cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate('/profile')}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-xl"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border-4 border-primary shadow-xl">
                      <span className="text-3xl text-white font-bold">
                        {[user.firstName, user.lastName].filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-text-primary mb-1">
                      {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ') || 'User'}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">{user.email || 'N/A'}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="badge">Student</span>
                      {user.graduationYear && (
                        <span className="badge">Class of {user.graduationYear}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    className="card fade-up hover:scale-105 transition-transform cursor-pointer" 
                    style={{ animationDelay: '0.1s' }}
                    onClick={() => navigate('/blogs')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">✍️</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-text-primary">Blogs</h5>
                        <p className="text-sm text-text-secondary">Read & Share</p>
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-xl">→</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="card fade-up hover:scale-105 transition-transform cursor-pointer" 
                    style={{ animationDelay: '0.2s' }}
                    onClick={() => navigate('/resources')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">📖</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-text-primary">Resources</h5>
                        <p className="text-sm text-text-secondary">Study Materials</p>
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-xl">→</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="card fade-up hover:scale-105 transition-transform cursor-pointer" 
                    style={{ animationDelay: '0.3s' }}
                    onClick={() => navigate('/local-guide')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-text-primary">Local Guide</h5>
                        <p className="text-sm text-text-secondary">Campus Spots</p>
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-xl">→</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="card fade-up hover:scale-105 transition-transform cursor-pointer" 
                    style={{ animationDelay: '0.4s' }}
                    onClick={() => navigate('/fare-analysis')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-text-primary">Fare Analysis</h5>
                        <p className="text-sm text-text-secondary">Transit Rates</p>
                      </div>
                      <div className="text-text-secondary">
                        <span className="text-xl">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-4">Academic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card fade-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center gap-3.5">
                      <CollegeLogo
                        collegeId={user.collegeId}
                        collegeName={user.collegeName}
                        emailDomain={user.email}
                        size="lg"
                        className="w-12 h-12 bg-white p-1 rounded-xl shadow-md border border-white/20 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-text-secondary uppercase tracking-wide">College</p>
                        <p className="font-semibold text-text-primary text-sm line-clamp-2">{user.collegeName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-xl">📚</span>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wide">Course</p>
                        <p className="font-semibold text-text-primary text-sm">{user.courseName || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card fade-up" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-xl">🎓</span>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary uppercase tracking-wide">Graduation</p>
                        <p className="font-semibold text-text-primary text-sm">{user.graduationYear || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {user.regNo && (
                    <div className="card fade-up" style={{ animationDelay: '0.6s' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-xl">🆔</span>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wide">Reg. No.</p>
                          <p className="font-semibold text-text-primary text-sm">{user.regNo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
