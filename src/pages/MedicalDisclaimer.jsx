// src/pages/MedicalDisclaimer.jsx
// Comprehensive Medical Disclaimer page

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ChevronLeft, Stethoscope, Scale, FileText, Mail, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MedicalDisclaimer() {
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
          <Badge className="mb-3 sm:mb-4 bg-yellow-600/20 text-yellow-300 border-yellow-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="h-3 w-3 mr-1.5 inline" />
            Important Notice
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 break-words">
            Medical Disclaimer
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">Critical Notice</h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    <strong className="text-white">ByOnco is NOT a medical provider, healthcare facility, or licensed medical professional.</strong> We do NOT provide medical advice, diagnosis, treatment, prescriptions, or emergency medical services. All medical decisions must be made in consultation with qualified, licensed healthcare professionals.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 break-words">
              <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>1. Medical Non-Advice Disclaimer</span>
            </h2>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base break-words">
              ByOnco, operated by PraesidioCare Private Limited, is a healthcare navigation and coordination platform. Our Services are designed to assist you in finding healthcare providers, understanding treatment costs, coordinating care, and accessing informational resources. <strong className="text-white">We are NOT a medical provider and do NOT provide medical advice, diagnosis, or treatment.</strong>
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3 mt-4 sm:mt-6">1.1 What We Provide</h3>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              Our Services include:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>Hospital and doctor matching based on your preferences and needs</li>
              <li>Cost estimates and financial planning assistance</li>
              <li>Second opinion consultations from board-certified oncologists (facilitated, not provided by us)</li>
              <li>Medical tourism coordination and care package facilitation</li>
              <li>Informational content about cancer types, treatments, and care options</li>
              <li>Access to clinical trials and subsidy information</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2 sm:mb-3 mt-4 sm:mt-6">1.2 What We Do NOT Provide</h3>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              ByOnco does NOT provide:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><strong className="text-white">Medical advice, diagnosis, or treatment recommendations</strong></li>
              <li><strong className="text-white">Prescriptions or medication guidance</strong></li>
              <li><strong className="text-white">Emergency medical services</strong></li>
              <li><strong className="text-white">Direct medical care or treatment</strong></li>
              <li><strong className="text-white">Guarantees about medical outcomes or treatment results</strong></li>
              <li><strong className="text-white">Substitute for professional medical consultation</strong></li>
            </ul>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 mt-8 break-words">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>2. Your Responsibilities</span>
            </h2>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              You acknowledge and agree that:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><strong className="text-white">You are solely responsible</strong> for all medical decisions, including diagnosis, treatment selection, medication, and care plans</li>
              <li><strong className="text-white">You must consult</strong> with qualified, licensed healthcare professionals before making any treatment decisions</li>
              <li><strong className="text-white">You will verify</strong> the accuracy of information provided by hospitals, doctors, or partners independently</li>
              <li><strong className="text-white">You understand</strong> that ByOnco's recommendations, AI-generated insights, and care packages are informational tools only</li>
              <li><strong className="text-white">You will not rely</strong> solely on ByOnco's information for medical decisions</li>
              <li><strong className="text-white">You are either the patient</strong> or an authorized caregiver with legal authority to make medical decisions</li>
            </ul>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 mt-8 break-words">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>3. No Medical Guarantees</span>
            </h2>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              ByOnco does NOT guarantee, warrant, or represent that:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>Any hospital, doctor, or treatment option will be suitable for your specific condition</li>
              <li>Cost estimates will match actual treatment costs (costs vary by stage, hospital, regimen, and complications)</li>
              <li>Treatment outcomes, recovery times, or medical results</li>
              <li>Hospital availability, bed availability, or appointment scheduling</li>
              <li>The accuracy, completeness, or timeliness of third-party information</li>
              <li>That any recommended treatment will be effective or appropriate for your condition</li>
            </ul>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 mt-8 break-words">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>4. Limitation of Liability</span>
            </h2>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              <strong className="text-white">To the maximum extent permitted by applicable law, ByOnco and PraesidioCare Private Limited shall NOT be liable for:</strong>
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-4 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><strong className="text-white">Medical outcomes or treatment results</strong> - We are not responsible for the success, failure, or complications of any medical treatment, procedure, or care plan</li>
              <li><strong className="text-white">Medical decisions</strong> - We are not liable for decisions made based on our recommendations, information, or platform content</li>
              <li><strong className="text-white">Inaccuracies in information</strong> - Hospital availability, cost estimates, doctor credentials, or third-party service details may change or contain errors</li>
              <li><strong className="text-white">Delays or cancellations</strong> - Issues with third-party services (hospitals, travel, accommodation, appointments)</li>
              <li><strong className="text-white">Indirect, incidental, consequential, or punitive damages</strong> arising from use of our platform</li>
              <li><strong className="text-white">Loss of data, revenue, business opportunities, or personal injury</strong> related to medical treatment or platform use</li>
              <li><strong className="text-white">Emergency situations</strong> - For medical emergencies, contact emergency services immediately. Do not rely on ByOnco for emergency medical assistance</li>
            </ul>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              <strong className="text-white">Our total liability, if any, shall not exceed the amount you paid to ByOnco in the 12 months preceding the claim.</strong> This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise) and even if we have been advised of the possibility of such damages.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 mt-8 break-words">5. Emergency Medical Situations</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 sm:p-6 mb-6">
              <p className="text-red-300 text-sm sm:text-base leading-relaxed font-semibold mb-2">
                ⚠️ IMPORTANT: For Medical Emergencies
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you are experiencing a medical emergency, call your local emergency services immediately (e.g., 108 in India, 911 in the US). 
                <strong className="text-white"> Do NOT use ByOnco for emergency medical assistance.</strong> ByOnco is not equipped to handle emergencies and cannot provide immediate medical care.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 mt-8 break-words">6. Information Accuracy</h2>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              While we strive to provide accurate and up-to-date information, ByOnco does not guarantee the accuracy, completeness, or timeliness of:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>Hospital availability, bed availability, or queue status</li>
              <li>Cost estimates (actual costs vary by stage, hospital, treatment regimen, and complications)</li>
              <li>Doctor credentials, specializations, or availability</li>
              <li>Third-party service information (travel, accommodation, translation services)</li>
              <li>Clinical trial availability or eligibility</li>
              <li>Subsidy or insurance coverage information</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
              You are responsible for verifying all information independently with the relevant healthcare providers, insurance companies, or service providers before making decisions.
            </p>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 mt-8 break-words">7. Jurisdiction & Healthcare Compliance</h2>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              ByOnco operates in compliance with applicable healthcare and data protection laws in India and considers relevant US healthcare regulations. However:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>Healthcare regulations vary by jurisdiction and may change over time</li>
              <li>We are not responsible for ensuring compliance with healthcare laws in your specific jurisdiction</li>
              <li>You are responsible for understanding and complying with applicable healthcare laws in your location</li>
              <li>Medical practices, standards, and regulations differ between countries and regions</li>
            </ul>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 mt-8 flex items-center gap-2 break-words">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
              <span>8. Contact & Questions</span>
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              If you have questions about this Medical Disclaimer, our Services, or need clarification on any medical matter, please:
            </p>
            <ul className="list-disc ml-4 sm:ml-6 mb-6 space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><strong className="text-white">For medical questions:</strong> Consult with a qualified, licensed healthcare professional</li>
              <li><strong className="text-white">For platform questions:</strong> Contact us at <a href="mailto:contact@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">contact@byoncocare.com</a></li>
              <li><strong className="text-white">For emergencies:</strong> Call your local emergency services immediately</li>
            </ul>

            <div className="text-gray-300 space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-400" />
                <strong className="text-white">PraesidioCare Private Limited</strong>
              </p>
              <p>
                <strong className="text-white">Email</strong>: <a href="mailto:contact@byoncocare.com" className="text-purple-400 hover:text-purple-300 hover:underline">contact@byoncocare.com</a>
              </p>
              <p>
                <strong className="text-white">Website</strong>: <a href="https://www.byoncocare.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline">www.byoncocare.com</a>
              </p>
            </div>

            <div className="mt-10 text-sm sm:text-base italic text-gray-400 text-center border-t border-gray-700 pt-8 space-y-2">
              <p>By using ByOnco, you acknowledge that you have read, understood, and agree to this Medical Disclaimer.</p>
              <p className="font-semibold">ByOnco — Built by people who understand your pain, powered by people who can solve it.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
