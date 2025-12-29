import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, Search, Library, Compass, LogIn, Menu, 
  Paperclip, Mic, ArrowRight, Crosshair, AlertCircle,
  X, FileText, Loader2, Sparkles, Lock, Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

// Usage limits
const FREE_TEXT_PROMPTS = 2;
const FREE_FILE_PROMPTS = 1;

// Storage keys
const STORAGE_TEXT_COUNT = 'byonco_ai_text_prompts';
const STORAGE_FILE_COUNT = 'byonco_ai_file_prompts';
const STORAGE_SUBSCRIPTION = 'byonco_subscription_status';

export default function SecondOpinionAIPage() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Get usage counts
  const getTextCount = () => parseInt(localStorage.getItem(STORAGE_TEXT_COUNT) || '0', 10);
  const getFileCount = () => parseInt(localStorage.getItem(STORAGE_FILE_COUNT) || '0', 10);
  const isSubscribed = () => localStorage.getItem(STORAGE_SUBSCRIPTION) === 'true';
  
  const [textPromptCount, setTextPromptCount] = useState(getTextCount());
  const [filePromptCount, setFilePromptCount] = useState(getFileCount());
  const [hasSubscription, setHasSubscription] = useState(isSubscribed());

  // Check if user can send message
  const canSendText = hasSubscription || textPromptCount < FREE_TEXT_PROMPTS;
  const canSendFile = hasSubscription || filePromptCount < FREE_FILE_PROMPTS;
  const hasFiles = uploadedFiles.length > 0;
  const canSend = canSendText && (!hasFiles || canSendFile);

  useEffect(() => {
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
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
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const extractTextFromFile = async (file) => {
    // For now, return a placeholder. In production, you'd use OCR or PDF parsing
    // For PDFs, you might use pdf-parse or similar library
    // For images, you'd use OCR (Tesseract.js or cloud OCR service)
    return `[Medical Report: ${file.name} - Content extraction would be implemented here. For production, integrate OCR/PDF parsing services.]`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && uploadedFiles.length === 0) return;
    if (!canSend) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    
    try {
      let fileContent = null;
      if (uploadedFiles.length > 0) {
        // Extract text from files (simplified - in production, use proper OCR/PDF parsing)
        const fileTexts = await Promise.all(
          uploadedFiles.map(file => extractTextFromFile(file))
        );
        fileContent = fileTexts.join('\n\n');
      }

      // Add user message to chat
      const userMessage = {
        role: 'user',
        content: message || (hasFiles ? 'Please analyze the attached medical reports.' : ''),
        files: uploadedFiles.map(f => f.name)
      };
      setChatHistory(prev => [...prev, userMessage]);

      // Call AI endpoint
      const response = await axios.post(
        `${API}/second-opinion-ai/chat`,
        {
          message: message || 'Please analyze the attached medical reports and provide insights.',
          file_content: fileContent
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setChatHistory(prev => [...prev, aiMessage]);

      // Update usage counts
      if (!hasSubscription) {
        if (hasFiles) {
          const newFileCount = filePromptCount + 1;
          localStorage.setItem(STORAGE_FILE_COUNT, newFileCount.toString());
          setFilePromptCount(newFileCount);
          if (newFileCount >= FREE_FILE_PROMPTS) {
            setShowUpgrade(true);
          }
        } else {
          const newTextCount = textPromptCount + 1;
          localStorage.setItem(STORAGE_TEXT_COUNT, newTextCount.toString());
          setTextPromptCount(newTextCount);
          if (newTextCount >= FREE_TEXT_PROMPTS) {
            setShowUpgrade(true);
          }
        }
      }

      // Clear input
      setMessage('');
      setUploadedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.',
        error: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to subscription/payment page
    // For now, just show a message - you can integrate with your payment system
    alert('Redirecting to subscription page...');
    // navigate('/subscription');
  };

  const handleGoToPremium = () => {
    navigate('/second-opinion');
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col justify-between items-center w-20 py-6 border-r border-white/5 bg-black/20 backdrop-blur-xl z-20">
        <div className="flex flex-col items-center gap-8">
          <div className="size-10 rounded-xl bg-gradient-to-br from-teal-900 to-black border border-white/10 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(20,184,166,0.3)]">
            <Activity className="text-teal-400 size-6" />
          </div>
          <nav className="flex flex-col gap-6">
            <button className="p-3 rounded-lg text-teal-400 bg-teal-400/10 transition-all duration-300 group relative">
              <Search className="size-6" />
              <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap text-zinc-300">New Thread</span>
            </button>
            <button className="p-3 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors group relative">
              <Library className="size-6" />
              <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 text-zinc-300">Library</span>
            </button>
          </nav>
        </div>
        <div className="flex flex-col items-center gap-6">
          <button className="p-3 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors">
            <LogIn className="size-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_0%,rgba(0,0,0,0)_60%)] blur-3xl opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-900/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 z-10 md:hidden">
          <div className="flex items-center gap-2">
            <Activity className="text-teal-400 size-6" />
            <span className="font-serif font-medium text-xl text-zinc-100 tracking-tight">byOnco</span>
          </div>
          <button className="text-zinc-400"><Menu className="size-6" /></button>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 w-full max-w-4xl mx-auto overflow-y-auto">
          
          {/* Hero Title */}
          <div className="text-center mb-10 space-y-4">
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 pb-2">
              byOnco Second Opinion
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
              Advanced oncology guidance, treatment analysis, and hospital recommendations.
            </p>
          </div>

          {/* Usage Limits Banner */}
          {!hasSubscription && (
            <div className="mb-6 w-full max-w-3xl">
              <Card className="bg-zinc-900/50 border-zinc-800 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    Free prompts: {textPromptCount}/{FREE_TEXT_PROMPTS} text, {filePromptCount}/{FREE_FILE_PROMPTS} file
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpgrade}
                    className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10"
                  >
                    Upgrade
                  </Button>
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

          {/* Upgrade Modal */}
          {showUpgrade && !hasSubscription && (
            <Card className="mb-6 w-full max-w-3xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/40 p-6">
              <div className="text-center space-y-4">
                <Sparkles className="h-12 w-12 text-purple-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Upgrade to Premium</h3>
                <p className="text-zinc-300">
                  You've used your free prompts. Subscribe to get unlimited access to AI assistance and premium second opinions from board-certified oncologists.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleGoToPremium}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    Get Premium Second Opinion
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgrade(false)}
                    className="border-zinc-600"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Input Container */}
          <div className="w-full relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-teal-500/20 rounded-2xl opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <div className="relative bg-[#0F0F10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <form onSubmit={handleSubmit}>
                {/* Text Area */}
                <div className="p-4 sm:p-5">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your diagnosis, upload reports, or ask about nutrition..."
                    className="w-full bg-transparent text-lg text-zinc-200 placeholder:text-zinc-600 resize-none outline-none min-h-[60px] max-h-[200px] align-top leading-relaxed font-light"
                    rows={2}
                    disabled={loading || !canSend}
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="px-4 pb-2 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-zinc-800/40 rounded-lg p-2"
                      >
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

                {/* Input Footer */}
                <div className="px-4 pb-4 flex items-center justify-between">
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
                      disabled={!canSendFile || loading}
                      className="group/attach flex items-center justify-center size-9 rounded-full hover:bg-white/10 transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={!canSendFile || loading}
                      />
                      <Paperclip className="size-5 text-zinc-500 group-hover/attach:text-zinc-300 transition-colors" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Mic className="size-5" />
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading || !canSend || (!message.trim() && uploadedFiles.length === 0)}
                      className="relative inline-flex h-9 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-[-1000%] animate-[shimmer_3s_linear_infinite] bg-[linear-gradient(110deg,#0d9488,45%,#5eead4,55%,#0d9488)]"></span>
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-4 py-1 text-sm font-medium text-teal-100 backdrop-blur-3xl hover:bg-zinc-900 transition-colors gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
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

          {/* Suggestions */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-3xl">
            {[
              { icon: <FileText className="size-4 text-teal-500/70" />, text: "Interpretation of biopsy reports" },
              { icon: <Sparkles className="size-4 text-orange-400/70" />, text: "Diet plan during chemotherapy" },
              { icon: <Activity className="size-4 text-blue-400/70" />, text: "Top oncology centers near me" }
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(suggestion.text)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-teal-500/30 transition-all duration-300 text-zinc-400 hover:text-zinc-200 text-sm font-light"
              >
                {suggestion.icon}
                {suggestion.text}
              </button>
            ))}
          </div>
          
          {/* Warning */}
          <div className="mt-12 text-center">
            <p className="text-xs text-zinc-600 flex items-center justify-center gap-2 border border-red-900/20 bg-red-950/10 px-4 py-2 rounded-full">
              <AlertCircle className="size-3 text-red-400" />
              AI is not trained to answer non-medical queries. Always consult your physical doctor.
            </p>
          </div>

          {/* Premium CTA */}
          {!hasSubscription && (
            <div className="mt-8 w-full max-w-3xl">
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/40 p-6">
                <div className="text-center space-y-4">
                  <Lock className="h-8 w-8 text-purple-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Get Expert Second Opinion</h3>
                  <p className="text-zinc-300 text-sm">
                    For a comprehensive second opinion from board-certified oncologists with 15+ years of experience, use our premium service.
                  </p>
                  <Button
                    onClick={handleGoToPremium}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    Get Premium Second Opinion
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

