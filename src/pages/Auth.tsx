import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

const Auth: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState('job_seeker');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Safely access auth context
  const authContext = useAuth();
  const { login } = authContext || {};
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleTab = (tab: 'login' | 'register') => {
    setTab(tab);
    setError('');
  };

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 'register') {
        // Validation
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (!form.firstName.trim() || !form.lastName.trim()) {
          throw new Error('First name and last name are required');
        }

        // Register user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            role,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            initials: getInitials(form.firstName.trim(), form.lastName.trim()),
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Auto-login after registration
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Login failed');
        }

        if (login && loginData.access_token) {
          await login(loginData.access_token);
          navigate('/');
        } else {
          throw new Error('Authentication service unavailable');
        }
      } else {
        // Login user
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        if (login && data.access_token) {
          await login(data.access_token);
          navigate('/');
        } else {
          throw new Error('Authentication service unavailable');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-yellow-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl mx-auto p-8 md:p-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-600 rounded-xl p-3 mb-3 flex items-center justify-center shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome to PATHMATCH</h1>
          <p className="text-gray-500 text-sm">Sign in to your account or create a new one</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex w-full mb-8 rounded-lg overflow-hidden border border-gray-200">
          <button
            className={`flex-1 py-2 text-center text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${tab === 'login' ? 'bg-red-100 text-red-700 shadow-inner' : 'bg-white text-gray-500'}`}
            onClick={() => handleTab('login')}
            tabIndex={0}
            aria-selected={tab === 'login'}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${tab === 'register' ? 'bg-red-100 text-red-700 shadow-inner' : 'bg-white text-gray-500'}`}
            onClick={() => handleTab('register')}
            tabIndex={0}
            aria-selected={tab === 'register'}
          >
            Sign Up
          </button>
        </div>
        
        {/* Form */}
        <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
          {tab === 'register' && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <select
                name="role"
                className="w-full mb-4 rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                value={role}
                onChange={handleChange}
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-6.364A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-6.364-2.364" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
              )}
            </button>
          </div>
          {tab === 'register' && (
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-6.364A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-6.364-2.364" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                )}
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white mt-2 transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={loading}
          >
            {loading 
              ? (tab === 'login' ? 'Signing In...' : 'Creating Account...') 
              : (tab === 'login' ? 'Sign In' : 'Create Account')
            }
          </button>
          {error && (
            <div className="w-full mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </form>
        
        {tab === 'login' && (
          <div className="w-full text-center mt-4">
            <Link to="#" className="text-sm text-red-600 hover:underline">Forgot your password?</Link>
          </div>
        )}
        
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        
        <div className="w-full text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link to="#" className="text-red-600 hover:underline">Terms of Service</Link> and{' '}
          <Link to="#" className="text-red-600 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth; 