import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuthOperations } from '../hooks/useAuth';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { useAvatar } from '../hooks/useAvatar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AvatarSelector } from '../components/profile/AvatarSelector';
import { SEO } from '../components/common/SEO';

// Profile Page
// Replaces: profile.html + profile.js

export function ProfilePage() {
  const { user: contextUser } = useAuthContext();
  const { getProfile } = useAuthOperations();
  const { currentAvatar, getAvatarUrl, availableAvatars } = useAvatar();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getProfile();
      if (result.success) {
        setUser(result.user);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const fullName = user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')
    : '';

  const avatarUrl = currentAvatar ? getAvatarUrl(currentAvatar) : (availableAvatars.length > 0 ? availableAvatars[0].url : null);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="My Profile" 
        description="View and edit your profile information"
        keywords="profile, account, settings"
      />
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="card flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="space-y-8 fade-in">
              {/* Profile Header Card */}
              <div className="card-glass fade-up">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-2xl"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border-4 border-primary shadow-2xl">
                      <span className="text-5xl text-white font-bold">
                        {[user?.firstName, user?.lastName].filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-text-primary mb-2">{fullName || 'User'}</h2>
                    <p className="text-text-secondary text-lg mb-4">{user?.email || 'N/A'}</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="badge text-sm">Student</span>
                      {user?.graduationYear && (
                        <span className="badge text-sm">Class of {user.graduationYear}</span>
                      )}
                      {user?.collegeName && (
                        <span className="badge text-sm">{user.collegeName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Selection Section */}
              <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
                <AvatarSelector />
              </div>

              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-base font-semibold text-text-primary">{fullName || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-base font-semibold text-text-primary">{user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="card fade-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    Academic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">College</p>
                      <p className="text-base font-semibold text-text-primary">{user?.collegeName || user?.collegeId || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Course</p>
                      <p className="text-base font-semibold text-text-primary">{user?.courseName || user?.courseId || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                      <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Graduation Year</p>
                      <p className="text-base font-semibold text-text-primary">{user?.graduationYear || 'N/A'}</p>
                    </div>
                    {user?.regNo && (
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Registration Number</p>
                        <p className="text-base font-semibold text-text-primary">{user.regNo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
