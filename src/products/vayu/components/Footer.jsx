// src/products/vayu/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

/* ---- Tiny inline icons (no external deps) ---- */
const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" strokeWidth="2" />
    <path d="M3 7l9 6 9-6" strokeWidth="2" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      strokeWidth="2"
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.62-3.07A19.5 19.5 0 0 1 3.13 12.8 19.8 19.8 0 0 1 .06 4.18 2 2 0 0 1 2.05 2h3A2 2 0 0 1 7 3.72c.12.93.33 1.84.62 2.72a2 2 0 0 1-.45 2.11L6 9a16 16 0 0 0 9 9l.45-.17a2 2 0 0 1 2.11.45c.88.29 1.79.5 2.72.62A2 2 0 0 1 22 16.92z"
    />
  </svg>
);

const MapPinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
    <circle cx="12" cy="11" r="2.5" strokeWidth="2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.46 6c-.77.34-1.6.57-2.46.68a4.2 4.2 0 0 0 1.84-2.32 8.4 8.4 0 0 1-2.67 1.02A4.18 4.18 0 0 0 12 8.13c0 .33.04.66.1.97a11.87 11.87 0 0 1-8.62-4.37 4.18 4.18 0 0 0 1.29 5.58 4.15 4.15 0 0 1-1.9-.52v.05c0 2.02 1.44 3.7 3.36 4.08-.35.1-.73.15-1.12.15-.27 0-.54-.03-.79-.08.54 1.7 2.12 2.94 3.98 2.97A8.4 8.4 0 0 1 2 19.54 11.86 11.86 0 0 0 8.29 21c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.36-.01-.54A8.27 8.27 0 0 0 22.46 6z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.06c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.81 2.67 4.81 6.15V24h-4v-7.1c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.71 1.84-2.71 3.74V24h-4V8z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.04.53 1.49.98.45.45.74.88.98 1.49.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a3.88 3.88 0 0 1-.98 1.49 3.88 3.88 0 0 1-1.49.98c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a3.88 3.88 0 0 1-1.49-.98 3.88 3.88 0 0 1-.98-1.49c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.53-1.04.98-1.49.45-.45.88-.74 1.49-.98.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2m0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.73.34 3.87.67 2.98 1 2.22 1.5 1.5 2.22.78 2.94.28 3.7-.05 4.59c-.33.86-.54 1.91-.6 3.18C-.01 9.05 0 9.46 0 12s.01 2.95.07 4.23c.06 1.27.27 2.32.6 3.18.33.89.83 1.65 1.55 2.37.72.72 1.48 1.22 2.37 1.55.86.33 1.91.54 3.18.6C8.33 24 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.32-.27 3.18-.6.89-.33 1.65-.83 2.37-1.55.72-.72 1.22-1.48 1.55-2.37.33-.86.54-1.91.6-3.18.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.32-.6-3.18C23.72 1.48 23.22.72 22.5 0c-.72-.72-1.48-1.22-2.37-1.55-.86-.33-1.91-.54-3.18-.6C15.67-.01 15.26 0 12 0z" />
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="18.4" cy="5.6" r="1.2" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.73v-3.62h3.09V8.41c0-3.06 1.87-4.73 4.6-4.73 1.31 0 2.43.1 2.76.14v3.2h-1.9c-1.49 0-1.78.71-1.78 1.75v2.3h3.56l-.46 3.62h-3.1V24h6.08c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" />
  </svg>
);

/* ---- Footer ---- */
const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              Vayu<span className="text-blue-400"> X</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India's first AI-powered smart glasses designed for professionals.
              Experience the future of augmented intelligence with Vayu X ByOnco.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                rel="noreferrer"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                rel="noreferrer"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                rel="noreferrer"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                rel="noreferrer"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/products/vayu#essential" className="hover:text-white transition-colors">
                  Vayu Essential
                </Link>
              </li>
              <li>
                <Link to="/products/vayu#medpro" className="hover:text-white transition-colors">
                  Vayu MedPro
                </Link>
              </li>
              <li>
                <Link to="/products/vayu#legaledge" className="hover:text-white transition-colors">
                  Vayu LegalEdge
                </Link>
              </li>
              {/* Accessories removed intentionally */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/products/vayu/help-center" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/products/vayu/warranty" className="hover:text-white transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/products/vayu/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/products/vayu/shipping-info" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <MailIcon className="w-4 h-4" />
                <a
                  href="mailto:contact@byoncocare.com"
                  className="hover:text-white transition-colors"
                >
                  contact@byoncocare.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4" />
                <a
                  href="tel:+919022792824"
                  className="hover:text-white transition-colors"
                >
                  +91-902-2792-824
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-4 h-4 mt-1" />
                <span className="hover:text-white transition-colors">
                  ITI Layout, Somasundarapalya, Bengaluru, Karnataka
                  <br />
                  India 560102
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Praesidio Care Private Limited. All rights reserved.
            </p>
          </div>

          {/* Vayu-specific legal links */}
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/products/vayu/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/products/vayu/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/products/vayu/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Made in India Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-full text-white text-sm font-semibold">
            🇮🇳 Proudly Made in India
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
