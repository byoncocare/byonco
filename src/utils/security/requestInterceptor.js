// src/utils/security/requestInterceptor.js
// Intercepts fetch/axios requests to add fingerprinting and rate limit awareness

import { generateFingerprint, checkRateLimitHeaders, logSecurityEvent, detectAbusePattern } from './antiScraping';

/**
 * Wrap fetch to add security headers and monitor rate limits
 */
export const createSecureFetch = () => {
  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
    
    // Skip security checks for Stack Auth API calls (they need to work)
    const isStackAuthRequest = url.includes('api.stack-auth.com') || url.includes('app.stack-auth.com');
    
    // Check for abuse patterns before making request (skip for Stack Auth)
    if (!isStackAuthRequest && detectAbusePattern()) {
      logSecurityEvent('abuse_pattern_detected', {
        url: args[0],
      });
    }

    // Add fingerprint to request headers (skip for Stack Auth to avoid breaking their requests)
    const fingerprint = generateFingerprint();
    const options = args[1] || {};
    const headers = new Headers(options.headers || {});

    // Add fingerprint header (if backend supports it) - skip for Stack Auth
    if (fingerprint && !isStackAuthRequest) {
      headers.set('X-Client-Fingerprint', fingerprint.hash);
      headers.set('X-Client-Timestamp', fingerprint.raw.timestamp.toString());
    }

    // Make the request
    const response = await originalFetch(args[0], {
      ...options,
      headers,
    });

    // Check rate limit headers
    const rateLimitInfo = checkRateLimitHeaders(response);
    if (rateLimitInfo) {
      // Store rate limit info for UI awareness
      try {
        sessionStorage.setItem('rate_limit_info', JSON.stringify(rateLimitInfo));
      } catch (e) {
        // Ignore storage errors
      }
    }

    return response;
  };
};

/**
 * Wrap axios to add security headers and monitor rate limits
 * Can be applied to default axios or a custom instance
 */
export const createSecureAxios = (axiosInstance) => {
  // Add request interceptor for fingerprinting
  axiosInstance.interceptors.request.use(
    (config) => {
      // Skip security checks for Stack Auth API calls
      const isStackAuthRequest = config.url?.includes('api.stack-auth.com') || 
                                  config.url?.includes('app.stack-auth.com');
      
      const fingerprint = generateFingerprint();
      
      // Add fingerprint header (skip for Stack Auth to avoid breaking their requests)
      if (fingerprint && config.headers && !isStackAuthRequest) {
        config.headers['X-Client-Fingerprint'] = fingerprint.hash;
        config.headers['X-Client-Timestamp'] = fingerprint.raw.timestamp.toString();
      }

      // Check for abuse patterns (skip for Stack Auth)
      if (!isStackAuthRequest && detectAbusePattern()) {
        logSecurityEvent('abuse_pattern_detected', {
          url: config.url,
          method: config.method,
        });
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for rate limit monitoring
  axiosInstance.interceptors.response.use(
    (response) => {
      // Check rate limit headers
      const rateLimitInfo = checkRateLimitHeaders(response);
      if (rateLimitInfo) {
        try {
          sessionStorage.setItem('rate_limit_info', JSON.stringify(rateLimitInfo));
        } catch (e) {
          // Ignore storage errors
        }
      }
      return response;
    },
    (error) => {
      // Check rate limit in error response
      if (error.response) {
        const rateLimitInfo = checkRateLimitHeaders(error.response);
        if (rateLimitInfo || error.response.status === 429) {
          logSecurityEvent('rate_limit_error', {
            status: error.response.status,
            headers: rateLimitInfo,
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Apply security interceptors to default axios instance globally
 */
export const secureDefaultAxios = () => {
  // This will be called in index.js to secure all axios calls
  // Note: We can't modify the default axios export, but we can add interceptors
  // The interceptors will apply to all axios instances created from the default
  try {
    const axios = require('axios').default;
    return createSecureAxios(axios);
  } catch (e) {
    // If axios is not available, return null
    return null;
  }
};

/**
 * Initialize request interceptors
 */
export const initializeRequestInterceptors = () => {
  if (typeof window !== 'undefined') {
    createSecureFetch();
  }
};
