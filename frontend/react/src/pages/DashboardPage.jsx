import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/common/SEO';

// Dashboard Page
// Replaces: dashboard.html + dashboard.js

export function DashboardPage() {
  const { user } = useAuth();

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
            {user && (
              <div className="mt-6 space-y-3 border-t pt-4">
                <p className="text-sm md:text-base">
                  <strong className="text-gray-700">Name:</strong>{' '}
                  <span className="text-gray-600">{[user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
