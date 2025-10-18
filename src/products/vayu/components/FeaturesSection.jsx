// src/products/vayu/components/FeaturesSection.jsx
import React from 'react';
import { Zap, Brain, Clock } from 'lucide-react';
import { features } from '../data/mock';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            HOW IT WORKS
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vayu X listens to your entire day, building you the most personal, proactive assistant in the world.
          </h3>
        </div>

        {/* Features Grid */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="mb-6">
                  {index === 0 && <Zap className="w-12 h-12 text-blue-600 mb-4" />}
                  {index === 1 && <Brain className="w-12 h-12 text-purple-600 mb-4" />}
                  {index === 2 && <Clock className="w-12 h-12 text-green-600 mb-4" />}
                </div>

                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {feature.title}
                  {feature.subtitle && (
                    <div className="text-xl text-gray-600 mt-1">{feature.subtitle}</div>
                  )}
                </h4>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {index === 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="font-mono text-sm text-green-600">
                      "What were India's Q4 GDP numbers?"
                    </div>
                    <div className="font-mono text-sm text-gray-700 mt-2">
                      India's Q4 2024 GDP grew at 7.8% year-over-year, driven by strong manufacturing and services sectors...
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Responded in 847ms</div>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                  <img
                    src={
                      index === 0
                        ? process.env.PUBLIC_URL + "/vayu/ai-main.png"   // card 1
                        : index === 1
                        ? process.env.PUBLIC_URL + "/vayu/hero.webp"     // card 2
                        : process.env.PUBLIC_URL + "/vayu/meeting.png"   // card 3
                    }
                    alt={feature.title}
                    className="relative w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating UI elements */}
                  {index === 0 && (
                    <div className="absolute top-4 left-4 bg-green-500/90 text-white text-xs px-3 py-2 rounded-lg">
                      <div className="font-mono">847ms</div>
                    </div>
                  )}

                  {index === 2 && (
                    <div className="absolute bottom-4 right-4 bg-blue-500/90 text-white text-xs px-3 py-2 rounded-lg max-w-48">
                      <div className="font-light">
                        Meeting with Raj at 3 PM tomorrow about about the ongoing litigation.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
