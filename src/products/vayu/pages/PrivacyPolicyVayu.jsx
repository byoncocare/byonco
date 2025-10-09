import React from "react";

export default function PrivacyPolicyVayu() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Vayu X Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: 02 Oct 2025</p>

      <section className="space-y-6">
        <p>
          This Privacy Policy explains how Praesidio Care Private Limited
          (“Vayu X”, “we”, “us”) handles your information for our smart-glasses
          products, mobile/desktop apps, and related cloud services specifically
          under the Vayu brand.
        </p>

        <h2 className="text-xl font-semibold">1. What We Collect (Vayu)</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account data: name, email/phone, shipping details.</li>
          <li>Device & diagnostics: firmware version, crash logs, usage events.</li>
          <li>Voice/OCR inputs (only when features are used) for on-device or
              cloud processing; we minimize retention and use pseudonymization where possible.</li>
          <li>Payments via partners; we do not store card details.</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use It</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Core features (AI assistance, translations, on-device prompts).</li>
          <li>Diagnostics, updates, and safety improvements.</li>
          <li>Fraud prevention and legal compliance.</li>
          <li>Marketing only with consent; easy opt-out.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Sensitive/Professional Use</h2>
        <p>
          For Vayu MedPro/LegalEdge modes, sensitive data may be processed with
          explicit consent and purpose limitation. We align with India’s DPDPA
          2023 and IT Act/SPDI Rules.
        </p>

        <h2 className="text-xl font-semibold">4. Sharing & Transfers</h2>
        <p>
          We share with processors (cloud/analytics/support) under contracts.
          Cross-border transfers use contractual safeguards.
        </p>

        <h2 className="text-xl font-semibold">5. Retention & Security</h2>
        <p>
          Retained only as needed; protected with encryption (in transit/at rest
          where supported), access controls, and logging.
        </p>

        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access/correction/deletion; withdraw consent prospectively.</li>
          <li>Contact our Grievance Officer for disputes.</li>
        </ul>

        <h2 className="text-xl font-semibold">7. Contact</h2>
        <p>
          Praesidio Care Private Limited, Nashik, Maharashtra, India 422009<br/>
          <a className="underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a>
        </p>
      </section>
    </main>
  );
}
