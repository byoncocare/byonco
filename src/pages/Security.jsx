import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Shield, Lock, Eye, AlertTriangle, Mail, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Security() {
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
            Data Security
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 break-words">
            Security at ByOnco
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed break-words">
              At ByOnco, the security of your data—medical, personal, or financial—is at the core of everything we build. We are committed to protecting the confidentiality,
              integrity, and availability of your information through advanced security practices, continuous monitoring, and compliance with applicable Indian data protection
              laws, including the Digital Personal Data Protection Act (DPDP Act), 2023.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 break-words">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>Our Security Measures</span>
            </h2>

            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-gray-600">
                <h3 className="font-bold text-base sm:text-lg mb-2 text-white flex items-center gap-2 break-words">
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <span>1. End-to-End Data Encryption</span>
                </h3>
                <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base leading-6 sm:leading-7 text-gray-300 space-y-1">
                  <li>In transit: HTTPS/TLS 1.3 to secure all API and web communications.</li>
                  <li>At rest: AES-256 encryption for databases and storage.</li>
                  <li>OTP and personal identifiers are hashed using salted algorithms.</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  2. Role-Based Access Controls (RBAC)
                </h3>
                <ul className="list-disc ml-6 text-base leading-7 text-gray-300 space-y-1">
                  <li>Limited to authorized personnel</li>
                  <li>Controlled using RBAC and time-limited session tokens</li>
                  <li>Logged and auditable</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  3. Authentication and Identity Management
                </h3>
                <ul className="list-disc ml-6 text-base leading-7 text-gray-300 space-y-1">
                  <li>Secure OTP-based login via Firebase Auth</li>
                  <li>Biometric authentication (for future mobile release)</li>
                  <li>Multi-factor authentication for internal tools and admin portals</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-400" />
                  4. Continuous Monitoring & Intrusion Detection
                </h3>
                <ul className="list-disc ml-6 text-base leading-7 text-gray-300 space-y-1">
                  <li>Suspicious activity is flagged in real-time</li>
                  <li>Automated alerts are integrated with our internal response workflows</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  5. Regular Vulnerability Assessments
                </h3>
                <ul className="list-disc ml-6 text-base leading-7 text-gray-300 space-y-1">
                  <li>Quarterly penetration testing with certified ethical hackers</li>
                  <li>Monthly vulnerability scans and codebase security audits</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Shield className="h-6 w-6 text-purple-400" />
              Our Commitment to Data Protection
            </h2>
            <ul className="list-disc ml-6 text-base leading-7 mb-8 text-gray-300 space-y-2">
              <li>Complying with India's DPDP Act and other relevant medical privacy regulations</li>
              <li>Never sharing your data with hospitals, labs, or partners without explicit user consent</li>
              <li>Ensuring all hospital-side integrations follow secure API and sandboxed architectures</li>
              <li>Training our team regularly in HIPAA-equivalent data security best practices</li>
              <li>Working with trusted third-party processors (e.g., Razorpay for payments) that meet our security standards</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <AlertTriangle className="h-6 w-6 text-purple-400" />
              Breach Response Protocol
            </h2>
            <ul className="list-disc ml-6 text-base leading-7 mb-8 text-gray-300 space-y-2">
              <li>Affected users will be notified within 72 hours</li>
              <li>Regulatory authorities will be informed, as per DPDP Act guidelines</li>
              <li>Internal audits and forensic analysis will be triggered immediately</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">Third-Party Processors</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We work with trusted third-party service providers to deliver our Services, including payment processors (Razorpay), 
              cloud infrastructure providers, and analytics services. All third-party processors are required to meet our security 
              standards and comply with applicable data protection laws. Payment information is handled directly by our payment 
              gateway partner and is not stored on our servers.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">Best Practices for Users</h2>
            <ul className="list-disc ml-6 text-base leading-7 mb-8 text-gray-300 space-y-2">
              <li>Use a strong, unique password for your ByOnco account</li>
              <li>Enable two-factor authentication when available</li>
              <li>Do not share your account credentials with others</li>
              <li>Log out from shared or public devices</li>
              <li>Keep your device software and browser updated</li>
              <li>Be cautious of phishing attempts—ByOnco will never ask for your password via email or phone</li>
            </ul>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 mt-8">Transparency and Trust</h2>
            <p className="text-lg leading-7 mb-8 text-gray-300">
              We believe security is not a feature—it's a promise. We continuously invest in improving our infrastructure and 
              uphold best practices across engineering, design, and operations.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
              <Mail className="h-6 w-6 text-purple-400" />
              Contact Our Security Team
            </h2>
            <div className="text-base leading-7 text-gray-300 space-y-2">
              <p>Have concerns or questions about your data's safety?</p>
              <p>
                <strong className="text-white">Email</strong>: <a href="mailto:security@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">security@byoncocare.com</a>
              </p>
              <p>
                <strong className="text-white">Subject</strong>: "Security Inquiry – [Your Concern]"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
