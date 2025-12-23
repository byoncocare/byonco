// Hook for letter-by-letter animation
import { useEffect, useState } from 'react';

export const useLetterAnimation = (text, delay = 0, stagger = 0.04) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const splitText = (str) => {
    return str.split('').map((char, i) => ({
      char: char === ' ' ? '\u00A0' : char,
      delay: animated ? i * stagger : 0,
      key: i,
    }));
  };

  return { splitText, animated };
};




