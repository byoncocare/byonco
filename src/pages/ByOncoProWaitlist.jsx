// src/pages/ByOncoProWaitlist.jsx

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ByOncoProWaitlist() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
        Unlock <span className="text-blue-600">ByOnco Pro</span>
      </motion.h1>

      {/* Subtitle */}
      <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto text-base sm:text-lg">
        Get early access to <strong>real-time bed availability</strong>, <strong>live treatment queues</strong>, and <strong>priority hospital matching</strong>—designed for patients who can’t afford to wait.
      </p>

      {/* Embedded Typeform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-5xl mx-auto shadow-md rounded-lg overflow-hidden"
      >
        <iframe
          src="https://form.typeform.com/to/uhMG1bob"
          width="100%"
          height="700"
          frameBorder="0"
          allow="camera; microphone; autoplay; encrypted-media;"
          title="ByOnco Pro"
          className="w-full"
        ></iframe>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-6">
        🔒 Your responses help us tailor ByOnco Pro for patients who need urgent, smart, AI-powered help.
      </p>

      <div className="text-center mt-4">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 transition font-medium text-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
