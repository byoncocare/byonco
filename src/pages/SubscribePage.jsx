// src/pages/SubscribePage.jsx
// Subscribe page - triggers Razorpay checkout

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/utils/payments/subscriptionPlans';
import { initiatePayment } from '@/utils/payments/razorpay-new';
import { saveSubscription } from '@/utils/subscription';
import { toast } from '@/hooks/use-toast';

export default function SubscribePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const redirectPath = searchParams.get('redirect') || '/';

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'byonco-pro');

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate(`/authentication?redirect=${encodeURIComponent(`/subscribe?redirect=${encodeURIComponent(redirectPath)}`)}`);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubscribe = async () => {
    if (!plan) return;
    
    // Prevent double clicks
    if (paymentLoading) return;

    // Set processing state immediately
    setPaymentLoading(true);
    
    try {
      // CRITICAL: Call payment flow immediately after user gesture
      await initiatePayment({
        amount: plan.amount,
        currency: plan.currency,
        description: `${plan.name} - ${plan.subtitle}`,
        serviceType: plan.serviceType,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name
        },
        onSuccess: async (result) => {
          // Save subscription from backend response if available
          if (result.subscription) {
            saveSubscription(result.subscription);
          } else if (result.payment_id) {
            // Fallback: create subscription locally
            saveSubscription({
              planId: plan.id,
              paymentId: result.payment_id,
              orderId: result.order_id || result.razorpay_order_id
            });
          }

          toast({
            variant: "success",
            title: "Payment successful",
            description: "Your subscription is now active. Redirecting...",
          });

          // Redirect to requested path or home
          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
        },
        onDismiss: () => {
          // Payment modal dismissed - reset processing state
          setPaymentLoading(false);
          toast({
            variant: "info",
            title: "Payment cancelled",
            description: "You can retry anytime.",
          });
        },
        onFail: (error) => {
          // Payment failed - reset processing state
          setPaymentLoading(false);
          
          // Don't show error toast for cancelled payments
          if (error.message && (error.message.includes('cancelled') || error.message.includes('Payment cancelled'))) {
            toast({
              variant: "info",
              title: "Payment cancelled",
              description: "You can retry anytime.",
            });
          } else {
            toast({
              variant: "error",
              title: "Payment failed",
              description: error.message || "Failed to process payment. Please try again.",
            });
          }
        }
      });
    } catch (error) {
      // Error in payment initiation - reset processing state
      setPaymentLoading(false);
      toast({
        variant: "error",
        title: "Payment failed",
        description: error.message || "Failed to initiate payment. Please try again.",
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gray-900/50 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-purple-400" />
            <CardTitle className="text-3xl text-white">Subscribe to ByOnco PRO</CardTitle>
          </div>
          <p className="text-gray-400 mt-2">
            Get full access to all AI-powered oncology navigation features
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {plan && (
            <>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                </div>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-purple-500/30 pt-4">
                  <p className="text-3xl font-bold text-purple-300 mb-1">
                    ₹{plan.amount.toLocaleString('en-IN')}
                    <span className="text-lg text-gray-400 font-normal">{plan.period}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Full access to all services for {plan.period === '/week' ? '7 days' : '30 days'}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={paymentLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-lg py-6"
                size="lg"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Subscribe Now - ₹${plan.amount.toLocaleString('en-IN')}${plan.period}`
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Secure payment powered by Razorpay. Your subscription will activate immediately after payment.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
