// src/App.js
import "./index.css"; // Tailwind + globals (base)
import "./App.css";   // Custom marketing + ByOnco/Vayu overrides

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Sections (old home page)
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

// Med tourism landing (new main home)
import MedTourismLanding from "./pages/MedTourismLanding";
import FindHospitalsPage from "./pages/FindHospitalsPage";
import RareCancersPage from "./pages/RareCancersPage";
import FindOncologistsPage from "./pages/FindOncologistsPage";
import SecondOpinionPage from "./pages/SecondOpinionPage";
import SecondOpinionPromptPage from "./pages/SecondOpinionPromptPage";
import RequireSecondOpinionEntitlement from "./components/RequireSecondOpinionEntitlement";
import TeleconsultationPage from "./pages/TeleconsultationPage";
import CostCalculatorPage from "./pages/CostCalculatorPage";
import JourneyBuilderPage from "./pages/JourneyBuilderPage";
import JourneyPlanDetails from "./pages/JourneyPlanDetails";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MedicalTourismWaitlistPage from "./pages/MedicalTourismWaitlistPage";
import PaymentTestPage from "./pages/PaymentTestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentGate from "./components/PaymentGate";
import PaidGate from "./components/PaidGate";
import SubscriptionGuard from "./components/SubscriptionGuard";
import SubscriptionExpiryWarning from "./components/SubscriptionExpiryWarning";
import SubscribePage from "./pages/SubscribePage";

// Vayu legal pages
import PrivacyPolicyVayu from "./products/vayu/pages/PrivacyPolicyVayu";
import TermsOfServiceVayu from "./products/vayu/pages/TermsOfServiceVayu";
import RefundPolicyVayu from "./products/vayu/pages/RefundPolicyVayu";
import ContactInformationVayu from "./products/vayu/pages/ContactInformationVayu";
import CookiePolicyVayu from "./products/vayu/pages/CookiePolicyVayu";

// Vayu support pages
import HelpCenterVayu from "./products/vayu/pages/HelpCenterVayu";
import WarrantyVayu from "./products/vayu/pages/WarrantyVayu";
import ReturnsVayu from "./products/vayu/pages/ReturnsVayu";
import ShippingInfoVayu from "./products/vayu/pages/ShippingInfoVayu";
import AboutVayu from "./products/vayu/pages/AboutVayu";
import VayuOrderPage from "./products/vayu/pages/VayuOrderPage";
import VayuCheckoutPage from "./products/vayu/pages/VayuCheckoutPage";
import VayuCheckoutSuccess from "./products/vayu/pages/VayuCheckoutSuccess";

// Vayu waitlist page
import VayuWaitlist from "./products/vayu/pages/VayuWaitlist";

// Import Vayu product page directly (no lazy loading to avoid cache issues)
import VayuX from "./pages/VayuX";

