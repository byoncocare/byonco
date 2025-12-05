import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Briefcase, Linkedin, Mail, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Careers() {
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
          <Badge className="mb-3 sm:mb-4 bg-purple-600/20 text-purple-300 border-purple-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
            <Briefcase className="h-3 w-3 mr-1.5 inline" />
            Join Our Team
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 break-words">
            Careers at ByOnco
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Thank you for your interest in joining our team!
          </p>
        </div>

        {/* Content */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <div className="mb-4 sm:mb-6">
              <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-purple-400 mx-auto" />
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 break-words">
              Currently Hiring
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed break-words">
              While we currently don't have any open positions, we're always excited
              to connect with passionate, talented individuals who share our mission
              to transform cancer care.
            </p>

            <div className="mt-10 space-y-4">
              <p className="text-base text-gray-300">
                Stay updated on future opportunities by following us on
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                  onClick={() => window.open('https://www.linkedin.com/company/byonco', '_blank')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:text-white"
                  onClick={() => window.location.href = 'mailto:contact@byoncocare.com'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  contact@byoncocare.com
                </Button>
              </div>
            </div>

            <div className="mt-12 text-sm text-gray-400 italic">
              We're building something meaningful. Join us in making a difference.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
