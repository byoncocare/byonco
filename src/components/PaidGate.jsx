// src/components/PaidGate.jsx
// Paid-only access gate - redirects to /subscribe if not paid

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/utils/subscription';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';

export default function PaidGate({ children }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkSubscription = async () => {
      if (!isMounted) return;
      
      // Prevent redirect loops - if already on subscribe/auth page, don't redirect
      if (location.pathname === '/subscribe' || location.pathname === '/authentication') {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      
      // Admin bypass
      if (isAdmin(user)) {
        if (isMounted) {
          setHasAccess(true);
          setLoading(false);
        }
        return;
      }

      // Not authenticated - redirect to login with return path
      if (!isAuthenticated) {
        const redirectPath = `/authentication?redirect=${encodeURIComponent(location.pathname + location.search)}`;
        // Use replace to avoid adding to history stack
        navigate(redirectPath, { replace: true });
        return;
      }

      try {
        const token = localStorage.getItem('token') || localStorage.getItem('byonco_jwt') || localStorage.getItem('auth_token');
        const response = await fetch(`${BACKEND_URL}/api/payments/subscription/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error('Failed to check subscription');
        }

        const data = await response.json();
        
        if (!isMounted) return;
        
        // Check if subscription is active
        if (data.subscription && data.subscription.status === 'active' && data.subscription.is_active) {
          // Check expiry
          const expiresAt = new Date(data.subscription.expires_at);
          const now = new Date();
          if (expiresAt > now) {
            setHasAccess(true);
          } else {
            // Expired - redirect to subscribe with return path
            const returnPath = location.pathname + location.search;
            navigate(`/subscribe?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
          }
        } else {
          // No active subscription - redirect to subscribe with return path
          const returnPath = location.pathname + location.search;
          navigate(`/subscribe?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        if (isMounted) {
          // On error, redirect to subscribe with return path
          const returnPath = location.pathname + location.search;
          navigate(`/subscribe?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSubscription();
    
    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, navigate, location.pathname, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Checking access...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Navigation will handle redirect
  }

  return <>{children}</>;
}
