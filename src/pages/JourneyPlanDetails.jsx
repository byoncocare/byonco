import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { getPatientProfile } from '@/utils/patientProfile';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';

// Add-ons configuration
const ADD_ONS = [
  {
    id: 'hotel-upgrade',
    label: 'Upgrade to Better Hotel Tier',
    description: 'Upgrade accommodation to next tier (+15-20%)',
    extraCost: 0.15, // 15% of base
  },
  {
    id: 'translator',
    label: 'Professional Translator',
    description: 'Dedicated translator for medical consultations',
    extraCost: 5000, // Fixed amount
  },
  {
    id: 'caregiver',
    label: 'Dedicated Caregiver',
    description: 'Professional caregiver assistance during stay',
    extraCost: 15000, // Fixed amount
  },
  {
    id: 'airport-lounge',
    label: 'Airport Lounge & Priority Assistance',
    description: 'VIP airport services and lounge access',
    extraCost: 3000, // Fixed amount
  },
];

export default function JourneyPlanDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;
  const patientProfile = getPatientProfile();

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [requestToken, setRequestToken] = useState(null);
  const [tokenCreated, setTokenCreated] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!plan) {
      navigate('/journey-builder');
    }
  }, [plan, navigate]);

  if (!plan) {
    return null;
  }

  // Calculate costs
  const parsePriceRange = (priceRange) => {
    const match = priceRange.match(/(\d+[LK]?)\s*[–-]\s*(\d+[LK]?)/);
    if (!match) return { min: 0, max: 0 };
    
    const parseAmount = (str) => {
      if (str.includes('L')) {
        return parseFloat(str.replace('L', '')) * 100000; // Lakhs
      } else if (str.includes('K')) {
        return parseFloat(str.replace('K', '')) * 1000; // Thousands
      }
      return parseFloat(str);
    };
    
    return { min: parseAmount(match[1]), max: parseAmount(match[2]) };
  };

  const baseCost = parsePriceRange(plan.priceRange);
  const addOnCosts = selectedAddOns.reduce((sum, addOnId) => {
    const addOn = ADD_ONS.find(a => a.id === addOnId);
    if (!addOn) return sum;
    if (addOn.extraCost < 1) {
      // Percentage
      return sum + (baseCost.min * addOn.extraCost);
    }
    return sum + addOn.extraCost;
  }, 0);

  const finalMin = baseCost.min + addOnCosts;
  const finalMax = baseCost.max + addOnCosts;

  const formatPrice = (amount) => {
    if (plan.priceRange.includes('₹')) {
      if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
      }
      return `₹${amount.toLocaleString()}`;
    } else if (plan.priceRange.includes('$')) {
      if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
      }
      return `$${amount.toLocaleString()}`;
    }
    return amount.toLocaleString();
  };

  const handleAddOnToggle = (addOnId) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const createRequestToken = async () => {
    const token = `BYO-2025-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setRequestToken(token);
    setTokenCreated(true);

    // TODO: implement this endpoint in FastAPI
    try {
      await fetch(`${BACKEND_URL}/api/journey-tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          plan,
          addOns: selectedAddOns,
          patientProfile,
        }),
      });
    } catch (err) {
      console.error("Error creating token:", err);
      // Continue anyway - token is created locally
    }
  };

  const handlePayNow = async () => {
    if (!tokenCreated) {
      await createRequestToken();
    }
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/journey-builder')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Journey Builder
        </button>

        {/* Plan Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium ${
                  plan.planType === 'Value' ? 'bg-emerald-100 text-emerald-800' :
                  plan.planType === 'Balanced' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {plan.planType} Plan
                </span>
                <h1 className="text-2xl font-bold text-slate-900">{plan.city}, {plan.region}</h1>
              </div>
              <p className="text-lg text-slate-600">{plan.hospitalName}</p>
              <p className="text-sm text-slate-500 mt-1">{plan.hospitalNote}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Base Estimate</p>
              <p className="text-2xl font-bold text-slate-900">{plan.priceRange}</p>
              <p className="text-xs text-slate-500 mt-1">{plan.duration}</p>
            </div>
          </div>
        </div>

        {/* Detailed Inclusions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">What's Included</h2>
          <div className="space-y-3">
            {plan.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="iconify text-indigo-400 mt-0.5 shrink-0" data-icon="lucide:check-circle" data-width="16"></span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add-ons</h2>
          <div className="space-y-3">
            {ADD_ONS.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.id);
              const costDisplay = addOn.extraCost < 1 
                ? `+${(addOn.extraCost * 100).toFixed(0)}%` 
                : `+${formatPrice(addOn.extraCost)}`;
              
              return (
                <label
                  key={addOn.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleAddOnToggle(addOn.id)}
                    className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{addOn.label}</span>
                      <span className="text-sm font-medium text-indigo-600">{costDisplay}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{addOn.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Cost Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Base estimate:</span>
              <span className="font-medium text-slate-900">{plan.priceRange}</span>
            </div>
            {selectedAddOns.length > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Add-ons:</span>
                <span className="font-medium text-indigo-600">
                  +{formatPrice(addOnCosts)} – +{formatPrice(addOnCosts)}
                </span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Final estimated total:</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatPrice(finalMin)} – {formatPrice(finalMax)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                This is still an estimate; final costs may vary based on clinical decisions and hospital policies.
              </p>
            </div>
          </div>
        </div>

        {/* Request Token Section */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Create a Request Token</h2>
          <p className="text-sm text-slate-600 mb-4">
            Get a unique token to track your journey plan request. Our team will contact you to verify details and share final offers.
          </p>
          
          {!tokenCreated ? (
            <button
              onClick={createRequestToken}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Request Token
            </button>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <p className="text-sm text-slate-600 mb-2">Your request token is:</p>
              <p className="text-lg font-mono font-semibold text-indigo-600 mb-2">{requestToken}</p>
              <p className="text-xs text-slate-500 italic">
                Our team will contact you immediately to verify details, tailor the plan, and share final offers before you pay.
              </p>
            </div>
          )}
        </div>

        {/* Pay Now Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/journey-builder')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handlePayNow}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            Pay Now {tokenCreated ? '(after token verification)' : ''}
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="text-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Request Submitted</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Your request <strong>{requestToken}</strong> has been submitted.
                </p>
                <p className="text-sm text-slate-600">
                  Our team will verify your plan and contact you. Final bookings are typically completed within 12 hours to 3 days, depending on urgency and availability.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  navigate('/journey-builder');
                }}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

