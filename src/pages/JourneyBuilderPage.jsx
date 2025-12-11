import React, { useState } from 'react';

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
function PlanCard({ plan }) {
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
        <button className={`w-full py-2 ${isBalanced ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'} text-xs font-medium rounded-lg transition-colors`}>
          {isBalanced ? 'Select Plan' : 'View Details'}
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function JourneyBuilderPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [plans, setPlans] = useState(defaultPlans);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [userMessage, setUserMessage] = useState(defaultUserMessage);
  const [aiMessage, setAiMessage] = useState(defaultAIMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
      const apiUrl = `${BACKEND_URL}/api/journey-builder`;
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

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
      setError(err instanceof Error ? err.message : "Failed to fetch journey plan. Please try again.");
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
            <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <span className="iconify" data-icon="lucide:activity" data-width="20" data-stroke-width="1.5"></span>
            </div>
            <h1 className="font-semibold text-lg tracking-tight">ByOnco</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Platform</div>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:building-2" data-width="18" data-stroke-width="1.5"></span>
            Find Hospitals
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:calculator" data-width="18" data-stroke-width="1.5"></span>
            Cost Calculator
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:microscope" data-width="18" data-stroke-width="1.5"></span>
            Rare Cancers
          </a>

          <div className="mt-6 px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Planning</div>
          
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm bg-slate-100 text-slate-900 font-medium rounded-md shadow-sm ring-1 ring-slate-900/5">
            <span className="iconify text-indigo-600" data-icon="lucide:map" data-width="18" data-stroke-width="1.5"></span>
            Journey Builder
            <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">AI</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-50 group transition-colors">
            <span className="iconify text-slate-400 group-hover:text-slate-600" data-icon="lucide:video" data-width="18" data-stroke-width="1.5"></span>
            Teleconsultation
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-900">John Doe</span>
              <span className="text-[10px] text-slate-500">Patient Account</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative bg-white lg:bg-slate-50/50">
        {/* Header (Mobile only) */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="iconify text-indigo-600" data-icon="lucide:activity" data-width="20"></span>
            <span className="font-semibold tracking-tight text-slate-900">ByOnco</span>
          </div>
          <button className="text-slate-500">
            <span className="iconify" data-icon="lucide:menu" data-width="24"></span>
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth">
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
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="iconify" data-icon="lucide:user-check" data-width="14"></span>
                      Extracted Journey Profile
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {plans.map((plan, idx) => (
                      <PlanCard key={idx} plan={plan} />
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
            <p className="text-[10px] text-slate-400 text-center">ByOnco Journey AI can make mistakes. Please verify important info.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

