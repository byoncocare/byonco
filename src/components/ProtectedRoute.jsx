import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProtectedRoute component - Wraps routes that require authentication and profile completion
 * 
 * Flow:
 * - If not authenticated → redirect to /auth
 * - If authenticated but profile not complete → redirect to /profile
 * - If authenticated and profile complete → render children
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, profileCompleted, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // If authenticated but profile not complete, redirect to profile
  if (!profileCompleted) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/profile?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  // User is authenticated and profile is complete, render the protected content
  return children;
}

