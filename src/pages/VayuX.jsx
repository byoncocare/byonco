// src/pages/VayuX.jsx
import React, { useEffect, useState } from "react";
import "../products/vayu/App.css";

import Navbar from "../products/vayu/components/Navbar";
import HeroSection from "../products/vayu/components/HeroSection";
import PreOrderPage from "../products/vayu/components/PreOrderPage";
import FeaturesSection from "../products/vayu/components/FeaturesSection";
import ProductVariants from "../products/vayu/components/ProductVariants";
import AICapabilities from "../products/vayu/components/AICapabilities";
import TestimonialsSection from "../products/vayu/components/TestimonialsSection";
import FAQSection from "../products/vayu/components/FAQSection";
import Footer from "../products/vayu/components/Footer";

export default function VayuX() {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);

  // land on /products/vayu/preorder -> open preorder view
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.endsWith("/preorder")) {
      setPage("preorder");
    }
  }, []);

  // small entrance delay (keeps your loading animation)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // keep URL in sync when user switches page (home <-> preorder)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const base = "/products/vayu";
    const url = page === "preorder" ? `${base}/preorder` : base;
    if (window.location.pathname !== url) {
      window.history.replaceState({}, "", url);
    }
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">
            Vayu<span className="text-blue-600"> X</span>
          </h2>
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  if (page === "preorder") {
    return <PreOrderPage onBack={() => setPage("home")} />;
  }

  return (
    <div className="page-shell">
      <Navbar />
      <HeroSection onPreOrder={() => setPage("preorder")} />

      {/* About + Features */}
      <section id="about">
        <section id="features">
          <FeaturesSection />
        </section>
      </section>

      {/* AI Capabilities */}
      <section id="capabilities">
        <AICapabilities />
      </section>

      {/* Variants / Pricing */}
      <section id="variants">
        <ProductVariants onPreOrder={() => setPage("preorder")} />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* FAQ */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* CTA section to satisfy Navbar's scrollTo('preorder') */}
      <section id="preorder">
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of professionals who have already pre-ordered Vayu X
            </p>
            <button
              onClick={() => setPage("preorder")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Pre-Order Now — Starting at ₹49,999
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
