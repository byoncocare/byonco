// src/products/vayu/components/FeaturesSection.jsx
import React from 'react';
import { Zap, Brain, Clock } from 'lucide-react';
import { features } from '../data/mock';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

const FeatureItem = ({ feature, index }) => {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-12 items-center h-full ${
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
    >
                {/* Text Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="mb-6">
                    {index === 0 && <Zap className="w-12 h-12 text-[#1E5BFF] mb-4" />}
                    {index === 1 && <Brain className="w-12 h-12 text-[#8B5CF6] mb-4" />}
                    {index === 2 && <Clock className="w-12 h-12 text-green-400 mb-4" />}
                  </div>

                  <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tighter text-white mb-3 md:mb-4">
                    {feature.title}
                    {feature.subtitle && (
                      <div className="text-base sm:text-lg md:text-xl text-gray-400 mt-1 font-light">{feature.subtitle}</div>
                    )}
                  </h4>

                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light">
                    {feature.description}
                  </p>

                  {index === 0 && (
                    <div className="mt-6 p-4 glass-panel-sm rounded-lg border-l-4 border-[#1E5BFF]">
                      <div className="font-mono text-sm text-green-400">
                        "What were India's Q4 GDP numbers?"
                      </div>
                      <div className="font-mono text-sm text-gray-300 mt-2 font-light">
                        India's Q4 FY 2024–25 GDP grew at 7.4% year-over-year, driven by strength in manufacturing, construction, and services.
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Responded in 847ms</div>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#2F6BFF] rounded-2xl blur-2xl opacity-10"></div>
                    <div className="glass-panel rounded-2xl p-2 relative hover-lift">
                      <img
                        src={
                          index === 0
                            ? process.env.PUBLIC_URL + "/vayu/ai-main.png"   // card 1
                            : index === 1
                            ? process.env.PUBLIC_URL + "/vayu/hero.webp"     // card 2
                            : process.env.PUBLIC_URL + "/vayu/meeting.png?v=2"   // card 3 - cache bust
                        }
                        alt={feature.title}
                        className="relative w-full h-64 md:h-80 object-cover rounded-xl"
                      />

                      {/* Floating UI elements */}
                      {index === 0 && (
                        <div className="absolute top-6 left-6 glass-panel-sm bg-green-500/20 border-green-500/30 text-green-300 text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
                          <div className="font-mono">847ms</div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="absolute bottom-6 right-6 glass-panel-sm bg-blue-500/20 border-blue-500/30 text-xs px-3 py-2 rounded-lg max-w-48 backdrop-blur-sm">
                          <div className="font-bold text-[#1E5BFF]">
                            Meeting with Aishwarya at 3 PM tomorrow about about the ongoing litigation.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [sectionRef, sectionRevealed] = useRevealOnScroll({ threshold: 0.1 });

  return (
    <section id="features" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${sectionRevealed ? 'revealed' : 'reveal-on-scroll'}`} ref={sectionRef}>
          <h2 className="text-sm font-semibold text-[#1E5BFF] uppercase tracking-wide mb-2">
            HOW IT WORKS
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-newreader font-semibold tracking-tighter text-white mb-4 px-4">
            Vayu X helps you throughout your day, building a personal assistant that understands your needs.
          </h3>
        </div>

        {/* Original Features Grid - Restored */}
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureItem feature={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
