// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import WhyAI from './components/WhyAI';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import TeamSection from './components/TeamSection';
import FAQ from './components/FAQ';

// Optional: page route
import GetStarted from './pages/GetStarted';

function HomePage() {
  return (
    <motion.main
      className="bg-gradient-to-b from-[#fffdfa] to-[#f9f9f8] text-gray-800 font-sans leading-relaxed overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <About />
      <WhyAI />
      <Features />
      <TeamSection />
      <FAQ />
      <Testimonials />
      <CallToAction />
      <Footer />
    </motion.main>
  );
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/get-started"
          element={
            <motion.div
              className="min-h-screen bg-white text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GetStarted />
            </motion.div>
          }
        />
        {/* Optional fallback route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
