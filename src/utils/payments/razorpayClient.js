/**
 * Unified Razorpay payment client
 * Reusable payment module for all payment flows
 */
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
// Use same-origin API path to avoid CORS issues (Vercel proxy handles routing)
const API = '/api/payments';
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

/**
 * Get Razorpay key ID from backend (preferred) or environment variable (fallback)
 * ALWAYS uses same-origin path to avoid CORS issues
 */
async function getRazorpayKeyId() {
  // 1) Optional env override (if intentionally set)
  const envKey = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY;
  if (envKey) {
    return envKey;
  }

  // 2) ALWAYS use same-origin path so CORS is never an issue
  // This uses Vercel proxy: /api/payments/razorpay/key -> backend
  const url = '/api/payments/razorpay/key';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Key fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const keyId = data?.keyId;
    if (!keyId) {
      throw new Error('keyId missing in response');
    }

    return keyId;
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw new Error('Razorpay key not configured');
  }
}

/**
 * Load Razorpay script
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

/**
 * Create payment order on backend
 */
export async function createOrder({ amount, currency = 'INR', description, serviceType, metadata = {} }) {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(
    `${API}/create-order`,
    {
      amount,
      currency,
      description,
      service_type: serviceType,
      ...metadata
    },
    { headers }
  );

  return response.data;
}

/**
 * Open Razorpay checkout
 */
export async function openCheckout({ order, prefill = {}, notes = {}, onSuccess, onError, theme = { color: '#7c3aed' } }) {
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not loaded');
  }

  // Fetch key ID from backend (with fallback to env)
  const keyId = await getRazorpayKeyId();

  const { order_id, amount, currency } = order;

  const options = {
    key: keyId,
    amount: amount * 100, // Convert to paise
    currency: currency,
    name: 'ByOnco Care',
    description: notes.description || 'Payment',
    order_id: order_id,
    prefill: prefill,
    notes: notes,
    theme: theme,
    handler: async function (response) {
      try {
        const result = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount
        });
        
        if (result.success && onSuccess) {
          onSuccess(result);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        if (onError) {
          onError(error);
        }
      }
    },
    modal: {
      ondismiss: function() {
        // Payment cancelled
        if (onError) {
          onError(new Error('Payment cancelled'));
        }
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  
  razorpay.on('payment.failed', function (response) {
    console.error('Payment failed:', response);
    if (onError) {
      onError(new Error(response.error?.description || 'Payment failed'));
    }
  });

  razorpay.open();
  return razorpay;
}

/**
 * Verify payment on backend
 */
export async function verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, metadata = {} }) {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(
    `${API}/verify`,
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      ...metadata
    },
    { headers }
  );

  return response.data;
}

/**
 * Complete payment flow (create order + open checkout + verify)
 */
export async function initiatePayment({
  amount,
  currency = 'INR',
  description,
  serviceType,
  prefill = {},
  metadata = {},
  onSuccess,
  onError,
  theme = { color: '#7c3aed' }
}) {
  try {
    // Ensure Razorpay is loaded
    await loadRazorpayScript();

    // Create order
    const order = await createOrder({
      amount,
      currency,
      description,
      serviceType,
      metadata
    });

    // Open checkout (now async)
    await openCheckout({
      order,
      prefill,
      notes: {
        description,
        service_type: serviceType,
        ...metadata
      },
      theme,
      onSuccess,
      onError
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    if (onError) {
      onError(error);
    }
  }
}

