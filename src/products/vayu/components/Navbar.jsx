// src/products/vayu/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // NEW: unified handler to go to the waitlist page
  const goToWaitlist = () => {
    navigate('/products/vayu/waitlist');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              Vayu<span className="text-blue-600"> X</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('variants')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </button>
            </div>
          </div>

          {/* CTA Button (Desktop) -> Waitlist */}
          <div className="hidden md:block">
            <Button
              onClick={goToWaitlist}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              aria-label="Pre-Order and join the Vayu X waitlist"
            >
              Pre-Order Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('variants')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>

            {/* CTA (Mobile) -> Waitlist */}
            <Button
              onClick={goToWaitlist}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              aria-label="Pre-Order"
            >
              Pre-Order Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
