// src/utils/security/antiScraping.js
// Security utilities for anti-scraping protection while maintaining SEO

/**
 * Check if the current request is from a legitimate crawler
 * Allows Googlebot, Bingbot, and other known search engine crawlers
 */
export const isLegitimateCrawler = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true; // Server-side, assume crawler-friendly
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const legitimateBots = [
    'googlebot',
    'bingbot',
    'slurp', // Yahoo
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'ia_archiver',
    'facebookexternalhit',
    'twitterbot',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'qwantify',
    'pinterestbot',
    'bitrix link preview',
    'redditbot',
    'applebot',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'qwantify',
    'pinterestbot',
    'bitrix link preview',
    'redditbot',
    'applebot',
  ];

  return legitimateBots.some(bot => userAgent.includes(bot));
};

/**
 * Basic headless browser detection using heuristics
 * Returns true if headless browser is detected
 */
export const detectHeadlessBrowser = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const checks = {
    // Check for common headless browser indicators
    webdriver: navigator.webdriver === true,
    plugins: navigator.plugins.length === 0,
    languages: navigator.languages.length === 0,
    permissions: typeof navigator.permissions === 'undefined',
    chrome: !window.chrome,
    // PhantomJS detection
    phantom: window.callPhantom || window._phantom,
    // Selenium detection
    selenium: window.__selenium_unwrapped || window.__webdriver_evaluate || window.__driver_evaluate,
    // Puppeteer detection
    puppeteer: window.__puppeteer_evaluated__ || navigator.webdriver,
    // Playwright detection
    playwright: window.__playwright || navigator.webdriver,
    // Missing common browser properties
    missingWindowProperties: !window.outerWidth || !window.outerHeight,
  };

  // Check for headless Chrome/Firefox indicators
  const headlessIndicators = [
    navigator.webdriver,
    !window.chrome && navigator.vendor === 'Google Inc.',
    navigator.plugins.length === 0,
    navigator.languages.length === 0,
  ];

  const suspiciousCount = Object.values(checks).filter(Boolean).length;
  const headlessCount = headlessIndicators.filter(Boolean).length;

  // If multiple indicators are present, likely headless
  return suspiciousCount >= 2 || headlessCount >= 2;
};

/**
 * Generate request fingerprint for abuse detection
 * Combines User-Agent, timing, and browser characteristics
 */
export const generateFingerprint = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return null;
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now(),
    // Browser capabilities
    hasWebGL: !!window.WebGLRenderingContext,
    hasCanvas: !!document.createElement('canvas').getContext,
    hasLocalStorage: typeof Storage !== 'undefined',
    hasSessionStorage: typeof sessionStorage !== 'undefined',
    // Timing fingerprint (for rate limiting detection)
    loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : null,
  };

  // Create a hash-like identifier (simplified)
  const fingerprintString = JSON.stringify(fingerprint);
  return {
    raw: fingerprint,
    hash: btoa(fingerprintString).substring(0, 32), // Simple encoding
  };
};

/**
 * Log security events for monitoring
 * In production, this should send to your analytics/security service
 */
export const logSecurityEvent = (eventType, details = {}) => {
  // Don't log for legitimate crawlers
  if (isLegitimateCrawler()) {
    return;
  }

  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    fingerprint: generateFingerprint(),
    details,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Security Event]', event);
  }

  // In production, send to your security monitoring endpoint
  // Example:
  // fetch('/api/security/events', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event),
  // }).catch(() => {}); // Fail silently

  // Store in sessionStorage for rate limiting awareness
  try {
    const events = JSON.parse(sessionStorage.getItem('security_events') || '[]');
    events.push(event);
    // Keep only last 50 events
    if (events.length > 50) {
      events.shift();
    }
    sessionStorage.setItem('security_events', JSON.stringify(events));
  } catch (e) {
    // Ignore storage errors
  }
};

/**
 * Check rate limiting headers from server response
 * Prepares for WAF integration
 */
export const checkRateLimitHeaders = (response) => {
  if (!response || !response.headers) return null;

  const rateLimitHeaders = {
    'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
    'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
    'x-ratelimit-reset': response.headers.get('x-ratelimit-reset'),
    'retry-after': response.headers.get('retry-after'),
  };

  // If rate limited, log the event
  if (response.status === 429 || rateLimitHeaders['retry-after']) {
    logSecurityEvent('rate_limit_hit', {
      headers: rateLimitHeaders,
      status: response.status,
    });
  }

  return rateLimitHeaders;
};

/**
 * Monitor for suspicious activity patterns
 */
export const detectAbusePattern = () => {
  try {
    const events = JSON.parse(sessionStorage.getItem('security_events') || '[]');
    const recentEvents = events.filter(
      e => Date.now() - new Date(e.timestamp).getTime() < 60000 // Last minute
    );

    // Check for rapid-fire events
    if (recentEvents.length > 10) {
      logSecurityEvent('suspicious_activity', {
        eventCount: recentEvents.length,
        events: recentEvents.map(e => e.type),
      });
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};
