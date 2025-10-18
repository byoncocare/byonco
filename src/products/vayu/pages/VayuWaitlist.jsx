// src/products/vayu/pages/VayuWaitlist.jsx
import React from "react";
import { Link } from "react-router-dom";
import WaitlistForm from "../components/WaitlistForm";

export default function VayuWaitlist() {
  return (
    <main
      className="min-h-screen bg-gradient-to-br from-[#EEE9FF] via-[#E6F1FF] to-[#E6FFF7] text-gray-900"
      role="main"
      aria-labelledby="vayu-waitlist-title"
    >
      {/* Top Banner / Header */}
      <header className="w-full border-b border-white/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Brand (text-only; image removed) */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="ByOncoCare home">
            <span className="text-lg font-semibold tracking-tight group-hover:text-indigo-700 transition-colors">
              ByOnco<span className="text-indigo-700">Care</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/products/vayu" className="hover:text-indigo-700">
              Vayu X
            </Link>
            <Link to="/products/vayu/help-center" className="hover:text-indigo-700">
              Help Center
            </Link>
            <Link to="/products/vayu/shipping-info" className="hover:text-indigo-700">
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
            className="mt-4 text-3xl md:text-5xl font-semibold leading-tight"
          >
            Be first in line for{" "}
            <span className="bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Vayu X
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-700">
            Due to overwhelming response, we’re building more units. Share your details and our
            team will reach out.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-900 px-3 py-1 text-sm font-medium">
              🚚 Shipping starts <strong className="ml-1">March 2026</strong>
            </span>
            <span className="inline-flex items-center rounded-full bg-fuchsia-100 text-fuchsia-900 px-3 py-1 text-sm font-medium">
              📦 Currently shipping: <strong className="ml-1">Vayu X Essential</strong>
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="mt-10">
          <WaitlistForm />
        </div>

        <p className="mt-8 text-xs text-gray-600">
          “Built by people who understand your pain. Powered by people who can solve it.”
        </p>
      </section>

      {/* Footer Hint */}
      <footer className="mt-8 border-t border-white/60 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600">
          By continuing, you agree to our{" "}
          <Link to="/products/vayu/terms-of-service" className="text-indigo-700 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/products/vayu/privacy-policy" className="text-indigo-700 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </footer>
    </main>
  );
}
