import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

// Valid routes that can be redirected to (security measure)
const VALID_REDIRECT_PATHS = [
  '/',
  '/find-hospitals',
  '/rare-cancers',
  '/second-opinion',
  '/teleconsultation',
  '/cost-calculator',
  '/find-oncologists',
  '/get-started',
];

/**
 * Validates and sanitizes redirect URL
 * Returns safe redirect path or null if invalid
 */
const getValidRedirectPath = (redirectParam) => {
  if (!redirectParam) return null;
  
  try {
    const decoded = decodeURIComponent(redirectParam);
    // Only allow relative paths (no external URLs)
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return null;
    }
    
    // Check if it's a valid route
    const path = decoded.split('?')[0]; // Remove query params for validation
    if (VALID_REDIRECT_PATHS.includes(path)) {
      return decoded;
    }
    
    // Allow paths that start with valid routes (for query params)
    if (VALID_REDIRECT_PATHS.some(valid => decoded.startsWith(valid))) {
      return decoded;
    }
    
    return null;
  } catch (e) {
    return null;
  }
};

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test backend connectivity on mount (optional, for debugging)
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/`, { timeout: 5000 });
        console.log('✅ Backend is reachable:', response.data);
      } catch (err) {
        console.warn('⚠️ Backend connectivity test failed:', err.message);
      }
    };
    testConnection();
  }, []);

  // Helper function to wake up Render backend (free tier services sleep)
  const wakeUpBackend = async () => {
    try {
      console.log('🌙 Backend might be sleeping, attempting to wake it up...');
      await axios.get(`${BACKEND_URL}/`, { timeout: 10000 });
      console.log('✅ Backend is awake');
    } catch (wakeError) {
      console.warn('⚠️ Wake-up request failed (non-fatal):', wakeError.message);
      // Continue anyway - the actual request might still work
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 LOGIN REQUEST START');
      console.log('📧 Email:', formData.email);
      console.log('🌐 Backend URL:', BACKEND_URL);
      console.log('🔗 API Endpoint:', `${API}/login`);
      
      // Wake up backend if it's sleeping (Render free tier)
      await wakeUpBackend();
      
      // Normalize email to lowercase (backend expects lowercase)
      const normalizedEmail = formData.email.toLowerCase().trim();
      
      const response = await axios.post(
        `${API}/login`,
        {
          email: normalizedEmail,
          password: formData.password
        },
        {
          timeout: 60000, // 60 second timeout (Render free tier can take 30-60s to wake up)
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ LOGIN SUCCESS');
      console.log('📦 Response:', response.data);
      console.log('📊 Status:', response.status);
      
      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error('Invalid response from server: missing token or user data');
      }
      
      console.log('🔑 Token received:', access_token.substring(0, 20) + '...');
      console.log('👤 User data:', user);
      
      // Update auth context (this will fetch profile and check profile_completed)
      try {
        console.log('🔄 Updating auth context...');
        await login(user, access_token);
        console.log('✅ Auth context updated');
      } catch (loginError) {
        console.error('⚠️ Error in login context (non-fatal):', loginError);
        // Continue anyway - token is valid, profile fetch can fail gracefully
      }
      
      // Get profile data to check completion status
      let profileCompleted = false;
      try {
        console.log('📋 Fetching profile data...');
        const profileResponse = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
          timeout: 10000
        });
        profileCompleted = profileResponse.data?.profile_completed || false;
        console.log('✅ Profile fetched, completed:', profileCompleted);
      } catch (profileError) {
        console.warn('⚠️ Could not fetch profile, using default:', profileError);
        // Use profile_completed from user object if available
        profileCompleted = user?.profile_completed || false;
        console.log('📋 Using profile_completed from user object:', profileCompleted);
      }
      
      if (onSuccess) {
        console.log('🎯 Calling onSuccess callback');
        onSuccess(user);
      } else {
        // If profile not complete, redirect to profile page
        if (!profileCompleted) {
          const redirectParam = searchParams.get('redirect');
          const redirectPath = redirectParam ? `/profile?redirect=${encodeURIComponent(redirectParam)}` : '/profile';
          console.log('➡️ Redirecting to profile:', redirectPath);
          navigate(redirectPath, { replace: true });
        } else {
          // Check for redirect query param
          const redirectParam = searchParams.get('redirect');
          const redirectPath = getValidRedirectPath(redirectParam);
          const finalPath = redirectPath || '/';
          console.log('➡️ Redirecting to:', finalPath);
          navigate(finalPath, { replace: true });
        }
      }
    } catch (err) {
      console.error('❌ LOGIN ERROR');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (err.response) {
        // Server responded with error
        console.error('📡 Server error response:', err.response.status, err.response.data);
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          errorMessage = data?.detail || 'Incorrect email or password. Please try again.';
        } else if (status === 400) {
          errorMessage = data?.detail || 'Invalid request. Please check your input.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.detail || data?.message || `Server error (${status}). Please try again.`;
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('📡 No response received from server');
        errorMessage = `Unable to connect to server at ${BACKEND_URL}. Please check your internet connection or try again later.`;
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        // Timeout error
        console.error('⏱️ Request timeout');
        errorMessage = 'Request timed out. The server may be slow. Please try again.';
      } else {
        // Error setting up request
        console.error('🔧 Request setup error:', err.message);
        errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      }
      
      console.error('💬 Final error message:', errorMessage);
      setError(errorMessage);
    } finally {
      // Always reset loading state
      console.log('🔄 Resetting loading state');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-[#0b0f1f]/95 border border-white/30 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white shadow-xl shadow-black/40 backdrop-blur">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">Welcome back to ByOnco</h2>
        <p className="text-sm sm:text-base text-white/90">Sign in to continue your cancer care journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="text-sm bg-red-500/30 border border-red-500/60 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center text-white/70">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pl-12 sm:pl-16 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center text-white/70">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pl-12 sm:pl-16 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-full px-4 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 border-2 border-purple-300/90 text-white font-bold shadow-[0_0_30px_rgba(139,92,246,0.7),0_0_60px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.9),0_0_80px_rgba(139,92,246,0.6)] hover:from-purple-400 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-white/90">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-base font-medium text-white hover:text-purple-300 underline underline-offset-2 transition"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}




