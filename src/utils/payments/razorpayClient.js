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
      console.log('[Razorpay] SDK already loaded');
      resolve();
      return;
    }

    console.log('[Razorpay] Loading SDK script...');
    
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      console.log('[Razorpay] Script already exists, waiting for load...');
      existingScript.onload = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          reject(new Error('Razorpay SDK script loaded but window.Razorpay not available'));
        }
      };
      existingScript.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('[Razorpay] Script loaded, checking window.Razorpay...');
      // Wait a bit for Razorpay to initialize
      setTimeout(() => {
        if (window.Razorpay) {
          console.log('[Razorpay] SDK initialized successfully');
          resolve();
        } else {
          console.error('[Razorpay] Script loaded but window.Razorpay not found');
          reject(new Error('Razorpay SDK script loaded but window.Razorpay not available'));
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      console.error('[Razorpay] Script load error:', error);
      reject(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    };
    
    document.body.appendChild(script);
    console.log('[Razorpay] Script tag added to body');
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
  try {
    // Ensure Razorpay is loaded
    if (!window.Razorpay) {
      console.error('[Razorpay] SDK not found, attempting to load...');
      await loadRazorpayScript();
      
      // Double check after loading
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }
    }

    console.log('[Razorpay] SDK loaded, fetching key ID...');
    
    // Fetch key ID from backend (with fallback to env)
    const keyId = await getRazorpayKeyId();
    
    if (!keyId) {
      throw new Error('Razorpay key ID not found. Please contact support.');
    }

    console.log('[Razorpay] Key ID fetched, creating checkout...');

    const { order_id, amount, currency } = order;

    // Backend returns amount in rupees, but Razorpay checkout needs paise
    // However, since backend already created the order with correct amount in paise,
    // we should use the order_id directly. The amount here is just for display/verification.
    // Razorpay will use the amount from the order_id, so we don't need to convert again.
    // But to be safe, we'll use the amount from order (which is in rupees) and convert to paise
    const amountInPaise = Math.round(amount * 100);

    const options = {
      key: keyId,
      amount: amountInPaise, // Amount in paise (backend returns in rupees)
      currency: currency,
      name: 'ByOnco Care',
      description: notes.description || 'Payment',
      order_id: order_id, // Use order_id from backend (order already created with correct amount)
      prefill: prefill,
      notes: notes,
      theme: theme,
      handler: async function (response) {
        try {
          console.log('[Razorpay] Payment successful, verifying...', response);
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
          console.error('[Razorpay] Payment verification error:', error);
          if (onError) {
            onError(error);
          }
        }
      },
      modal: {
        ondismiss: function() {
          console.log('[Razorpay] Payment modal dismissed');
          // Payment cancelled
          if (onError) {
            onError(new Error('Payment cancelled'));
          }
        }
      }
    };

    console.log('[Razorpay] Creating Razorpay instance with options:', { ...options, key: keyId.substring(0, 10) + '...' });
    
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response) {
      console.error('[Razorpay] Payment failed:', response);
      if (onError) {
        onError(new Error(response.error?.description || 'Payment failed'));
      }
    });

    console.log('[Razorpay] Opening checkout modal...');
    
    // Open the checkout modal
    razorpay.open();
    
    console.log('[Razorpay] Checkout modal opened');
    
    return razorpay;
  } catch (error) {
    console.error('[Razorpay] Error opening checkout:', error);
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
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
    console.log('[Razorpay] Initiating payment flow...', { amount, currency, description });
    
    // Ensure Razorpay is loaded
    console.log('[Razorpay] Step 1: Loading SDK...');
    await loadRazorpayScript();
    console.log('[Razorpay] Step 1: SDK loaded ✓');

    // Create order
    console.log('[Razorpay] Step 2: Creating order...');
    const order = await createOrder({
      amount,
      currency,
      description,
      serviceType,
      metadata
    });
    console.log('[Razorpay] Step 2: Order created ✓', { order_id: order.order_id });

    // Open checkout
    console.log('[Razorpay] Step 3: Opening checkout...');
    const razorpayInstance = await openCheckout({
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
    
    console.log('[Razorpay] Step 3: Checkout opened ✓', razorpayInstance);
    
    // Return the instance so caller can track it
    return razorpayInstance;
  } catch (error) {
    console.error('[Razorpay] Payment initiation error:', error);
    if (onError) {
      onError(error);
    } else {
      // Re-throw if no error handler provided
      throw error;
    }
  }
}

