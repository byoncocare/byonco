// src/components/CookieConsent.jsx
/* global dataLayer */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite } from 'react-icons/fa';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      loadAnalyticsScript();
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('cookieConsent', choice);
    if (choice === 'accepted') {
      loadAnalyticsScript();
    }
    setShowBanner(false);
  };

  const loadAnalyticsScript = () => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y20BNVZBPX'; // Replace with your ID
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-Y20BNVZBPX'); // Replace with your ID again
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-3 sm:px-6 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-3">
            <div className="flex items-center gap-2">
              <FaCookieBite className="text-2xl text-blue-500" />
              <p className="text-center sm:text-left">
                We use cookies to improve your experience. See our{' '}
                <a
                  href="/privacy"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleConsent('accepted')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                I Agree
              </motion.button>
              <button
                onClick={() => handleConsent('declined')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 px-4 py-2 rounded text-sm"
              >
                I Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
