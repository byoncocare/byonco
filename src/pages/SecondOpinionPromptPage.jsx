import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Search, Library, Compass, LogIn, Menu, Paperclip, Mic, ArrowRight, Crosshair, AlertCircle, FileText, Building2, Utensils, X, Twitter, Linkedin } from 'lucide-react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SecondOpinionPaywallModal from '@/components/SecondOpinionPaywallModal';
import {
  getUsage,
  canAskQuestion,
  canAttach,
  recordQuestionUsed,
  recordAttachmentUsed,
  resetIfNewDay,
  hasEntitlement
} from '@/utils/secondOpinionAccess';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

export default function SecondOpinionPromptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState('limit');
  const [usage, setUsage] = useState(getUsage());

  // Check if paywall should auto-open from route state
  useEffect(() => {
    if (location.state?.openPaywall) {
      setPaywallReason(location.state.reason || 'route-guard');
      setShowPaywall(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Reset usage if new day and update state
  useEffect(() => {
    resetIfNewDay();
    setUsage(getUsage());
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to only 1 file
    if (files.length > 1) {
      alert('You can only upload 1 file at a time. Please select a single file.');
      return;
    }
    
    // Check if user already has a file and is trying to add another
    if (uploadedFiles.length >= 1) {
      alert('You can only attach 1 file. Please remove the current file before uploading a new one.');
      return;
    }

    // Check if user can attach
    if (!canAttach() && !hasEntitlement()) {
      setPaywallReason('limit');
      setShowPaywall(true);
      return;
    }

    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or image files.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles([validFiles[0]]); // Only allow 1 file
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && uploadedFiles.length === 0) return;

    // Check limits before proceeding
    const hasAttachment = uploadedFiles.length > 0;
    
    if (!hasEntitlement()) {
      // Check question limit
      if (!canAskQuestion()) {
        setPaywallReason('limit');
        setShowPaywall(true);
        return;
      }
      
      // Check attachment limit
      if (hasAttachment && !canAttach()) {
        setPaywallReason('limit');
        setShowPaywall(true);
        return;
      }
    }

    setLoading(true);
    
    try {
      let fileContent = null;
      
      // Upload file first if present and extract text
      if (uploadedFiles.length > 0) {
        try {
          const formData = new FormData();
          formData.append('files', uploadedFiles[0]);
          
          const uploadResponse = await axios.post(
            `${API}/second-opinion-ai/upload-files`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 60000 // 60 second timeout
            }
          );
          
          fileContent = uploadResponse.data.extracted_text;
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Show user-friendly error and return early
          const uploadErrorMessage = {
            role: 'assistant',
            content: "We're having trouble processing your file right now. Please try again in a moment, or contact support if the issue persists.",
            error: true
          };
          setChatHistory(prev => [...prev, uploadErrorMessage]);
          setLoading(false);
          return;
        }
      }

      // Add user message to chat
      const userMessage = {
        role: 'user',
        content: message || (uploadedFiles.length > 0 ? 'Please analyze the attached medical reports.' : ''),
        files: uploadedFiles.map(f => f.name)
      };
      setChatHistory(prev => [...prev, userMessage]);

      // Call AI endpoint with timeout
      const response = await axios.post(
        `${API}/second-opinion-ai/chat`,
        {
          message: message || 'Please analyze the attached medical reports and provide insights.',
          file_content: fileContent
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setChatHistory(prev => [...prev, aiMessage]);

      // Record usage (only if not entitled)
      if (!hasEntitlement()) {
        recordQuestionUsed();
        if (uploadedFiles.length > 0) {
          recordAttachmentUsed();
        }
        // Update usage state
        setUsage(getUsage());
      }

      // Clear input
      setMessage('');
      setUploadedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Determine user-friendly error message based on error type
      let userFriendlyMessage = "We're having trouble connecting right now. Please try again in a moment.";
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('fetch')) {
        userFriendlyMessage = "We cannot reach our servers at the moment. Please check your internet connection and try again.";
      } else if (error.response?.status === 500) {
        userFriendlyMessage = "Our service is temporarily unavailable. Please try again in a few moments.";
      } else if (error.response?.status === 503 || error.response?.status === 504) {
        userFriendlyMessage = "Our servers are currently processing requests. Please try again shortly.";
      } else if (error.response?.status === 400 || error.response?.status === 422) {
        userFriendlyMessage = "We're currently only accessible in India. We're working on expanding our services to more regions soon.";
      } else if (error.response?.status === 404) {
        userFriendlyMessage = "This feature is currently being updated. We're adding improvements to serve you better. Please try again later.";
      }
      
      const errorMessage = {
        role: 'assistant',
        content: userFriendlyMessage,
        error: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetConsultNow = () => {
    // Check if user has entitlement
    if (hasEntitlement()) {
      navigate('/second-opinion/form');
    } else {
      // Show paywall modal
      setPaywallReason('cta');
      setShowPaywall(true);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Get current usage for display
  const currentUsage = getUsage();
  const canAsk = canAskQuestion() || hasEntitlement();
  const canAttachFile = canAttach() || hasEntitlement();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        .beam-bg {
          background: radial-gradient(circle at center, rgba(45, 212, 191, 0.08) 0%, rgba(0,0,0,0) 60%);
        }
        
        textarea::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        ::selection {
          background: rgba(45, 212, 191, 0.2);
          color: #ccfbf1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Paywall Modal */}
      <SecondOpinionPaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason={paywallReason}
      />

      {/* Sidebar (Collapsed style akin to Perplexity) */}
      <aside className="hidden md:flex flex-col justify-between items-center w-20 py-6 border-r border-white/5 bg-black/20 backdrop-blur-xl z-20">
        <div className="flex flex-col items-center gap-8">
          {/* Brand Logo Mark */}
          <div className="size-10 rounded-xl bg-gradient-to-br from-teal-900 to-black border border-white/10 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(20,184,166,0.3)]">
            <Activity className="text-teal-400 size-6" />
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-6">
            <button 
              onClick={() => navigate('/')}
              className="p-3 rounded-lg text-teal-400 bg-teal-400/10 transition-all duration-300 group relative"
            >
              <Search className="size-6" />
              <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap text-zinc-300">New Thread</span>
            </button>
            <button 
              onClick={() => navigate('/teleconsultation')}
              className="p-3 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors group relative"
            >
              <Library className="size-6" />
              <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 text-zinc-300">Library</span>
            </button>
            <button 
              onClick={() => navigate('/journey-builder')}
              className="p-3 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors group relative"
            >
              <Compass className="size-6" />
              <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 text-zinc-300">Discover</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button className="p-3 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors">
            <LogIn className="size-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        
        {/* Background Ambient Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Center Beam */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] beam-bg blur-3xl opacity-40"></div>
          {/* Bottom Right Subtle Glow */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-900/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Top Navigation (Mobile/Desktop) */}
        <header className="flex items-center justify-between px-6 py-4 z-10 md:hidden">
          <div className="flex items-center gap-2">
            <Activity className="text-teal-400 size-6" />
            <span className="font-serif font-medium text-xl text-zinc-100 tracking-tight" style={{ fontFamily: "'Newsreader', serif" }}>byOnco</span>
          </div>
          <button className="text-zinc-400"><Menu className="size-6" /></button>
        </header>

        {/* Central Content Wrapper */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full max-w-4xl mx-auto overflow-y-auto">
          
          {/* Hero Title */}
          <div className="text-center mb-10 space-y-4" style={{ animation: 'fadeIn 0.8s ease-out' }}>
            <h1 className="text-5xl md:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 pb-2" style={{ fontFamily: "'Newsreader', serif" }}>
              byOnco Second Opinion
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
              Advanced oncology guidance, treatment analysis, and hospital recommendations.
            </p>
          </div>

          {/* Usage Limits Banner */}
          {!hasEntitlement() && (
            <div className="mb-6 w-full max-w-3xl">
              <Card className="bg-zinc-900/50 border-zinc-800 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    Free prompts today: {currentUsage.questionsUsed}/2 text, {currentUsage.attachmentUsed}/1 attachment
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="w-full max-w-3xl mb-6 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-teal-500/20 text-teal-100'
                        : msg.error
                        ? 'bg-red-900/20 text-red-200'
                        : 'bg-zinc-800/60 text-zinc-200'
                    }`}
                  >
                    {msg.files && msg.files.length > 0 && (
                      <div className="mb-2 text-xs text-zinc-400">
                        📎 {msg.files.join(', ')}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Container (The "Perplexity" Box) */}
          <div className="w-full relative group">
            {/* Outer Glow/Border Beam */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-teal-500/20 rounded-2xl opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <div className="relative bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <form onSubmit={handleAnalyze}>
                {/* Text Area */}
                <div className="p-4 sm:p-5">
                  <textarea 
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your diagnosis, upload reports, or ask about nutrition..." 
                    className="w-full bg-transparent text-lg text-zinc-200 placeholder:text-zinc-600 resize-none outline-none min-h-[60px] max-h-[200px] align-top leading-relaxed font-light" 
                    rows="2"
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="px-4 pb-2 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-zinc-800/40 rounded-lg p-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm text-zinc-300 truncate">{file.name}</span>
                          <span className="text-xs text-zinc-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Footer / Actions */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  {/* Left Actions: Focus & Attach */}
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-teal-300 transition-all border border-white/5 text-sm font-light"
                    >
                      <Crosshair className="size-4" />
                      <span>Focus: Oncology</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadedFiles.length >= 1 || !canAttachFile || loading}
                      className="group/attach flex items-center justify-center size-9 rounded-full hover:bg-white/10 transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed"
                      title={uploadedFiles.length >= 1 ? "Only 1 file can be attached" : "Attach file (1 file limit)"}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadedFiles.length >= 1 || !canAttachFile || loading}
                      />
                      <Paperclip className="size-5 text-zinc-500 group-hover/attach:text-zinc-300 transition-colors" />
                    </button>
                  </div>

                  {/* Right Actions: Voice & Submit */}
                  <div className="flex items-center gap-3">
                    <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <Mic className="size-5" />
                    </button>
                    
                    {/* The Shimmer Button */}
                    <button 
                      type="submit"
                      disabled={loading || !canAsk || (!message.trim() && uploadedFiles.length === 0)}
                      className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-[-1000%] animate-shimmer bg-[linear-gradient(110deg,#0d9488,45%,#5eead4,55%,#0d9488)]"></span>
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-4 py-1 text-sm font-medium text-teal-100 backdrop-blur-3xl hover:bg-zinc-900 transition-colors gap-2">
                        {loading ? (
                          <>
                            <div className="size-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Analyze <ArrowRight className="size-4" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Get Consult Now Button (CTA) */}
          <div className="mt-6 w-full flex justify-center">
            <button
              onClick={handleGetConsultNow}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              <span className="absolute inset-[-1000%] animate-shimmer bg-[linear-gradient(110deg,#9333ea,45%,#a855f7,55%,#9333ea)]"></span>
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-purple-950 px-8 py-2 text-base font-medium text-purple-100 backdrop-blur-3xl hover:bg-purple-900 transition-colors gap-2">
                Consult a doctor now for second opinion <ArrowRight className="size-5" />
              </span>
            </button>
          </div>

          {/* Contextual Suggestions */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-3xl">
            <button 
              type="button"
              onClick={() => setMessage("Interpretation of biopsy reports")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal-500/30 transition-all duration-300 text-zinc-400 hover:text-zinc-200 text-sm font-light"
            >
              <FileText className="size-4 text-teal-500/70" />
              Interpretation of biopsy reports
            </button>
            <button 
              type="button"
              onClick={() => setMessage("Diet plan during chemotherapy")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal-500/30 transition-all duration-300 text-zinc-400 hover:text-zinc-200 text-sm font-light"
            >
              <Utensils className="size-4 text-orange-400/70" />
              Diet plan during chemotherapy
            </button>
            <button 
              type="button"
              onClick={() => setMessage("Top oncology centers near me")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal-500/30 transition-all duration-300 text-zinc-400 hover:text-zinc-200 text-sm font-light"
            >
              <Building2 className="size-4 text-blue-400/70" />
              Top oncology centers near me
            </button>
          </div>
          
          {/* Warning/Disclaimer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-zinc-600 flex items-center justify-center gap-2 border border-red-900/20 bg-red-950/10 px-4 py-2 rounded-full">
              <AlertCircle className="size-3 text-red-400" />
              This is not medical advice. Consult a doctor.
            </p>
          </div>

        </div>

        {/* Footer Strip */}
        <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-sm py-3 px-6 flex justify-between items-center text-xs text-zinc-600 hidden sm:flex">
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400 transition-colors">Pro</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Enterprise</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Download</a>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 byOnco Labs</span>
            <div className="flex gap-3">
              <Twitter className="size-3 hover:text-zinc-400 cursor-pointer" />
              <Linkedin className="size-3 hover:text-zinc-400 cursor-pointer" />
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
