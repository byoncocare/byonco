import React from 'react';
import { Newspaper, Languages, Calculator, Shield, Database, Mic } from 'lucide-react';
import { aiCapabilities } from '../data/mock';

const AICapabilities = () => {
  const capabilityIcons = {
    'Real Time News': Newspaper,
    'Realtime Translation': Languages,
    'Complex Calculations': Calculator
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            State-of-the-art AI Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vayu X was systematically designed to provide the most high-quality, accurate answers, 
            from math, economics, physics, to finance, and more - instantly and automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Capabilities List */}
          <div className="space-y-8">
            {aiCapabilities.map((capability, index) => {
              const Icon = capabilityIcons[capability.title];
              return (
                <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-gray-600">
                      {capability.description}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200">
              <p className="text-sm text-gray-600 italic mb-2">*Preview concepts only.</p>
              <p className="text-gray-700">
                These features represent the cutting-edge capabilities being developed for Vayu X. 
                Final implementations may vary based on user feedback and technical refinements.
              </p>
            </div>
          </div>

          {/* Right - Product Image */}
          <div className="relative">
            <div className="relative">
              <img
                src={process.env.PUBLIC_URL + "/vayu/ai-main.png"}
                alt="Professional using Vayu smart glasses"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating AI Messages */}
              <div className="absolute top-6 left-6 bg-green-500/90 text-white text-sm px-4 py-2 rounded-lg animate-fade-in-up">
                📊 NSE Sensex up 2.3% today
              </div>
              
              <div className="absolute top-24 right-6 bg-blue-500/90 text-white text-sm px-4 py-2 rounded-lg animate-fade-in-up animation-delay-1000">
                🌍 "नमस्ते" → "Hello" (Hindi)
              </div>
              
              <div className="absolute bottom-6 left-6 bg-purple-500/90 text-white text-sm px-4 py-2 rounded-lg animate-fade-in-up animation-delay-2000">
                🔢 √(144 × 25) = 60
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={process.env.PUBLIC_URL + "/vayu/privacy.jpg"}
              alt="Privacy and security focused design"
              className="w-full h-80 object-cover rounded-3xl shadow-xl"
            />
            
            {/* Privacy indicators */}
            <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4 inline mr-1" />
              Privacy Protected
            </div>
          </div>

          <div>
            <div className="mb-6">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Private, by design
            </h3>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Vayu X never trains on, shares, or sells any of your conversations. 
              All processing happens securely with enterprise-grade encryption and 
              SOC II compliance for the highest level of data protection.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Local data processing when possible</span>
              </div>
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Audio deleted immediately after transcription</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">End-to-end encryption for all communications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;