import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { initiatePayment } from '@/utils/payments/razorpayClient';
import { toast } from '@/hooks/use-toast';

export default function RazorPayButton({ 
  amount, 
  currency = 'INR', 
  description, 
  serviceType,
  onSuccess,
  onError,
  className = '',
  buttonText,
  metadata = {}
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await initiatePayment({
        amount,
        currency,
        description,
        serviceType,
        metadata,
        onSuccess: (result) => {
          setLoading(false);
          if (onSuccess) {
            onSuccess(result);
          }
        },
        onError: (error) => {
          setLoading(false);
          if (onError) {
            onError(error);
          } else {
            const errorMessage = error.message || 'Payment failed. Please try again.';
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
          }
        }
      });
    } catch (error) {
      setLoading(false);
      if (onError) {
        onError(error);
      } else {
        toast({
          variant: "error",
          title: "Payment failed",
          description: "Failed to initiate payment. Please try again.",
        });
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText || `Pay ₹${amount.toLocaleString('en-IN')}`
      )}
    </Button>
  );
}

