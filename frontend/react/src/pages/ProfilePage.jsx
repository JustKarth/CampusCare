import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
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
          <h2 className="text-xl md:text-2xl mb-6 text-text-primary font-semibold">My Profile</h2>
          
          {loading ? (
            <div className="card flex items-center justify-center min-h-[200px]">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="card space-y-4 fade-in">
              <div className="space-y-3">
                <p className="text-sm md:text-base">
                  <strong className="text-text-primary">Name:</strong>{' '}
                  <span className="text-text-secondary">{fullName || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-text-primary">Email:</strong>{' '}
                  <span className="text-text-secondary">{user?.email || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-text-primary">College:</strong>{' '}
                  <span className="text-text-secondary">{user?.collegeName || user?.collegeId || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-text-primary">Course:</strong>{' '}
                  <span className="text-text-secondary">{user?.courseName || user?.courseId || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-text-primary">Graduation Year:</strong>{' '}
                  <span className="text-text-secondary">{user?.graduationYear || 'N/A'}</span>
                </p>
                {user?.regNo && (
                  <p className="text-sm md:text-base">
                    <strong className="text-text-primary">Registration Number:</strong>{' '}
                    <span className="text-text-secondary">{user.regNo}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
