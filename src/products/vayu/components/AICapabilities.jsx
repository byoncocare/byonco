import React from 'react';
import { Newspaper, Languages, Calculator, Shield, Database, Mic } from 'lucide-react';
import { aiCapabilities } from '../data/mock';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

const AICapabilities = () => {
  const capabilityIcons = {
    'Real Time News': Newspaper,
    'Realtime Translation': Languages,
    'Complex Calculations': Calculator
  };

  const [sectionRef, sectionRevealed] = useRevealOnScroll({ threshold: 0.1 });

  return (
    <section className="section-padding relative">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto ${
            sectionRevealed ? 'revealed' : 'reveal-on-scroll'
          }`}
          ref={sectionRef}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-newreader font-semibold tracking-tighter text-white mb-4 md:mb-6 px-4">
            State-of-the-art AI Capabilities
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light px-4">
            Vayu X helps you get accurate answers across math, economics, physics, finance, and more—instantly and automatically.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 md:gap-12 mt-12 md:mt-16 lg:mt-20">
          {/* Right column on desktop – Image, but first on mobile */}
          <div className="order-1 lg:order-2">
            <div className="relative isolate w-full max-w-xl ml-auto">
              <div className="relative rounded-3xl overflow-hidden glass-panel p-3 z-10">
                <div className="relative z-10">
                  <img
                    src="/vayu/ai-main.png"
                    alt="Professional using Vayu smart glasses"
                    className="w-full h-auto rounded-2xl object-cover block opacity-100 mix-blend-normal"
                  />

                  {/* Overlay chips - Smaller and transparent on mobile */}
                  {/* Top-left chip */}
                  <div className="absolute top-2 left-2 md:top-6 md:left-6 max-w-[60%] md:max-w-[72%]">
                    <div className="inline-flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs lg:text-sm font-medium text-white shadow-lg backdrop-blur bg-emerald-500/40 md:bg-emerald-500/70 lg:bg-emerald-500/90">
                      <span className="text-xs md:text-base lg:text-lg">📊</span>
                      <span className="leading-tight">NSE Sensex up 2.3% today</span>
                    </div>
                  </div>

                  {/* Bottom-left chip */}
                  <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 max-w-[60%] md:max-w-[72%]">
                    <div className="inline-flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs lg:text-sm font-medium text-white shadow-lg backdrop-blur bg-[#7C3AED]/40 md:bg-[#7C3AED]/70 lg:bg-[#7C3AED]/90">
                      <span className="text-xs">🔢</span>
                      <span className="leading-tight">√(144 × 25) = 60</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left column on desktop – feature cards and note */}
          <div className="order-2 lg:order-1 relative isolate">
            {/* Soft blue glow background behind cards (like reference) */}
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-80 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25)_0%,transparent_60%)] opacity-60 blur-3xl z-0" />

            <div className="relative z-10">
              {/* Feature descriptions as text */}
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 mt-0.5">
                    <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2 md:mb-3 text-base sm:text-lg">Real Time News</h4>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                      Get instant updates on current events and breaking news.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 mt-0.5">
                    <Languages className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2 md:mb-3 text-base sm:text-lg">Realtime Translation</h4>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                      Translate 40+ languages including English, Chinese, German, French, Russian, Hindi, Marathi, Spanish, Italian, Japanese, Korean, Hebrew, Arabic, Bengali, Gujarati, Tamil, Telugu, Polish, Vietnamese, and more international languages instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 mt-0.5">
                    <Calculator className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2 md:mb-3 text-base sm:text-lg">Complex Calculations</h4>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                      Solve mathematical problems and financial calculations instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview note box - Dark theme readable */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs mt-12">
                <p className="font-medium mb-1 text-emerald-300">
                  * Preview concepts only.
                </p>
                <p className="text-white text-xs leading-relaxed">
                  These features represent the cutting-edge capabilities being developed for Vayu X.
                  Final implementations may vary based on user feedback and technical refinements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative isolate">
            <div className="glass-panel rounded-3xl p-4 hover-lift relative z-10">
              <img
                src="/vayu/privacy.jpg"
                alt="Privacy and security focused design"
                className="w-full h-80 object-cover rounded-2xl block opacity-100 mix-blend-normal"
              />
              
              {/* Privacy indicators */}
              <div className="absolute top-8 right-8 glass-panel-sm bg-green-500/20 border-green-500/30 text-green-300 text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
                <Shield className="w-4 h-4 inline mr-1" />
                Privacy Protected
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tighter text-white mb-4">
              Private, by design
            </h3>
            
            <p className="text-lg text-gray-400 leading-relaxed mb-6 font-light">
              Vayu X never trains on, shares, or sells any of your conversations. 
              All processing happens securely with enterprise-grade encryption and 
              SOC II compliance for the highest level of data protection.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#1E5BFF]" />
                <span className="text-gray-400 font-light">Local data processing when possible</span>
              </div>
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-gray-400 font-light">Audio deleted immediately after transcription</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 font-light">End-to-end encryption for all communications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;