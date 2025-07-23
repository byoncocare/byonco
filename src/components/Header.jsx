// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ByoncoB from '../assets/logo/B.svg'; // Update path if needed

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-black shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-2">
        <motion.img
          src={ByoncoB}
          alt="ByOnco Logo B"
          className="h-7 sm:h-8 w-auto"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
        <span className="text-xl sm:text-2xl font-satoshi font-semibold tracking-tight text-gray-900 dark:text-white">
          yOnco
        </span>
      </Link>
    </header>
  );
}
