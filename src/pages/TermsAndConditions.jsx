import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, FileText, Scale, Building, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-white hover:text-purple-300 hover:bg-gray-800 mb-6"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <Badge className="mb-3 sm:mb-4 bg-purple-600/20 text-purple-300 border-purple-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
            <Scale className="h-3 w-3 mr-1.5 inline" />
            Legal Terms
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 break-words">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Last Updated: July 15, 2025
          </p>
        </div>

        {/* Content */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed break-words">
              These Terms and Conditions ("Terms") govern your access to and use of the ByOnco platform and related services
              (collectively, the "Services"). By using our Services, you agree to be bound by these Terms. If you do not
              agree, you must not access or use the Services.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 break-words">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>1. About ByOnco</span>
            </h2>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 mt-3 sm:mt-4">1.1 Company Overview</h3>
            <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base break-words">
              ByOnco, operated by PraesidioCare Private Limited, is a healthcare intelligence platform that helps cancer
              patients and their families find the best hospitals, labs, doctors, and financial support options. The platform
              uses AI, real-time data, and human expertise to match patients based on location, budget, disease type,
              insurance, and government scheme eligibility.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">1.2 Legal Compliance and Patient Privacy</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              ByOnco adheres to the data privacy laws applicable in India, including the Digital Personal Data Protection Act,
              2023. While ByOnco is not a healthcare provider, we ensure any health information processed is treated with the
              highest standards of confidentiality and security.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Scale className="h-6 w-6 text-purple-400" />
              2. Acceptance and Modifications
            </h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">2.1 Acceptance</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              By using the Services, you confirm that you have read, understood, and agreed to be bound by these Terms and our
              Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">2.2 Modifications</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We reserve the right to update or modify these Terms at any time. Continued use of the Services following any
              changes implies your acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">3. Description of Services</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">3.1 Scope</h3>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>Real-time cancer hospital recommendations based on multiple parameters</li>
              <li>Bed and queue availability updates (where available)</li>
              <li>Cost comparisons and support for patients under schemes like PMJAY, MPJAY, etc.</li>
              <li>Lab test bookings and appointment scheduling</li>
              <li>Cancer data tracking across India</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">3.2 Technology and Human Support</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We use AI algorithms to assist in matching and recommendations. Human intervention may occur to improve accuracy
              or handle special cases. Final responsibility for healthcare decisions lies with the patient and care provider.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">3.3 Availability</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We aim for high availability, but the Services may experience downtime due to maintenance or unforeseen issues.
              Service is provided on an "as is" basis.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">4. Data Ownership and Security</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">4.1 Ownership</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              You retain ownership of all personal and health-related information submitted. You grant ByOnco a limited,
              revocable license to use this data for providing and improving the Services.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">4.2 Privacy & Compliance</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Data is handled in accordance with our Privacy Policy. We do not sell your data. Your use of the platform must
              comply with applicable Indian laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">4.3 Security</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We implement strong encryption, access controls, and monitoring to safeguard your data. In case of a data
              breach, we will notify you as required by law.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">5. User Responsibilities</h2>
            <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
              <li>Submit only accurate and lawful information</li>
              <li>Do not attempt to breach security or misuse the platform</li>
              <li>Do not impersonate others or use the platform for unauthorized purposes</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We reserve the right to suspend or terminate your access if misuse is detected.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">6. Payment Terms (If Applicable)</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Certain features or subscription tiers may be subject to fees. You agree to the pricing and payment terms
              displayed at the time of purchase. All payments are processed securely via third-party gateways such as Razorpay
              or Stripe.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Subscription fees are non-refundable unless required by law or explicitly mentioned during the transaction.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">7. Intellectual Property</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              All content, design, logos, and technology used in the platform are the intellectual property of PraesidioCare
              Private Limited. You may not reuse, replicate, or redistribute without written permission.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              You retain rights to any information you upload but grant us a limited license to use it for providing the
              Services.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">8. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">ByOnco provides recommendations and tools for informational purposes only. We do not provide medical advice or treatment.</p>
            <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
              <li>Medical outcomes or decisions made using our data</li>
              <li>Inaccuracies in hospital availability or cost information</li>
              <li>Indirect, incidental, or consequential damages arising from use of our platform</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">9. Termination</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">9.1 By You</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              You may stop using the Services at any time. To delete your data, email{' '}
              <a href="mailto:contact@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">
                contact@byoncocare.com
              </a>
              .
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">9.2 By ByOnco</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We reserve the right to suspend or terminate your access if you breach these Terms or engage in unlawful
              behavior.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-400" />
              10. Governing Law
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              These Terms are governed by the laws of India. Disputes, if any, shall be subject to the exclusive jurisdiction
              of the courts in Mumbai, Maharashtra.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
              <Mail className="h-6 w-6 text-purple-400" />
              11. Contact
            </h2>
            <div className="text-gray-300 space-y-2">
              <p className="font-semibold text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-400" />
                PraesidioCare Private Limited
              </p>
              <p>
                <strong className="text-white">Email</strong>:{' '}
                <a href="mailto:contact@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">
                  contact@byoncocare.com
                </a>
              </p>
              <p>
                <strong className="text-white">Website</strong>:{' '}
                <a href="https://www.byoncocare.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline">
                  www.byoncocare.com
                </a>
              </p>
            </div>

            <div className="mt-10 text-sm italic text-gray-400 text-center border-t border-gray-700 pt-8 space-y-2">
              <p>By using ByOnco, you agree to these Terms and Conditions.</p>
              <p className="font-semibold">ByOnco — Built by people who understand your pain, powered by people who can solve it.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
