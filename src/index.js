// src/index.js

// ---- Polyfills (fix blank screen on some iPhones / older browsers) ----
import "core-js/stable";              // ES features (Promise, Array.from, etc.)
import "regenerator-runtime/runtime"; // async/await, generators
import "whatwg-fetch";                // window.fetch()
// ----------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

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
    <BrowserRouter basename={BASENAME}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Optional: measure performance (logs or send to analytics)
reportWebVitals();
