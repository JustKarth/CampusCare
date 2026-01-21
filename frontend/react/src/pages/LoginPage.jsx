import { LoginForm } from '../components/auth/LoginForm';

// Login Page
// Replaces: login.html + auth.js login handler

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-4">
      <h2 className="text-white text-2xl font-semibold mb-6">Login</h2>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <LoginForm />
      </div>
    </div>
  );
}
