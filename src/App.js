// src/App.js
import "./index.css"; // Tailwind + globals (base)
import "./App.css";   // Custom marketing + ByOnco/Vayu overrides

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { StackHandler } from "@stackframe/react";
import { stackClientApp } from "./stack/client";

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
import { Toaster } from "./components/ui/toaster";

// Pages - Regular imports
import ByOncoProWaitlist from "./pages/ByOncoProWaitlist";
import Careers from "./pages/Careers";
import GetStarted from "./pages/GetStarted";
import JoinWaitlist from "./pages/JoinWaitlist";
import GetMatched from "./pages/GetMatched";
import CancellationRefund from "./pages/CancellationRefund";
import ShippingDelivery from "./pages/ShippingDelivery";
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
import CancerPage from "./pages/CancerPage";
import CancerHub from "./pages/CancerHub";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentGate from "./components/PaymentGate";
import SecurityProtection from "./components/Security/SecurityProtection";
import PrivacyPolicyVayu from "./products/vayu/pages/PrivacyPolicyVayu";
import TermsOfServiceVayu from "./products/vayu/pages/TermsOfServiceVayu";
import RefundPolicyVayu from "./products/vayu/pages/RefundPolicyVayu";
import ContactInformationVayu from "./products/vayu/pages/ContactInformationVayu";
import CookiePolicyVayu from "./products/vayu/pages/CookiePolicyVayu";
import HelpCenterVayu from "./products/vayu/pages/HelpCenterVayu";
import WarrantyVayu from "./products/vayu/pages/WarrantyVayu";
import ReturnsVayu from "./products/vayu/pages/ReturnsVayu";
import ShippingInfoVayu from "./products/vayu/pages/ShippingInfoVayu";
import AboutVayu from "./products/vayu/pages/AboutVayu";
import VayuOrderPage from "./products/vayu/pages/VayuOrderPage";
import VayuCheckoutPage from "./products/vayu/pages/VayuCheckoutPage";
import VayuCheckoutSuccess from "./products/vayu/pages/VayuCheckoutSuccess";
import VayuWaitlist from "./products/vayu/pages/VayuWaitlist";
import VayuX from "./pages/VayuX";

// Pages - Lazy load legal pages for performance
// eslint-disable-next-line import/first
const Security = lazy(() => import("./pages/Security"));
// eslint-disable-next-line import/first
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
// eslint-disable-next-line import/first
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
// eslint-disable-next-line import/first
const MedicalDisclaimer = lazy(() => import("./pages/MedicalDisclaimer"));
// eslint-disable-next-line import/first
const AboutPage = lazy(() => import("./pages/AboutPage"));

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
   Stack Auth Handler Wrapper
