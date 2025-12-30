// src/products/vayu/components/TestimonialsSection.jsx
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { testimonials } from '../data/mock';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';
import { useWaitlistCounter, usePreOrdersCounter } from './hooks/useDynamicCounter';

// Map names -> your public/vayu/testimonials/* files
const AVATAR_MAP = {
  'Dr. Priya Sharma': `${process.env.PUBLIC_URL || ''}/vayu/testimonials/priya-sharma.png`,
  'Rajesh Kumar': `${process.env.PUBLIC_URL || ''}/vayu/testimonials/rajesh-kumar.png`,
  'Anita Desai': `${process.env.PUBLIC_URL || ''}/vayu/testimonials/anita-desai.png`,
};

// Optional fallback (if a name isn't in the map)
const FALLBACK_AVATAR = `${process.env.PUBLIC_URL || ''}/vayu/ai-main.png`;

const TestimonialCard = ({ testimonial, index }) => {
  const [testimonialRef, testimonialRevealed] = useRevealOnScroll({ threshold: 0.2 });
  const avatarSrc =
    AVATAR_MAP[testimonial.name] ||
    testimonial.avatar || // keep old value if provided
    FALLBACK_AVATAR;

  return (
    <div
      ref={testimonialRef}
      className={`h-full ${testimonialRevealed ? 'revealed' : 'reveal-on-scroll'}`}
    >
                <Card className="glass-panel hover-lift transition-all duration-300 h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <Quote className="w-10 h-10 text-[#1E5BFF]" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-400 leading-relaxed mb-6 italic font-light flex-grow">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarSrc}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                      <div>
                        <h4 className="font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Variant Badge */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          testimonial.variant === 'healthcare'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : testimonial.variant === 'legal'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-[#1E5BFF]/20 text-blue-300 border border-[#1E5BFF]/30'
                        }`}
                      >
                        {testimonial.variant === 'healthcare'
                          ? 'Vayu MedPro'
                          : testimonial.variant === 'legal'
                          ? 'Vayu LegalEdge'
                          : 'Vayu Essential'}{' '}
                        User
                      </span>
                    </div>
                  </CardContent>
                </Card>
    </div>
  );
};

const TestimonialsSection = () => {
  const [sectionRef, sectionRevealed] = useRevealOnScroll({ threshold: 0.1 });
  
  // Dynamic counters that update based on time elapsed
  const waitlistCount = useWaitlistCounter();
  const preOrdersCount = usePreOrdersCounter();

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${sectionRevealed ? 'revealed' : 'reveal-on-scroll'}`} ref={sectionRef}>
          <h2 className="text-3xl md:text-4xl font-newreader font-semibold tracking-tighter text-white mb-4">
            Trusted by Professionals Across India
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            See how Vayu X is transforming the way professionals work, 
            from healthcare to legal services and beyond.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* CTA Section - Metrics Strip - Mobile version with static 2257 */}
        <div className="mt-16 text-center md:hidden">
          <div className="glass-panel rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold tracking-tighter text-white mb-4">
              Join the Future of Professional Productivity
            </h3>
            <p className="text-gray-400 mb-6 font-light">
              Over {preOrdersCount} professionals have already signed up for and pre-ordered their Vayu X. 
              Don't miss out on the early bird pricing.
            </p>
            
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-[#1E5BFF]/20">
                <div className="text-3xl font-bold text-[#1E5BFF]">{preOrdersCount}</div>
                <div className="text-sm text-gray-500">Pre-orders</div>
              </div>
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-green-500/20">
                <div className="text-3xl font-semibold tracking-tighter text-green-400">2,257</div>
                <div className="text-sm text-gray-500">Waitlisted Forms</div>
              </div>
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-[#8B5CF6]/20">
                <div className="text-3xl font-semibold tracking-tighter text-[#8B5CF6]">March 2026</div>
                <div className="text-sm text-gray-500">Shipping Starts</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Metrics Strip - Desktop version with dynamic counter */}
        <div className="mt-16 text-center hidden md:block">
          <div className="glass-panel rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold tracking-tighter text-white mb-4">
Join the Future of Professional Productivity
            </h3>
            <p className="text-gray-400 mb-6 font-light">
              Over {preOrdersCount} professionals have already signed up for and pre-ordered their Vayu X. 
              Don't miss out on the early bird pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-[#1E5BFF]/20">
                <div className="text-3xl font-bold text-[#1E5BFF]">{preOrdersCount}</div>
                <div className="text-sm text-gray-500">Pre-orders</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/5"></div>
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-green-500/20">
                <div className="text-3xl font-semibold tracking-tighter text-green-400">{waitlistCount.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Waitlisted Forms</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/5"></div>
              <div className="text-center px-6 py-4 glass-panel-sm rounded-xl border border-[#8B5CF6]/20">
                <div className="text-3xl font-semibold tracking-tighter text-[#8B5CF6]">March 2026</div>
                <div className="text-sm text-gray-500">Shipping Starts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
