/**
 * Payment Test Page
 * Simple test page to verify Razorpay payment flow on mobile and desktop
 * Route: /payment-test
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { initiatePayment } from '@/utils/payments/razorpay-new';
import { toast } from '@/hooks/use-toast';

export default function PaymentTestPage() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleTestPayment = async () => {
    // Prevent double clicks
    if (processing) return;

    // Set processing state immediately
    setProcessing(true);

    try {
      // CRITICAL: Call payment flow immediately after user gesture
      await initiatePayment({
        amount: 99, // ₹99 test payment
        currency: 'INR',
        description: 'Test Payment - ByOnco',
        serviceType: 'test_payment',
        metadata: {
          test: true,
          source: 'payment_test_page'
        },
        onSuccess: (result) => {
          setProcessing(false);
          toast({
            variant: "success",
            title: "Test Payment Successful",
            description: "Payment verification completed successfully.",
          });
        },
        onDismiss: () => {
          // Payment modal dismissed - reset processing state
          setProcessing(false);
          toast({
            variant: "info",
            title: "Payment Cancelled",
            description: "Test payment was cancelled.",
          });
        },
        onFail: (error) => {
          // Payment failed - reset processing state
          setProcessing(false);
          toast({
            variant: "error",
            title: "Test Payment Failed",
            description: error.message || "Payment failed. Please try again.",
          });
        }
      });
    } catch (error) {
      // Error in payment initiation - reset processing state
      setProcessing(false);
      toast({
        variant: "error",
        title: "Payment Initiation Failed",
        description: error.message || "Failed to initiate payment. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-purple-400" />
            <CardTitle className="text-2xl text-white">Payment Test</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-300">
              This page tests the Razorpay payment gateway integration.
            </p>
            
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Test Payment</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Amount: ₹99</p>
                <p>Purpose: Testing Razorpay integration</p>
                <p className="text-purple-300 font-medium mt-3">
                  Click the button below to test payment flow
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleTestPayment}
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Test Payment - ₹99'
            )}
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Back to Home
          </Button>

          <p className="text-xs text-gray-400 text-center">
            This is a test page. Use test mode credentials for Razorpay.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
