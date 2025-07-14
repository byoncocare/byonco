// src/pages/GetMatched.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiSearch,
  FiMapPin,
  FiSettings,
  FiGlobe,
  FiLink,
  FiMic,
  FiActivity,
  FiX,
  FiCheck,
} from 'react-icons/fi';

export default function GetMatched() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('light');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Failed to copy URL.');
    }
  };

  return (
    <main className={`min-h-screen px-4 py-12 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-[#fdfefe] to-[#e9fdfb]'}`}>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => navigate('/get-started')}
          className="text-[#2563eb] border border-[#2563eb] font-semibold px-4 py-2 rounded hover:bg-[#2563eb] hover:text-white transition"
        >
          Try ByOnco Pro
        </button>
      </div>

      <div className="flex flex-col items-center px-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-8"
        >
          <span className="text-[#183b4d]">ByOnco</span>
          <span className="text-[#2ca3a2]">care</span>
        </motion.h1>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-3xl bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg px-4 py-6 sm:px-6 mb-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-6 py-4 shadow-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskClick()}
                placeholder="Where Google ends, ByOnco begins… Search smarter, Ask anything about cancer."
                className="w-full outline-none text-gray-800 text-lg placeholder:text-gray-500 bg-transparent"
              />
              <FiSearch
                className="text-gray-500 w-6 h-6 ml-3 hover:text-teal-600 cursor-pointer"
                onClick={handleAskClick}
              />
            </div>

            {/* Icon Bar */}
            <div className="flex justify-between items-center flex-wrap mt-3 px-1 gap-4">
              <div className="flex gap-4 text-gray-600 items-center">
                <FiMapPin onClick={() => setModal('location')} className="hover:text-teal-600 cursor-pointer" />
                <FiSettings onClick={() => setModal('settings')} className="hover:text-teal-600 cursor-pointer" />
                <FiGlobe
                  onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
                  className="hover:text-teal-600 cursor-pointer"
                  title={`Current: ${language.toUpperCase()}`}
                />
                <FiLink onClick={copyToClipboard} className="hover:text-teal-600 cursor-pointer" />
                <FiMic
                  onClick={handleVoiceInput}
                  className={`cursor-pointer ${isListening ? 'text-red-600 animate-pulse' : 'hover:text-teal-600'}`}
                />
                {copied && <FiCheck className="text-green-600" title="Copied!" />}
              </div>
              <button
                onClick={handleAskClick}
                disabled={loading}
                className="bg-[#2ca3a2] hover:bg-[#239191] text-white rounded-full p-3 shadow transition"
              >
                {loading ? <span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" /> : <FiActivity className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Response Box */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl w-full bg-white border border-gray-200 rounded-xl p-6 shadow-md text-gray-800 overflow-auto max-h-[70vh]"
          >
            <div className="flex items-start gap-3">
              <img src="/icons/bot-avatar.svg" alt="ByOnco AI" className="w-10 h-10 rounded-full border border-gray-300" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-[#1f575e]">ByOnco AI Recommendation:</h2>
                <div
                  className="prose max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: formatResponseHTML(response) }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {modal === 'location' && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <FiX className="absolute top-3 right-3 text-gray-600 cursor-pointer" onClick={() => setModal(null)} />
                <h3 className="text-xl font-bold mb-4">Location Settings</h3>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded px-4 py-2 text-gray-800"
                />
              </motion.div>
            </motion.div>
          )}
          {modal === 'settings' && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <FiX className="absolute top-3 right-3 text-gray-600 cursor-pointer" onClick={() => setModal(null)} />
                <h3 className="text-xl font-bold mb-4">Settings</h3>
                <label className="block mb-3">Language: <span className="font-medium">{language.toUpperCase()}</span></label>
                <label className="block mb-3">
                  Theme:
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="ml-2 border px-2 py-1 rounded"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
