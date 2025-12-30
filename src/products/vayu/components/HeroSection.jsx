// src/products/vayu/components/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";
import VideoModal from "./ui/VideoModal"; // fullscreen video modal
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";

const DEMO_URL = "https://www.youtube.com/watch?v=LKjsukwPMSE"; 
// Tip: replace with your YouTube URL/ID or an MP4 URL. MP4 also works.

const HeroSection = ({ onPreOrder }) => {
  const [openDemo, setOpenDemo] = useState(false);
  const navigate = useNavigate();
  const [heroRef, heroRevealed] = useRevealOnScroll({ threshold: 0.2 });
  const [lettersAnimated, setLettersAnimated] = useState(false);

  // Trigger letter animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLettersAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Helper to split text into letters for animation
  const splitTextIntoLetters = (text) => {
    return text.split('').map((char, i) => ({
      char: char === ' ' ? '\u00A0' : char,
      delay: lettersAnimated ? i * 0.04 : 0,
      key: i,
    }));
  };

  // Route to waitlist unless a custom handler is passed
  const handlePreOrderClick = () => {
    if (typeof onPreOrder === "function") {
      onPreOrder();
      return;
    }
    navigate("/products/vayu/waitlist");
  };

  return (
    <>
      <section
        id="about"
        className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center pt-16 md:pt-20 section-padding overflow-hidden bg-transparent"
        aria-label="Vayu X hero section"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center" ref={heroRef}>
            {/* Left Content */}
            <div className={`text-center lg:text-left ${heroRevealed ? 'revealed' : 'reveal-on-scroll'}`}>
              <div className="mb-12">
                <span className="pill-shimmer-beam inline-flex items-center gap-3 border border-white/20 bg-black rounded-full px-6 py-2.5 backdrop-blur-sm relative z-10">
                  <span className="w-2 h-2 rounded-full bg-[#1E5BFF] animate-pulse"></span>
                  <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white">Made in India, Built for the Future</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-newreader font-bold tracking-tighter text-white leading-[1.1] mb-6 md:mb-8">
                <div className="block overflow-hidden">
                  {splitTextIntoLetters("Glasses that ").map(({ char, delay, key }) => (
                    <span key={key} className="char-wrapper">
                      <span
                        className={`char ${lettersAnimated ? 'animate-in' : ''}`}
                        style={{ animationDelay: `${delay}s` }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                  {splitTextIntoLetters("answer").map(({ char, delay, key }) => (
                    <span key={`answer-${key}`} className="char-wrapper">
                      <span
                        className={`char ${lettersAnimated ? 'animate-in' : ''} text-[#1E5BFF]`}
                        style={{ animationDelay: `${delay + splitTextIntoLetters("Glasses that ").length * 0.04}s` }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                  {splitTextIntoLetters(" what ").map(({ char, delay, key }) => (
                    <span key={`what-${key}`} className="char-wrapper">
                      <span
                        className={`char ${lettersAnimated ? 'animate-in' : ''}`}
                        style={{ animationDelay: `${delay + (splitTextIntoLetters("Glasses that ").length + splitTextIntoLetters("answer").length) * 0.04}s` }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                  {splitTextIntoLetters("matters").map(({ char, delay, key }) => (
                    <span key={`matters-${key}`} className="char-wrapper">
                      <span
                        className={`char ${lettersAnimated ? 'animate-in' : ''} text-[#1E5BFF]`}
                        style={{ animationDelay: `${delay + (splitTextIntoLetters("Glasses that ").length + splitTextIntoLetters("answer").length + splitTextIntoLetters(" what ").length) * 0.04}s` }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                  {splitTextIntoLetters(".").map(({ char, delay, key }) => (
                    <span key={`dot-${key}`} className="char-wrapper">
                      <span
                        className={`char ${lettersAnimated ? 'animate-in' : ''}`}
                        style={{ animationDelay: `${delay + (splitTextIntoLetters("Glasses that ").length + splitTextIntoLetters("answer").length + splitTextIntoLetters(" what ").length + splitTextIntoLetters("matters").length) * 0.04}s` }}
                      >
                        {char}
                      </span>
                    </span>
                  ))}
                </div>
              </h1>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 md:mb-8 tracking-tight">
                Designed to stay out of your way.
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8 md:mb-12 font-light">
                Built in India. An AI companion that helps you throughout your day. Created for professionals who value focus over noise and for moments where clarity matters. Notes for conversations. Meetings, calls, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a
                  onClick={handlePreOrderClick}
                  className="btn-shimmer-wrapper btn-glow-hover relative group inline-flex items-center justify-center p-[1px] rounded-full shadow-[0_0_20px_rgba(30,91,255,0.3)] cursor-pointer"
                  aria-label="Pre-Order"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1E5BFF] to-[#2F6BFF] opacity-100 rounded-full"></span>
                  <span className="relative bg-[#1E5BFF] group-hover:bg-[#2F6BFF] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors z-10">
                    Pre-Order 
                    <ArrowRight className="ml-2 h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <button
                  onClick={() => setOpenDemo(true)}
                  className="btn-shimmer-wrapper relative group inline-flex items-center justify-center p-[1px] rounded-full"
                  aria-label="Watch the Vayu X demo video"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-50 rounded-full"></span>
                  <span className="relative bg-[#0a0a0c] hover:bg-[#12121a] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors z-10 flex items-center gap-2 border border-white/10">
                    <Play className="w-4 h-4 group-hover:text-[#1E5BFF] transition-colors" />
                    Watch Demo
                  </span>
                </button>
              </div>

              <div className="mt-6 md:mt-8 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start flex-wrap">
                  <p className="text-xs sm:text-sm text-gray-400">Starting at</p>
                  <p className="text-2xl sm:text-3xl font-semibold tracking-tighter text-white">₹59,999</p>
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm">
                    🚚 Shipping starts March 2026
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-400 font-light">
                  Currently shipping: <strong className="text-white font-semibold">Vayu X Essential</strong>
                </p>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative isolate mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-lg">
                {/* Premium glow behind image */}
                <div className="absolute inset-0 bg-[#2F6BFF] rounded-3xl blur-3xl opacity-15 animate-pulse z-0 pointer-events-none" />
                <div className="glass-panel rounded-3xl p-4 relative z-10 hover-lift">
                  <img
                    src={`${process.env.PUBLIC_URL || ''}/vayu/hero.webp`}
                    alt="Person wearing Vayu X smart glasses"
                    className="relative w-full h-auto rounded-2xl block opacity-100 object-contain mix-blend-normal"
                  />

                  {/* Floating AI assistant text overlay - Below the face */}
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-6 md:left-auto md:right-6 md:max-w-[80%] glass-panel-sm bg-black/30 md:bg-black/60 backdrop-blur-md border border-white/20 text-xs px-3 py-2 rounded-lg animate-fade-in">
                    <div className="font-mono font-bold text-[#1E5BFF]">14:32</div>
                    <div className="font-bold text-[#1E5BFF]">
                      Good afternoon! Ready for your presentation?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen video modal */}
      <VideoModal
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        src={DEMO_URL}
        // poster="/assets/vayu-poster.jpg" // (optional) if using MP4
      />
    </>
  );
};

export default HeroSection;
