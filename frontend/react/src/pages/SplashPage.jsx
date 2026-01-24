import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Splash Page component
// Shows for 7-8 seconds after successful login
export function SplashPage() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 7 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 7000);

    // Navigate after 7.5 seconds (allowing for fade animation)
    const navigateTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 7500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        {/* Logo placeholder - using emoji since appLogo not found */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🎓</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          CampusCare
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8">
          Your Campus Companion
        </p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        
        <p className="text-white/80 mt-6 text-sm md:text-base">
          Preparing your dashboard...
        </p>
      </div>
    </div>
  );
}
