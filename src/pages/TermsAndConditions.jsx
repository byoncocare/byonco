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
            <p className="text-gray-300 mb-6 leading-relaxed">
              We reserve the right to suspend or terminate your access if misuse is detected.
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

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">7. Intellectual Property</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              All content, design, logos, and technology used in the platform are the intellectual property of PraesidioCare
              Private Limited. You may not reuse, replicate, or redistribute without written permission.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              You retain rights to any information you upload but grant us a limited license to use it for providing the
              Services.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">8. Medical Disclaimer & Limitation of Liability</h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-4">8.1 Medical Disclaimer</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">ByOnco is not a medical provider and does not provide medical advice, diagnosis, or treatment.</strong> 
              Our Services are designed to assist you in finding healthcare providers, understanding costs, and coordinating care. 
              All medical decisions must be made in consultation with qualified healthcare professionals. ByOnco's recommendations, 
              AI-generated insights, and care packages are informational tools only and do not constitute medical advice.
            </p>
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
