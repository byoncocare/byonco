import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientProfile, buildDefaultJourneyPrompt, isPatientProfileComplete, getInitials, getDisplayName } from '@/utils/patientProfile';
import { useAuth } from '@/contexts/AuthContext';

// Default example data (matching the static HTML)
const defaultProfile = {
  cancerType: "Lung Cancer",
  stage: "Stage III",
  originDest: "BLR → DEL / BOM",
  estBudget: "₹15L – ₹20L INR",
};

const defaultPlans = [
  {
    planType: "Value",
    city: "Mumbai",
    region: "Maharashtra",
    priceRange: "₹12L – ₹15L",
    duration: "~6 weeks duration",
    hospitalName: "Tata Memorial Centre",
    hospitalNote: "Govt-aided, high volume, premier oncology research institute.",
    bullets: [
      "Chemo-Radiation protocol (General Ward)",
      "Round-trip Train (AC 2 Tier) for 3",
      "Guest House / Budget Lodge (40 nights)",
    ],
    fitNote: "Best for maximizing medical quality on a strict budget. Wait times may be higher.",
    icon: "lucide:train-front",
  },
  {
    planType: "Balanced",
    city: "New Delhi",
    region: "Delhi NCR",
    priceRange: "₹16L – ₹19L",
    duration: "~5 weeks duration",
    hospitalName: "Max Super Speciality",
    hospitalNote: "NABH accredited, specialized Thoracic Oncology team.",
    bullets: [
      "Surgery + Chemo (Twin Sharing Room)",
      "Domestic Flights (Economy) for 2",
      "3-Star Hotel / Serviced Apt (30 nights)",
      "ByOnco Care Coordinator included",
    ],
    fitNote: "Good balance of comfort, speed, and cost. Within your upper budget limit.",
    icon: "lucide:plane",
  },
  {
    planType: "Comfort",
    city: "Gurugram",
    region: "NCR",
    priceRange: "₹22L – ₹25L",
    duration: "~5 weeks duration",
    hospitalName: "Medanta - The Medicity",
    hospitalNote: "JCI accredited, advanced robotic surgery options.",
    bullets: [
      "Robotic Surgery + Targeted Therapy (Private)",
      "Flexi Flights + Airport Transfer",
      "4-Star Hotel near hospital (30 nights)",
      "24/7 Dedicated Concierge",
    ],
    fitNote: "Maximum comfort and reduced logistics burden, but exceeds stated budget.",
    overBudget: true,
    icon: "lucide:armchair",
  },
];

const defaultSuggestions = {
  items: [
    {
      title: "Reduce Costs",
      text: "Opt for train travel to Delhi instead of flights to save approx ₹15,000.",
    },
    {
      title: "Accommodation",
      text: "Staying with relatives in Delhi/Mumbai can reduce the package cost by ₹60,000–₹1L.",
    },
  ],
};

const defaultUserMessage = "My father has been diagnosed with Stage 3 Lung Cancer. We currently live in Bangalore. I am looking for treatment options in Mumbai or Delhi as we have relatives there. Our budget is roughly 15-20 Lakhs INR. We need help with travel and stay arrangements as well.";

const defaultAIMessage = "I'm sorry to hear about your father's diagnosis. Based on your request, I have structured a journey plan focusing on **Stage III Lung Cancer** treatment in **Mumbai or Delhi**, keeping within the **₹15–20 Lakhs** budget range.";

