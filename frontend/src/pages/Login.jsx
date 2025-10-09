import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Simple frontend validation
    if (!email.includes('@') || password.length < 8) {
      setError('Please enter valid details (Email with @, Password min 8 chars)');
      return;
    }

    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store token for future protected routes
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccessMessage('Login successful! Redirecting...');
      setEmail('');
      setPassword('');

      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error(err);
      setError('Error while connecting to the Backend Server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="bg-surface-dark rounded-lg shadow-2xl p-8 w-full max-w-md border border-border-dark">
        <h2 className="text-3xl font-extrabold text-text-primary-dark mb-8 text-center">
          Welcome Back!
        </h2>

        {error && (
          <p className="bg-error text-text-primary-dark p-3 rounded-md mb-6 text-center text-sm">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="bg-success text-text-primary-dark p-3 rounded-md mb-6 text-center text-sm">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-bg-dark text-text-primary-dark border border-border-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 placeholder-text-secondary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-bg-dark text-text-primary-dark border border-border-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 placeholder-text-secondary"
              required
              minLength="8"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-text-primary-dark py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-text-primary-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-8">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;