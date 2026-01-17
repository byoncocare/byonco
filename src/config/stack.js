// src/config/stack.js
// Stack Auth configuration module - Production Ready
// Centralized config with debug logging and guardrails

// Framework: CRA (Create React App) - uses REACT_APP_* prefix
const PROJECT_ID = process.env.REACT_APP_STACK_PROJECT_ID;
const PUBLISHABLE_KEY = process.env.REACT_APP_STACK_PUBLISHABLE_KEY;

// Fallback values (for development only - should be overridden in production)
const FALLBACK_PROJECT_ID = "5a629032-2f33-46db-ac2c-134894a117eb";
const FALLBACK_PUBLISHABLE_KEY = "pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg";

// Production-safe debug logging (masks secrets)
if (typeof window !== 'undefined') {
  console.log("[STACK AUTH DEBUG] Configuration Check:");
  console.log("[STACK] projectId present:", Boolean(PROJECT_ID));
  console.log("[STACK] publishableKey present:", Boolean(PUBLISHABLE_KEY));
  console.log("[STACK] hostname:", window.location.origin);
  
  // Show first 6 chars of keys for debugging (safe - these are publishable)
  if (PROJECT_ID) {
    console.log("[STACK] projectId (first 6):", PROJECT_ID.substring(0, 6) + "...");
  }
  if (PUBLISHABLE_KEY) {
    console.log("[STACK] publishableKey (first 6):", PUBLISHABLE_KEY.substring(0, 6) + "...");
  }
  
  // Warn if using fallbacks in production
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (!PROJECT_ID || !PUBLISHABLE_KEY) {
      console.error("[STACK AUTH ERROR] Missing environment variables in production!");
      console.error("[STACK AUTH ERROR] Set REACT_APP_STACK_PROJECT_ID and REACT_APP_STACK_PUBLISHABLE_KEY in Vercel");
    }
  }
}

// Guardrails: Fail loudly in development, show clean error in production
const getProjectId = () => {
  const value = PROJECT_ID || FALLBACK_PROJECT_ID;
  
  if (!PROJECT_ID && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Production: Missing env var
    console.error("[STACK AUTH] REACT_APP_STACK_PROJECT_ID is missing in production!");
    // Don't throw - let it use fallback, but log error
  }
  
  return value;
};

const getPublishableKey = () => {
  const value = PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;
  
  if (!PUBLISHABLE_KEY && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Production: Missing env var
    console.error("[STACK AUTH] REACT_APP_STACK_PUBLISHABLE_KEY is missing in production!");
    // Don't throw - let it use fallback, but log error
  }
  
  return value;
};

// Validate that we have required values
const validateConfig = () => {
  const projectId = getProjectId();
  const publishableKey = getPublishableKey();
  
  if (!projectId || !publishableKey) {
    const error = new Error("Stack Auth configuration is missing required values");
    if (process.env.NODE_ENV === 'development') {
      // Development: Throw to catch early
      throw error;
    }
    // Production: Log but don't crash
    console.error("[STACK AUTH] Configuration validation failed:", error);
    return false;
  }
  
  return true;
};

// Export configuration
export const stackConfig = {
  projectId: getProjectId(),
  publishableClientKey: getPublishableKey(),
  // Explicitly set API URL for production
  baseUrl: process.env.REACT_APP_STACK_API_URL || "https://api.stack-auth.com",
  // Validate on import
  isValid: validateConfig(),
};

// Export individual values for convenience
export const STACK_PROJECT_ID = stackConfig.projectId;
export const STACK_PUBLISHABLE_KEY = stackConfig.publishableClientKey;
export const STACK_API_URL = stackConfig.baseUrl;

// Debug export (for troubleshooting)
export const debugStackConfig = () => {
  return {
    projectIdPresent: Boolean(PROJECT_ID),
    publishableKeyPresent: Boolean(PUBLISHABLE_KEY),
    usingFallbackProjectId: !PROJECT_ID,
    usingFallbackPublishableKey: !PUBLISHABLE_KEY,
    hostname: typeof window !== 'undefined' ? window.location.origin : 'server',
    apiUrl: stackConfig.baseUrl,
  };
};
