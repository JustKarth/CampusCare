import { LoginForm } from '../components/auth/LoginForm';
import { useLocation } from 'react-router-dom';

// Login Page
// Replaces: login.html + auth.js login handler

export function LoginPage() {
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-auth p-4">
      <h2 className="text-white text-2xl font-semibold mb-6 tracking-tight">Login</h2>
      {registrationSuccess && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">
          Registration successful. Please log in to continue.
        </div>
      )}
      <div className="card-glass w-full max-w-md shadow-glass">
        <LoginForm />
      </div>
    </div>
  );
}
