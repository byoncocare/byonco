import React from 'react';
import { motion } from 'framer-motion';

export default function Careers() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f9f8f7] to-[#f3f2f0] px-4 sm:px-8 py-20 text-center flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Breadcrumb or tag */}
        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-4 inline-block">
          Careers at ByOnco
        </span>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
          Hiring
        </h1>

        {/* Subtext */}
        <p className="text-gray-700 text-base sm:text-lg mb-4">
          Thank you for your interest in joining our team!
        </p>

        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
          While we currently don’t have any open positions, we’re always excited
          to connect with passionate, talented individuals.
        </p>

        {/* Connection note instead of button */}
        <div className="text-sm text-gray-500">
          Stay updated on future opportunities by following us on{' '}
          <a
            href="https://www.linkedin.com/company/byonco"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            LinkedIn
          </a>{' '}
          or reach out at{' '}
          <a
            href="mailto:careers@byoncocare.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            careers@byoncocare.com
          </a>.
        </div>
      </motion.div>
    </main>
  );
}
