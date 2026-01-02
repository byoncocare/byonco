import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, CheckCircle2, Shield, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RazorPayButton from '@/components/Payment/RazorPayButton';
import { setEntitlementActive } from '@/utils/secondOpinionAccess';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/payments`;

// Second Opinion service pricing (in INR)
const SECOND_OPINION_PRICE = 99; // ₹99
const SECOND_OPINION_CURRENCY = 'INR';

export default function SecondOpinionPaywallModal({ 
  open, 
  onClose, 
  reason = 'limit' // 'limit' | 'cta' | 'route-guard'
}) {
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  if (!open) return null;

  const handlePaymentSuccess = async (verificationData) => {
    try {
      // Set entitlement locally
      setEntitlementActive('razorpay', verificationData.order_id);
      
      // Navigate to form page
      navigate('/second-opinion/form', { replace: true });
      onClose();
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast({
        variant: "error",
        title: "Payment error",
        description: "Payment successful but there was an error. Please contact support.",
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    const errorMessage = String(error);
    if (errorMessage.includes('cancelled') || errorMessage.includes('Payment cancelled')) {
      toast({
        variant: "info",
        title: "Payment cancelled",
        description: "You can retry anytime.",
      });
    } else {
      toast({
        variant: "error",
        title: "Payment failed",
        description: errorMessage,
      });
    }
    setPaymentLoading(false);
  };

  const handleComeBackTomorrow = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl">
        <CardHeader className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/50 rounded-full h-16 w-16 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <CardTitle className="text-2xl sm:text-3xl text-center text-white mb-2">
            {reason === 'limit' 
              ? "You've reached today's free limit"
              : reason === 'cta'
              ? "Get Second Opinion from an Oncologist"
              : "Complete Payment to Continue"}
          </CardTitle>
          
          <CardDescription className="text-center text-purple-200 text-base">
            {reason === 'limit'
              ? "Upgrade to get unlimited AI assistance and access to our premium second opinion service from board-certified oncologists."
              : "Get a comprehensive second opinion from our expert oncologists with 15+ years of experience."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-6">
          {/* Benefits */}
          <div className="space-y-3">
            {[
              { icon: <FileText className="h-5 w-5 text-emerald-400" />, text: "Detailed analysis from board-certified oncologists" },
              { icon: <Clock className="h-5 w-5 text-cyan-400" />, text: "Response within 12-24 hours" },
              { icon: <Shield className="h-5 w-5 text-purple-400" />, text: "HIPAA compliant and secure" },
              { icon: <Sparkles className="h-5 w-5 text-pink-400" />, text: "Unlimited AI assistance" }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 text-slate-200">
                {benefit.icon}
                <span className="text-sm sm:text-base">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/40 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              ₹{SECOND_OPINION_PRICE.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-purple-200">
              One-time payment for comprehensive second opinion
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <RazorPayButton
                amount={SECOND_OPINION_PRICE}
                currency={SECOND_OPINION_CURRENCY}
                description="Second Opinion from Board-Certified Oncologist"
                serviceType="second_opinion"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
              />
            </div>
            {reason === 'limit' && (
              <Button
                variant="outline"
                onClick={handleComeBackTomorrow}
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
              >
                Come back tomorrow
              </Button>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-zinc-500 text-center">
            Secure payment powered by Razorpay. Your payment information is encrypted and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

