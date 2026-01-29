import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthOperations } from '../../hooks/useAuth';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';

// Login Form component
// Replaces: login.html form + auth.js login handler

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthOperations();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 fade-up">
      <ErrorMessage message={error} />

      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        disabled={loading}
        aria-label="Email address"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
      />

      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        disabled={loading}
        aria-label="Password"
        aria-required="true"
        aria-invalid={error ? 'true' : 'false'}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? 'Logging in...' : 'Login'}
        className="w-full py-3 gradient-auth text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="text-white" />
            <span>Logging in...</span>
          </>
        ) : (
          'Login'
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">Not registered yet?</p>
        <Link 
          to="/register" 
          className="inline-block w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-lg font-bold border-2 border-green-400"
        >
          🚀 Create New Account
        </Link>
      </div>
    </form>
  );
}
