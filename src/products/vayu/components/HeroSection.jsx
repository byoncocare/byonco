// src/products/vayu/components/HeroSection.jsx
import React, { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "./ui/button";
import VideoModal from "./ui/VideoModal"; // ⬅️ new: fullscreen video modal

const DEMO_URL = "https://www.youtube.com/watch?v=LKjsukwPMSE"; 
// Tip: replace with your YouTube URL/ID or an MP4 URL. MP4 also works.

const HeroSection = ({ onPreOrder }) => {
  const [openDemo, setOpenDemo] = useState(false); // ⬅️ new

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Made in India, Built for the Future
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The glasses to
                <span className="text-blue-600"> remember</span>
                <br />
                everything
              </h1>

              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                Vayu X <span className="text-blue-600">ByOnco</span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                The most advanced always-aware AI that assists before you ask.
                AI Notetaker for any conversation. Meetings, calls, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={onPreOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group"
                >
                  Pre-order now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setOpenDemo(true)} // ⬅️ new
                  className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              <div className="mt-8 text-center lg:text-left">
                <p className="text-sm text-gray-500 mb-2">Starting at</p>
                <p className="text-3xl font-bold text-gray-900">₹49,999</p>
                <p className="text-sm text-gray-500">Shipping starts March 2026</p>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <img
                  src={process.env.PUBLIC_URL + "/vayu/hero.webp"}
                  alt="Woman wearing Vayu smart glasses"
                  className="relative w-full h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
                />

                {/* Floating AI assistant text overlay */}
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs px-3 py-2 rounded-lg animate-fade-in">
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

      {/* ⬇️ Fullscreen video modal (closes on end / ESC / backdrop) */}
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
