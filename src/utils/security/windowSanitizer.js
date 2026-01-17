// src/utils/security/windowSanitizer.js
// Prevents exposure of structured datasets in window objects

/**
 * Sanitize window object to prevent data exposure
 * Removes sensitive data from global scope while maintaining functionality
 */
export const sanitizeWindowObject = () => {
  if (typeof window === 'undefined') return;

  // List of properties that should NOT be exposed
  const sensitiveProperties = [
    // API keys and secrets (if accidentally exposed)
    'API_KEY',
    'SECRET_KEY',
    'PRIVATE_KEY',
    'ACCESS_TOKEN',
    // Internal data structures
    'cancerPagesData',
    'userData',
    'subscriptionData',
    'paymentData',
    // Development/debugging tools
    '__REACT_DEVTOOLS_GLOBAL_HOOK__',
    '__REDUX_DEVTOOLS_EXTENSION__',
  ];

  // Remove sensitive properties if they exist
  sensitiveProperties.forEach(prop => {
    if (window[prop] !== undefined) {
      try {
        delete window[prop];
      } catch (e) {
        // Ignore deletion errors
      }
    }
  });

  // Prevent adding new properties to window (in development only)
  if (process.env.NODE_ENV === 'development') {
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
      if (obj === window && sensitiveProperties.includes(prop)) {
        console.warn(`[Security] Attempted to define sensitive property "${prop}" on window object`);
        return obj;
      }
      return originalDefineProperty.call(this, obj, prop, descriptor);
    };
  }
};

/**
 * Wrap data objects to prevent direct exposure
 * Returns a proxy that logs access attempts
 */
export const createSecureDataWrapper = (data, dataName = 'data') => {
  if (process.env.NODE_ENV === 'development') {
    return new Proxy(data, {
      get(target, prop) {
        if (typeof prop === 'string' && prop.startsWith('_')) {
          console.warn(`[Security] Attempted to access private property "${prop}" on ${dataName}`);
          return undefined;
        }
        return target[prop];
      },
      set(target, prop, value) {
        if (typeof prop === 'string' && prop.startsWith('_')) {
          console.warn(`[Security] Attempted to set private property "${prop}" on ${dataName}`);
          return false;
        }
        target[prop] = value;
        return true;
      },
    });
  }
  return data;
};

/**
 * Initialize window sanitization
 * Call this once when the app loads
 */
export const initializeWindowSanitization = () => {
  sanitizeWindowObject();

  // Monitor for new properties being added
  if (typeof window !== 'undefined' && typeof Proxy !== 'undefined') {
    const originalWindow = window;
    
    // In development, log attempts to add sensitive properties
    if (process.env.NODE_ENV === 'development') {
      const handler = {
        set(target, prop, value) {
          const sensitiveProps = ['API_KEY', 'SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE'];
          if (typeof prop === 'string' && sensitiveProps.some(sp => prop.toUpperCase().includes(sp))) {
            console.warn(`[Security] Attempted to set potentially sensitive property "${prop}" on window`);
          }
          target[prop] = value;
          return true;
        },
      };

      // Note: We can't actually proxy window in most browsers, but we can monitor
      // This is more of a development-time warning
    }
  }
};
