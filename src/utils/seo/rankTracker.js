// src/utils/seo/rankTracker.js
// Keyword ranking tracking utility

const STORAGE_KEY = 'byonco_keyword_rankings';

/**
 * Get stored keyword rankings
 */
export const getStoredRankings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading stored rankings:', error);
    return {};
  }
};

/**
 * Store keyword rankings
 */
export const storeRankings = (rankings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));
  } catch (error) {
    console.error('Error storing rankings:', error);
  }
};

/**
 * Update ranking for a keyword
 */
export const updateRanking = (keyword, position, page = null, date = null) => {
  const rankings = getStoredRankings();
  const today = date || new Date().toISOString().split('T')[0];
  
  if (!rankings[keyword]) {
    rankings[keyword] = [];
  }

  rankings[keyword].push({
    position,
    page: page || window.location.pathname,
    date: today,
    timestamp: new Date().toISOString()
  });

  // Keep only last 90 days of data
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  rankings[keyword] = rankings[keyword].filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });

  storeRankings(rankings);
  return rankings[keyword];
};

/**
 * Get current ranking for a keyword
 */
export const getCurrentRanking = (keyword) => {
  const rankings = getStoredRankings();
  if (!rankings[keyword] || rankings[keyword].length === 0) {
    return null;
  }
  
  // Get most recent entry
  const sorted = [...rankings[keyword]].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return sorted[0];
};

/**
 * Get ranking history for a keyword
 */
export const getRankingHistory = (keyword, days = 30) => {
  const rankings = getStoredRankings();
  if (!rankings[keyword]) {
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return rankings[keyword]
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Get all tracked keywords
 */
export const getAllTrackedKeywords = () => {
  const rankings = getStoredRankings();
  return Object.keys(rankings);
};

/**
 * Get ranking statistics
 */
export const getRankingStats = (keyword) => {
  const history = getRankingHistory(keyword, 30);
  if (history.length === 0) {
    return null;
  }

  const positions = history.map(h => h.position);
  const current = positions[positions.length - 1];
  const previous = positions.length > 1 ? positions[positions.length - 2] : null;
  const average = Math.round(positions.reduce((a, b) => a + b, 0) / positions.length);
  const best = Math.min(...positions);
  const worst = Math.max(...positions);
  const change = previous ? current - previous : 0;

  return {
    current,
    previous,
    change,
    average,
    best,
    worst,
    dataPoints: history.length
  };
};

/**
 * Export rankings data (for reporting)
 */
export const exportRankings = (format = 'json') => {
  const rankings = getStoredRankings();
  
  if (format === 'csv') {
    let csv = 'Keyword,Date,Position,Page\n';
    Object.keys(rankings).forEach(keyword => {
      rankings[keyword].forEach(entry => {
        csv += `${keyword},${entry.date},${entry.position},${entry.page}\n`;
      });
    });
    return csv;
  }
  
  return JSON.stringify(rankings, null, 2);
};

/**
 * Simulate ranking check (for testing)
 * In production, this would call an API or scraping service
 */
export const checkRanking = async (keyword, domain = 'www.byoncocare.com') => {
  // This is a placeholder - in production, you'd use:
  // 1. Google Search Console API
  // 2. Third-party rank tracking service (Ahrefs, SEMrush, etc.)
  // 3. Custom scraping solution
  
  console.log(`Checking ranking for: ${keyword}`);
  
  // Simulated response
  return {
    keyword,
    position: Math.floor(Math.random() * 50) + 1, // Random 1-50 for demo
    page: window.location.pathname,
    date: new Date().toISOString().split('T')[0]
  };
};