------------------------------------------------------- */
function StackAuthHandlerWrapper({ app, location }) {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Debug logging - no secrets
    console.log('[StackAuthHandler] ===== OAuth Callback Handler =====');
    console.log('[StackAuthHandler] Full URL:', window.location.href);
    console.log('[StackAuthHandler] Hostname:', window.location.hostname);
    console.log('[StackAuthHandler] Origin:', window.location.origin);
    console.log('[StackAuthHandler] Pathname:', window.location.pathname);
    console.log('[StackAuthHandler] Search params:', window.location.search);
    console.log('[StackAuthHandler] Location prop:', location);
    console.log('[StackAuthHandler] Stack Auth App:', app ? '✅ Present' : '❌ Missing');
    console.log('[StackAuthHandler] Stack Auth Project ID:', app?.projectId ? app.projectId.substring(0, 6) + '...' : 'Missing');
    
    // Log handler path configuration
    if (app?.urls?.handler) {
      console.log('[StackAuthHandler] Handler URL:', app.urls.handler);
    }
    
    // Listen for OAuth messages
    const messageHandler = (e) => {
      console.log('[StackAuthHandler] OAuth message received:', e.type, e.data);
    };
    window.addEventListener("message", messageHandler);
    
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [location, app]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">OAuth Callback Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/authentication'}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Use full pathname including search params for StackHandler
  const fullLocation = window.location.pathname + window.location.search;

  try {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <StackHandler 
            app={app} 
            location={fullLocation}
            fullPage={false}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error('[StackAuthHandler] Error:', err);
    setError(err.message || 'Failed to process OAuth callback');
    return null;
  }
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

  // Domain canonicalization - force www.byoncocare.com
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If on byoncocare.com (without www), redirect to www
      if (hostname === 'byoncocare.com') {
        const newUrl = `https://www.byoncocare.com${window.location.pathname}${window.location.search}${window.location.hash}`;
        console.log('[App] Redirecting to canonical domain:', newUrl);
        window.location.replace(newUrl);
        return;
      }
    }
  }, []);

  return (
    <SecurityProtection
      disableRightClick={true}
      disableCopyPaste={true}
      disableTextSelection={false} // Only disable on sensitive blocks, not whole page
      sensitiveSelector="[data-sensitive], .sensitive-content, .pricing-card, .subscription-details"
      allowDevTools={true} // Allow DevTools for debugging
    >
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
            {/* Stack Auth Handler - MUST be FIRST route (before all others) */}
            {/* StackHandler handles ALL /handler/* routes including /handler/oauth-callback */}
            <Route
              path="/handler/*"
              element={
                <StackAuthHandlerWrapper 
                  app={stackClientApp} 
                  location={location.pathname}
                />
              }
            />

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

            {/* ----------- Authentication ----------- */}
            {/* Redirect /auth to /authentication for backward compatibility */}
            <Route
              path="/auth"
              element={<Navigate to="/authentication" replace />}
            />
            {/* Stack Auth Authentication Page */}
            <Route
              path="/authentication"
              element={
                <motion.div
                  className="page-shell min-h-screen"
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
                <ProtectedRoute>
                  <PaymentGate serviceName="Find Hospitals">
                    <motion.div
                      className="page-shell min-h-screen text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <FindHospitalsPage />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
              }
            />

            <Route
              path="/find-oncologists"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <FindOncologistsPage />
                </motion.div>
              }
            />

            <Route
              path="/rare-cancers"
              element={
                <ProtectedRoute>
                  <PaymentGate serviceName="Rare Cancers">
                    <motion.div
                      className="page-shell min-h-screen text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <RareCancersPage />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
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
                <ProtectedRoute>
                  <PaymentGate serviceName="Teleconsultation">
                    <motion.div
                      className="page-shell min-h-screen text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <TeleconsultationPage />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cost-calculator"
              element={
                <ProtectedRoute>
                  <PaymentGate serviceName="Cost Calculator">
                    <motion.div
                      className="page-shell min-h-screen text-gray-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CostCalculatorPage />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
              }
            />

            {/* ----------- Cancer Pages (SEO Optimized) ----------- */}
            <Route
              path="/cancer"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CancerHub />
                </motion.div>
              }
            />
            <Route
              path="/cancer/:cancerType"
              element={
                <motion.div
                  className="page-shell min-h-screen text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CancerPage />
                </motion.div>
              }
            />

            <Route
              path="/journey-builder"
              element={
                <ProtectedRoute>
                  <PaymentGate serviceName="AI Medical Tourism for Oncology">
                    <motion.div
                      className="min-h-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <JourneyBuilderPage />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
              }
            />

            <Route
              path="/journey-builder/plan/:planId"
              element={
                <ProtectedRoute>
                  <PaymentGate serviceName="AI Medical Tourism for Oncology">
                    <motion.div
                      className="min-h-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <JourneyPlanDetails />
                    </motion.div>
                  </PaymentGate>
                </ProtectedRoute>
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
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>}>
                  <motion.div
                    className="page-shell min-h-screen bg-[#fdfdfc]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TermsAndConditions />
                  </motion.div>
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>}>
                  <motion.div
                    className="page-shell min-h-screen bg-[#fdfdfc]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PrivacyPolicy />
                  </motion.div>
                </Suspense>
              }
            />
            <Route
              path="/medical-disclaimer"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>}>
                  <motion.div
                    className="page-shell min-h-screen bg-[#fdfdfc]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MedicalDisclaimer />
                  </motion.div>
                </Suspense>
              }
            />
            <Route
              path="/security"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>}>
                  <motion.div
                    className="page-shell min-h-screen bg-[#fdfdfc]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Security />
                  </motion.div>
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>}>
                  <motion.div
                    className="min-h-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AboutPage />
                  </motion.div>
                </Suspense>
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

            {/* Catch-all route - redirect to home if no route matches */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-white flex items-center justify-center p-4">
                  <div className="max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Page does not exist</h1>
                    <p className="text-gray-600 mb-4">The page you are looking for could not be found. Please check the URL and try again.</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {/* Always visible */}
      <CookieConsent />
      <Toaster />
    </SecurityProtection>
  );
}
