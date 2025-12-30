// src/products/vayu/components/hooks/useDynamicCounter.js
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for dynamic counters that increment based on time elapsed
 * @param {Object} config - Configuration object
 * @param {Date} config.startDate - The date to start counting from (default: today)
 * @param {number} config.baseValue - Starting value (default: 0)
 * @param {number} config.growthRate - Growth per day (default: 1)
 * @param {number} config.updateInterval - Update interval in milliseconds (default: 60000 = 1 minute)
 * @param {boolean} config.showPlus - Whether to show "+" after the number (default: false)
 * @param {boolean} config.animateOnMount - Whether to animate from 0 on mount (default: false)
 * @returns {number|string} - The current counter value
 */
export const useDynamicCounter = ({
  startDate = new Date(),
  baseValue = 0,
  growthRate = 1, // per day
  updateInterval = 60000, // 1 minute
  showPlus = false,
  animateOnMount = false,
}) => {
  const [count, setCount] = useState(animateOnMount ? 0 : baseValue);
  const [isAnimating, setIsAnimating] = useState(animateOnMount);
  
  // Store the start date in a ref to prevent it from changing on re-renders
  const startDateRef = useRef(startDate);
  
  // Update start date only if it's explicitly changed
  useEffect(() => {
    startDateRef.current = startDate;
  }, [startDate]);

  useEffect(() => {
    const calculateCount = () => {
      const now = new Date();
      const start = new Date(startDateRef.current);
      
      // Calculate time difference in hours for more granular updates
      const diffMs = now - start;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // Calculate current count based on growth rate (per day, converted to per hour)
      // Use deterministic calculation - no randomness to prevent fluctuations
      const hourlyGrowthRate = growthRate / 24; // Convert daily rate to hourly
      const currentCount = Math.floor(baseValue + (diffHours * hourlyGrowthRate));
      
      return Math.max(baseValue, currentCount); // Never go below base value
    };

    // Handle initial animation on mount
    if (animateOnMount && isAnimating) {
      const targetCount = calculateCount();
      const duration = 2000; // 2 seconds animation
      const steps = 60; // 60 steps
      const stepDuration = duration / steps;
      const increment = targetCount / steps;
      
      let currentStep = 0;
      const animationInterval = setInterval(() => {
        currentStep++;
        const animatedValue = Math.floor(increment * currentStep);
        setCount(Math.min(animatedValue, targetCount));
        
        if (currentStep >= steps || animatedValue >= targetCount) {
          setCount(targetCount);
          setIsAnimating(false);
          clearInterval(animationInterval);
        }
      }, stepDuration);

      return () => clearInterval(animationInterval);
    }

    // Set initial count if not animating
    if (!animateOnMount || !isAnimating) {
      setCount(calculateCount());
    }

    // Update counter at specified interval (only after animation completes)
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCount(calculateCount());
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [baseValue, growthRate, updateInterval, animateOnMount, isAnimating]);

  // Format the number with "+" if needed
  if (showPlus && count >= 100) {
    return `${count}+`;
  }
  
  return count;
};

/**
 * Hook specifically for waitlist counter
 * Starts from 2257, grows at ~3-5 per day
 */
export const useWaitlistCounter = () => {
  // Use a stable start date - only create once
  const [startDate] = useState(() => new Date());
  
  return useDynamicCounter({
    startDate, // Start from today (stable reference)
    baseValue: 2257,
    growthRate: 4, // ~4 signups per day on average
    updateInterval: 60000, // Update every minute
    showPlus: false,
    animateOnMount: true, // Animate from 0 to 2257 on mount
  });
};

/**
 * Hook specifically for pre-orders counter
 * Starts from 110, grows slowly at ~0.5-1 per day
 */
export const usePreOrdersCounter = () => {
  // Use a stable start date - only create once
  const [startDate] = useState(() => new Date());
  
  return useDynamicCounter({
    startDate, // Start from today (stable reference)
    baseValue: 110,
    growthRate: 0.8, // ~0.8 pre-orders per day on average
    updateInterval: 60000, // Update every minute
    showPlus: true, // Show "110+" format
    animateOnMount: true, // Animate from 0 to 110+ on mount
  });
};

