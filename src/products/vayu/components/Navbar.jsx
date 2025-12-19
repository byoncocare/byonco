// src/products/vayu/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // Check if we're on the landing page
    const currentPath = window.location.pathname;
    const isOnLandingPage = currentPath === '/products/vayu' || currentPath === '/products/vayu/';
    
    if (!isOnLandingPage) {
      // Navigate to landing page with hash - VayuPage will handle scrolling
      navigate(`/products/vayu#${sectionId}`);
    } else {
      // Already on landing page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If element not found immediately, try after a short delay (in case page is still loading)
        setTimeout(() => {
          const delayedElement = document.getElementById(sectionId);
          if (delayedElement) {
            delayedElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setIsMenuOpen(false);
  };
  
  // Handle hash navigation on landing page load
  useEffect(() => {
    const handleHashNavigation = () => {
      const currentPath = window.location.pathname;
      const isOnLandingPage = currentPath === '/products/vayu' || currentPath === '/products/vayu/';
      
      if (isOnLandingPage && window.location.hash) {
        const sectionId = window.location.hash.substring(1); // Remove the '#'
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300); // Delay to ensure page is fully rendered
      }
    };
    
    // Handle hash on initial load
    handleHashNavigation();
    
    // Handle hash changes (e.g., browser back/forward)
    window.addEventListener('hashchange', handleHashNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, []);

  // NEW: unified handler to go to the waitlist page
  const goToWaitlist = () => {
    navigate('/products/vayu/waitlist');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full glass-header z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/products/vayu')}
              className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
            >
              <span className="text-[#1E5BFF]">Vayu</span><span className="text-[#1E5BFF]"> X</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => navigate('/products/vayu/about')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('variants')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          {/* CTA Button (Desktop) -> Waitlist */}
          <div className="hidden md:block">
            <button
              onClick={goToWaitlist}
              className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full"
              aria-label="Pre-Order and join the Vayu X waitlist"
            >
              <span className="absolute inset-0 bg-[#1E5BFF] rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative bg-[#020205] group-hover:bg-[#0a2570] text-white px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors z-10 block w-full h-full flex items-center">
                Pre-Order Now
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel-sm border-t border-white/5">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                navigate('/products/vayu/about');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('variants')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </button>

            {/* CTA (Mobile) -> Waitlist */}
            <button
              onClick={goToWaitlist}
              className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full w-full mt-2"
              aria-label="Pre-Order"
            >
              <span className="absolute inset-0 bg-[#1E5BFF] rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative bg-[#020205] group-hover:bg-[#0a2570] text-white px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors z-10 block w-full h-full flex items-center justify-center">
                Pre-Order Now
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
