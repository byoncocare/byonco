import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import WhyAI from './components/WhyAI';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import TeamSection from './components/TeamSection';
import FAQ from './components/FAQ';

// Optional GetStarted component (create it inside `src/pages/GetStarted.jsx`)
import GetStarted from './pages/GetStarted';

function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#fffdfa] to-[#f9f9f8] text-gray-800 font-sans leading-relaxed">
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <About />
      <WhyAI />
      <Features />
      <TeamSection />
      <FAQ />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/get-started" element={<GetStarted />} />
      {/* Optionally add 404 fallback */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
