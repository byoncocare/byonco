// src/components/CookieConsent.jsx
/* global dataLayer */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LS_KEY = "byonco_cookie_consent_v1";
const DEFAULTS = { essential: true, analytics: false, marketing: false, time: 0 };

export default function CookieConsent({ brandClass = "bg-[#22242A] text-white" }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [settings, setSettings] = useState(false);

  // Init + migrate old single-flag key
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved) {
        setPrefs(saved);
        applyConsent(saved);
        return;
      }
      const legacy = localStorage.getItem("cookieConsent"); // 'accepted' | 'declined'
      if (legacy === "accepted" || legacy === "declined") {
        const migrated = {
          essential: true,
          analytics: legacy === "accepted",
          marketing: legacy === "accepted",
          time: Date.now(),
        };
        localStorage.setItem(LS_KEY, JSON.stringify(migrated));
        setPrefs(migrated);
        applyConsent(migrated);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const save = (next) => {
    const payload = { ...next, time: Date.now() };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    applyConsent(payload);
  };

  // Enable/disable vendors based on consent (Google Analytics optional)
  const applyConsent = (c) => {
    const GA = import.meta.env.VITE_GA_ID_BYONCO; // set in Vercel
    const existing = document.getElementById("ga-script");
    if (existing) existing.remove();

    // Only attach GA when analytics is allowed
    if (c.analytics && GA) {
      const s = document.createElement("script");
      s.id = "ga-script";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
      document.head.appendChild(s);

      const init = document.createElement("script");
      init.appendChild(
        document.createTextNode(`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA}', { anonymize_ip: true });
        `),
      );
      document.head.appendChild(init);
    }
  };

  const acceptAll = () => {
    const n = { essential: true, analytics: true, marketing: true };
    setPrefs(n);
    save(n);
    setOpen(false);
  };

  const rejectAll = () => {
    const n = { essential: true, analytics: false, marketing: false };
    setPrefs(n);
    save(n);
    setOpen(false);
  };

  const saveChoices = () => {
    save(prefs);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6 pointer-events-none"
          aria-live="polite"
        >
          {/* Card */}
          <div
            className={`mx-auto max-w-4xl rounded-2xl shadow-xl border border-white/10 ${brandClass} pointer-events-auto`}
            role="dialog"
            aria-labelledby="cookie-title"
          >
            {!settings ? (
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex-1">
                  <h3 id="cookie-title" className="text-lg font-semibold">
                    We use cookies
                  </h3>
                  <p className="text-sm opacity-90">
                    Essential cookies run the site. Optional analytics help us improve. Manage choices anytime in Cookie
                    Settings. See our{" "}
                    <a href="/privacy" className="underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/cookies" className="underline">
                      Cookie Policy
                    </a>
                    .
                  </p>
                </div>
                <div className="flex gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setSettings(true)}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="px-4 py-2 rounded-lg bg-[#FFB457] text-black font-semibold hover:opacity-90"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Cookie Settings</h3>
                <div className="space-y-4">
                  <Toggle label="Essential" desc="Required for core features." checked disabled />
                  <Toggle
                    label="Analytics"
                    desc="Anonymous usage analytics."
                    checked={prefs.analytics}
                    onChange={(v) => setPrefs({ ...prefs, analytics: v })}
                  />
                  <Toggle
                    label="Marketing"
                    desc="Measurement/remarketing."
                    checked={prefs.marketing}
                    onChange={(v) => setPrefs({ ...prefs, marketing: v })}
                  />
                </div>
                <div className="mt-6 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSettings(false)}
                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={saveChoices}
                    className="px-4 py-2 rounded-lg bg-[#FFB457] text-black font-semibold hover:opacity-90"
                  >
                    Save choices
                  </button>
                </div>
                <p className="mt-3 text-xs opacity-70">
                  Questions? Write to{" "}
                  <a className="underline" href="mailto:contact@byoncocare.com">
                    contact@byoncocare.com
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toggle({ label, desc, checked = false, onChange = () => {}, disabled = false }) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? "opacity-70" : ""}`}>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm opacity-80">{desc}</div>
      </div>
    </label>
  );
}
