import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useAuthOperations } from '../hooks/useAuth';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Dashboard Page
// Replaces: dashboard.html + dashboard.js

export function DashboardPage() {
  const { user: contextUser, setUser: setContextUser } = useAuth();
  const { getProfile } = useAuthOperations();
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
        // Use context user as fallback
        setUser(contextUser);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have graduationYear
    if (!user?.graduationYear) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h3 className="text-xl md:text-2xl mb-5 text-gray-800">Dashboard Overview</h3>
          <div className="card min-h-[200px] fade-in">
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Welcome back to CampusCare. Use the tabs above to explore blogs, resources, and local guide for your college.
            </p>
            {loading ? (
              <div className="mt-6 flex items-center justify-center py-8">
                <LoadingSpinner size="md" className="text-blue-600" />
              </div>
            ) : user ? (
              <div className="mt-6 space-y-3 border-t pt-4">
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">Name:</strong>{' '}
                  <span className="text-gray-600">{[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">Email:</strong>{' '}
                  <span className="text-gray-600">{user.email || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">College:</strong>{' '}
                  <span className="text-gray-600">{user.collegeName || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">Course:</strong>{' '}
                  <span className="text-gray-600">{user.courseName || 'N/A'}</span>
                </p>
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">Graduation Year:</strong>{' '}
                  <span className="text-gray-600">{user.graduationYear || 'N/A'}</span>
                </p>
                {user.regNo && (
                  <p className="text-sm md:text-base">
                    <strong className="text-gray-700">Registration Number:</strong>{' '}
                    <span className="text-gray-600">{user.regNo}</span>
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
