// src/components/SubscriptionGuard.jsx
// TASK 2: Route-level subscription guard
// Redirects to auth if not logged in, or to paywall if subscription inactive/expired

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionState, isAdmin } from '@/utils/subscription';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';

export default function SubscriptionGuard({ children }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (!isMounted) return;

      // Prevent redirect loops - if already on subscribe/auth page, allow
      if (location.pathname === '/subscribe' || location.pathname === '/authentication' || location.pathname === '/get-started') {
        if (isMounted) {
          setHasAccess(true);
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      // Step 1: Check authentication
      if (!isAuthenticated || !user) {
        // Not logged in - redirect to auth with returnUrl
        const returnUrl = location.pathname + location.search;
        navigate(`/authentication?redirect=${encodeURIComponent(returnUrl)}`, { replace: true });
        return;
      }

      // Step 2: Admin bypass
      if (isAdmin(user)) {
        if (isMounted) {
          setHasAccess(true);
          setLoading(false);
        }
        return;
      }

      // Step 3: Check subscription state
      try {
        const subscriptionState = await getSubscriptionState(user);

        if (!isMounted) return;

        if (subscriptionState.isActive) {
          // Active subscription - allow access
          setHasAccess(true);
        } else {
          // Inactive or expired - redirect to paywall with returnUrl
          const returnUrl = location.pathname + location.search;
          navigate(`/get-started?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        if (isMounted) {
          // On error, redirect to paywall
          const returnUrl = location.pathname + location.search;
          navigate(`/get-started?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAccess();

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
