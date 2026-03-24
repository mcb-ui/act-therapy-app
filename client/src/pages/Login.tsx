import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

// Improvement #9: Use centralized API client
// Improvement #19: Password visibility toggle
// Improvement #22: Use AuthContext
// Improvement #30: Typed error handling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-midnight-purple opacity-5 rounded-full -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-electric-blue opacity-5 rounded-full -mr-48 -mb-48"></div>

      <div className="card max-w-md w-full animate-slide-in-up shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-midnight-purple rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-bounce-subtle">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-header text-midnight-purple mb-2">Welcome Back</h1>
          <p className="text-gray-600 font-body">Sign in to continue your ACT journey</p>
        </div>

        {error && (
          <div className="bg-white border-2 border-inferno-red text-inferno-red px-4 py-3 rounded-lg mb-4 font-body animate-slide-in-right flex items-center space-x-2" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-subheader text-gray-700 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-subheader text-gray-700 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <p className="text-center text-gray-600 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-electric-blue font-semibold hover:text-midnight-purple transition-colors underline decoration-2 underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
