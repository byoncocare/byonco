// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact" role="contentinfo" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top: 4-column grid (matches Vayu X) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-8"
        >
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              By<span className="text-purple-400">Onco</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India’s AI-powered cancer care navigator. Find the right hospital
              by wait time, budget, insurance/schemes, and outcomes—fast.
            </p>

            {/* Social Links (kept your LinkedIn; others optional/placeholders) */}
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/company/byoncocare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ByOnco on LinkedIn"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>

              {/* Uncomment and set when ready */}
              {/* <a
                href="https://twitter.com/byoncocare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ByOnco on X/Twitter"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a> */}

              <a
                href="#"
                aria-label="ByOnco on Instagram"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                rel="noreferrer"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="ByOnco on Facebook"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                rel="noreferrer"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products (use your existing Vayu product link) */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="/product/vayu"
                  className="hover:text-white transition-colors"
                >
                  Vayu
                </a>
              </li>
            </ul>
          </div>

          {/* Support / Resources (keep “Careers” you already expose) */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact (keeps your email + adds phone/address consistent with Vayu X style) */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4" aria-hidden="true" />
                <a
                  href="mailto:contact@byoncocare.com"
                  className="hover:text-white transition-colors"
                >
                  contact@byoncocare.com
                </a>
              </div>

              {/* Optional: keep if this is your official number */}
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4" aria-hidden="true" />
                <a
                  href="tel:+919022792824"
                  className="hover:text-white transition-colors"
                >
                  +91-902-2792-824
                </a>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-4 h-4 mt-1" aria-hidden="true" />
                <span className="hover:text-white transition-colors">
                  ITI Layout, Somasundarapalya, Bengaluru, Karnataka
                  <br />
                  India 560102
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar (matches Vayu X placement & style) */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} PraesidioCare Pvt. Ltd. All
              rights reserved.
            </p>
          </div>

          {/* Your legal routes preserved */}
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Terms and Conditions
            </a>
            <a href="/security" className="hover:text-white transition-colors">
              Security
            </a>
          </div>
        </div>

        {/* Made in India badge (same visual affordance as Vayu X) */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 rounded-full text-white text-sm font-semibold">
            🇮🇳 Proudly Made in India
          </div>
        </div>
      </div>
    </footer>
  );
}
