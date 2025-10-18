// src/products/vayu/components/ProductVariants.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { productVariants } from '../data/mock';

const ProductVariants = ({ onPreOrder }) => {
  const navigate = useNavigate();

  // Unified handler: prefer external handler if provided, otherwise go to waitlist
  const handlePreOrder = () => {
    if (typeof onPreOrder === 'function') {
      onPreOrder();
      return;
    }
    navigate('/products/vayu/waitlist');
  };

  return (
    <section className="py-20 bg-gray-50" id="variants">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Vayu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored for different professionals with specialized features and capabilities. 
            All models include core AI functionality with profession-specific enhancements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {productVariants.map((variant) => (
            <Card 
              key={variant.id} 
              className={`relative hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                variant.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''
              }`}
            >
              {variant.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${variant.color} mb-4 flex items-center justify-center`}>
                  <div className="w-8 h-8 bg-white rounded-lg" />
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {variant.name}
                </CardTitle>
                
                <p className="text-gray-600 mb-4">{variant.description}</p>
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{variant.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{variant.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    For {variant.targetAudience}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {variant.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={handlePreOrder}
                  className={`w-full py-3 font-semibold transition-all duration-300 group ${
                    variant.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  aria-label={`Pre-Order ${variant.name} and join the waitlist`}
                >
                  Pre-Order {variant.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
              <p className="text-sm text-gray-600">Delivered to your doorstep at no extra cost</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Warranty Included</h4>
              <p className="text-sm text-gray-600">Comprehensive warranty coverage for peace of mind</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">March 2026</h4>
              <p className="text-sm text-gray-600">Shipping starts soon - secure your spot today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVariants;
