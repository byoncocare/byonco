// src/products/vayu/components/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";
import VideoModal from "./ui/VideoModal"; // fullscreen video modal

const DEMO_URL = "https://www.youtube.com/watch?v=LKjsukwPMSE"; 
// Tip: replace with your YouTube URL/ID or an MP4 URL. MP4 also works.

const HeroSection = ({ onPreOrder }) => {
  const [openDemo, setOpenDemo] = useState(false);
  const navigate = useNavigate();

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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] via-[#E0F2FE] to-[#ECFEFF] pt-16"
        aria-label="Vayu X hero section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-sm font-medium rounded-full shadow">
                  Made in India, Built for the Future
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The glasses to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-600">
                  {" "}remember
                </span>
                <br />
                everything
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                Vayu X <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">ByOnco</span>
              </h2>

              <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto lg:mx-0">
                The most advanced always-aware AI that assists before you ask.
                AI Notetaker for any conversation. Meetings, calls, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handlePreOrderClick}
                  className="bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 hover:from-indigo-700 hover:via-sky-700 hover:to-cyan-700 text-white px-8 py-4 text-lg group shadow"
                  aria-label="Pre-Order"
                >
                  Pre-Order → 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setOpenDemo(true)}
                  className="border-2 border-gray-300 hover:border-indigo-600 px-8 py-4 text-lg group"
                  aria-label="Watch the Vayu X demo video"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              <div className="mt-8 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center lg:justify-start">
                  <p className="text-sm text-gray-600">Starting at</p>
                  <p className="text-3xl font-bold text-gray-900">₹49,999</p>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-900 px-3 py-1 text-sm font-medium">
                    🚚 Shipping starts March 2026
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Currently shipping: <strong>Vayu X Essential</strong>
                </p>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                <img
                  src={process.env.PUBLIC_URL + "/vayu/hero.webp"}
                  alt="Person wearing Vayu X smart glasses"
                  className="relative w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
                />

                {/* Floating AI assistant text overlay */}
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs px-3 py-2 rounded-lg shadow-md animate-fade-in">
                  <div className="font-mono">14:32</div>
                  <div className="font-light">
                    Good afternoon! Ready for your presentation?
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
