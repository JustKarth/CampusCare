import { LoginForm } from '../components/auth/LoginForm';
import { useLocation } from 'react-router-dom';

// Login Page
// Replaces: login.html + auth.js login handler

export function LoginPage() {
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-auth p-4">
      {/* Brand Logo & Name */}
      <div className="flex flex-col items-center mb-6 text-center">
        <img
          src="/logos/appLogo.jpeg"
          alt="CampusCare Logo"
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-2xl border-2 border-white/40 object-cover mb-3 hover:scale-105 transition-transform p-0.5 bg-white/10 backdrop-blur-md"
          onError={(e) => {
            e.target.src = '/appLogo.jpeg';
          }}
        />
        <h1 className="text-white text-3xl font-extrabold tracking-tight">CampusCare</h1>
        <p className="text-white/75 text-sm mt-1">Student & Campus Life Portal</p>
      </div>

      {registrationSuccess && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center max-w-md w-full">
          Registration successful. Please log in to continue.
        </div>
      )}
      <div className="card-glass w-full max-w-md shadow-glass">
        <LoginForm />
      </div>
    </div>
  );
}
