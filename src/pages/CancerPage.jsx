// src/pages/CancerPage.jsx
// Reusable cancer page component with SEO optimization

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { trackPageView, trackScrollDepth } from '@/utils/seo/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import '@/App.css';
import { 
  GetMatchedCTA,
  FindHospitalsCTA,
  WhatsAppCTA, 
  CostCalculatorCTA, 
  SecondOpinionCTA,
  ConversionCTACard,
  StickyCTABar
} from '@/components/ConversionCTAs';
import { cancerPagesData } from '@/data/cancerPagesData';
import { 
  AlertCircle, 
  Stethoscope, 
  DollarSign, 
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function CancerPage() {
  const { cancerType } = useParams();
  const navigate = useNavigate();
  const data = cancerPagesData[cancerType];

  // Fallback if cancer type not found
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cancer Type Not Found</h1>
          <p className="text-gray-600">The requested cancer type page is not available.</p>
        </div>
      </div>
    );
  }

  const { name, slug, meta, content, keywords, sources, reviewedBy, reviewedDate, updatedDate } = data;
  const baseUrl = "https://www.byoncocare.com";
  const pageUrl = `${baseUrl}/cancer/${slug}`;

  // Generate JSON-LD Schema
  const generateSchema = () => {
    const medicalConditionSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "name": name,
      "alternateName": content.h1,
      "description": meta.description,
      "url": pageUrl,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": content.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    };

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
          "item": `${baseUrl}/cancer`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": name,
          "item": pageUrl
        }
      ]
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ByOnco",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "description": "AI-powered cancer care navigation platform"
    };

    return [medicalConditionSchema, faqSchema, breadcrumbSchema, organizationSchema];
  };

  const schemas = generateSchema();

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={pageUrl} />

        {/* Hreflang Tags */}
        <link rel="alternate" hreflang="en-IN" href={`${pageUrl}?locale=en-IN`} />
        <link rel="alternate" hreflang="en-US" href={`${pageUrl}?locale=en-US`} />
        <link rel="alternate" hreflang="x-default" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${name} - Treatment Information | ByOnco`} />
        <meta property="og:site_name" content="ByOnco" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.ogImage} />
        <meta name="twitter:image:alt" content={`${name} - Treatment Information | ByOnco`} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="PraesidioCare Private Limited" />
        <meta name="keywords" content={[
          ...keywords.india.symptoms,
          ...keywords.india.diagnosis,
          ...keywords.india.treatment,
          ...keywords.india.cost,
          ...keywords.india.hospital,
          ...keywords.us.symptoms,
          ...keywords.us.diagnosis,
          ...keywords.us.treatment,
          ...keywords.us.cost,
          ...keywords.us.hospital
        ].join(", ")} />

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
                <WhatsAppCTA className="text-sm" text="Chat" location="header" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 break-words px-2">
              {content.h1}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#94a3b8] mb-4 sm:mb-6 max-w-3xl px-2">
              {content.intro}
            </p>
            
            {/* Quick CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
              <FindHospitalsCTA text="Find Hospitals" location="hero" />
              <WhatsAppCTA text="24/7 Support" location="hero" />
              <CostCalculatorCTA text="Estimate Cost" location="hero" />
              <SecondOpinionCTA text="Second Opinion" location="hero" />
            </div>
          </motion.section>

          {/* Symptoms Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-white break-words">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0" />
                  <span>{content.symptoms.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  {content.symptoms.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[#e2e8f0]">{item}</span>
                    </li>
                  ))}
                </ul>
                {content.symptoms.note && (
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-300">{content.symptoms.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Diagnosis Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-white break-words">
                  <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                  <span>{content.diagnosis.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 sm:space-y-3 list-decimal list-inside">
                  {content.diagnosis.steps.map((step, index) => (
                    <li key={index} className="text-sm sm:text-base text-[#e2e8f0] pl-2 break-words">
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.section>

          {/* Staging Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white break-words">Staging Explained</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.staging.stages.map((stage, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                    >
                      <Badge className="mb-2 bg-purple-600">{stage.stage}</Badge>
                      <p className="text-[#e2e8f0] text-sm">{stage.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Treatment Options */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white break-words">{content.treatment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {content.treatment.options.map((option, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 rounded-lg p-3 sm:p-4 bg-gray-800/50 hover:border-purple-500/50 transition-colors"
                    >
                      <h3 className="font-semibold text-base sm:text-lg text-white mb-2 break-words">
                        {option.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed break-words">{option.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Cost Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-white break-words">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
                  <span>Treatment Cost</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* India Costs */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 text-white break-words">
                      <span>🇮🇳</span> <span>{content.cost.india.title}</span>
                    </h3>
                    <ul className="space-y-2 mb-4">
                      {content.cost.india.ranges.map((range, index) => (
                        <li key={index} className="text-[#e2e8f0] flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{range}</span>
                        </li>
                      ))}
                    </ul>
                    {content.cost.india.note && (
                      <p className="text-sm text-[#94a3b8] bg-gray-800/50 p-3 rounded">
                        {content.cost.india.note}
                      </p>
                    )}
                  </div>

                  {/* US Costs */}
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2 text-white break-words">
                      <span>🇺🇸</span> <span>{content.cost.us.title}</span>
                    </h3>
                    <ul className="space-y-2 mb-3 sm:mb-4">
                      {content.cost.us.ranges.map((range, index) => (
                        <li key={index} className="text-sm sm:text-base text-[#e2e8f0] flex items-start gap-2 break-words">
                          <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                          <span>{range}</span>
                        </li>
                      ))}
                    </ul>
                    {content.cost.us.note && (
                      <p className="text-xs sm:text-sm text-[#94a3b8] bg-gray-800/50 p-2 sm:p-3 rounded break-words">
                        {content.cost.us.note}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Conversion CTA Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <ConversionCTACard cancerType={name} />
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white break-words">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {content.faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                      <AccordionTrigger className="text-left text-sm sm:text-base text-white hover:text-purple-400 break-words">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-base text-[#94a3b8] leading-relaxed break-words">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.section>

          {/* Medical Disclaimer */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-12"
          >
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-yellow-300 break-words">Medical Disclaimer</h3>
                <p className="text-xs sm:text-sm text-[#e2e8f0] mb-2 leading-relaxed break-words">
                  This content is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
                {(reviewedBy || reviewedDate || updatedDate) && (
                  <div className="mt-4 pt-4 border-t border-yellow-500/20">
                    {reviewedBy && (
                      <p className="text-xs text-[#94a3b8] mb-1">
                        Reviewed by: <span className="text-yellow-300">{reviewedBy}</span>
                      </p>
                    )}
                    {reviewedDate && (
                      <p className="text-xs text-[#94a3b8] mb-1">
                        Reviewed: {new Date(reviewedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                    {updatedDate && (
                      <p className="text-xs text-[#94a3b8]">
                        Last updated: {new Date(updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Sources Section */}
          {sources && sources.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mb-12"
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-white break-words">Sources & References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sources.map((source, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#94a3b8] hover:text-purple-400 transition-colors text-sm"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Internal Links */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white break-words">Related Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <a
                    href="/find-hospitals"
                    className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium break-words"
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span>Find Hospitals</span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 ml-auto" />
                  </a>
                  <a
                    href="/cost-calculator"
                    className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium break-words"
                  >
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>Cost Calculator</span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 ml-auto" />
                  </a>
                  <a
                    href="/second-opinion"
                    className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium break-words"
                  >
                    <Stethoscope className="h-4 w-4 flex-shrink-0" />
                    <span>Second Opinion</span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 ml-auto" />
                  </a>
                  <a
                    href="/find-oncologists"
                    className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium break-words"
                  >
                    <Stethoscope className="h-4 w-4 flex-shrink-0" />
                    <span>Find Doctors</span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 ml-auto" />
                  </a>
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

        {/* Sticky CTA Bar (Mobile) */}
        <StickyCTABar cancerType={name} />
      </div>
    </>
  );
}
