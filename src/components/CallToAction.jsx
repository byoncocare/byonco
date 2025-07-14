// src/components/CallToAction.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/get-started');
  };

  return (
    <section
      className="bg-[#f9f9f9] py-20 px-4 sm:px-6 text-center"
      aria-labelledby="cta-heading"
    >
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-snug"
        >
          Don’t wait. <span className="text-blue-600">Get the care you deserve.</span>
        </h2>

        <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed">
          More than <strong>1,000+ cancer patients</strong> have already found affordable and timely treatment with ByOnco. <br />
          <span className="text-gray-800">Your journey to healing starts now.</span>
        </p>

        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-md shadow-md transition-all duration-300 focus:outline-none"
          aria-label="Get started with ByOnco"
        >
          Get Started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}
