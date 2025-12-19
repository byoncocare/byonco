// src/products/vayu/pages/AboutVayu.jsx
import React from 'react';
import { useRevealOnScroll } from '../components/hooks/useRevealOnScroll';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlashlightCursor from '../components/FlashlightCursor';
import '../App.css';

export default function AboutVayu() {
  const [heroRef, heroRevealed] = useRevealOnScroll({ threshold: 0.2 });
  const [section1Ref, section1Revealed] = useRevealOnScroll({ threshold: 0.1 });
  const [section2Ref, section2Revealed] = useRevealOnScroll({ threshold: 0.1 });
  const [section3Ref, section3Revealed] = useRevealOnScroll({ threshold: 0.1 });
  const [section4Ref, section4Revealed] = useRevealOnScroll({ threshold: 0.1 });

  return (
    <div className="page-shell">
      {/* Background overlay layers - same as landing page */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          backgroundSize: '50px 50px',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}
        aria-hidden="true"
      />
      <div 
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.75) 100%)'
        }}
        aria-hidden="true"
      />
      
      <FlashlightCursor />
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center pt-20 md:pt-32 pb-8 md:pb-16 section-padding overflow-hidden bg-transparent"
      >
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className={`text-center ${heroRevealed ? 'revealed' : 'reveal-on-scroll'}`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-newreader font-bold tracking-tighter text-white leading-[1.1] mb-6">
              About Vayu
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#1E5BFF] to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16 mb-8 md:mb-16">
        
        {/* Opening Story */}
        <section 
          ref={section1Ref}
          className={`mb-12 md:mb-24 ${section1Revealed ? 'revealed' : 'reveal-on-scroll'}`}
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <p className="text-2xl md:text-3xl font-newreader font-light text-white/90 leading-relaxed mb-8 italic">
              Vayu began as a simple question:
            </p>
            <p className="text-3xl md:text-4xl font-newreader font-semibold text-white leading-tight mb-12">
              What would intelligence look like if it respected focus instead of interrupting it?
            </p>
            <p className="text-lg font-newreader text-gray-300 leading-relaxed">
              The idea took shape in Nashik, where the earliest conversations began, not about gadgets, but about professionals. People whose work demands clarity. People who cannot afford distraction. People who don't want technology to be loud, just dependable.
            </p>
          </div>
        </section>

        {/* Journey Section */}
        <section 
          ref={section2Ref}
          className={`mb-12 md:mb-24 ${section2Revealed ? 'revealed' : 'reveal-on-scroll'}`}
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <h2 className="text-2xl md:text-3xl font-newreader font-semibold text-white mb-6">From there, Vayu grew across India.</h2>
            <div className="space-y-6 text-lg font-newreader text-gray-300 leading-relaxed">
              <p>
                It was designed in <span className="text-[#1E5BFF] font-medium">Bengaluru</span>, shaped by engineers who understand software, hardware, and human behavior in equal measure. It was built and manufactured in <span className="text-[#1E5BFF] font-medium">Ahmedabad</span>, where precision engineering meets scale. At every step, the product passed through hands and minds across the country, each adding depth, restraint, and intent.
              </p>
              <p className="pt-4 border-t border-white/10">
                This is not a project assembled in isolation.
              </p>
              <p className="text-xl font-newreader text-white font-medium">
                It is the result of engineers who chose to return, despite global careers and strong résumés, to build something meaningful at home. Not because it was easy, but because it mattered.
              </p>
              <p className="text-2xl font-newreader font-semibold text-[#1E5BFF] pt-4">
                Vayu is built in India, for the world.
              </p>
            </div>
          </div>
        </section>

        {/* Designed for Professionals */}
        <section 
          ref={section3Ref}
          className={`mb-12 md:mb-24 ${section3Revealed ? 'revealed' : 'reveal-on-scroll'}`}
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <h2 className="text-2xl md:text-3xl font-newreader font-semibold text-white mb-6">Designed for Professionals</h2>
            <p className="text-xl font-newreader text-white/90 mb-6 italic">
              Vayu is not designed for everyone, and that is intentional.
            </p>
            <div className="space-y-6 text-lg font-newreader text-gray-300 leading-relaxed">
              <p>
                It is developed for professionals who value focus over noise, clarity over clutter, and discretion over display. Every decision, from how information appears to when it stays silent, is fine-tuned to real professional environments.
              </p>
              <div className="pt-6 border-t border-white/10 space-y-4">
                <p className="text-white font-newreader font-medium">
                  The goal was never to overload vision with data.
                </p>
                <p className="text-white font-newreader font-medium">
                  The goal was to deliver intelligence only when it's needed, and disappear when it's not.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* A Different Way */}
        <section 
          ref={section4Ref}
          className={`mb-12 md:mb-24 ${section4Revealed ? 'revealed' : 'reveal-on-scroll'}`}
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <h2 className="text-2xl md:text-3xl font-newreader font-semibold text-white mb-6">A Different Way to Think About Glasses</h2>
            <div className="space-y-6 text-lg font-newreader text-gray-300 leading-relaxed">
              <p>
                The earliest inspiration did not come from copying what already exists, but from questioning it.
              </p>
              <div className="space-y-6 pl-6 border-l-4 border-[#1E5BFF]/50 my-6">
                <p className="text-white font-newreader text-lg leading-relaxed">Could glasses be more than screens?</p>
                <p className="text-white font-newreader text-lg leading-relaxed">Could intelligence feel natural, not intrusive?</p>
                <p className="text-white font-newreader text-lg leading-relaxed">Could AI work with human attention instead of competing for it?</p>
              </div>
              <p className="pt-6 font-newreader">
                As AI, AR, and robotics continue to evolve, Vayu is built on a simple belief:
              </p>
              <p className="text-xl font-newreader text-white font-semibold pt-2">
                technology should adapt to professionals, not the other way around.
              </p>
              <p className="pt-4 font-newreader">
                Every iteration has been shaped with that principle in mind.
              </p>
            </div>
          </div>
        </section>

        {/* Built Here. Moving Forward. */}
        <section className="mb-8 md:mb-16">
          <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
            <h2 className="text-2xl md:text-3xl font-newreader font-semibold text-white mb-6">Built Here. Moving Forward.</h2>
            <div className="space-y-6 text-lg font-newreader text-gray-300 leading-relaxed">
              <p>
                When we say Made in India, we mean it literally, from ideation to execution. Every major stage of Vayu's journey has been shaped within the country, by people deeply invested in building world-class technology from India.
              </p>
              <p className="text-xl font-newreader text-white font-medium pt-4">
                Vayu is preparing to enter the Indian market in early 2026.
              </p>
              <div className="pt-8 border-t border-white/10 space-y-4">
                <p className="text-lg font-newreader text-gray-300">
                  This journey is just beginning. And as we move forward, we invite those who believe in focus, precision, and thoughtful innovation to be part of it.
                </p>
                <p className="text-2xl font-newreader font-semibold text-white pt-4">
                  Not as users.
                </p>
                <p className="text-2xl font-newreader font-semibold text-[#1E5BFF]">
                  But as the reason we build.
                </p>
                <p className="text-lg font-newreader text-gray-300 pt-6">
                  We look forward to sharing more as we move toward our first launch milestone in 2026.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}

