// src/utils/seo/abTesting.js
// A/B testing utility for CTA placements and variations

const STORAGE_KEY = 'byonco_ab_tests';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Get stored test assignments
 */
const getStoredTests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading stored tests:', error);
    return {};
  }
};

/**
 * Store test assignments
 */
const storeTests = (tests) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  } catch (error) {
    console.error('Error storing tests:', error);
  }
};

/**
 * Generate consistent user ID (for persistent assignment)
 */
const getUserId = () => {
  let userId = localStorage.getItem('byonco_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('byonco_user_id', userId);
  }
  return userId;
};

/**
 * Hash function for consistent assignment
 */
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Assign user to a test variant
 */
export const assignToVariant = (testName, variants = ['A', 'B'], weights = [50, 50]) => {
  const stored = getStoredTests();
  
  // Check if user already assigned
  if (stored[testName]) {
    return stored[testName];
  }

  // Generate consistent assignment based on user ID
  const userId = getUserId();
  const hash = hashString(`${userId}_${testName}`);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = hash % totalWeight;

  let variant = variants[0];
  for (let i = 0; i < variants.length; i++) {
    if (random < weights[i]) {
      variant = variants[i];
      break;
    }
    random -= weights[i];
  }

  // Store assignment
  stored[testName] = {
    variant,
    assignedDate: new Date().toISOString(),
    testName
  };
  storeTests(stored);

  return variant;
};

/**
 * Get current variant for a test
 */
export const getVariant = (testName) => {
  const stored = getStoredTests();
  return stored[testName]?.variant || 'A';
};

/**
 * Track test conversion
 */
export const trackTestConversion = (testName, conversionType, value = null) => {
  const variant = getVariant(testName);
  const eventData = {
    event: 'ab_test_conversion',
    test_name: testName,
    variant: variant,
    conversion_type: conversionType,
    value: value,
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'ab_test_conversion', {
      test_name: testName,
      variant: variant,
      conversion_type: conversionType,
      value: value
    });
  }

  // Custom analytics
  if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
    fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    }).catch(err => console.error('Analytics error:', err));
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('A/B Test Conversion:', eventData);
  }
};

/**
 * Get test statistics
 */
export const getTestStats = (testName) => {
  // This would typically come from your analytics backend
  // For now, return placeholder structure
  return {
    testName,
    variants: {
      A: {
        impressions: 0,
        conversions: 0,
        conversionRate: 0
      },
      B: {
        impressions: 0,
        conversions: 0,
        conversionRate: 0
      }
    },
    significance: null,
    winner: null
  };
};

/**
 * CTA Placement Test Configuration
 */
export const CTA_PLACEMENT_TEST = {
  name: 'cta_placement',
  variants: {
    A: {
      name: 'Control',
      description: 'CTAs in hero, sticky bar, inline cards'
    },
    B: {
      name: 'Test',
      description: 'CTAs in sidebar, floating button, popup modal'
    }
  }
};

/**
 * Check if test is active
 */
export const isTestActive = (testName) => {
  // In production, this would check against a feature flag or config
  const activeTests = ['cta_placement']; // Add test names here
  return activeTests.includes(testName);
};
