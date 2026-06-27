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
        className="input-field"
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
        className="input-field"
      />

      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? 'Logging in...' : 'Login'}
        className="btn-primary"
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

      <p className="text-center text-text-secondary text-sm">
        Not registered?{' '}
        <Link to="/register" className="text-primary font-semibold hover:text-primary-light transition-colors">
          Register here
        </Link>
      </p>
    </form>
  );
}
