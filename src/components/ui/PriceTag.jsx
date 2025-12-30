import React from 'react';

/**
 * PriceTag component - Displays price with smaller currency symbol and Newsreader font for numbers
 * @param {string} currencySymbol - Currency symbol (default: ₹)
 * @param {string|number} amount - Price amount
 * @param {string} periodText - Period text (e.g., "/month")
 * @param {string} className - Additional CSS classes
 */
export default function PriceTag({ 
  currencySymbol = '₹', 
  amount, 
  periodText = '', 
  className = '' 
}) {
  // Extract numeric value if amount is a string like "₹99" or "₹15,000"
  const numericAmount = typeof amount === 'string' 
    ? amount.replace(/[₹,\s]/g, '') 
    : amount;

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className="text-sm sm:text-base md:text-lg align-top text-gray-300 mr-0.5">
        {currencySymbol}
      </span>
      <span className="font-newsreader text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
        {typeof numericAmount === 'number' 
          ? numericAmount.toLocaleString('en-IN') 
          : numericAmount}
      </span>
      {periodText && (
        <span className="text-sm sm:text-base md:text-lg text-gray-400 ml-1">
          {periodText}
        </span>
      )}
    </div>
  );
}

