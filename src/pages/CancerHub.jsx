// src/pages/CancerHub.jsx
// Cancer hub page - lists all cancer types

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { trackPageView, trackScrollDepth, trackCTA } from '@/utils/seo/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GetMatchedCTA,
  FindHospitalsCTA,
  CostCalculatorCTA,
  SecondOpinionCTA
} from '@/components/ConversionCTAs';
import { cancerPagesData } from '@/data/cancerPagesData';
import { 
  Stethoscope, 
  ArrowRight,
  Building2,
  Calculator
} from 'lucide-react';
import '@/App.css';

export default function CancerHub() {
  const navigate = useNavigate();
  const baseUrl = "https://www.byoncocare.com";
  const pageUrl = `${baseUrl}/cancer`;

  useEffect(() => {
    // Track page view
    trackPageView(pageUrl, "Cancer Types - Treatment Information | ByOnco");
    
    // Track scroll depth
    trackScrollDepth();
  }, [pageUrl]);

  // Get all cancer types
  const cancerTypes = Object.values(cancerPagesData).map(cancer => ({
    name: cancer.name,
    slug: cancer.slug,
    description: cancer.content.intro.substring(0, 150) + '...',
    meta: cancer.meta
  }));

  // Generate JSON-LD Schema
  const generateSchema = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Cancer Types",
          "item": pageUrl
        }
      ]
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Cancer Types - Treatment Information",
      "description": "Comprehensive information about different types of cancer, including symptoms, diagnosis, treatment options, and costs for India and US.",
      "numberOfItems": cancerTypes.length,
      "itemListElement": cancerTypes.map((cancer, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": cancer.name,
        "url": `${baseUrl}/cancer/${cancer.slug}`,
        "description": cancer.description
      }))
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ByOnco",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "description": "AI-powered cancer care navigation platform"
    };

    return [breadcrumbSchema, itemListSchema, organizationSchema];
  };

  const schemas = generateSchema();

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Cancer Types - Treatment Information | ByOnco</title>
        <meta name="title" content="Cancer Types - Treatment Information | ByOnco" />
        <meta name="description" content="Comprehensive cancer treatment information for 10+ cancer types. Compare symptoms, diagnosis, treatment options, costs, and find the best hospitals in India and US." />
        <link rel="canonical" href={pageUrl} />

        {/* Hreflang Tags */}
        <link rel="alternate" hreflang="en-IN" href={`${pageUrl}?locale=en-IN`} />
        <link rel="alternate" hreflang="en-US" href={`${pageUrl}?locale=en-US`} />
        <link rel="alternate" hreflang="x-default" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Cancer Types - Treatment Information | ByOnco" />
        <meta property="og:description" content="Comprehensive cancer treatment information for 10+ cancer types. Compare symptoms, diagnosis, treatment options, costs, and find the best hospitals." />
        <meta property="og:image" content="https://www.byoncocare.com/preview.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ByOnco - AI-Powered Cancer Care" />
        <meta property="og:site_name" content="ByOnco" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Cancer Types - Treatment Information | ByOnco" />
        <meta name="twitter:description" content="Comprehensive cancer treatment information for 10+ cancer types. Compare symptoms, diagnosis, treatment options, costs, and find the best hospitals." />
        <meta name="twitter:image" content="https://www.byoncocare.com/preview.png" />
        <meta name="twitter:image:alt" content="ByOnco - AI-Powered Cancer Care" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="PraesidioCare Private Limited" />

        {/* JSON-LD Schemas */}
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0]">
        {/* Header */}
        <header className="bg-[#0a0a0f] border-b border-purple-500/10 sticky top-0 z-40 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="footer-logo">
                <span className="logo-text">
                  <span className="logo-by">by</span>
                  <span className="logo-onco"><span className="logo-o">O</span>nco</span>
                </span>
              </a>
              <div className="hidden md:flex gap-4">
                <GetMatchedCTA className="text-sm" text="Get Matched" location="header" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 break-words">
              Cancer Treatment Information Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              Comprehensive, expert-reviewed information about cancer types, symptoms, diagnosis, treatment options, and costs. Get AI-matched care and expert second opinions.
            </p>
            
            {/* Quick CTAs */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
              <GetMatchedCTA text="Get Matched" location="hero" />
              <FindHospitalsCTA text="Find Hospitals" location="hero" />
              <CostCalculatorCTA text="Estimate Cost" location="hero" />
              <SecondOpinionCTA text="Second Opinion" location="hero" />
            </div>
          </motion.section>

          {/* Cancer Types Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 px-2">All Cancer Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cancerTypes.map((cancer, index) => (
                <motion.div
                  key={cancer.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-purple-400" />
                        {cancer.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-[#94a3b8] mb-4 flex-1">
                        {cancer.description}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => navigate(`/cancer/${cancer.slug}`)}
                          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button
                            onClick={() => {
                              trackCTA('estimate_cost', 'cancer_card', { page: '/cancer' });
                              navigate('/cost-calculator');
                            }}
                            variant="outline"
                            className="border-purple-500 text-purple-400 hover:bg-purple-900/20 text-xs sm:text-sm"
                          >
                            <Calculator className="h-3 w-3 mr-1" />
                            Estimate Cost
                          </Button>
                          <Button
                            onClick={() => {
                              trackCTA('get_matched', 'cancer_card', { page: '/cancer' });
                              navigate('/get-started');
                            }}
                            variant="outline"
                            className="border-purple-500 text-purple-400 hover:bg-purple-900/20 text-xs sm:text-sm"
                          >
                            <Building2 className="h-3 w-3 mr-1" />
                            Get Matched
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Help Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border-purple-500/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 px-2 break-words">
                  Need Help Finding the Right Treatment?
                </h2>
                <p className="text-sm sm:text-base text-[#94a3b8] mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
                  Our AI-powered platform matches you with the best hospitals based on your cancer type, stage, budget, location, and insurance coverage.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
                  <GetMatchedCTA text="Get Matched to Best Hospital" location="help_section" />
                  <SecondOpinionCTA text="Get Second Opinion" location="help_section" />
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </main>

        {/* Footer - Same as MedTourismLanding */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section footer-main">
              <div className="footer-logo">
                <span className="logo-text">
                  <span className="logo-by">by</span>
                  <span className="logo-onco"><span className="logo-o">O</span>nco</span>
                </span>
              </div>
              <p className="footer-description">
                AI-powered oncology medical tourism OS helping patients find the
                right treatment, faster.
              </p>
              <div className="footer-address">
                <p className="footer-address-title">
                  PraesidioCare Private Limited
                </p>
                <p className="footer-address-text">Bengaluru, Karnataka, India</p>
                <p className="footer-address-text">
                  Email: contact@byoncocare.com
                </p>
              </div>
              <div className="built-in-india">
                <span className="india-flag">🇮🇳</span>
                <span>Built in India</span>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Services</h4>
              <a href="/find-hospitals" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/find-hospitals"); }}>
                Find Hospitals
              </a>
              <a href="/cost-calculator" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/cost-calculator"); }}>
                Cost Calculator
              </a>
              <a href="/rare-cancers" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/rare-cancers"); }}>
                Rare Cancers
              </a>
              <a href="/second-opinion" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/second-opinion"); }}>
                Second Opinion
              </a>
              <a href="/teleconsultation" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/teleconsultation"); }}>
                Teleconsultation
              </a>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <a href="/about" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
                About
              </a>
              <a href="/careers" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/careers"); }}>
                Careers
              </a>
              <a href="/get-started" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/get-started"); }}>
                Get Started
              </a>
              <a href="/products/vayu" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/products/vayu"); }}>
                Products
              </a>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Legal</h4>
              <a href="/privacy" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>
                Privacy Policy
              </a>
              <a href="/terms-and-conditions" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/terms-and-conditions"); }}>
                Terms of Service
              </a>
              <a href="/security" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/security"); }}>
                Security
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © 2026 ByOnco by PraesidioCare Private Limited. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
