// src/App.js
import "./index.css"; // single entry: tailwind + globals + marketing + vayu polish

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Sections (home page)
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import WhyAI from "./components/WhyAI";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import TeamSection from "./components/TeamSection";
import FAQ from "./components/FAQ";
import CookieConsent from "./components/CookieConsent";

// Pages
import ByOncoProWaitlist from "./pages/ByOncoProWaitlist";
import Security from "./pages/Security";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Careers from "./pages/Careers";
import GetStarted from "./pages/GetStarted";
import JoinWaitlist from "./pages/JoinWaitlist";
import GetMatched from "./pages/GetMatched";
import CancellationRefund from "./pages/CancellationRefund";
import ShippingDelivery from "./pages/ShippingDelivery";

// 🔹 Vayu legal pages (Vayu-specific, separate from main app)
import PrivacyPolicyVayu from "./products/vayu/pages/PrivacyPolicyVayu";
import TermsOfServiceVayu from "./products/vayu/pages/TermsOfServiceVayu";
import CookiePolicyVayu from "./products/vayu/pages/CookiePolicyVayu";

// 🔹 Vayu support pages
import HelpCenterVayu from "./products/vayu/pages/HelpCenterVayu";
import WarrantyVayu from "./products/vayu/pages/WarrantyVayu";
import ReturnsVayu from "./products/vayu/pages/ReturnsVayu";
import ShippingInfoVayu from "./products/vayu/pages/ShippingInfoVayu";

// 🔹 NEW: Vayu waitlist page
import VayuWaitlist from "./products/vayu/pages/VayuWaitlist";

// 🔹 Lazy-load Vayu product page (smaller initial bundle)
const VayuX = lazy(() => import("./pages/VayuX"));

/* -------------------------------------------------------
   Global hash scroller: works WITHOUT editing Vayu page.
   - looks for element by id (essential|medpro|legaledge)
   - if not found, falls back to heading text detection
   - adds header offset and smooth scroll

   Supports both /products/vayu and /product/vayu.
------------------------------------------------------- */
function HashScroller({ offset = 96 }) {
  const location = useLocation();

  useEffect(() => {
    const { pathname, hash } = location;
    if (!hash) return;

    const vayuPaths = ["/products/vayu", "/product/vayu"];
    if (!vayuPaths.includes(pathname)) return;

    const wanted = hash.slice(1); // "essential" | "medpro" | "legaledge"

    const tryScroll = () => {
      // 1) ID match (best if present)
      let el = document.getElementById(wanted);

      // 2) Fallback: find by visible heading text
      if (!el) {
        const map = {
          essential: /vayu\s*essential/i,
          medpro: /vayu\s*med\s*pro|vayu\s*medpro/i,
          legaledge: /vayu\s*legal\s*edge|vayu\s*legaledge/i,
        };

        const re = map[wanted];
        if (re) {
          const candidates = Array.from(
            document.querySelectorAll("h1,h2,h3,h4,[role='heading']")
          );
          const hit = candidates.find((n) => re.test(n.textContent || ""));
          if (hit) {
            // scroll to the card container if available; else to heading
            el = hit.closest("section, article, div") || hit;
          }
        }
      }

      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    const t = setTimeout(tryScroll, 80);
    return () => clearTimeout(t);
  }, [location, offset]);

  return null;
}

// ---------- Home wrapper ----------
function HomePage() {
  return (
    <motion.main
      className="page-shell bg-gradient-to-b from-[#fffdfa] to-[#f9f9f8] text-gray-800 font-sans leading-relaxed overflow-x-hidden"
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

// ---------- App ----------
export default function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <div className="page-shell min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading…</p>
              </div>
            </div>
          }
        >
          {/* ⬇️ Global scroller active on every route */}
          <HashScroller offset={96} />

          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Core flows */}
            <Route
              path="/get-started"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-white text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <GetStarted />
                </motion.div>
              }
            />
            <Route
              path="/get-matched"
              element={
                <motion.div
                  className="page-shell min-h-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <GetMatched />
                </motion.div>
              }
            />
            <Route
              path="/join-waitlist"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#f8f8ff]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <JoinWaitlist />
                </motion.div>
              }
            />

            {/* Company & policy */}
            <Route
              path="/careers"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Careers />
                </motion.div>
              }
            />
            <Route
              path="/terms-and-conditions"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <TermsAndConditions />
                </motion.div>
              }
            />
            <Route
              path="/privacy"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PrivacyPolicy />
                </motion.div>
              }
            />
            <Route
              path="/security"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Security />
                </motion.div>
              }
            />
            <Route
              path="/pro-waitlist"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#f8f8ff]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ByOncoProWaitlist />
                </motion.div>
              }
            />

            {/* 🔹 Vayu product page */}
            <Route path="/products/vayu" element={<VayuX />} />

            {/* 🔹 NEW: Vayu waitlist page */}
            <Route
              path="/products/vayu/waitlist"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#E6F1FF] to-[#E6FFF7] text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <VayuWaitlist />
                </motion.div>
              }
            />

            {/* 🔁 Old preorder path → waitlist */}
            <Route
              path="/products/vayu/preorder"
              element={<Navigate to="/products/vayu/waitlist" replace />}
            />

            {/* ✅ Normalize short path → full path to avoid blank page */}
            <Route path="/product/vayu" element={<Navigate to="/products/vayu" replace />} />

            {/* 🔹 Vayu legal pages (separate from main ByOnco legal) */}
            <Route
              path="/products/vayu/privacy-policy"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PrivacyPolicyVayu />
                </motion.div>
              }
            />
            <Route
              path="/products/vayu/terms-of-service"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <TermsOfServiceVayu />
                </motion.div>
              }
            />
            <Route
              path="/products/vayu/cookie-policy"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CookiePolicyVayu />
                </motion.div>
              }
            />

            {/* 🔹 Vayu support pages */}
            <Route
              path="/products/vayu/help-center"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <HelpCenterVayu />
                </motion.div>
              }
            />
            <Route
              path="/products/vayu/warranty"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <WarrantyVayu />
                </motion.div>
              }
            />
            <Route
              path="/products/vayu/returns"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ReturnsVayu />
                </motion.div>
              }
            />
            <Route
              path="/products/vayu/shipping-info"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-[#fdfdfc]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ShippingInfoVayu />
                </motion.div>
              }
            />

            {/* Razorpay-required */}
            <Route
              path="/cancellation-refund"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CancellationRefund />
                </motion.div>
              }
            />
            <Route
              path="/shipping-delivery"
              element={
                <motion.div
                  className="page-shell min-h-screen bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShippingDelivery />
                </motion.div>
              }
            />

            {/*
            // Optional:
            // <Route path="*" element={<NotFound />} />
            */}
          </Routes>
        </Suspense>
      </AnimatePresence>

      {/* Visible on all routes */}
      <CookieConsent />
    </>
  );
}
