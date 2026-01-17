// src/components/ConversionCTAs.jsx
// Reusable conversion CTA components for cancer pages

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackCTA } from '@/utils/seo/analytics';
import { 
  MessageCircle, 
  Calculator, 
  Stethoscope, 
  Building2,
  ArrowRight,
  Phone
} from 'lucide-react';

/**
 * WhatsApp CTA Button
 */
export function WhatsAppCTA({ className = "", text = "Chat on WhatsApp", location = "unknown" }) {
  const currentLocation = useLocation();
  const whatsappNumber = "+919022792824"; // Update with actual number
  const whatsappMessage = encodeURIComponent("Hi, I need help with cancer treatment options.");
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const handleClick = () => {
    trackCTA('whatsapp', location, {
      page: currentLocation.pathname,
      button_text: text
    });
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
        <MessageCircle className="h-4 w-4 mr-2" />
        {text}
      </Button>
    </a>
  );
}

/**
 * Get Matched CTA Button - Links to /get-started
 */
export function GetMatchedCTA({ className = "", text = "Get Matched", location = "unknown" }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleClick = () => {
    trackCTA('get_matched', location, {
      page: currentLocation.pathname,
      button_text: text
    });
    navigate('/get-started');
  };

  return (
    <Button
      onClick={handleClick}
      className={`w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white ${className}`}
    >
      <Building2 className="h-4 w-4 mr-2" />
      {text}
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
}

/**
 * Find Hospitals CTA Button - Links to /find-hospitals
 */
export function FindHospitalsCTA({ className = "", text = "Find Hospitals", location = "unknown" }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleClick = () => {
    trackCTA('find_hospitals', location, {
      page: currentLocation.pathname,
      button_text: text
    });
    navigate('/find-hospitals');
  };

  return (
    <Button
      onClick={handleClick}
      className={`w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white ${className}`}
    >
      <Building2 className="h-4 w-4 mr-2" />
      {text}
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
}

/**
 * Cost Calculator CTA Button - Links to /cost-calculator
 */
export function CostCalculatorCTA({ className = "", text = "Estimate Cost", location = "unknown" }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleClick = () => {
    trackCTA('estimate_cost', location, {
      page: currentLocation.pathname,
      button_text: text
    });
    navigate('/cost-calculator');
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`w-full border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20 ${className}`}
    >
      <Calculator className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}

/**
 * Second Opinion CTA Button - Links to /second-opinion
 */
export function SecondOpinionCTA({ className = "", text = "Get Second Opinion", location = "unknown" }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const handleClick = () => {
    trackCTA('second_opinion', location, {
      page: currentLocation.pathname,
      button_text: text
    });
    navigate('/second-opinion');
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 ${className}`}
    >
      <Stethoscope className="h-4 w-4 mr-2" />
      {text}
    </Button>
  );
}

/**
 * Sticky CTA Bar (for mobile/desktop sticky positioning)
 */
export function StickyCTABar({ cancerType = "cancer" }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 shadow-lg p-3 sm:p-4 md:hidden">
      <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3">
        <GetMatchedCTA className="flex-1 text-xs sm:text-sm py-2" text="Get Matched" location="sticky_bar" />
        <WhatsAppCTA className="flex-1 text-xs sm:text-sm py-2" text="Chat" location="sticky_bar" />
      </div>
    </div>
  );
}

/**
 * Conversion CTA Card (for inline placement)
 */
export function ConversionCTACard({ cancerType = "cancer" }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-gray-800 dark:to-gray-900 dark:border-purple-500/30">
      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">
          Get Expert Help for {cancerType} Treatment
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed break-words">
          Connect with our AI-powered platform to find the best hospitals, compare costs, and get expert second opinions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <FindHospitalsCTA text="Find Hospitals" location="inline_card" />
          <WhatsAppCTA text="24/7 Support" location="inline_card" />
          <CostCalculatorCTA text="Estimate Cost" location="inline_card" />
          <SecondOpinionCTA text="Second Opinion" location="inline_card" />
        </div>
      </CardContent>
    </Card>
  );
}
