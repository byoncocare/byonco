import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="bg-gray-900 text-white py-10 px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap gap-6 items-center justify-between text-center md:text-left"
      >
        {/* Left Section */}
        <div className="flex-1 min-w-[250px]">
          <h4 className="text-xl font-bold tracking-wide">ByOnco</h4>
          <p className="text-sm text-gray-400 mt-1">
            © 2025 PraesidioCare Pvt. Ltd. All rights reserved.
          </p>
        </div>

        {/* Middle Section - Contact Info */}
        <div className="flex-1 min-w-[250px] space-y-3">
          <div className="flex justify-center md:justify-start items-center gap-3 text-gray-300">
            <FaEnvelope aria-hidden="true" />
            <a
              href="mailto:contact@byoncocare.com"
              className="hover:text-white underline underline-offset-2 transition"
              aria-label="Email ByOnco"
            >
              contact@byoncocare.com
            </a>
          </div>
          <div className="text-sm text-gray-300 space-x-3">
            <a
              href="/privacy"
              className="hover:text-white underline-offset-2 hover:underline transition"
            >
              Privacy Policy
            </a>
            <span>·</span>
            <a
              href="/terms"
              className="hover:text-white underline-offset-2 hover:underline transition"
            >
              Terms
            </a>
            <span>·</span>
            <a
              href="/careers"
              className="hover:text-white underline-offset-2 hover:underline transition"
            >
              Careers
            </a>
          </div>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex-1 min-w-[250px] flex justify-center md:justify-end gap-4 text-gray-400">
          <a
            href="https://linkedin.com/company/byoncocare"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ByOnco LinkedIn"
            className="hover:text-white transition"
          >
            <FaLinkedin size={18} />
          </a>
          {/* Optional Twitter or more */}
          {/* <a
            href="https://twitter.com/byoncocare"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ByOnco Twitter"
            className="hover:text-white transition"
          >
            <FaTwitter size={18} />
          </a> */}
        </div>
      </motion.div>
    </footer>
  );
}
