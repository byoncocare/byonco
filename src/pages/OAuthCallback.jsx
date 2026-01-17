// src/pages/OAuthCallback.jsx
// OAuth Callback Handler - Production Ready
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@stackframe/react";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "@/stack/client";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug logging - no secrets
    console.log("[OAuthCallback] ===== OAuth Callback Handler =====");
    console.log("[OAuthCallback] Full URL:", window.location.href);
    console.log("[OAuthCallback] Pathname:", window.location.pathname);
    console.log("[OAuthCallback] Search params:", window.location.search);
    console.log("[OAuthCallback] Stack Auth App:", stackClientApp ? "✅ Present" : "❌ Missing");
    console.log("[OAuthCallback] User state:", user ? "✅ Logged in" : "⏳ Processing...");

    // Check if we have a code in the URL (OAuth callback)
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      console.warn("[OAuthCallback] No OAuth code found in URL");
      setError("No OAuth code found. Please try signing in again.");
      setStatus("error");
      setTimeout(() => {
        navigate("/authentication?error=no_code", { replace: true });
      }, 3000);
      return;
    }

    console.log("[OAuthCallback] OAuth code present:", code.substring(0, 10) + "...");
    console.log("[OAuthCallback] OAuth state:", state ? state.substring(0, 10) + "..." : "none");

    // StackHandler will process the OAuth callback automatically
    // We just need to wait for the user to be set, then redirect

    // Set a timeout to prevent infinite waiting
    const timeoutId = setTimeout(() => {
      if (!user) {
        console.error("[OAuthCallback] Timeout waiting for user authentication");
        setError("Authentication timed out. Please try again.");
        setStatus("error");
        setTimeout(() => {
          navigate("/authentication?error=timeout", { replace: true });
        }, 3000);
      }
    }, 15000); // 15 second timeout (OAuth can take a moment)

    return () => clearTimeout(timeoutId);
  }, [location, navigate, user]);

  // Redirect when user is authenticated
  useEffect(() => {
    if (user) {
      console.log("[OAuthCallback] ✅ User authenticated, redirecting...");
      setStatus("success");
      
      // Get redirect URL from query params or default to home
      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get("redirect");
      
      // Security: Only allow relative paths
      const redirectPath = redirect && !redirect.startsWith("http") && redirect.startsWith("/")
        ? redirect 
        : "/";
      
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000); // Small delay to show success message
    }
  }, [user, navigate, location.search]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error || "An error occurred during authentication."}</p>
          </div>
          <button
            onClick={() => navigate("/authentication", { replace: true })}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Successful!</h2>
            <p className="text-gray-600">Redirecting you now...</p>
          </div>
        </div>
      </div>
    );
  }

  // Processing state - Mount StackHandler to process OAuth callback
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* StackHandler processes the OAuth callback automatically */}
        <StackHandler 
          app={stackClientApp} 
          location={location.pathname + location.search} 
          fullPage={false}
        />
        
        {/* Loading UI overlay */}
        <div className="text-center mt-4">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Signing you in…</h2>
          <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </div>
      </div>
    </div>
  );
}
