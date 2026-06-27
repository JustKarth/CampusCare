import { LoginForm } from '../components/auth/LoginForm';

// Login Page
// Replaces: login.html + auth.js login handler

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-auth p-4">
      <h2 className="text-white text-2xl font-semibold mb-6 tracking-tight">Login</h2>
      <div className="card-glass w-full max-w-md shadow-glass">
        <LoginForm />
      </div>
    </div>
  );
}
