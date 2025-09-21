// src/pages/GetMatched.jsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
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
} from "react-icons/fi";

/** ---- CONFIG ----
 * Backend is reverse-proxied as /api/ask by your server (nginx/vercel.json/etc.)
 * Never hardcode your Render/Railway URL or any API keys here.
 */
const API_PATH = "/api/ask"; // backend should expose POST /api/ask

/** Minimal client-side health intent check (backend MUST enforce too) */
const HEALTH_KEYWORDS = [
  "cancer",
  "oncology",
  "chemotherapy",
  "radiation",
  "tumor",
  "tumour",
  "surgery",
  "oncologist",
  "immunotherapy",
  "biopsy",
  "scan",
  "ct",
  "mri",
  "pet ct",
  "liver transplant",
  "palliative",
  "radiotherapy",
  "metastasis",
  "diagnosis",
  "treatment",
  "side effects",
  "symptom",
  "hospital",
  "doctor",
  "care",
];

function looksHealthcare(q) {
  const s = (q || "").toLowerCase();
  return HEALTH_KEYWORDS.some((k) => s.includes(k));
}

/** Escape + lightweight formatting (bold + newlines + 1./2. lists) */
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function formatToHtml(text) {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\n)(\d+)\.\s/g, "$1<br/><strong>$2.</strong> ")
    .replace(/\n/g, "<br/>");
}

export default function GetMatched() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("light");
  const [city, setCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(
    SpeechRecognition ? new SpeechRecognition() : null
  );

  /** Axios instance with auth header */
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "" }); // same origin
    instance.interceptors.request.use(async (config) => {
      // If using Firebase, replace below with await user.getIdToken()
      const token = localStorage.getItem("byonco_jwt"); // your app should set this after login
      if (token) config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
      return config;
    });
    return instance;
  }, []);

  async function handleAskClick() {
    setErrorMsg("");
    setResponse("");

    const q = query.trim();
    if (!q) return;

    // Client-side guard (UX). Backend will do the real enforcement.
    if (!looksHealthcare(q)) {
      setResponse(
        "I can only answer healthcare-related questions. Please ask about cancer care, diagnostics, treatments, side effects, hospitals, or doctors."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(API_PATH, { question: q, context: { city, lang: language } });
      if (res?.data?.ok) {
        setResponse(res.data.answer || "No response.");
      } else if (res?.data?.error) {
        setResponse(res.data.error);
      } else {
        setResponse("⚠️ Unexpected server response.");
      }
    } catch (err) {
      console.error("API Error:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong while fetching the response.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleVoiceInput() {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy URL.");
    }
  }

  return (
    <main
      className={`min-h-screen px-4 pb-12 pt-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-[#fdfefe] to-[#e9fdfb]"
      }`}
    >
      <div className="fixed top-2 right-2 z-10">
        <button
          onClick={() => navigate("/pro-waitlist")}
          className="text-xs sm:text-sm md:text-base px-2 sm:px-4 py-1 sm:py-2 border border-[#2563eb] text-[#2563eb] font-medium rounded hover:bg-[#2563eb] hover:text-white transition"
          aria-label="Join ByOnco Pro waitlist"
        >
          ByOnco Pro
        </button>
      </div>

      <div className="flex flex-col items-center px-2 w-full max-w-4xl mx-auto mt-20 sm:mt-28">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl sm:text-4xl font-bold mb-6"
        >
          <span className="text-[#183b4d]">ByOnco</span>
          <span className="text-[#2ca3a2]">care</span>
        </motion.h1>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg px-4 py-6 sm:px-6 mb-8"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-full px-4 py-3 shadow-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskClick()}
                placeholder="Where Google ends, ByOnco begins… Search smarter."
                className="w-full outline-none text-gray-800 text-sm sm:text-base placeholder:text-gray-500 bg-transparent"
              />
              <FiSearch
                className="text-gray-500 w-5 h-5 ml-2 hover:text-teal-600 cursor-pointer"
                onClick={handleAskClick}
              />
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 text-sm">
              <div className="flex gap-4 text-gray-600 items-center">
                <FiMapPin onClick={() => setModal("location")} className="hover:text-teal-600 cursor-pointer" />
                <FiSettings onClick={() => setModal("settings")} className="hover:text-teal-600 cursor-pointer" />
                <FiGlobe
                  onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
                  className="hover:text-teal-600 cursor-pointer"
                  title={`Current: ${language.toUpperCase()}`}
                />
                <FiLink onClick={copyToClipboard} className="hover:text-teal-600 cursor-pointer" />
                <FiMic
                  onClick={handleVoiceInput}
                  className={`cursor-pointer ${isListening ? "text-red-600 animate-pulse" : "hover:text-teal-600"}`}
                />
                {copied && <FiCheck className="text-green-600" title="Copied!" />}
              </div>
              <button
                onClick={handleAskClick}
                disabled={loading}
                className="bg-[#2ca3a2] hover:bg-[#239191] text-white rounded-full p-3 shadow transition"
              >
                {loading ? (
                  <span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" />
                ) : (
                  <FiActivity className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {errorMsg && (
          <div className="w-full bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-4">
            {errorMsg}
          </div>
        )}

        {/* Response */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md text-gray-800 flex items-center justify-start space-x-3"
          >
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce [animation-delay:.1s]" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce [animation-delay:.2s]" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-bounce [animation-delay:.3s]" />
            <span className="text-gray-500 ml-4">Processing your request…</span>
          </motion.div>
        ) : response ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md text-gray-800 overflow-auto max-h-[70vh]"
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-[#1f575e]">
                ByOnco AI Recommendation:
              </h2>
              <div
                className="prose max-w-none text-gray-800"
                // We escape + format ourselves to avoid XSS
                dangerouslySetInnerHTML={{ __html: formatToHtml(response) }}
              />
            </div>
          </motion.div>
        ) : null}

        {/* Modals */}
        <AnimatePresence>
          {modal === "location" && (
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
          {modal === "settings" && (
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
                <label className="block mb-3">
                  Language: <span className="font-medium">{language.toUpperCase()}</span>
                </label>
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
