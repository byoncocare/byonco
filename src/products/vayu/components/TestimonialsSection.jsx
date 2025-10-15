import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { testimonials } from '../data/mock';

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Professionals Across India
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Vayu X is transforming the way professionals work, 
            from healthcare to legal services and beyond.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-blue-500" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Variant Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    testimonial.variant === 'healthcare' 
                      ? 'bg-green-100 text-green-800'
                      : testimonial.variant === 'legal'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {testimonial.variant === 'healthcare' ? 'Vayu MedPro' :
                     testimonial.variant === 'legal' ? 'Vayu LegalEdge' : 'Vayu Essential'} User
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join the Future of Professional Productivity
            </h3>
            <p className="text-gray-600 mb-6">
              Over 10,000+ professionals have already pre-ordered their Vayu X. 
              Don't miss out on the early bird pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-sm text-gray-500">Pre-orders</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200 mx-4"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4.9/5</div>
                <div className="text-sm text-gray-500">Demo Rating</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200 mx-4"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">March 2026</div>
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