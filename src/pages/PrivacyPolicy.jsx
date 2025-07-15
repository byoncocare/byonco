// src/pages/PrivacyPolicy.jsx

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-4 md:px-16 py-12 font-serif text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-2">Privacy Policy</h1>
        <p className="italic text-gray-500 mb-6">Last Updated: July 15, 2025</p>

        <p className="mb-6">
          This Privacy Policy explains how PraesidioCare Private Limited ("ByOnco", "we", "our", or "us") collects,
          uses, stores, and protects personal and medical information ("Personal Information") when you interact
          with our services. This applies to our websites, ByOnco mobile and web apps, and any related services,
          including our AI-based cancer care navigation platform ("Services"). By using our Services, you consent to
          the terms outlined in this Privacy Policy.
        </p>

        <h2 className="text-2xl font-medium mb-4">1. Information We Collect</h2>
        <h3 className="text-lg font-semibold mb-2">A. Information You Provide</h3>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>Account Details</strong>: Full name, phone number, email, city, and basic profile data.</li>
          <li><strong>Patient Data</strong>: Cancer stage, treatment details, hospital preferences, financial needs, and other health-related inputs.</li>
          <li><strong>Communications</strong>: When you contact us via WhatsApp, chat, email, or form submissions.</li>
          <li><strong>Payment Details</strong>: Where applicable, details like cardholder name, masked card information, billing address.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">B. Information We Collect Automatically</h3>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>Usage Data</strong>: IP address, device type, browser, OS, screen resolution, time spent on app or pages.</li>
          <li><strong>Cookies and Local Storage</strong>: To personalize experience, retain session data, and offer relevant content.</li>
          <li><strong>Device & Diagnostic Logs</strong>: For security, troubleshooting, and improving app experience.</li>
        </ul>

        <h2 className="text-2xl font-medium mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>Hospital Matching & Care Navigation</strong>: To help recommend best-fit cancer hospitals based on your profile.</li>
          <li><strong>Communications</strong>: To send confirmations, alerts, WhatsApp messages, and respond to queries.</li>
          <li><strong>Service Optimization</strong>: Analyze aggregated data to improve user experience, routes, and performance.</li>
          <li><strong>Personalization</strong>: Tailor hospital and treatment suggestions based on user patterns.</li>
          <li><strong>Compliance</strong>: Ensure adherence to Indian laws like IT Act, DISHA guidelines, and data protection frameworks.</li>
        </ul>

        <h2 className="text-2xl font-medium mb-4">3. Data Sharing & Disclosure</h2>
        <p className="mb-4">We do <strong>not</strong> sell your personal data. We only share:</p>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>With Healthcare Partners</strong>: Hospitals and labs you engage with (only post-consent).</li>
          <li><strong>With Trusted Vendors</strong>: Including cloud storage providers, payment gateways, and analytics services.</li>
          <li><strong>For Legal Reasons</strong>: If required by Indian law enforcement or judiciary.</li>
          <li><strong>Business Transfers</strong>: If ByOnco undergoes merger or acquisition.</li>
        </ul>

        <h2 className="text-2xl font-medium mb-4">4. Data Security Measures</h2>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>Encryption</strong>: HTTPS/TLS for data in transit. AES encryption for data at rest.</li>
          <li><strong>Access Control</strong>: Only essential staff and systems have access based on role.</li>
          <li><strong>Audit Logs</strong>: All critical actions and logins are tracked securely.</li>
          <li><strong>Breach Notification</strong>: In the event of a data breach, we’ll notify affected parties as required under Indian law.</li>
        </ul>

        <h2 className="text-2xl font-medium mb-4">5. Data Retention</h2>
        <p className="mb-6">
          We retain user information for as long as necessary to:
          <br />• Provide services
          <br />• Comply with medical or regulatory obligations (e.g., Ayushman Bharat scheme records)
          <br />• Improve platform accuracy
          <br />After that, data is either anonymized or deleted securely.
        </p>

        <h2 className="text-2xl font-medium mb-4">6. Your Rights</h2>
        <ul className="list-disc ml-6 mb-6 space-y-2">
          <li><strong>Access</strong> to your stored information</li>
          <li><strong>Rectification</strong> of inaccurate details</li>
          <li><strong>Deletion</strong>, subject to legal limitations</li>
          <li><strong>Data Portability</strong> (where feasible)</li>
          <li><strong>Opt-out</strong> of marketing or communications via <a className="underline text-blue-600" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a></li>
        </ul>

        <h2 className="text-2xl font-medium mb-4">7. Consent & Compliance</h2>
        <p className="mb-6">
          By using ByOnco, you:
          <br />• Consent to us processing your health-related data
          <br />• Confirm you’re either the patient or an authorized caregiver
          <br />• Agree to abide by the Terms and Conditions and Privacy Policy
          <br /><br />
          We comply with India’s evolving data laws, including those under the <strong>Digital Personal Data Protection Act, 2023</strong> and healthcare-specific norms.
        </p>

        <h2 className="text-2xl font-medium mb-4">8. Changes to this Privacy Policy</h2>
        <p className="mb-6">
          We may revise this policy periodically. Any changes will be posted on this page with a new effective date.
          Continued use of ByOnco after updates constitutes your consent to the changes.
        </p>

        <h2 className="text-2xl font-medium mb-4">9. Contact Us</h2>
        <p className="mb-2"><strong>Email</strong>: <a href="mailto:contact@byoncocare.com" className="underline text-blue-600">contact@byoncocare.com</a></p>
        <p><strong>Registered Office</strong>: PraesidioCare Private Limited, Nashik, Maharashtra, India</p>

        <div className="mt-10 text-lg italic text-gray-700">
          ByOnco — Built by people who understand your pain. Powered by people who can solve it.
        </div>
      </div>
    </main>
  );
}
