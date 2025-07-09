import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <main
      className="bg-gradient-to-br from-[#fef9f7] to-[#fbfbfa] min-h-screen flex flex-col font-sans text-gray-800"
      role="main"
    >
      {/* Header */}
      <header
        className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-16 py-6 gap-4"
        role="banner"
        aria-label="Main site navigation"
      >
        {/* Logo */}
        <div className="flex items-center" aria-label="ByOnco logo">
          <img
            src="/byonco-logo.svg"
            alt="ByOnco logo — AI-powered cancer care platform"
            className="h-16 sm:h-24 w-auto object-contain"
          />
        </div>

        {/* Nav + CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <nav
            className="hidden md:flex space-x-4 text-sm text-gray-600"
            role="navigation"
            aria-label="Primary"
          >
            <a href="#how" className="hover:text-black transition-colors">How it Works</a>
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#about" className="hover:text-black transition-colors">About</a>
            <a href="#contact" className="hover:text-black transition-colors">Contact</a>
          </nav>
          <button
            className="bg-black text-white text-sm px-5 py-2 rounded-full shadow hover:bg-gray-900 transition duration-200"
            aria-label="Join the waitlist for ByOnco"
          >
            Join the Waitlist
          </button>
        </div>
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
          {/* Tagline */}
          <div className="text-sm font-semibold mb-3 text-[#5e17eb]">
            ByOnco — Where Intelligence Meets Empathy.
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug tracking-tight"
          >
            The Future of Cancer Care Starts Here
          </motion.h1>

          {/* Subheadline */}
          <p className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            One platform. Every answer. <br />
            <span className="text-gray-800">
              Personalized hospital matching, real-time treatment access, financial aid, and global consultations — powered by AI, designed for humans.
            </span>
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              className="bg-black text-white px-7 py-3 rounded-full text-sm hover:scale-105 hover:bg-gray-900 transition-transform duration-300"
              aria-label="Get matched with the best hospital"
            >
              Get Matched Now
            </button>
            <button
              className="border border-gray-400 text-gray-700 px-7 py-3 rounded-full text-sm hover:scale-105 hover:bg-gray-100 transition-transform duration-300"
              aria-label="Watch a demo of the ByOnco platform"
            >
              Watch Demo
            </button>
          </div>

          {/* Microtrust */}
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
          {/* Ambient glow */}
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
