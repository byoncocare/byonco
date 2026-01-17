// src/pages/AuthPage.jsx
// Stack Auth Authentication Page - Production Ready
// Completely replaced custom auth with Stack Auth
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@stackframe/react';
import { motion } from 'framer-motion';
import StackAuthErrorBoundary from '@/components/ErrorBoundary';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useUser();
  const redirect = searchParams.get('redirect');
  
  // Determine mode from URL or default to signin
  const urlMode = searchParams.get('mode');
  const [mode, setMode] = useState(urlMode === 'signup' ? 'signup' : 'signin');
  
  // Update mode when URL changes
  useEffect(() => {
    if (urlMode === 'signup') {
      setMode('signup');
    } else if (urlMode === 'signin' || !urlMode) {
      setMode('signin');
    }
  }, [urlMode]);

  // Handle redirect after successful authentication
  useEffect(() => {
    if (user) {
      // User is authenticated, redirect to intended page or home
      if (redirect) {
        try {
          const decodedRedirect = decodeURIComponent(redirect);
          // Security: Only allow relative paths (no external URLs)
          if (!decodedRedirect.startsWith('http://') && !decodedRedirect.startsWith('https://')) {
            navigate(decodedRedirect, { replace: true });
            return;
          }
        } catch (e) {
          console.warn('Invalid redirect URL:', e);
        }
      }
      // Default redirect to home if no redirect specified
      navigate('/', { replace: true });
    }
  }, [user, navigate, redirect]);

  // Build redirect URLs for Stack Auth components
  const signInRedirect = redirect ? `/authentication?redirect=${encodeURIComponent(redirect)}` : '/';
  const signUpRedirect = redirect ? `/authentication?redirect=${encodeURIComponent(redirect)}` : '/';

  // Use Stack Auth's built-in SignIn and SignUp components
  // These handle: email/password, OAuth, forgot-password, email verification, etc.
  // Wrapped in error boundary to catch connection errors
  return (
    <StackAuthErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {mode === 'signin' ? (
            <SignIn
              afterSignInUrl={signInRedirect}
              fullPage={false}
              signUpUrl={`/authentication?mode=signup${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`}
            />
          ) : (
            <SignUp
              afterSignUpUrl={signUpRedirect}
              fullPage={false}
              signInUrl={`/authentication?mode=signin${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`}
            />
          )}
        </motion.div>
      </div>
    </StackAuthErrorBoundary>
  );
}
