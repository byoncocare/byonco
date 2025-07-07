// src/components/CallToAction.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function CallToAction() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/get-started');
  };

  return (
    <section className="bg-[#f9f9f9] py-24 px-6 text-center">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
          Ready to begin your <span className="text-blue-600">cancer care journey?</span>
        </h2>

        <p className="text-gray-700 text-base md:text-lg mb-10">
          Thousands of patients have already found affordable, life-saving care with ByOnco.  
          <br className="hidden sm:block" /> It's your turn to experience the difference.
        </p>

        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white font-medium text-sm md:text-base px-6 py-3 rounded-md shadow-md transition-all duration-300 focus:outline-none"
          aria-label="Get started with ByOnco cancer care"
        >
          Get Started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
