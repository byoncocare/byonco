// src/pages/TermsAndConditions.jsx
import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#fdfdfc] px-6 py-20 sm:px-10 md:px-32 lg:px-60 font-serif text-gray-900 leading-relaxed">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Terms and Conditions</h1>
      <p className="italic text-sm mb-8">Last Updated: July 15, 2025</p>

      <p className="mb-6">
        These Terms and Conditions ("Terms") govern your access to and use of the ByOnco platform and related services
        (collectively, the "Services"). By using our Services, you agree to be bound by these Terms. If you do not
        agree, you must not access or use the Services.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">1. About ByOnco</h2>
      <h3 className="font-bold mb-1">1.1 Company Overview</h3>
      <p className="mb-4">
        ByOnco, operated by PraesidioCare Private Limited, is a healthcare intelligence platform that helps cancer
        patients and their families find the best hospitals, labs, doctors, and financial support options. The platform
        uses AI, real-time data, and human expertise to match patients based on location, budget, disease type,
        insurance, and government scheme eligibility.
      </p>

      <h3 className="font-bold mb-1">1.2 Legal Compliance and Patient Privacy</h3>
      <p className="mb-6">
        ByOnco adheres to the data privacy laws applicable in India, including the Digital Personal Data Protection Act,
        2023. While ByOnco is not a healthcare provider, we ensure any health information processed is treated with the
        highest standards of confidentiality and security.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">2. Acceptance and Modifications</h2>
      <h3 className="font-bold mb-1">2.1 Acceptance</h3>
      <p className="mb-4">
        By using the Services, you confirm that you have read, understood, and agreed to be bound by these Terms and our
        Privacy Policy.
      </p>

      <h3 className="font-bold mb-1">2.2 Modifications</h3>
      <p className="mb-6">
        We reserve the right to update or modify these Terms at any time. Continued use of the Services following any
        changes implies your acceptance of the revised Terms.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">3. Description of Services</h2>
      <h3 className="font-bold mb-1">3.1 Scope</h3>
      <ul className="list-disc pl-5 mb-4">
        <li>Real-time cancer hospital recommendations based on multiple parameters</li>
        <li>Bed and queue availability updates (where available)</li>
        <li>Cost comparisons and support for patients under schemes like PMJAY, MPJAY, etc.</li>
        <li>Lab test bookings and appointment scheduling</li>
        <li>Cancer data tracking across India</li>
      </ul>

      <h3 className="font-bold mb-1">3.2 Technology and Human Support</h3>
      <p className="mb-4">
        We use AI algorithms to assist in matching and recommendations. Human intervention may occur to improve accuracy
        or handle special cases. Final responsibility for healthcare decisions lies with the patient and care provider.
      </p>

      <h3 className="font-bold mb-1">3.3 Availability</h3>
      <p className="mb-6">
        We aim for high availability, but the Services may experience downtime due to maintenance or unforeseen issues.
        Service is provided on an "as is" basis.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">4. Data Ownership and Security</h2>
      <h3 className="font-bold mb-1">4.1 Ownership</h3>
      <p className="mb-4">
        You retain ownership of all personal and health-related information submitted. You grant ByOnco a limited,
        revocable license to use this data for providing and improving the Services.
      </p>

      <h3 className="font-bold mb-1">4.2 Privacy & Compliance</h3>
      <p className="mb-4">
        Data is handled in accordance with our Privacy Policy. We do not sell your data. Your use of the platform must
        comply with applicable Indian laws.
      </p>

      <h3 className="font-bold mb-1">4.3 Security</h3>
      <p className="mb-6">
        We implement strong encryption, access controls, and monitoring to safeguard your data. In case of a data
        breach, we will notify you as required by law.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">5. User Responsibilities</h2>
      <ul className="list-disc pl-5 mb-6">
        <li>Submit only accurate and lawful information</li>
        <li>Do not attempt to breach security or misuse the platform</li>
        <li>Do not impersonate others or use the platform for unauthorized purposes</li>
      </ul>
      <p className="mb-6">
        We reserve the right to suspend or terminate your access if misuse is detected.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">6. Payment Terms (If Applicable)</h2>
      <p className="mb-4">
        Certain features or subscription tiers may be subject to fees. You agree to the pricing and payment terms
        displayed at the time of purchase. All payments are processed securely via third-party gateways such as Razorpay
        or Stripe.
      </p>
      <p className="mb-6">
        Subscription fees are non-refundable unless required by law or explicitly mentioned during the transaction.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">7. Intellectual Property</h2>
      <p className="mb-4">
        All content, design, logos, and technology used in the platform are the intellectual property of PraesidioCare
        Private Limited. You may not reuse, replicate, or redistribute without written permission.
      </p>
      <p className="mb-6">
        You retain rights to any information you upload but grant us a limited license to use it for providing the
        Services.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">8. Limitation of Liability</h2>
      <p className="mb-4">ByOnco provides recommendations and tools for informational purposes only. We do not provide medical advice or treatment.</p>
      <ul className="list-disc pl-5 mb-6">
        <li>Medical outcomes or decisions made using our data</li>
        <li>Inaccuracies in hospital availability or cost information</li>
        <li>Indirect, incidental, or consequential damages arising from use of our platform</li>
      </ul>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">9. Termination</h2>
      <h3 className="font-bold mb-1">9.1 By You</h3>
      <p className="mb-4">
        You may stop using the Services at any time. To delete your data, email{' '}
        <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">
          contact@byoncocare.com
        </a>
        .
      </p>

      <h3 className="font-bold mb-1">9.2 By ByOnco</h3>
      <p className="mb-6">
        We reserve the right to suspend or terminate your access if you breach these Terms or engage in unlawful
        behavior.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">10. Governing Law</h2>
      <p className="mb-6">
        These Terms are governed by the laws of India. Disputes, if any, shall be subject to the exclusive jurisdiction
        of the courts in Mumbai, Maharashtra.
      </p>

      {/* Section 11 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">11. Contact</h2>
      <p className="mb-1 font-semibold">PraesidioCare Private Limited</p>
      <p className="mb-1">
        Email:{' '}
        <a href="mailto:contact@byoncocare.com" className="text-blue-600 underline">
          contact@byoncocare.com
        </a>
      </p>
      <p className="mb-10">
        Website:{' '}
        <a href="https://www.byoncocare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          www.byoncocare.com
        </a>
      </p>

      <p className="text-sm italic text-gray-700">
        By using ByOnco, you agree to these Terms and Conditions.
      </p>
      <p className="text-sm mt-2 font-semibold">ByOnco — Built by people who understand your pain, powered by people who can solve it.</p>
    </div>
  );
}
