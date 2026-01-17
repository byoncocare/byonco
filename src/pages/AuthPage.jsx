// src/pages/AuthPage.jsx
// Stack Auth Authentication Page - Production Ready
// Non-blocking initialization with timeout
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@stackframe/react';
import { motion } from 'framer-motion';
import StackAuthErrorBoundary from '@/components/ErrorBoundary';
import { stackConfig, STACK_PROJECT_ID, STACK_PUBLISHABLE_KEY } from '@/config/stack';

// Non-blocking connection check with timeout
const checkStackAuthConnection = async () => {
  if (typeof window === 'undefined') return;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    const response = await fetch(`${stackConfig.baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log("[AUTH] ✅ Stack Auth connection successful");
    } else {
      console.warn("[AUTH] ⚠️ Stack Auth connection check returned:", response.status, response.statusText);
      console.warn("[AUTH] Request URL:", `${stackConfig.baseUrl}/health`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.warn("[AUTH] ⚠️ Stack Auth connection check timed out after 5s");
    } else {
      console.warn("[AUTH] ⚠️ Stack Auth connection check failed:", error.message);
      console.warn("[AUTH] Request URL:", `${stackConfig.baseUrl}/health`);
      console.warn("[AUTH] Error type:", error.name);
    }
  }
};

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
    console.log('[AuthPage] URL mode changed:', urlMode);
    if (urlMode === 'signup') {
      console.log('[AuthPage] Switching to signup mode');
      setMode('signup');
    } else if (urlMode === 'signin' || !urlMode) {
      console.log('[AuthPage] Switching to signin mode');
      setMode('signin');
    }
  }, [urlMode]);
  
  // Debug: Log current mode
  useEffect(() => {
    console.log('[AuthPage] Current mode:', mode);
    console.log('[AuthPage] URL mode param:', urlMode);
  }, [mode, urlMode]);

  // Log config on mount (non-blocking)
  useEffect(() => {
    logAuthConfig();
    // Non-blocking connection check in background (doesn't block render)
    checkStackAuthConnection();
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Custom styles for Stack Auth components - purple theme on white background */}
          <style>{`
            /* Stack Auth component styling - purple text on white background */
            [data-stack-auth] *,
            [data-stack-auth-root] *,
            .stack-auth-sign-in *,
            .stack-auth-sign-up *,
            [class*="stack-auth"] * {
              color: #7c3aed !important;
            }
            
            /* Stack Auth headings and titles - darker purple */
            [data-stack-auth] h1,
            [data-stack-auth] h2,
            [data-stack-auth] h3,
            [data-stack-auth-root] h1,
            [data-stack-auth-root] h2,
            [data-stack-auth-root] h3,
            .stack-auth-sign-in h1,
            .stack-auth-sign-in h2,
            .stack-auth-sign-in h3,
            .stack-auth-sign-up h1,
            .stack-auth-sign-up h2,
            .stack-auth-sign-up h3 {
              color: #6d28d9 !important;
            }
            
            /* Stack Auth input fields - white background with purple border */
            [data-stack-auth] input,
            [data-stack-auth-root] input,
            .stack-auth-sign-in input,
            .stack-auth-sign-up input {
              background-color: #ffffff !important;
              border-color: #a78bfa !important;
              border-width: 1px !important;
              color: #1f2937 !important;
            }
            
            [data-stack-auth] input:focus,
            [data-stack-auth-root] input:focus,
            .stack-auth-sign-in input:focus,
            .stack-auth-sign-up input:focus {
              border-color: #7c3aed !important;
              outline-color: #7c3aed !important;
              box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
            }
            
            [data-stack-auth] input::placeholder,
            [data-stack-auth-root] input::placeholder,
            .stack-auth-sign-in input::placeholder,
            .stack-auth-sign-up input::placeholder {
              color: #9ca3af !important;
            }
            
            /* Stack Auth buttons - purple background */
            [data-stack-auth] button[type="submit"],
            [data-stack-auth-root] button[type="submit"],
            .stack-auth-sign-in button[type="submit"],
            .stack-auth-sign-up button[type="submit"] {
              background-color: #7c3aed !important;
              color: #ffffff !important;
              border: none !important;
            }
            
            [data-stack-auth] button[type="submit"]:hover,
            [data-stack-auth-root] button[type="submit"]:hover,
            .stack-auth-sign-in button[type="submit"]:hover,
            .stack-auth-sign-up button[type="submit"]:hover {
              background-color: #6d28d9 !important;
            }
            
            /* Stack Auth text and labels - purple */
            [data-stack-auth] label,
            [data-stack-auth-root] label,
            [data-stack-auth] p,
            [data-stack-auth-root] p,
            [data-stack-auth] span,
            [data-stack-auth-root] span,
            [data-stack-auth] div,
            [data-stack-auth-root] div,
            .stack-auth-sign-in label,
            .stack-auth-sign-up label,
            .stack-auth-sign-in p,
            .stack-auth-sign-up p,
            .stack-auth-sign-in span,
            .stack-auth-sign-up span,
            .stack-auth-sign-in div,
            .stack-auth-sign-up div {
              color: #7c3aed !important;
            }
            
            /* Stack Auth links - purple with hover */
            [data-stack-auth] a,
            [data-stack-auth-root] a,
            .stack-auth-sign-in a,
            .stack-auth-sign-up a {
              color: #7c3aed !important;
            }
            
            [data-stack-auth] a:hover,
            [data-stack-auth-root] a:hover,
            .stack-auth-sign-in a:hover,
            .stack-auth-sign-up a:hover {
              color: #6d28d9 !important;
            }
            
            /* Stack Auth card/container background - white with purple border */
            [data-stack-auth] > div,
            [data-stack-auth-root] > div {
              background-color: #ffffff !important;
              border-color: #e9d5ff !important;
              border-width: 1px !important;
            }
            
            /* Google sign-in button - keep original styling but ensure visibility */
            [data-stack-auth] button[aria-label*="Google"],
            [data-stack-auth-root] button[aria-label*="Google"],
            .stack-auth-sign-in button[aria-label*="Google"],
            .stack-auth-sign-up button[aria-label*="Google"] {
              background-color: #ffffff !important;
              color: #1f2937 !important;
              border-color: #d1d5db !important;
            }
          `}</style>
          
          {/* Subtitle text - purple */}
          <div className="text-center mb-6">
            <p className="text-purple-600 text-base sm:text-lg font-medium">
              Join over 10,000+ people taking control of their cancer journey.
            </p>
          </div>
          
          {/* Render Stack Auth components immediately - they handle their own loading and errors */}
          {mode === 'signin' ? (
            <>
              {console.log('[AuthPage] Rendering SignIn component')}
              <SignIn
                afterSignInUrl={signInRedirect}
                fullPage={false}
                signUpUrl={`/authentication?mode=signup${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`}
              />
            </>
          ) : (
            <>
              {console.log('[AuthPage] Rendering SignUp component')}
              <div className="w-full">
                <SignUp
                  afterSignUpUrl={signUpRedirect}
                  fullPage={false}
                  signInUrl={`/authentication?mode=signin${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </StackAuthErrorBoundary>
  );
}
