// src/products/vayu/pages/VayuWaitlist.jsx
import React from "react";
import { Link } from "react-router-dom";
import WaitlistForm from "../components/WaitlistForm";
import "../App.css";

export default function VayuWaitlist() {
  return (
    <main
      className="min-h-screen page-shell text-white"
      role="main"
      aria-labelledby="vayu-waitlist-title"
    >
      {/* Top Banner / Header */}
      <header className="w-full border-b border-white/10 bg-[#070C0B]/80 backdrop-blur supports-[backdrop-filter]:bg-[#070C0B]/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Brand (text-only; image removed) */}
          <Link to="/products/vayu" className="flex items-center gap-2 group" aria-label="Vayu X home">
            <span className="text-lg font-semibold tracking-tight text-white group-hover:text-[#1E5BFF] transition-colors">
              Vayu<span className="text-[#1E5BFF]"> X</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/products/vayu/help-center" className="text-white/70 hover:text-white transition-colors">
              Help Center
            </Link>
            <Link to="/products/vayu/shipping-info" className="text-white/70 hover:text-white transition-colors">
              Shipping
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero / Intro */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-3 py-1 text-xs font-medium shadow">
            VAYU X — Join the Waitlist
          </p>

          <h1
            id="vayu-waitlist-title"
            className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white"
          >
            Be first in line for{" "}
            <span className="text-[#1E5BFF]">
              Vayu X
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70">
            Due to overwhelming response, we're building more units. Share your details and our
            team will reach out.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm">
              🚚 Shipping starts <strong className="ml-1">March 2026</strong>
            </span>
            <span className="inline-flex items-center rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm">
              📦 Currently shipping: <strong className="ml-1">Vayu X Essential</strong>
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="mt-10">
          <WaitlistForm />
        </div>

        <p className="mt-8 text-xs text-white/60">
          "Built by people who understand your pain. Powered by people who can solve it."
        </p>
      </section>

      {/* Footer Hint */}
      <footer className="mt-8 border-t border-white/10 bg-[#070C0B]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-white/60">
          By continuing, you agree to our{" "}
          <Link to="/products/vayu/terms-of-service" className="text-[#1E5BFF] hover:text-[#2F6BFF] hover:underline transition-colors">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/products/vayu/privacy-policy" className="text-[#1E5BFF] hover:text-[#2F6BFF] hover:underline transition-colors">
            Privacy Policy
          </Link>
          .
        </div>
      </footer>
    </main>
  );
}
