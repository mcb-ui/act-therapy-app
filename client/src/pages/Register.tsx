import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppToast } from '../contexts/ToastContext';
import { getApiErrorMessage } from '../lib/api';

export default function Register() {
  const { register } = useAuth();
  const { success } = useAppToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      success('Account created. Start with one small step today.');
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(31,137,150,0.10),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(68,37,103,0.10),_transparent_28%),linear-gradient(180deg,#fcfafb_0%,#f5f2f4_100%)] p-4">
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-electric-blue/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-midnight-purple/10 blur-3xl" />

      <div className="card relative z-10 w-full max-w-md animate-slide-in-up border-brand-pink/40">
        <div className="mb-8 text-center">
          <img src="/logos/logo.png" alt="Dr. MCB Logo" className="mx-auto mb-5 h-16 w-auto" />
          <p className="font-subheader text-[10px] uppercase tracking-[0.22em] text-electric-blue">
            Dr. MCB Practice Space
          </p>
          <h1 className="mb-3 mt-3 text-3xl font-header text-midnight-purple md:text-4xl">Create Your Account</h1>
          <p className="font-body text-[#4e3f5e]">Start with one grounded step and build from there.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 rounded-xl border border-inferno-red/35 bg-inferno-red/5 px-4 py-3 font-body text-inferno-red animate-slide-in-right">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your Name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              minLength={8}
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-xs font-body text-[#8c8199]">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-6 w-full shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 border-t border-brand-pink/35 pt-6">
          <p className="text-center font-body text-[#4e3f5e]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-electric-blue transition-colors hover:text-inferno-red underline decoration-2 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
