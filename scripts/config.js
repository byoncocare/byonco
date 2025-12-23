/**
 * Configuration for ZenOnco scraper
 */

export const config = {
  // Base URL for the listing page
  baseUrl: "https://zenonco.io/best-oncologist-in-india",
  
  // Concurrency settings
  concurrency: 3,
  
  // Delay between requests (ms)
  minDelay: 500,
  maxDelay: 1500,
  
  // Browser settings
  headless: true,
  timeout: 30000, // 30 seconds
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 1000, // Base delay for exponential backoff
  
  // Output directories
  outputDir: "output",
  debugDir: "output/debug",
  
  // User agent for stealth
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  
  // Selectors - multiple strategies will be tried automatically
  // The scraper will attempt these selectors in order until one works
  selectors: {
    // Listing page selectors - tried in order
    doctorCard: [
      'a[href*="/doctor/"]',
      'a[href*="/oncologist/"]',
      'a[href*="/profile/"]',
      '[class*="doctor-card"] a',
      '[class*="doctorCard"] a',
      'article a'
    ],
    doctorLink: [
      'a[href*="/doctor/"]',
      'a[href*="/oncologist/"]',
      'a[href*="/profile/"]'
    ],
    paginationNext: [
      'a:has-text("Next")',
      'a[aria-label*="next" i]',
      '[class*="next"]',
      'button:has-text("Next")'
    ],
    loadMoreButton: [
      'button:has-text("Load More")',
      'button:has-text("Load more")',
      '[class*="load-more"]',
      '[class*="loadMore"]'
    ],
    
    // Profile page selectors - tried in order
    profileName: [
      'h1',
      '[class*="doctor-name"]',
      '[class*="doctorName"]',
      '[class*="name"]',
      'h2:has-text("Dr")',
      '[itemprop="name"]'
    ],
    designation: [
      '[class*="designation"]',
      '[class*="title"]',
      '[class*="specialization"]'
    ],
    specialty: [
      '[class*="specialty"]',
      '[class*="department"]',
      '[class*="specialization"]'
    ],
    yearsExperience: [
      '[class*="experience"]',
      '[class*="years"]'
    ],
    hospitalAffiliations: [
      '[class*="hospital"]',
      '[class*="affiliation"]',
      '[class*="clinic"]'
    ],
    clinicAddress: [
      '[class*="address"]',
      '[class*="location"]',
      '[class*="city"]',
      '[itemprop="address"]'
    ],
    consultationFee: [
      '[class*="fee"]',
      '[class*="price"]',
      '[class*="consultation"]'
    ],
    phone: [
      'a[href^="tel:"]',
      '[class*="phone"]',
      '[class*="contact"]'
    ],
    rating: [
      '[class*="rating"]',
      '[class*="star"]',
      '[itemprop="ratingValue"]'
    ],
    about: [
      '[class*="about"]',
      '[class*="bio"]',
      '[class*="description"]',
      '[class*="summary"]'
    ]
  }
};

/**
 * Get random delay between min and max
 */
export function getRandomDelay() {
  return Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
}

