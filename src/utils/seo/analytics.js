// src/utils/seo/analytics.js
// Analytics tracking utility for SEO and conversion monitoring

/**
 * Track CTA clicks and conversions
 */
export const trackCTA = (ctaType, location, additionalData = {}) => {
  const eventData = {
    event: `cta_click_${ctaType}`,
    location: location, // e.g., 'hero', 'sticky_bar', 'inline_card', 'footer'
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', `cta_click_${ctaType}`, {
      event_category: 'CTA',
      event_label: location,
      page_path: window.location.pathname,
      ...additionalData
    });
  }

  // Custom analytics endpoint (if available)
  if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
    fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    }).catch(err => console.error('Analytics error:', err));
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('CTA Tracked:', eventData);
  }
};

/**
 * Track page views for SEO monitoring
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * Track keyword searches (internal search)
 */
export const trackKeywordSearch = (keyword, resultsCount) => {
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: keyword,
      results_count: resultsCount
    });
  }
};

/**
 * Track conversion events
 */
export const trackConversion = (conversionType, value = null) => {
  const eventData = {
    event: `conversion_${conversionType}`,
    value: value,
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  if (window.gtag) {
    window.gtag('event', `conversion_${conversionType}`, {
      value: value,
      currency: 'USD'
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Conversion Tracked:', eventData);
  }
};

/**
 * Track scroll depth (engagement metric)
 */
export const trackScrollDepth = () => {
  let maxScroll = 0;
  const thresholds = [25, 50, 75, 90, 100];

  const handleScroll = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && maxScroll < threshold + 5) {
          if (window.gtag) {
            window.gtag('event', 'scroll', {
              scroll_depth: threshold
            });
          }
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = () => {
  const startTime = Date.now();
  
  const trackExit = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    if (window.gtag) {
      window.gtag('event', 'time_on_page', {
        value: timeOnPage
      });
    }
  };

  window.addEventListener('beforeunload', trackExit);
  return () => window.removeEventListener('beforeunload', trackExit);
};