/* -------------------------------------------------------
   Global hash scroller (unchanged)
------------------------------------------------------- */
function HashScroller({ offset = 96 }) {
  const location = useLocation();

  useEffect(() => {
    const { pathname, hash } = location;
    if (!hash) return;

    const vayuPaths = ["/products/vayu", "/product/vayu"];
    if (!vayuPaths.includes(pathname)) return;

    const wanted = hash.slice(1);

    const tryScroll = () => {
      let el = document.getElementById(wanted);

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

/* -------------------------------------------------------
   Classic old home (/classic-home)
------------------------------------------------------- */
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

/* -------------------------------------------------------
   App Component (routing)
------------------------------------------------------- */
export default function App() {
  const location = useLocation();

  return (
    <>
      <SubscriptionExpiryWarning />
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
          {/* Global Vayu hash scroller */}
          <HashScroller offset={96} />

          <Routes location={location} key={location.pathname}>
            {/* MAIN HOME PAGE - MedTourismLanding */}
            <Route
              path="/"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <MedTourismLanding />
                </motion.div>
              }
            />

            {/* Classic old ByOnco homepage */}
            <Route path="/classic-home" element={<HomePage />} />

            {/* ----------- Core ByOnco flows ----------- */}
            <Route
              path="/get-started"
              element={
                <ProtectedRoute>
                  <motion.div
                    className="page-shell min-h-screen bg-white text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <GetStarted />
                  </motion.div>
                </ProtectedRoute>
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

            {/* ----------- Subscribe ----------- */}
            <Route
              path="/subscribe"
              element={
                <motion.div
                  className="page-shell min-h-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <SubscribePage />
                </motion.div>
              }
            />

            {/* ----------- Authentication ----------- */}
            {/* Redirect /auth to /authentication */}
            <Route
              path="/auth"
              element={<Navigate to="/authentication" replace />}
            />
            <Route
              path="/authentication"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <AuthPage />
                </motion.div>
              }
            />

            {/* ----------- Profile ----------- */}
            <Route
              path="/profile"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProfilePage />
                </motion.div>
              }
            />

            {/* ----------- Payment Test Page ----------- */}
            <Route
              path="/payment-test"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <PaymentTestPage />
                </motion.div>
              }
            />

            {/* ----------- Waitlist ----------- */}
            <Route
              path="/waitlist/medical-tourism"
              element={
                <ProtectedRoute>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MedicalTourismWaitlistPage />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            {/* ----------- New Medical Tourism Pages ----------- */}
            <Route
              path="/find-hospitals"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FindHospitalsPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/find-oncologists"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FindOncologistsPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/rare-cancers"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <RareCancersPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/second-opinion"
              element={
                <SecondOpinionPromptPage />
              }
            />

            <Route
              path="/second-opinion/form"
              element={
                <RequireSecondOpinionEntitlement>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SecondOpinionPage />
                  </motion.div>
                </RequireSecondOpinionEntitlement>
              }
            />

            <Route
              path="/teleconsultation"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TeleconsultationPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/cost-calculator"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="page-shell min-h-screen text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CostCalculatorPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/journey-builder"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="min-h-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <JourneyBuilderPage />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            <Route
              path="/journey-builder/plan/:planId"
              element={
                <SubscriptionGuard>
                  <motion.div
                    className="min-h-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <JourneyPlanDetails />
                  </motion.div>
                </SubscriptionGuard>
              }
            />

            {/* ----------- Company / Legal ----------- */}
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

            {/* ----------- ByOnco Pro Waitlist ----------- */}
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

            {/* ----------- Vayu product page ----------- */}
            <Route path="/products/vayu" element={<VayuX />} exact />

            {/* ----------- Vayu order / checkout ----------- */}
            <Route
              path="/products/vayu/order"
              element={<VayuOrderPage />}
            />
            <Route
              path="/products/vayu/checkout"
              element={<VayuCheckoutPage />}
            />
            <Route
              path="/products/vayu/checkout/success"
              element={<VayuCheckoutSuccess />}
            />

            {/* ----------- Vayu About page ----------- */}
            <Route
              path="/products/vayu/about"
              element={<AboutVayu />}
            />

            {/* ----------- Vayu waitlist ----------- */}
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

            {/* Old → new path */}
            <Route
              path="/products/vayu/preorder"
              element={<Navigate to="/products/vayu/waitlist" replace />}
            />

            <Route
              path="/product/vayu"
              element={<Navigate to="/products/vayu" replace />}
            />

            {/* ----------- Vayu legal pages ----------- */}
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
                path="/products/vayu/refund-policy"
                element={<RefundPolicyVayu />}
              />
              <Route
                path="/products/vayu/contact-information"
                element={<ContactInformationVayu />}
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

            {/* ----------- Vayu support ----------- */}
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
              element={<WarrantyVayu />}
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

            {/* ----------- Razorpay-required ----------- */}
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

            {/* Optional 404 - not added */}
          </Routes>
        </Suspense>
      </AnimatePresence>

      {/* Always visible */}
      <CookieConsent />
    </>
  );
}
