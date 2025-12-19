// src/products/vayu/components/ProductVariants.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { productVariants } from '../data/mock';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

const PricingCard = ({ variant, index, handlePreOrder }) => {
  const [cardRef, cardRevealed] = useRevealOnScroll({ threshold: 0.2 });
  
  const baseCardClasses =
    'relative glass-panel hover-lift transition-all duration-300 h-full flex flex-col border border-white/10';

  // Map variant IDs to anchor IDs for footer links
  const variantAnchorMap = {
    'standard': 'essential',
    'healthcare': 'medpro',
    'legal': 'legaledge'
  };
  const anchorId = variantAnchorMap[variant.id] || variant.id;

  return (
    <div
      id={anchorId}
      ref={cardRef}
      className={`h-full ${cardRevealed ? 'revealed' : 'reveal-on-scroll'}`}
    >
                <Card 
                  className={`${baseCardClasses} ${
                    variant.popular ? 'ring-2 ring-blue-500/60 border-2 border-blue-500/60' : ''
                  }`}
                >
                  {variant.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                      <Badge className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold border border-blue-300/40 shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_8px_24px_rgba(59,130,246,0.25)] flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Most Popular</span>
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={`text-center pb-4 ${variant.popular ? 'pt-6' : 'pt-4'}`}>
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${variant.color} mb-4 flex items-center justify-center shadow-lg`}>
                      <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm" />
                    </div>
                    
                    <CardTitle className="text-2xl font-semibold tracking-tight text-white mb-2">
                      {variant.name}
                    </CardTitle>
                    
                    <p className="text-gray-400 mb-4 font-light">{variant.description}</p>
                    
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-white">
                          ₹{variant.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-lg text-white/50 line-through">
                          ₹{variant.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        For {variant.targetAudience}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-0 flex flex-col flex-grow">
                    {/* Features List */}
                    <ul className="space-y-3 mb-6 flex-grow">
                      {variant.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400 text-sm font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* All buttons use shimmer style - same as Most Popular */}
                    <div className="mt-auto">
                      <button 
                        onClick={handlePreOrder}
                        className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full w-full"
                        aria-label={`Pre-Order ${variant.name} and join the waitlist`}
                      >
                        <span className="absolute inset-0 bg-[#1E5BFF] rounded-full opacity-100"></span>
                        <span className="relative bg-[#1E5BFF] group-hover:bg-[#2F6BFF] text-white w-full py-3 rounded-full text-sm font-semibold tracking-wide transition-colors z-10 flex items-center justify-center">
                          Pre-Order {variant.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
    </div>
  );
};

const ProductVariants = ({ onPreOrder }) => {
  const navigate = useNavigate();
  const [sectionRef, sectionRevealed] = useRevealOnScroll({ threshold: 0.1 });

  // Unified handler: prefer external handler if provided, otherwise go to waitlist
  const handlePreOrder = () => {
    if (typeof onPreOrder === 'function') {
      onPreOrder();
      return;
    }
    navigate('/products/vayu/waitlist');
  };

  return (
    <section className="section-padding relative" id="variants">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${sectionRevealed ? 'revealed' : 'reveal-on-scroll'}`} ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-newreader font-semibold tracking-tighter text-white mb-3 md:mb-4">
            Three editions, built for three worlds
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light px-4">
            Everyday, Clinical, Legal. All models include core AI functionality with profession-specific enhancements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 items-stretch">
          {productVariants.map((variant, index) => (
            <PricingCard key={variant.id} variant={variant} index={index} handlePreOrder={handlePreOrder} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-1 tracking-tight">Prescription Compatible</h4>
              <p className="text-sm text-gray-400 font-light">All models support prescription lenses</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#1E5BFF]/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#1E5BFF]/30">
                <Star className="w-6 h-6 text-[#1E5BFF]" />
              </div>
              <h4 className="font-semibold text-white mb-1 tracking-tight">Warranty Included</h4>
              <p className="text-sm text-gray-400 font-light">Comprehensive warranty coverage for peace of mind</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#8B5CF6]/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#8B5CF6]/30">
                <ArrowRight className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h4 className="font-semibold text-white mb-1 tracking-tight">March 2026</h4>
              <p className="text-sm text-gray-400 font-light">Shipping starts soon - secure your spot today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVariants;
