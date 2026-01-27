import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Heart, 
  Sparkles, 
  Shield, 
  Users, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-white hover:text-purple-300 hover:bg-gray-800 mb-6"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 px-2"
        >
          <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-500/40 px-4 py-1.5 text-sm font-semibold">
            <Heart className="h-3 w-3 mr-1.5 inline" />
            Our Story
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 break-words">
            Why ByOnco Exists
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We believe every cancer patient deserves access to the best care, regardless of where they live or what they can afford. 
            ByOnco was born from real pain and real system gaps—and built to solve them.
          </p>
        </motion.div>

        {/* Origin Story */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/50 rounded-full h-12 w-12 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">The Origin Story</h2>
              </div>
              <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                <p>
                  ByOnco was founded by a team that experienced firsthand the challenges of navigating cancer care. 
                  We watched families struggle to find the right hospitals, understand costs, access second opinions, 
                  and coordinate care across cities and countries.
                </p>
                <p>
                  The healthcare system, while filled with dedicated professionals, often lacks the transparency, 
                  real-time information, and coordination tools that patients desperately need during their most vulnerable moments.
                </p>
                <p>
                  We saw the gap between what technology could enable and what patients were experiencing. 
                  So we built ByOnco—not as a replacement for medical care, but as a trusted navigation partner 
                  that empowers patients and families with clarity, speed, and hope.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* What We Do */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              What We Do
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              ByOnco combines AI-powered intelligence with human care coordination to transform how cancer patients find and access treatment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Activity className="h-6 w-6 text-purple-400" />,
                title: "AI Oncology Navigation",
                description: "Our AI analyzes your cancer type, stage, budget, insurance, and preferences to match you with the best hospitals and doctors globally."
              },
              {
                icon: <Zap className="h-6 w-6 text-cyan-400" />,
                title: "Real-Time Access",
                description: "Get live bed availability, queue status, and hospital capacity data across India, US, EU, and Middle East."
              },
              {
                icon: <FileText className="h-6 w-6 text-violet-400" />,
                title: "Rapid Second Opinions",
                description: "Connect with board-certified oncologists for comprehensive second opinions delivered in under 12 hours."
              },
              {
                icon: <Globe className="h-6 w-6 text-blue-400" />,
                title: "Cost Clarity",
                description: "Transparent cost estimates, financial planning, subsidy matching, and complete care package coordination."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/50 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* What Makes Us Different */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/50 rounded-full h-12 w-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">What Makes Us Different</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Data Integrity",
                    description: "We verify hospital data, doctor credentials, and real-time availability. No outdated information, no false promises."
                  },
                  {
                    title: "Real-Time Signal Focus",
                    description: "Our platform prioritizes live data—bed availability, queue status, actual costs—over static directories."
                  },
                  {
                    title: "Patient-First Coordination",
                    description: "Every care package is tailored to your needs. We coordinate travel, accommodation, translation, and local support."
                  },
                  {
                    title: "Trust & Transparency",
                    description: "Clear pricing, honest recommendations, and full disclosure of what's included in every service and package."
                  }
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{point.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Getting started with ByOnco is simple. We guide you through every step.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Share Your Journey",
                description: "Tell us about your cancer type, stage, location, budget, and preferences. Our AI analyzes your needs instantly."
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Receive personalized hospital and doctor recommendations with real-time availability, costs, and outcomes data."
              },
              {
                step: "3",
                title: "Access Care",
                description: "Connect with hospitals, get second opinions, coordinate travel, and access financial support—all in one place."
              }
            ].map((step, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Trust & Safety */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/50 rounded-full h-12 w-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Trust & Safety</h2>
              </div>
              <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                <p>
                  <strong className="text-white">Medical Disclaimer:</strong> ByOnco is a healthcare navigation and coordination 
                  platform. We are not a medical provider and do not provide medical advice, diagnosis, or treatment. All medical 
                  decisions must be made in consultation with qualified healthcare professionals.
                </p>
                <p>
                  Your privacy and data security are paramount. We comply with India's Digital Personal Data Protection Act, 2023, 
                  and maintain HIPAA-equivalent security standards. Learn more in our{' '}
                  <a href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">Privacy Policy</a> and{' '}
                  <a href="/security" className="text-purple-400 hover:text-purple-300 hover:underline">Security</a> pages.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border border-purple-500/30">
            <CardContent className="p-8 sm:p-10 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of families who found clarity, hope, and faster treatment starts with ByOnco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
                  onClick={() => navigate('/get-started')}
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-lg"
                  onClick={() => navigate('/second-opinion')}
                >
                  Get Second Opinion <Clock className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}

