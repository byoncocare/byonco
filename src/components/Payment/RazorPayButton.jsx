import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/payments`;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

export default function RazorPayButton({ 
  amount, 
  currency = 'INR', 
  description, 
  serviceType,
  onSuccess,
  onError,
  className = ''
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load RazorPay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert('RazorPay SDK not loaded. Please refresh the page.');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      alert('RazorPay key not configured. Please contact support.');
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const orderResponse = await axios.post(
        `${API}/create-order`,
        {
          amount,
          currency,
          description,
          service_type: serviceType
        },
        { headers }
      );

      const { order_id, amount: orderAmount } = orderResponse.data;

      // Initialize RazorPay
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderAmount * 100, // Convert to paise
        currency: currency,
        name: 'ByOnco Care',
        description: description,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API}/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderAmount
              },
              { headers }
            );

            if (verifyResponse.data.success && onSuccess) {
              onSuccess(verifyResponse.data);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            if (onError) {
              onError(error.response?.data?.detail || 'Payment verification failed');
            }
          }
        },
        prefill: {
          // You can prefill user details if available
        },
        theme: {
          color: '#7c3aed' // Purple theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        if (onError) {
          onError(response.error.description || 'Payment failed');
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment initiation error:', error);
      if (onError) {
        onError(error.response?.data?.detail || 'Failed to initiate payment');
      }
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !window.Razorpay}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₹${amount.toLocaleString('en-IN')}`
      )}
    </Button>
  );
}

