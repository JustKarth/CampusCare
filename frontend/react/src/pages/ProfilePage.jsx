import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { AvatarSelector } from '../components/profile/AvatarSelector';
import { useAuthOperations } from '../hooks/useAuth';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

// Profile Page
// Replaces: profile.html + profile.js

export function ProfilePage() {
  const { user: contextUser } = useAuthContext();
  const { getProfile } = useAuthOperations();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl mb-6">My Profile</h2>
          
          {loading ? (
            <div className="card flex items-center justify-center min-h-[200px]">
              <LoadingSpinner size="lg" className="text-blue-600" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="space-y-6 fade-in">
              {/* Avatar Selection Section */}
              <div className="card">
                <AvatarSelector />
              </div>
              
              {/* Profile Information Section */}
              <div className="card space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">Name:</strong>{' '}
                    <span className="text-gray-600">{fullName || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">Email:</strong>{' '}
                    <span className="text-gray-600">{user?.email || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">College:</strong>{' '}
                    <span className="text-gray-600">{user?.collegeName || user?.collegeId || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">Course:</strong>{' '}
                    <span className="text-gray-600">{user?.courseName || user?.courseId || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">Graduation Year:</strong>{' '}
                    <span className="text-gray-600">{user?.graduationYear || 'N/A'}</span>
                  </p>
                  {user?.regNo && (
                    <p className="text-sm md:text-base">
                      <strong className="text-gray-700">Registration Number:</strong>{' '}
                      <span className="text-gray-600">{user.regNo}</span>
                    </p>
                  )}
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
