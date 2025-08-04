// src/components/Hero.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
        className="relative flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-16 py-6 gap-4"
        role="banner"
        aria-label="Main site navigation"
      >
        {/* Logo */}
        <div className="flex items-center w-full justify-between sm:justify-start" aria-label="ByOnco logo">
          <img
            src="/byonco-logo.svg"
            alt="ByOnco logo — AI-powered cancer care platform"
            className="h-12 sm:h-20 w-auto object-contain"
          />

          {/* Hamburger Menu (mobile only) */}
          <button
            className="sm:hidden text-gray-800 text-2xl focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex space-x-6 text-sm text-gray-600"
          role="navigation"
          aria-label="Primary"
        >
          <a href="#how" className="hover:text-black transition-colors">How it Works</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#contact" className="hover:text-black transition-colors">Contact</a>
        </nav>

        {/* CTA Button (Join Waitlist) */}
        <div className="hidden sm:flex">
          <button
            onClick={() => navigate('/join-waitlist')}
            className="bg-black text-white px-7 py-3 rounded-full text-sm hover:scale-105 hover:bg-gray-900 transition-transform duration-300"
            aria-label="Join the waitlist for ByOnco"
          >
            Join the Waitlist
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-[100%] left-4 right-4 bg-white rounded-xl shadow-lg py-4 px-6 z-50 space-y-3 sm:hidden text-sm text-gray-700">
            <a href="#how" className="block border-b pb-2">How it Works</a>
            <a href="#features" className="block border-b pb-2">Features</a>
            <a href="#about" className="block border-b pb-2">About</a>
            <a href="#contact" className="block border-b pb-2">Contact</a>
            <button
              onClick={() => {
                navigate('/join-waitlist');
                setMenuOpen(false);
              }}
              className="w-full mt-2 bg-black text-white px-6 py-3 rounded-full text-sm"
            >
              Join the Waitlist
            </button>
          </div>
        )}
      </header>

      {/* Hero Content */}
      <section
        className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-24 lg:px-32 mt-8 md:mt-20 gap-10 md:gap-20"
        aria-label="Hero section"
      >
        {/* Text Section */}
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

          {/* CTAs */}
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
          className="w-full max-w-md sm:max-w-lg flex justify-center items-center relative"
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
