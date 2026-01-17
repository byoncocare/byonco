import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import secureAxios from '@/utils/security/secureAxios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

export default function ForgotPasswordForm({ onBack, onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      const response = await secureAxios.post(
        `${API}/forgot-password`,
        { email: normalizedEmail },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Password reset request sent:', response.data);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(normalizedEmail);
      }
    } catch (err) {
      console.error('❌ Password reset request error:', err);
      
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          errorMessage = data?.detail || 'Invalid email address.';
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
            Check Your Email
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6">
            If an account with <strong className="text-white">{email}</strong> exists, we've sent you a password reset link.
          </p>
          <p className="text-xs sm:text-sm text-white/70 mb-6">
            Please check your inbox and follow the instructions to reset your password. The link will expire in 1 hour.
          </p>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full bg-[#0b0f1f]/95 border border-white/30 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white shadow-xl shadow-black/40 backdrop-blur">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">Reset Password</h2>
        <p className="text-sm sm:text-base text-white/90">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="text-sm bg-red-500/30 border border-red-500/60 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email Address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center text-white/70">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-white/90 hover:text-purple-300 underline underline-offset-2 transition"
          >
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
