// src/pages/GetMatched.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSearch, FiActivity } from "react-icons/fi";

/** ---- CONFIG ---- */
const API_PATH = "/api/ask"; // backend reverse-proxied

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  /** Axios instance with auth header */
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "" }); // same origin
    instance.interceptors.request.use(async (config) => {
      const token = localStorage.getItem("byonco_jwt");
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

    if (!looksHealthcare(q)) {
      setResponse(
        "I can only answer healthcare-related questions. Please ask about cancer care, diagnostics, treatments, side effects, hospitals, or doctors."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(API_PATH, { question: q });
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

  return (
    <main className="min-h-screen px-4 pb-12 pt-8 bg-gradient-to-br from-[#fdfefe] to-[#e9fdfb]">
      {/* Pro Waitlist Button */}
      <div className="fixed top-2 right-2 z-10">
        <button
          onClick={() => navigate("/pro-waitlist")}
          className="text-xs sm:text-sm md:text-base px-2 sm:px-4 py-1 sm:py-2 border border-[#2563eb] text-[#2563eb] font-medium rounded hover:bg-[#2563eb] hover:text-white transition"
        >
          ByOnco Pro
        </button>
      </div>

      <div className="flex flex-col items-center px-2 w-full max-w-4xl mx-auto mt-20 sm:mt-28">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl sm:text-4xl font-bold mb-6"
        >
          <span className="text-[#183b4d]">ByOnco</span>
          <span className="text-[#2ca3a2]">care</span>
        </motion.h1>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg px-4 py-6 sm:px-6 mb-8"
        >
          <div className="flex flex-col gap-4">
            {/* Input */}
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

            {/* Ask Button Only */}
            <div className="flex justify-end">
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
                dangerouslySetInnerHTML={{ __html: formatToHtml(response) }}
              />
            </div>
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
