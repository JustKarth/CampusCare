import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useAuthOperations } from '../hooks/useAuth';
import { useHomeContent } from '../hooks/useHomeContent';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Dashboard Page
// Replaces: dashboard.html + dashboard.js

export function DashboardPage() {
  const { user: contextUser, setUser: setContextUser } = useAuth();
  const { getProfile } = useAuthOperations();
  const { content: homeContent, loading: contentLoading, getCurrentBackgroundImage, setCurrentBackgroundIndex } = useHomeContent();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(false);
  const currentBackgroundImage = getCurrentBackgroundImage();

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
        title={homeContent.title || 'Dashboard'} 
        description="View your campus dashboard and access all CampusCare features"
        keywords="dashboard, campus, student"
      />
      <TopNav />
      <main 
        id="main-content" 
        className={`flex-1 relative fade-in ${currentBackgroundImage ? 'min-h-[500px]' : 'p-6 md:p-10'}`} 
        tabIndex={-1}
        style={{
          backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        {/* Overlay for better text readability */}
        {currentBackgroundImage && (
          <div className="absolute inset-0 bg-black/50"></div>
        )}
        
        {/* Background indicators */}
        {homeContent.backgroundImages.length > 1 && currentBackgroundImage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {homeContent.backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  // Manual navigation to specific background
                  setCurrentBackgroundIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === homeContent.currentBackgroundIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                title={`Background ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        <div className={`relative z-10 ${currentBackgroundImage ? 'flex items-center justify-center min-h-[500px]' : 'max-w-6xl mx-auto'}`}>
          <div className={`${currentBackgroundImage ? 'text-center text-white' : ''}`}>
            {contentLoading ? (
              <div className="py-8">
                <LoadingSpinner size="md" className="text-blue-600" />
              </div>
            ) : (
              <>
                {homeContent.overlayText && (
                  <div className={`mb-8 ${currentBackgroundImage ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl mb-5 text-gray-800'}`}>
                    {homeContent.overlayText}
                  </div>
                )}
                
                {!currentBackgroundImage && (
                  <h3 className="text-xl md:text-2xl mb-5 text-gray-800">Dashboard Overview</h3>
                )}
              </>
            )}
            
            <div className={`card min-h-[200px] fade-in ${currentBackgroundImage ? 'bg-white/10 backdrop-blur-sm text-white' : ''}`}>
              {!homeContent.overlayText && !contentLoading && (
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Welcome back to CampusCare. Use the tabs above to explore blogs, resources, and local guide for your college.
                </p>
              )}
              
              {loading ? (
                <div className="mt-6 flex items-center justify-center py-8">
                  <LoadingSpinner size="md" className={currentBackgroundImage ? "text-white" : "text-blue-600"} />
                </div>
              ) : user ? (
                <div className="mt-6 space-y-3 border-t pt-4">
                  <p className="text-sm md:text-base">
                    <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>Name:</strong>{' '}
                    <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>Email:</strong>{' '}
                    <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{user.email || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>College:</strong>{' '}
                    <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{user.collegeName || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>Course:</strong>{' '}
                    <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{user.courseName || 'N/A'}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>Graduation Year:</strong>{' '}
                    <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{user.graduationYear || 'N/A'}</span>
                  </p>
                  {user.regNo && (
                    <p className="text-sm md:text-base">
                      <strong className={currentBackgroundImage ? "text-gray-200" : "text-gray-700"}>Registration Number:</strong>{' '}
                      <span className={currentBackgroundImage ? "text-gray-100" : "text-gray-600"}>{user.regNo}</span>
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
