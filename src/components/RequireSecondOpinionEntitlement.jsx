import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasEntitlement } from '@/utils/secondOpinionAccess';

/**
 * Route guard component that requires Second Opinion entitlement
 * If user doesn't have active entitlement, redirects to /second-opinion with paywall modal
 */
export default function RequireSecondOpinionEntitlement({ children }) {
  const location = useLocation();
  const entitled = hasEntitlement();

  useEffect(() => {
    // If not entitled, the redirect will happen via Navigate component
  }, [entitled]);

  if (!entitled) {
    // Redirect to prompt page and trigger paywall modal
    return (
      <Navigate 
        to="/second-opinion" 
        replace 
        state={{ openPaywall: true, reason: 'route-guard' }} 
      />
    );
  }

  return children;
}

