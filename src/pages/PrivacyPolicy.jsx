import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, ChevronLeft, Lock, Eye, FileText, Mail, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            <Shield className="h-3 w-3 mr-1.5 inline" />
            Data Protection
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 break-words">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Last Updated: July 15, 2025
          </p>
        </div>

        {/* Content */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed break-words">
              This Privacy Policy explains how PraesidioCare Private Limited ("ByOnco", "we", "our", or "us") collects,
              uses, stores, and protects personal and medical information ("Personal Information") when you interact
              with our services. This applies to our websites, ByOnco mobile and web apps, and any related services,
              including our AI-based cancer care navigation platform ("Services"). By using our Services, you consent to
              the terms outlined in this Privacy Policy.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 break-words">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>1. Information We Collect</span>
            </h2>
            
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3 mt-4 sm:mt-6">A. Information You Provide</h3>
            <ul className="list-disc ml-4 sm:ml-6 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><strong className="text-white">Account Details</strong>: Full name, phone number, email, city, and basic profile data.</li>
              <li><strong className="text-white">Patient Data</strong>: Cancer stage, treatment details, hospital preferences, financial needs, and other health-related inputs.</li>
              <li><strong className="text-white">Communications</strong>: When you contact us via WhatsApp, chat, email, or form submissions.</li>
              <li><strong className="text-white">Payment Details</strong>: Where applicable, details like cardholder name, masked card information, billing address.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-300 mb-3">B. Information We Collect Automatically</h3>
            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Usage Data</strong>: IP address, device type, browser, OS, screen resolution, time spent on app or pages.</li>
              <li><strong className="text-white">Cookies and Local Storage</strong>: To personalize experience, retain session data, and offer relevant content.</li>
              <li><strong className="text-white">Device & Diagnostic Logs</strong>: For security, troubleshooting, and improving app experience.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Eye className="h-6 w-6 text-purple-400" />
              2. How We Use Your Information
            </h2>
            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Hospital Matching & Care Navigation</strong>: To help recommend best-fit cancer hospitals based on your profile.</li>
              <li><strong className="text-white">Communications</strong>: To send confirmations, alerts, WhatsApp messages, and respond to queries.</li>
              <li><strong className="text-white">Service Optimization</strong>: Analyze aggregated data to improve user experience, routes, and performance.</li>
              <li><strong className="text-white">Personalization</strong>: Tailor hospital and treatment suggestions based on user patterns.</li>
              <li><strong className="text-white">Compliance</strong>: Ensure adherence to Indian laws like IT Act, DISHA guidelines, and data protection frameworks.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Lock className="h-6 w-6 text-purple-400" />
              3. Data Sharing & Disclosure
            </h2>
            <p className="text-gray-300 mb-4">We do <strong className="text-white">not</strong> sell your personal data. We only share:</p>
            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-300">
              <li><strong className="text-white">With Healthcare Partners</strong>: Hospitals and labs you engage with (only post-consent).</li>
              <li><strong className="text-white">With Trusted Vendors</strong>: Including cloud storage providers, payment gateways, and analytics services.</li>
              <li><strong className="text-white">For Legal Reasons</strong>: If required by Indian law enforcement or judiciary.</li>
              <li><strong className="text-white">Business Transfers</strong>: If ByOnco undergoes merger or acquisition.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Shield className="h-6 w-6 text-purple-400" />
              4. Data Security Measures
            </h2>
            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Encryption</strong>: HTTPS/TLS for data in transit. AES encryption for data at rest.</li>
              <li><strong className="text-white">Access Control</strong>: Only essential staff and systems have access based on role.</li>
              <li><strong className="text-white">Audit Logs</strong>: All critical actions and logins are tracked securely.</li>
              <li><strong className="text-white">Breach Notification</strong>: In the event of a data breach, we'll notify affected parties as required under Indian law.</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">5. Data Retention</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We retain user information for as long as necessary to:
              <br />• Provide services
              <br />• Comply with medical or regulatory obligations (e.g., Ayushman Bharat scheme records)
              <br />• Improve platform accuracy
              <br />After that, data is either anonymized or deleted securely.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">6. Your Rights</h2>
            <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Access</strong> to your stored information</li>
              <li><strong className="text-white">Rectification</strong> of inaccurate details</li>
              <li><strong className="text-white">Deletion</strong>, subject to legal limitations</li>
              <li><strong className="text-white">Data Portability</strong> (where feasible)</li>
              <li><strong className="text-white">Opt-out</strong> of marketing or communications via <a className="text-purple-400 hover:text-purple-300 hover:underline" href="mailto:contact@byoncocare.com">contact@byoncocare.com</a></li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">7. Consent & Compliance</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              By using ByOnco, you:
              <br />• Consent to us processing your health-related data
              <br />• Confirm you're either the patient or an authorized caregiver
              <br />• Agree to abide by the Terms and Conditions and Privacy Policy
              <br /><br />
              We comply with India's evolving data laws, including those under the <strong className="text-white">Digital Personal Data Protection Act, 2023</strong> and healthcare-specific norms.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">8. Changes to this Privacy Policy</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We may revise this policy periodically. Any changes will be posted on this page with a new effective date.
              Continued use of ByOnco after updates constitutes your consent to the changes.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
              <Mail className="h-6 w-6 text-purple-400" />
              9. Contact Us
            </h2>
            <div className="text-gray-300 space-y-2">
              <p><strong className="text-white">Email</strong>: <a href="mailto:contact@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">contact@byoncocare.com</a></p>
              <p className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-400" />
                <strong className="text-white">Registered Office</strong>: PraesidioCare Private Limited, Nashik, Maharashtra, India
              </p>
            </div>

            <div className="mt-10 text-lg italic text-gray-400 text-center border-t border-gray-700 pt-8">
              ByOnco — Built by people who understand your pain. Powered by people who can solve it.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
