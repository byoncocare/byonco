import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { initiatePayment } from '@/utils/payments/razorpayClient';

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
            alert(error.message || 'Payment failed. Please try again.');
          }
        }
      });
    } catch (error) {
      setLoading(false);
      if (onError) {
        onError(error);
      } else {
        alert('Failed to initiate payment. Please try again.');
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

