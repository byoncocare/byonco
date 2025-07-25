// src/pages/JoinWaitlist.jsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function JoinWaitlist() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  return (
    <main className="bg-white min-h-screen px-4 sm:px-8 py-16 font-sans">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8"
      >
        Join the ByOnco Waitlist
      </motion.h1>

      {/* Embedded Typeform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-5xl mx-auto shadow-md rounded-lg overflow-hidden"
      >
        <iframe
          src="https://form.typeform.com/to/IrpbkJrO"
          width="100%"
          height="700"
          frameBorder="0"
          allow="camera; microphone; autoplay; encrypted-media;"
          title="ByOnco Waitlist Form"
          className="w-full"
        ></iframe>
      </motion.div>

      {/* Footer Text */}
      <p className="text-center text-gray-500 text-sm mt-6">
        🔒 Your information is safe with us. We’ll only use it to match you with the best care options.
      </p>
    </main>
  );
}
