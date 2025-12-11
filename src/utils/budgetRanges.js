/**
 * Budget range utilities based on country/currency
 */

export function getBudgetRangesForCountry(country) {
  if (country === 'India' || country === 'india') {
    return {
      currency: 'INR',
      symbol: '₹',
      ranges: [
        { label: '₹5L – ₹10L', value: '₹5L – ₹10L INR' },
        { label: '₹10L – ₹20L', value: '₹10L – ₹20L INR' },
        { label: '₹20L – ₹40L', value: '₹20L – ₹40L INR' },
        { label: '₹40L – ₹75L', value: '₹40L – ₹75L INR' },
        { label: '₹75L+', value: '₹75L+ INR' },
      ]
    };
  } else if (country === 'USA' || country === 'United States' || country === 'United States of America') {
    return {
      currency: 'USD',
      symbol: '$',
      ranges: [
        { label: '$0 – $50K', value: '$0 – $50K USD' },
        { label: '$50K – $100K', value: '$50K – $100K USD' },
        { label: '$100K – $200K', value: '$100K – $200K USD' },
        { label: '$200K – $400K', value: '$200K – $400K USD' },
        { label: '$400K+', value: '$400K+ USD' },
      ]
    };
  } else {
    // Generic/default ranges (using USD pattern with generic currency)
    return {
      currency: 'USD',
      symbol: '$',
      ranges: [
        { label: '$0 – $50K', value: '$0 – $50K USD' },
        { label: '$50K – $100K', value: '$50K – $100K USD' },
        { label: '$100K – $200K', value: '$100K – $200K USD' },
        { label: '$200K – $400K', value: '$200K – $400K USD' },
        { label: '$400K+', value: '$400K+ USD' },
      ]
    };
  }
}

