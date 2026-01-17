import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import secureAxios from '@/utils/security/secureAxios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

export default function ResetPasswordForm({ token, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.');
      return;
    }

    setLoading(true);

    try {
      const response = await secureAxios.post(
        `${API}/reset-password`,
        {
          token: token,
          new_password: formData.password
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Password reset successful:', response.data);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/authentication?message=password_reset_success');
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Password reset error:', err);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          errorMessage = data?.detail || 'Invalid or expired reset token. Please request a new password reset link.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.detail || data?.message || `Error (${status}). Please try again.`;
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg w-full bg-[#0b0f1f]/95 border border-white/30 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white shadow-xl shadow-black/40 backdrop-blur">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-4">
            Password Reset Successful
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button
            onClick={() => navigate('/authentication')}
            className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full bg-[#0b0f1f]/95 border border-white/30 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white shadow-xl shadow-black/40 backdrop-blur">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">Set New Password</h2>
        <p className="text-sm sm:text-base text-white/90">
          Enter your new password below. Make sure it's at least 8 characters long.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="text-sm bg-red-500/30 border border-red-500/60 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white">
            New Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center text-white/70">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pl-12 sm:pl-16 pr-12 sm:pr-16 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 sm:right-4 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
          <p className="text-xs text-white/70">Must be at least 8 characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
            Confirm New Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center text-white/70">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 sm:px-4 sm:py-3 pl-12 sm:pl-16 pr-12 sm:pr-16 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 sm:right-4 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
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
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}
