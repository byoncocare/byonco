// src/components/Hero.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGetMatchedClick = () => {
    navigate('/get-matched');
  };

  return (
    <main
      className="bg-gradient-to-br from-[#fef9f7] to-[#fbfbfa] min-h-screen flex flex-col font-sans text-gray-800"
      role="main"
    >
      {/* Header */}
      <header
        className="relative flex items-center justify-between px-4 sm:px-6 md:px-16 py-4"
        role="banner"
        aria-label="Main site navigation"
      >
        {/* Logo */}
        <img
          src="/byonco-logo.svg"
          alt="ByOnco logo — AI-powered cancer care platform"
          className="h-14 md:h-24"


        />

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-gray-800 text-xl"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6 text-sm text-gray-600 items-center">
          <a href="#how" className="hover:text-black">How it Works</a>
          <a href="#features" className="hover:text-black">Features</a>
          <a href="#about" className="hover:text-black">About</a>
          <a href="#contact" className="hover:text-black">Contact</a>
          <button
            onClick={() => navigate('/join-waitlist')}
            className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-900 transition"
          >
            Join the Waitlist
          </button>
        </nav>
      </header>

      {/* Slide-In Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-full h-full z-50 bg-white shadow-xl px-6 py-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <img
                src="/byonco-logo.svg"
                alt="ByOnco"
                className="h-10 w-auto"
              />
              <button
                className="text-xl text-gray-800"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col space-y-4 text-lg font-medium text-gray-800">
              <a href="#how" onClick={() => setMenuOpen(false)}>How it Works</a>
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
              <button
                onClick={() => {
                  navigate('/join-waitlist');
                  setMenuOpen(false);
                }}
                className="bg-black text-white w-full py-3 rounded-full mt-4"
              >
                Join the Waitlist
              </button>
            </div>

            {/* External Links */}
            <div className="mt-auto pt-10 pb-6 space-y-2 text-sm text-gray-500 border-t border-gray-200">
              <a href="https://www.linkedin.com/company/byoncocare" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="https://www.instagram.com/byoncocare/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-24 lg:px-32 mt-4 md:mt-20 gap-10 md:gap-20"
        aria-label="Hero section"
      >
        {/* Text Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-2xl text-center lg:text-left"
        >
          <div className="text-sm font-semibold mb-3 text-orange-600">
            ByOnco — Where Intelligence Meets Empathy.
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug tracking-tight"
          >
            The Future of Cancer Care Starts Here
          </motion.h1>

          <p className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            One platform. Every answer. <br />
            <span className="text-gray-800">
              Personalized hospital matching, real-time treatment access, financial aid, and global consultations — powered by AI, designed for humans.
            </span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={handleGetMatchedClick}
              className="bg-black text-white px-7 py-3 rounded-full text-sm hover:scale-105 hover:bg-gray-900 transition-transform duration-300"
              aria-label="Get matched with the best hospital"
            >
              Get Matched Now
            </button>
            <a
              href="https://calendly.com/getbyonco/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 text-gray-700 px-7 py-3 rounded-full text-sm hover:scale-105 hover:bg-gray-100 transition-transform duration-300 inline-block"
              aria-label="Book a demo of the ByOnco platform"
            >
              Book a Demo
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-4" aria-label="Trust statement">
            Trusted by top oncologists and 1,000+ patients across India.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="w-full max-w-md sm:max-w-lg flex justify-center items-center relative mt-[-20px] sm:mt-0"
          role="img"
          aria-label="Illustration of a patient receiving AI-assisted support"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute w-80 h-60 bg-[#5e17eb]/30 blur-3xl rounded-full z-0"
          />
          <motion.img
            src="/byonco-hero-illustration.webp"
            alt="AI-assisted healthcare comforting a female patient — conceptual digital illustration"
            className="w-full h-auto object-contain rounded-xl shadow-xl relative z-10"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
          />
        </motion.div>
      </section>
    </main>
  );
}
