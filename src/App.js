// src/App.js
import './styles/globals.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Sections
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
import CookieConsent from './components/CookieConsent';

// Pages
import ByOncoProWaitlist from './pages/ByOncoProWaitlist';
import Security from './pages/Security';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Careers from './pages/Careers';
import GetStarted from './pages/GetStarted';
import JoinWaitlist from './pages/JoinWaitlist';
import ByOncoX from './pages/ByOnco-x';
import GetMatched from './pages/GetMatched';

// ✅ New Razorpay policy pages
import CancellationRefund from './pages/CancellationRefund';
import ShippingDelivery from './pages/ShippingDelivery';

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
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/get-started"
            element={
              <motion.div className="min-h-screen bg-white text-gray-900"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <GetStarted />
              </motion.div>
            }
          />

          {/* Get Matched (AI) */}
          <Route
            path="/get-matched"
            element={
              <motion.div className="min-h-screen"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <GetMatched />
              </motion.div>
            }
          />

          <Route
            path="/join-waitlist"
            element={
              <motion.div className="min-h-screen bg-[#f8f8ff]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <JoinWaitlist />
              </motion.div>
            }
          />

          <Route
            path="/careers"
            element={
              <motion.div className="min-h-screen bg-[#fdfdfc]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <Careers />
              </motion.div>
            }
          />

          <Route
            path="/terms-and-conditions"
            element={
              <motion.div className="min-h-screen bg-[#fdfdfc]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <TermsAndConditions />
              </motion.div>
            }
          />

          <Route
            path="/privacy"
            element={
              <motion.div className="min-h-screen bg-[#fdfdfc]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <PrivacyPolicy />
              </motion.div>
            }
          />

          <Route
            path="/security"
            element={
              <motion.div className="min-h-screen bg-[#fdfdfc]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <Security />
              </motion.div>
            }
          />

          <Route
            path="/pro-waitlist"
            element={
              <motion.div className="min-h-screen bg-[#f8f8ff]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <ByOncoProWaitlist />
              </motion.div>
            }
          />

          <Route path="/products/byonco-x" element={<ByOncoX />} />

          {/* ✅ New Razorpay-required routes */}
          <Route
            path="/cancellation-refund"
            element={
              <motion.div className="min-h-screen bg-white"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <CancellationRefund />
              </motion.div>
            }
          />

          <Route
            path="/shipping-delivery"
            element={
              <motion.div className="min-h-screen bg-white"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <ShippingDelivery />
              </motion.div>
            }
          />

          {/* Optional: 404
          <Route path="*" element={<NotFound />} />
          */}
        </Routes>
      </AnimatePresence>

      {/* Visible on all routes */}
      <CookieConsent />
    </>
  );
}

export default App;
