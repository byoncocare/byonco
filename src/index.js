// src/index.js

// ---- Polyfills (fix blank screen on some iPhones) ----
import 'core-js/stable';              // ES features (Promise, Array.from, etc.)
import 'regenerator-runtime/runtime'; // async/await, generators
import 'whatwg-fetch';                // window.fetch()
// ------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// If you ever deploy under a sub-path (e.g., /byonco/),
// PUBLIC_URL will make BrowserRouter generate correct URLs.
const BASENAME = process.env.PUBLIC_URL || "/";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Optional: measure performance (logs or send to analytics)
reportWebVitals();
