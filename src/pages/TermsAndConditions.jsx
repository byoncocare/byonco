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
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">2.1 Acceptance & User Consent</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              By accessing, using, or registering for the Services, you explicitly acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>You have read, understood, and agree to be bound by these Terms and our Privacy Policy</li>
              <li>You consent to the collection, use, storage, and processing of your personal and health information as described in our Privacy Policy</li>
              <li>You consent to communication via WhatsApp, email, and other channels for service delivery</li>
              <li>You understand that ByOnco is not a medical provider and does not provide medical advice</li>
              <li>You are either the patient or an authorized caregiver with legal authority to consent</li>
              <li>You will not engage in scraping, data extraction, or unauthorized redistribution of our content</li>
              <li>You accept the limitations of liability and medical disclaimers outlined in these Terms</li>
            </ul>
            <p className="text-gray-300 mb-4 leading-relaxed">
              If you do not agree to these Terms, you must immediately stop using the Services and may not access or use any part of the platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">2.2 Modifications</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We reserve the right to update or modify these Terms at any time. Continued use of the Services following any
              changes implies your acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">3. Description of Services</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">3.1 Service Scope</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              ByOnco provides oncology navigation and AI-powered assistance services, including but not limited to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>AI-powered hospital and doctor matching based on disease type, budget, outcomes, insurance eligibility, and preferences</li>
              <li>Real-time bed and queue visibility across India</li>
              <li>Second opinion consultations from board-certified oncologists</li>
              <li>Cost estimates and financial planning assistance</li>
              <li>Subsidy and clinical trial matching</li>
              <li>Medical tourism coordination and care packages (see Section 6.4)</li>
              <li>Treatment journey planning and support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">3.2 AI-Built Care Packages</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Our AI-powered system may recommend comprehensive care packages tailored to your treatment journey. These packages 
              are similar to travel packages—they may include coordination services, optional third-party services (travel, 
              accommodation, translation), and facilitation support. ByOnco is a coordination platform, not a medical provider. 
              All medical decisions and treatments are between you and your chosen healthcare providers.
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">3.3 Technology and Human Support</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We use AI algorithms to assist in matching, recommendations, and care package creation. Human care coordinators 
              may intervene to improve accuracy or handle special cases. Final responsibility for healthcare decisions lies with 
              the patient and their chosen medical providers.
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

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">5. User Responsibilities & Acceptable Use</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">5.1 Patient Responsibility</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              ByOnco provides information, recommendations, and coordination services. We are not a medical provider. You are 
              responsible for:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>Consulting with qualified medical professionals for all medical decisions</li>
              <li>Verifying the accuracy of information provided by hospitals, doctors, or partners</li>
              <li>Making informed decisions about your treatment based on professional medical advice</li>
              <li>Submitting only accurate and lawful information to our platform</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">5.2 Acceptable Use</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              You agree to use ByOnco only for legitimate medical and healthcare-related purposes. You must not:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>Use the platform for non-medical purposes or commercial exploitation</li>
              <li>Attempt to breach security, misuse the platform, or access unauthorized areas</li>
              <li>Impersonate others or use the platform for fraudulent purposes</li>
              <li>Upload malicious content, spam, or inappropriate material</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-6">5.3 Prohibited Activities: Scraping & Redistribution</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">You expressly agree NOT to:</strong>
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li><strong className="text-white">Scrape, Extract, or Harvest Data</strong>: Use automated tools, bots, crawlers, scrapers, or scripts to extract, copy, download, or collect any content, data, hospital information, pricing, doctor details, or user information from our platform.</li>
              <li><strong className="text-white">Redistribute or Resell Content</strong>: Republish, resell, redistribute, or share any content, data, or information obtained from ByOnco, whether for commercial or non-commercial purposes, without our explicit written permission.</li>
              <li><strong className="text-white">Reverse Engineer</strong>: Attempt to reverse engineer, decompile, disassemble, or extract source code, algorithms, database structures, or proprietary logic from our platform.</li>
              <li><strong className="text-white">Circumvent Security Measures</strong>: Bypass, disable, or interfere with security features, rate limits, access controls, or technical protection measures.</li>
              <li><strong className="text-white">Create Derivative Works</strong>: Build competing services, databases, or platforms using data or insights obtained from ByOnco.</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">Consequences:</strong> Violations of these prohibitions may result in immediate termination of your account, legal action, and claims for damages. We actively monitor for such activities and employ technical measures to prevent unauthorized access and data extraction.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">6. Payment Terms & Billing</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">6.1 Subscriptions</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              ByOnco offers subscription plans (e.g., ByOnco PRO) and one-time payment services (e.g., Second Opinion consultations). 
              You agree to the pricing and payment terms displayed at the time of purchase. All payments are processed securely via 
              our payment gateway partner Razorpay.
            </p>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">6.2 Billing & Renewal</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Subscription fees are billed monthly in advance. Your subscription will automatically renew unless cancelled before 
              the renewal date. You can cancel your subscription at any time through your account settings or by contacting us.
            </p>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">6.3 Refunds</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Subscription fees are generally non-refundable. However, we may provide refunds in exceptional circumstances, 
              such as technical issues preventing service access, or as required by applicable law. Refund requests must be 
              submitted within 7 days of the transaction. One-time service payments (e.g., Second Opinion) may be refunded if 
              the service has not been delivered, subject to our review.
            </p>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">6.4 Care Packages</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              ByOnco may offer comprehensive "Care Packages" that include coordination services, travel arrangements, accommodation 
              assistance, translation services, and optional third-party partner services. These packages are designed to provide 
              a complete medical tourism experience. ByOnco acts as a coordinator and facilitator—we are not a hospital or medical 
              provider. Package costs may include coordination fees, partner service fees, and optional add-ons. All costs are 
              itemized and disclosed before purchase. You may opt into specific package components based on your needs.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">7. Intellectual Property & Content Protection</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              All content, design, logos, technology, algorithms, databases, hospital data, pricing information, and proprietary information used in the platform are the intellectual property of PraesidioCare Private Limited and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">No Redistribution:</strong> You may not reuse, replicate, redistribute, resell, or share any content, data, or information from ByOnco without our explicit written permission. This includes but is not limited to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>Hospital listings, availability data, or pricing information</li>
              <li>Doctor profiles, specializations, or credentials</li>
              <li>Treatment recommendations, cost estimates, or care packages</li>
              <li>User-generated content, reviews, or testimonials</li>
              <li>Platform design, UI/UX elements, or branding</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              You retain rights to any information you upload but grant us a limited, non-exclusive license to use it for providing and improving the Services. This license terminates when you delete your account or request data deletion, subject to legal retention requirements.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">8. Medical Disclaimer & Limitation of Liability</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">8.1 Medical Non-Advice Disclaimer</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">ByOnco is NOT a medical provider, healthcare facility, or licensed medical professional. We do NOT provide medical advice, diagnosis, treatment, or prescriptions.</strong>
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Our Services are informational and coordination tools designed to assist you in:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-300 space-y-2">
              <li>Finding healthcare providers and hospitals</li>
              <li>Understanding treatment costs and financial options</li>
              <li>Coordinating care and medical tourism</li>
              <li>Accessing second opinions from qualified oncologists</li>
            </ul>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">All medical decisions, including diagnosis, treatment selection, medication, and care plans, must be made in consultation with qualified, licensed healthcare professionals.</strong> ByOnco's recommendations, AI-generated insights, hospital matches, cost estimates, and care packages are informational tools only and do not constitute medical advice, diagnosis, or treatment recommendations.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              You acknowledge that:
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
              <li>ByOnco does not replace professional medical consultation</li>
              <li>You are solely responsible for all medical decisions</li>
              <li>You will consult with qualified healthcare providers before making any treatment decisions</li>
              <li>ByOnco is not liable for medical outcomes or treatment results</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">8.2 Limitation of Liability</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              To the maximum extent permitted by law, ByOnco and PraesidioCare Private Limited shall not be liable for:
            </p>
            <ul className="list-disc pl-5 mb-6 text-gray-300 space-y-2">
              <li>Medical outcomes, treatment results, or decisions made based on our recommendations</li>
              <li>Inaccuracies in hospital availability, cost information, or third-party service details</li>
              <li>Delays, cancellations, or issues with third-party services (hospitals, travel, accommodation)</li>
              <li>Indirect, incidental, consequential, or punitive damages arising from use of our platform</li>
              <li>Loss of data, revenue, or business opportunities</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Our total liability, if any, shall not exceed the amount you paid to ByOnco in the 12 months preceding the claim.
            </p>

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
              10. Governing Law & Jurisdiction
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles. For users in the United States, these Terms are also subject to applicable US federal and state laws, though Indian law shall prevail in case of conflict.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">Jurisdiction:</strong> Any disputes, claims, or legal proceedings arising out of or relating to these Terms, the Services, or your use of ByOnco shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India. You consent to the personal jurisdiction of such courts and waive any objection to venue.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              <strong className="text-white">Compliance:</strong> By using ByOnco, you represent that you are in compliance with all applicable laws in your jurisdiction, including but not limited to healthcare regulations, data protection laws, and export control laws.
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
