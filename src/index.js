// src/index.js

// ---- Polyfills (fix blank screen on some iPhones / older browsers) ----
import "core-js/stable";              // ES features (Promise, Array.from, etc.)
import "regenerator-runtime/runtime"; // async/await, generators
import "whatwg-fetch";                // window.fetch()
// ----------------------------------------------------------------------

// Razorpay modal CSS overrides - ensure payment gateway is visible
import "./styles/razorpay-overrides.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import reportWebVitals from "./reportWebVitals";

// Security initialization
import { initializeWindowSanitization } from "./utils/security/windowSanitizer";
import { initializeRequestInterceptors } from "./utils/security/requestInterceptor";
import axios from 'axios';
import { createSecureAxios } from "./utils/security/requestInterceptor";

// Initialize security on app load
if (typeof window !== 'undefined') {
  initializeWindowSanitization();
  initializeRequestInterceptors();
  
  // Apply security interceptors to default axios instance
  // This ensures all axios calls include fingerprinting
  try {
    createSecureAxios(axios);
  } catch (e) {
    console.warn('Failed to secure axios instance:', e);
  }
}

// ---- iOS Safari (12.x / some webviews) MediaQueryList shim ----
// Older iOS only has addListener/removeListener; this maps change events.
(function () {
  if (typeof window === "undefined" || !window.matchMedia) return;

  const mql = window.matchMedia("(min-width: 0px)");
  if (mql && !mql.addEventListener && mql.addListener) {
    const proto = Object.getPrototypeOf(mql);
    proto.addEventListener = function (type, listener) {
      if (type === "change") this.addListener(listener);
    };
    proto.removeEventListener = function (type, listener) {
      if (type === "change") this.removeListener(listener);
    };
  }
})();

// If you ever deploy under a sub-path (e.g., /byonco/),
// PUBLIC_URL will make BrowserRouter generate correct URLs.
const BASENAME = process.env.PUBLIC_URL || "/";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={BASENAME}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Optional: measure performance (logs or send to analytics)
reportWebVitals();
