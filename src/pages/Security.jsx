// src/pages/Security.jsx
import React from 'react';

export default function Security() {
  return (
    <div className="min-h-screen bg-[#fdfdfc] px-6 py-16 sm:px-12 md:px-28 lg:px-40 text-[#1a1a1a] font-serif">
      <h1 className="text-4xl font-semibold mb-2">Security at ByOnco</h1>
      <p className="italic text-gray-600 mb-6">Last Updated: July 15, 2025</p>

      <p className="text-lg leading-7 mb-8">
        At ByOnco, the security of your data—medical, personal, or financial—is at the core of everything we build. We are committed to protecting the confidentiality,
        integrity, and availability of your information through advanced security practices, continuous monitoring, and compliance with applicable Indian data protection
        laws, including the Digital Personal Data Protection Act (DPDP Act), 2023.
      </p>

      <h2 className="text-2xl font-semibold mb-4">🔒 Our Security Measures
      </h2>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-1">1. End-to-End Data Encryption</h3>
        <ul className="list-disc ml-6 text-base leading-7">
          <li>In transit: HTTPS/TLS 1.3 to secure all API and web communications.</li>
          <li>At rest: AES-256 encryption for databases and storage.</li>
          <li>OTP and personal identifiers are hashed using salted algorithms.</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-1">2. Role-Based Access Controls (RBAC)</h3>
        <ul className="list-disc ml-6 text-base leading-7">
          <li>Limited to authorized personnel</li>
          <li>Controlled using RBAC and time-limited session tokens</li>
          <li>Logged and auditable</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-1">3. Authentication and Identity Management</h3>
        <ul className="list-disc ml-6 text-base leading-7">
          <li>Secure OTP-based login via Firebase Auth</li>
          <li>Biometric authentication (for future mobile release)</li>
          <li>Multi-factor authentication for internal tools and admin portals</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-1">4. Continuous Monitoring & Intrusion Detection</h3>
        <ul className="list-disc ml-6 text-base leading-7">
          <li>Suspicious activity is flagged in real-time</li>
          <li>Automated alerts are integrated with our internal response workflows</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-1">5. Regular Vulnerability Assessments</h3>
        <ul className="list-disc ml-6 text-base leading-7">
          <li>Quarterly penetration testing with certified ethical hackers</li>
          <li>Monthly vulnerability scans and codebase security audits</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">🛡️ Our Commitment to Data Protection
      </h2>
      <ul className="list-disc ml-6 text-base leading-7 mb-8">
        <li>Complying with India's DPDP Act and other relevant medical privacy regulations</li>
        <li>Never sharing your data with hospitals or labs without explicit user consent</li>
        <li>Ensuring all hospital-side integrations follow secure API and sandboxed architectures</li>
        <li>Training our team regularly in HIPAA-equivalent data security best practices</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">🚨 Breach Response Protocol
      </h2>
      <ul className="list-disc ml-6 text-base leading-7 mb-8">
        <li>Affected users will be notified within 72 hours</li>
        <li>Regulatory authorities will be informed, as per DPDP Act guidelines</li>
        <li>Internal audits and forensic analysis will be triggered immediately</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">🤝 Transparency and Trust
      </h2>
      <p className="text-lg leading-7 mb-8">
        We believe security is not a feature—it's a promise. We continuously invest in improving our infrastructure and uphold best practices across engineering, design, and operations.
      </p>

      <h2 className="text-2xl font-semibold mb-2">📩 Contact Our Security Team
      </h2>
      <p className="text-base leading-7">
        Have concerns or questions about your data’s safety?<br />
        <strong>Email</strong>: <a href="mailto:security@byoncocare.com" className="underline text-blue-600">security@byoncocare.com</a><br />
        <strong>Subject</strong>: "Security Inquiry – [Your Concern]"
      </p>
    </div>
  );
}
