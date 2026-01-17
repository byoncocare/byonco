// src/pages/AuthPage.jsx
// Stack Auth Authentication Page - Production Ready
// Non-blocking initialization with timeout
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@stackframe/react';
import { motion } from 'framer-motion';
import StackAuthErrorBoundary from '@/components/ErrorBoundary';
import { stackConfig, STACK_PROJECT_ID, STACK_PUBLISHABLE_KEY } from '@/config/stack';

// Log configuration on mount (non-blocking)
const logAuthConfig = () => {
  if (typeof window !== 'undefined') {
    console.log("[AUTH] origin", window.location.origin);
    console.log("[AUTH] stackProjectId present", Boolean(STACK_PROJECT_ID));
    console.log("[AUTH] stackKey present", Boolean(STACK_PUBLISHABLE_KEY));
    console.log("[AUTH] stackApiUrl", stackConfig.baseUrl);
  }
};

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

  // Log config on mount (non-blocking)
  useEffect(() => {
    logAuthConfig();
  }, []);

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

  // Render immediately - Stack Auth components handle their own initialization and errors
  // Error boundary will catch any connection errors from Stack Auth
  return (
    <StackAuthErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Custom styles for Stack Auth components to ensure visibility */}
          <style>{`
            /* Stack Auth component styling - ensure text is visible */
            [data-stack-auth] *,
            [data-stack-auth-root] *,
            .stack-auth-sign-in *,
            .stack-auth-sign-up * {
              color: #ffffff !important;
            }
            
            /* Stack Auth input fields */
            [data-stack-auth] input,
            [data-stack-auth-root] input,
            .stack-auth-sign-in input,
            .stack-auth-sign-up input {
              background-color: rgba(255, 255, 255, 0.1) !important;
              border-color: rgba(255, 255, 255, 0.3) !important;
              color: #ffffff !important;
            }
            
            [data-stack-auth] input::placeholder,
            [data-stack-auth-root] input::placeholder,
            .stack-auth-sign-in input::placeholder,
            .stack-auth-sign-up input::placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
            
            /* Stack Auth buttons */
            [data-stack-auth] button,
            [data-stack-auth-root] button,
            .stack-auth-sign-in button,
            .stack-auth-sign-up button {
              color: #ffffff !important;
            }
            
            /* Stack Auth text and labels */
            [data-stack-auth] label,
            [data-stack-auth-root] label,
            [data-stack-auth] p,
            [data-stack-auth-root] p,
            [data-stack-auth] span,
            [data-stack-auth-root] span,
            .stack-auth-sign-in label,
            .stack-auth-sign-up label,
            .stack-auth-sign-in p,
            .stack-auth-sign-up p,
            .stack-auth-sign-in span,
            .stack-auth-sign-up span {
              color: #ffffff !important;
            }
            
            /* Stack Auth links */
            [data-stack-auth] a,
            [data-stack-auth-root] a,
            .stack-auth-sign-in a,
            .stack-auth-sign-up a {
              color: #a78bfa !important;
            }
            
            [data-stack-auth] a:hover,
            [data-stack-auth-root] a:hover,
            .stack-auth-sign-in a:hover,
            .stack-auth-sign-up a:hover {
              color: #c4b5fd !important;
            }
            
            /* Stack Auth card/container background */
            [data-stack-auth] > div,
            [data-stack-auth-root] > div {
              background-color: rgba(15, 23, 42, 0.8) !important;
              border-color: rgba(255, 255, 255, 0.1) !important;
            }
          `}</style>
          
          {/* Render Stack Auth components immediately - they handle their own loading and errors */}
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
