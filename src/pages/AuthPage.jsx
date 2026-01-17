// src/pages/AuthPage.jsx
// Stack Auth Authentication Page - Production Ready
// Non-blocking initialization with timeout
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@stackframe/react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stackConfig, STACK_PROJECT_ID, STACK_PUBLISHABLE_KEY } from '@/config/stack';

// Connection check with timeout
const checkStackAuthConnection = async (timeoutMs = 5000) => {
  const apiUrl = stackConfig.baseUrl;
  const healthUrl = `${apiUrl}/health`; // Stack Auth health endpoint
  
  console.log("[AUTH] origin", window.location.origin);
  console.log("[AUTH] stackProjectId present", Boolean(STACK_PROJECT_ID));
  console.log("[AUTH] stackKey present", Boolean(STACK_PUBLISHABLE_KEY));
  console.log("[AUTH] checking connection to:", healthUrl);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log("[AUTH] connection check successful");
      return { success: true, error: null };
    } else {
      const error = `HTTP ${response.status}`;
      console.error("[AUTH] connection check failed:", error);
      return { success: false, error };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    
    // Determine error type
    let errorType = 'network';
    let errorMessage = 'Network error';
    
    if (err.name === 'AbortError') {
      errorType = 'timeout';
      errorMessage = 'Connection timeout';
    } else if (err.message?.includes('CORS') || err.message?.includes('Failed to fetch')) {
      errorType = 'cors';
      errorMessage = 'CORS blocked';
    } else if (err.message?.includes('ERR_')) {
      errorType = 'network';
      errorMessage = 'Network blocked';
    }
    
    console.error("[AUTH] connection check error:", errorType, err.message);
    return { success: false, error: errorMessage, errorType };
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
  
  // Connection state - non-blocking
  const [connectionState, setConnectionState] = useState({
    checking: false,
    connected: null, // null = unknown, true = connected, false = failed
    error: null,
    errorType: null,
  });
  
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

  // Non-blocking connection check (runs in background)
  const checkConnection = useCallback(async () => {
    setConnectionState({ checking: true, connected: null, error: null, errorType: null });
    
    const result = await checkStackAuthConnection(5000);
    
    setConnectionState({
      checking: false,
      connected: result.success,
      error: result.error,
      errorType: result.errorType,
    });
  }, []);

  // Run connection check on mount (non-blocking)
  useEffect(() => {
    // Don't block render - check in background
    checkConnection();
  }, [checkConnection]);

  // Build redirect URLs for Stack Auth components
  const signInRedirect = redirect ? `/authentication?redirect=${encodeURIComponent(redirect)}` : '/';
  const signUpRedirect = redirect ? `/authentication?redirect=${encodeURIComponent(redirect)}` : '/';

  // Render immediately - don't wait for connection check
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      {/* Non-blocking error banner */}
      {connectionState.connected === false && !connectionState.checking && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-900/90 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold text-sm mb-1">Stack Auth Connection Issue</p>
              <p className="text-xs text-gray-300 mb-2">
                {connectionState.errorType === 'cors' && 'CORS blocked - check browser extensions'}
                {connectionState.errorType === 'timeout' && 'Connection timeout - check network/firewall'}
                {connectionState.errorType === 'network' && 'Network error - check connection'}
                {!connectionState.errorType && `Error: ${connectionState.error}`}
              </p>
              <Button
                onClick={checkConnection}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Render Stack Auth components immediately - they handle their own loading */}
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
  );
}
