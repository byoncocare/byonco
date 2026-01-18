// src/components/PaymentGate.jsx
// Payment gate component - checks subscription before allowing access

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasPaidAccess, isAdmin } from '@/utils/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/utils/payments/subscriptionPlans';
import { initiatePayment } from '@/utils/payments/razorpayClient';
import { saveSubscription } from '@/utils/subscription';
import { toast } from '@/hooks/use-toast';

export default function PaymentGate({ children, serviceName = "this service" }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [accessCheck, setAccessCheck] = React.useState({ hasAccess: false, reason: 'checking' });
  const [loading, setLoading] = React.useState(true);

  const admin = isAdmin(user);

  // Check access on mount and when user changes
  React.useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      try {
        const check = await hasPaidAccess(user);
        setAccessCheck(check);
      } catch (error) {
        console.error('Error checking access:', error);
        setAccessCheck({ hasAccess: false, reason: 'error' });
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [user]);

  // If admin, allow access
  if (admin) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Checking access...</div>
      </div>
    );
  }

  // If user has active subscription, allow access
  if (accessCheck.hasAccess) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-purple-400" />
              <CardTitle className="text-2xl text-white">Authentication Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              You need to be logged in to access {serviceName}. Please log in or create an account first.
            </p>
            <Button
              onClick={() => navigate('/authentication?redirect=' + window.location.pathname)}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              Login or Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated but no subscription - show payment required
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'byonco-pro');

  const handleSubscribe = async () => {
    if (!plan) return;

    setPaymentLoading(true);
    try {
      await initiatePayment({
        amount: plan.amount,
        currency: plan.currency,
        description: `${plan.name} - ${plan.subtitle}`,
        serviceType: plan.serviceType,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name
        },
      }, {
        onSuccess: async (result) => {
          // Save subscription from backend response if available
          if (result.subscription) {
            saveSubscription(result.subscription);
          } else {
            // Fallback: create subscription locally
            saveSubscription({
              planId: plan.id,
              paymentId: result.payment_id,
              orderId: result.order_id
            });
          }

          toast({
            variant: "success",
            title: "Payment successful",
            description: "Your subscription is now active. You can now access all services.",
          });

          // Reload to refresh access check
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        onError: (error) => {
          console.error('Payment error:', error);
          toast({
            variant: "error",
            title: "Payment failed",
            description: error.message || "Failed to process payment. Please try again.",
          });
          setPaymentLoading(false);
        }
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "error",
        title: "Payment failed",
        description: "Failed to initiate payment. Please try again.",
      });
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-purple-400" />
            <CardTitle className="text-2xl text-white">Subscription Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-300">
              To access <strong className="text-white">{serviceName}</strong>, you need an active subscription.
            </p>
            
            {accessCheck.reason === 'expired' && (
              <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <p className="text-sm text-yellow-300">
                  Your subscription has expired. Please renew to continue accessing services.
                </p>
              </div>
            )}

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">{plan?.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                {plan?.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
                <p className="text-purple-300 font-medium mt-3">
                  ₹{plan?.amount.toLocaleString('en-IN')}{plan?.period}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={paymentLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
          >
            {paymentLoading ? 'Processing...' : `Subscribe Now - ₹${plan?.amount}${plan?.period}`}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            After payment, you'll have full access to all services for {plan?.period === '/week' ? '7 days' : '30 days'}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