// Plan Card Subcomponent
function PlanCard({ plan, navigate }) {
  const isBalanced = plan.planType === "Balanced";
  const planColors = {
    Value: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200/50" },
    Balanced: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200/50" },
    Comfort: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200/50" },
  };
  const colors = planColors[plan.planType] || planColors.Value;
  const iconColor = isBalanced ? "text-indigo-300" : "text-slate-300";
  const bulletIconColor = isBalanced ? "text-indigo-400" : "text-slate-400";
  const priceColor = isBalanced ? "text-indigo-600" : "text-slate-900";

  return (
    <div className={`group bg-white rounded-xl border ${isBalanced ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200'} p-0 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col relative`}>
      {isBalanced && (
        <div className="absolute top-0 right-0 size-16 bg-gradient-to-bl from-indigo-50 to-transparent -z-10 rounded-bl-3xl"></div>
      )}
      <div className={`p-5 border-b border-slate-100 ${isBalanced ? 'bg-white' : 'bg-slate-50/50'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
            {plan.planType} Plan
          </span>
          <span className={`iconify ${iconColor}`} data-icon={plan.icon || "lucide:circle"} data-width="18"></span>
        </div>
        <h4 className="font-semibold text-slate-900">{plan.city}, {plan.region}</h4>
        <div className="mt-2 flex items-baseline gap-1">
          <span className={`text-lg font-bold ${priceColor}`}>{plan.priceRange}</span>
          <span className="text-xs text-slate-500">total est.</span>
          {plan.overBudget && (
            <span className="text-xs text-red-500 font-medium ml-1">Over budget</span>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-1">{plan.duration}</div>
      </div>
      
      <div className="p-5 space-y-4 flex-1">
        <div>
          <div className="text-xs font-medium text-slate-400 uppercase mb-1">Hospital</div>
          <div className="text-sm font-medium text-slate-900">{plan.hospitalName}</div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{plan.hospitalNote}</p>
        </div>

        <div className="space-y-2">
          {plan.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
              <span className={`iconify ${bulletIconColor} mt-0.5 shrink-0`} data-icon="lucide:stethoscope" data-width="14"></span>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 italic">
            <span className="font-semibold text-slate-500">Fit:</span> {plan.fitNote}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <button 
          onClick={() => navigate(`/journey-builder/plan/${plan.planType.toLowerCase()}`, { state: { plan } })}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 text-xs font-medium rounded-lg transition-colors"
        >
          Select Plan
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function JourneyBuilderPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // Get auth user for fallback
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [patientProfile, setPatientProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // Get display name and initials for sidebar
  const displayName = getDisplayName(patientProfile, authUser);
  const initials = getInitials(displayName);

  // Load patient profile on mount
  useEffect(() => {
    const savedProfile = getPatientProfile();
    setPatientProfile(savedProfile);
    
    if (savedProfile && isPatientProfileComplete(savedProfile)) {
      setProfileComplete(true);
      const defaultPrompt = buildDefaultJourneyPrompt(savedProfile);
      if (defaultPrompt) {
        setInputText(defaultPrompt);
        setUserMessage(defaultPrompt);
        // Auto-submit on mount
        handleAutoSubmit(defaultPrompt);
      } else {
        // Show default example data if prompt can't be built
        setProfile(defaultProfile);
        setPlans(defaultPlans);
        setSuggestions(defaultSuggestions);
        setUserMessage(defaultUserMessage);
        setAiMessage(defaultAIMessage);
      }
    } else {
      setProfileComplete(false);
      // Show default example data
      setProfile(defaultProfile);
      setPlans(defaultPlans);
      setSuggestions(defaultSuggestions);
      setUserMessage(defaultUserMessage);
      setAiMessage(defaultAIMessage);
    }
  }, []);

  const handleAutoSubmit = async (promptText) => {
    if (!promptText || loading) return;

    setLoading(true);
    setError(null);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
      const apiUrl = `${BACKEND_URL}/api/journey-builder`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      
      setProfile(data.profile);
      setPlans(data.plans);
      setSuggestions(data.suggestions || null);
      setAiMessage(data.disclaimer || "I've generated a personalized journey plan for you.");
    } catch (err) {
      // Determine user-friendly error message
      let userFriendlyMessage = "We're having trouble connecting right now. Please try again in a moment.";
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage = "We cannot reach our servers at the moment. Please check your internet connection and try again.";
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        userFriendlyMessage = "Our service is temporarily unavailable. Please try again in a few moments.";
      } else if (errorMessage.includes('503') || errorMessage.includes('504') || errorMessage.includes('timeout')) {
        userFriendlyMessage = "Our servers are currently processing requests. Please try again shortly.";
      } else if (errorMessage.includes('400') || errorMessage.includes('422')) {
        userFriendlyMessage = "We're currently only accessible in India. We're working on expanding our services to more regions soon.";
      } else if (errorMessage.includes('404')) {
        userFriendlyMessage = "This feature is currently being updated. We're adding improvements to serve you better. Please try again later.";
      }
      
      setError(userFriendlyMessage);
      console.error("Journey builder error:", err);
      // Fallback to default data on error
      setProfile(defaultProfile);
      setPlans(defaultPlans);
      setSuggestions(defaultSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
      const apiUrl = `${BACKEND_URL}/api/journey-builder`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      
      setProfile(data.profile);
      setPlans(data.plans);
      setSuggestions(data.suggestions || null);
      setUserMessage(inputText);
      setAiMessage(data.disclaimer || "I've updated your journey plan based on your request.");
      setInputText("");
    } catch (err) {
      // Determine user-friendly error message
      let userFriendlyMessage = "We're having trouble connecting right now. Please try again in a moment.";
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage = "We cannot reach our servers at the moment. Please check your internet connection and try again.";
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        userFriendlyMessage = "Our service is temporarily unavailable. Please try again in a few moments.";
      } else if (errorMessage.includes('503') || errorMessage.includes('504') || errorMessage.includes('timeout')) {
        userFriendlyMessage = "Our servers are currently processing requests. Please try again shortly.";
      } else if (errorMessage.includes('400') || errorMessage.includes('422')) {
        userFriendlyMessage = "We're currently only accessible in India. We're working on expanding our services to more regions soon.";
      } else if (errorMessage.includes('404')) {
        userFriendlyMessage = "This feature is currently being updated. We're adding improvements to serve you better. Please try again later.";
      }
      
      setError(userFriendlyMessage);
      console.error("Journey builder error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 h-screen flex overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-full flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="logo-text">
              <span className="logo-by">by</span>
              <span className="logo-onco"><span className="logo-o">O</span>nco</span>
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Platform</div>
          
          <button onClick={() => navigate('/find-hospitals')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors w-full text-left">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:building-2" data-width="18" data-stroke-width="1.5"></span>
            Find Hospitals
          </button>
          <button onClick={() => navigate('/cost-calculator')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors w-full text-left">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:calculator" data-width="18" data-stroke-width="1.5"></span>
            Cost Calculator
          </button>
          <button onClick={() => navigate('/rare-cancers')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors w-full text-left">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:microscope" data-width="18" data-stroke-width="1.5"></span>
            Rare Cancers
          </button>

          <div className="mt-6 px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Planning</div>
          
          <button className="flex items-center gap-3 px-3 py-2 text-sm bg-slate-100 text-slate-900 font-medium rounded-md shadow-sm ring-1 ring-slate-900/5 w-full text-left">
            <span className="iconify text-indigo-600" data-icon="lucide:map" data-width="18" data-stroke-width="1.5"></span>
            Journey Builder
            <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">AI</span>
          </button>
          <button onClick={() => navigate('/teleconsultation')} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors w-full text-left">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:video" data-width="18" data-stroke-width="1.5"></span>
            Teleconsultation
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-900">{displayName}</span>
              <span className="text-[10px] text-slate-500">
                Patient Account{patientProfile?.relationToPatient && patientProfile.relationToPatient !== "Self" ? ` • ${patientProfile.relationToPatient}` : ''}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative bg-white lg:bg-slate-50/50">
        {/* Header (Mobile only) */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="logo-text">
              <span className="logo-by">by</span>
              <span className="logo-onco"><span className="logo-o">O</span>nco</span>
            </span>
          </div>
          <button className="text-slate-500">
            <span className="iconify" data-icon="lucide:menu" data-width="24"></span>
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 scroll-smooth">
          {/* Profile Incomplete Message - Only show if no data at all */}
          {!profileComplete && !userMessage && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="max-w-md text-center space-y-4">
                <p className="text-slate-600">Please complete the Get Started form to generate a personalized journey plan.</p>
                <button
                  onClick={() => navigate('/get-started')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Go to Get Started
                </button>
              </div>
            </div>
          )}

          {/* User Message */}
          {userMessage && (
            <div className="flex justify-end">
              <div className="max-w-2xl bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm px-6 py-4 shadow-sm ring-1 ring-slate-900/5">
                <p className="text-sm leading-relaxed">{userMessage}</p>
              </div>
            </div>
          )}

          {/* AI Response */}
          <div className="flex gap-4 max-w-5xl">
            <div className="size-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
              <span className="iconify" data-icon="lucide:sparkles" data-width="16"></span>
            </div>
            
            <div className="flex-1 space-y-6">
              {/* Summary & Extraction */}
              <div className="space-y-4">
                {aiMessage && (
                  <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: aiMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                )}

                {/* Profile Card */}
                {profile && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="iconify" data-icon="lucide:user-check" data-width="14"></span>
                        Extracted Journey Profile
                      </h3>
                      {/* Tools Section */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowCurrencyModal(true)}
                          className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
                        >
                          Currency Converter
                        </button>
                        <button 
                          disabled
                          className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-full opacity-60 cursor-not-allowed"
                          title="We'll soon help you check what your insurance really covers."
                        >
                          Insurance Analyzer <span className="text-[10px]">(Coming Soon)</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-4 sm:gap-x-6 md:gap-x-8">
                      {profile.cancerType && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Cancer Type</span>
                          <span className="block text-sm font-medium text-slate-900">{profile.cancerType}</span>
                        </div>
                      )}
                      {profile.stage && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Stage</span>
                          <span className="block text-sm font-medium text-slate-900">{profile.stage}</span>
                        </div>
                      )}
                      {profile.originDest && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Origin → Dest</span>
                          <span className="block text-sm font-medium text-slate-900">{profile.originDest}</span>
                        </div>
                      )}
                      {profile.estBudget && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Est. Budget</span>
                          <span className="block text-sm font-medium text-slate-900">{profile.estBudget}</span>
                        </div>
                      )}
                      {patientProfile?.urgency && (
                        <div>
                          <span className="block text-[10px] text-slate-400 font-medium uppercase">Urgency</span>
                          <span className="block text-sm font-medium text-slate-900">
                            {patientProfile.urgency === 'immediately' ? 'Immediately' :
                             patientProfile.urgency === 'within_week' ? 'Within a week' :
                             patientProfile.urgency === 'two_to_three_weeks' ? '2–3 weeks' :
                             patientProfile.urgency === 'within_month' ? 'Within a month' :
                             patientProfile.urgency}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Journey Plans */}
              {plans.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Recommended Journey Packages</h3>
                    <span className="text-xs text-slate-400">Estimates include medical + travel + stay</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {plans.map((plan, idx) => (
                      <PlanCard key={idx} plan={plan} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}

              {/* Customisation & Next Steps */}
              {suggestions && suggestions.items.length > 0 && (
                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="iconify text-indigo-600" data-icon="lucide:sliders-horizontal" data-width="16"></span>
                    Suggestions to Optimise
                  </h4>
                  <ul className="space-y-2">
                    {suggestions.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="iconify text-indigo-400 mt-0.5 shrink-0" data-icon="lucide:arrow-right-circle" data-width="14"></span>
                        <span className="text-sm text-slate-700">
                          <strong>{item.title}:</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                      I have relatives for stay
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                      Prefer train travel
                    </button>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                      Show options in Chennai instead
                    </button>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="iconify text-slate-400 shrink-0" data-icon="lucide:alert-circle" data-width="16"></span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  <strong>Medical Disclaimer:</strong> I am an AI planner, not a doctor. Costs are estimates based on market rates and historical data. Actual hospital bills may vary based on complications or doctor specifics. Please consult a ByOnco specialist or your oncologist before finalizing travel.
                </p>
              </div>
            </div>
          </div>

          <div className="h-8"></div> {/* Spacer */}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 z-10">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask to modify the plan (e.g., 'Remove the hotel cost' or 'Is proton therapy an option?')"
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-900 shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="iconify" data-icon={loading ? "lucide:loader-2" : "lucide:send"} data-width="16"></span>
            </button>
          </form>
          <div className="max-w-4xl mx-auto mt-2">
            {error && (
              <p className="text-xs text-red-500 text-center mb-1">{error}</p>
            )}
            <p className="text-[10px] text-slate-400 text-center">
              ByOnco Journey AI can make mistakes. The estimated costs are not final and can vary based on clinical decisions, hospital policies, and travel changes. However, our goal is to keep your final bill as close as possible to these estimates, based on ByOnco's ongoing market research. Please verify important information with your oncologist and our team.
            </p>
          </div>
        </div>
      </main>

      {/* Currency Converter Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCurrencyModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Currency Converter</h3>
            {patientProfile?.budgetRangeLabel ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Your Budget</p>
                  <p className="text-lg font-semibold text-slate-900">{patientProfile.budgetRangeLabel}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">USD:</span>
                    <span className="font-medium text-slate-900">
                      {/* TODO: plug real FX API - using approximate rates: 1 USD = 83 INR */}
                      {patientProfile.budgetCurrency === 'USD' 
                        ? patientProfile.budgetRangeLabel 
                        : '~$' + (parseFloat(patientProfile.budgetRangeLabel.replace(/[^0-9.]/g, '')) * 0.012).toFixed(0) + 'K'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">INR:</span>
                    <span className="font-medium text-slate-900">
                      {patientProfile.budgetCurrency === 'INR' 
                        ? patientProfile.budgetRangeLabel 
                        : '~₹' + (parseFloat(patientProfile.budgetRangeLabel.replace(/[^0-9.]/g, '')) * 83).toFixed(0) + 'L'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">Note: Rates are approximate. Actual conversion may vary.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Please complete your profile to see currency conversions.</p>
            )}
            <button
              onClick={() => setShowCurrencyModal(false)}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

