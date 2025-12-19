// Main Vayu page component that assembles all sections
// Use this as a reference for how to assemble all components with FlashlightCursor

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import AICapabilities from './AICapabilities';
import ProductVariants from './ProductVariants';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import FlashlightCursor from './FlashlightCursor';
import '../App.css';

const VayuPage = ({ onPreOrder }) => {
  // Handle hash navigation on mount (for when navigating from other pages)
  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1); // Remove the '#'
      // Delay to ensure all components are rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="page-shell">
      {/* Background overlay layers - fixed positioning for continuous effect */}
      {/* Subtle grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}
        aria-hidden="true"
      />
      {/* Edge vignette overlay - Dark edges to focus center */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.75) 100%)'
        }}
        aria-hidden="true"
      />
      
      <FlashlightCursor />
      <Navbar />
      <HeroSection onPreOrder={onPreOrder} />
      <FeaturesSection />
      <AICapabilities />
      <ProductVariants onPreOrder={onPreOrder} />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default VayuPage;

