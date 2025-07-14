import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiSearch,
  FiMapPin,
  FiSettings,
  FiGlobe,
  FiLink,
  FiMic,
  FiActivity,
} from 'react-icons/fi';

export default function GetMatched() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const BACKEND_URL = 'https://byonco-fastapi-backend.onrender.com/api/gpt';

  const handleAskClick = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(BACKEND_URL, { prompt: query });
      setResponse(res.data.response || '⚠️ No response from server.');
    } catch (error) {
      console.error('API Error:', error);
      alert('⚠️ Something went wrong while fetching GPT response.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const formatResponseHTML = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
      .replace(/(\d+)\.\s/g, '<br /><strong>$1.</strong> ');
  };

  return (
    <main className="min-h-screen bg-[#d9f1f5] px-4 py-12 relative">
      {/* CTA Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => navigate('/get-started')}
          className="text-[#2563eb] border border-[#2563eb] font-semibold px-4 py-2 rounded hover:bg-[#2563eb] hover:text-white transition"
        >
          Try ByOnco Pro
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center"
        >
          <span className="text-[#183b4d]">ByOnco</span>
          <span className="text-[#2ca3a2] font-semibold">care</span>
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-3xl bg-white/60 backdrop-blur-lg rounded-xl shadow-lg flex items-center justify-between px-6 py-4 mb-10"
        >
          <div className="flex items-center gap-3 flex-1">
            <FiSearch className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskClick()}
              placeholder="Search hospitals, treatments, insurance, PMJAY help…"
              className="bg-transparent outline-none w-full text-gray-800 text-lg placeholder:text-gray-500"
              aria-label="Search input"
            />
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <FiMapPin className="hover:text-teal-600 transition" />
            <FiSettings className="hover:text-teal-600 transition" />
            <FiGlobe className="hover:text-teal-600 transition" />
            <FiLink className="hover:text-teal-600 transition" />
            <FiMic
              onClick={handleVoiceInput}
              className={`hover:text-teal-600 transition cursor-pointer ${
                isListening ? 'text-red-600 animate-pulse' : ''
              }`}
              aria-label="Voice Input"
            />
            <button
              onClick={handleAskClick}
              disabled={loading}
              className="bg-[#2ca3a2] hover:bg-[#239191] text-white p-2 rounded-md"
              aria-label="Ask"
            >
              {loading ? (
                <span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" />
              ) : (
                <FiActivity className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Response Display */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full bg-white border border-gray-200 rounded-xl p-6 shadow-md text-gray-800"
          >
            <h2 className="text-lg font-semibold mb-4 text-[#1f575e]">AI Recommendation:</h2>
            <div
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: formatResponseHTML(response) }}
            />
          </motion.div>
        )}
      </div>
    </main>
  );
}
