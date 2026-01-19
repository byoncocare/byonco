/**
 * Shared Razorpay Payment Launcher Utility
 * 
 * This module provides a unified interface for Razorpay payments across the entire application.
 * All payment flows should use this module instead of directly calling window.Razorpay.
 * 
 * Key features:
 * - Handles SDK loading
 * - Manages user gesture requirements (critical for mobile)
 * - Ensures processing state is always reset
 * - Provides consistent error handling
 */

const RAZORPAY_SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const BACKEND_API = '/api/payments';

/**
 * Load Razorpay SDK script
 * Returns true if SDK is available, false otherwise
 */
export async function loadRazorpaySdk() {
  // Check if already loaded
  if (window.Razorpay) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Razorpay] SDK already loaded');
    }
    return true;
  }

  // Check if script is already being loaded
  const existingScript = document.querySelector(`script[src="${RAZORPAY_SDK_URL}"]`);
  if (existingScript) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Razorpay] Script already exists, waiting for load...');
    }
    
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Razorpay SDK load timeout'));
      }, 10000);

      existingScript.onload = () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        setTimeout(() => {
          resolve(window.Razorpay ? true : false);
        }, 100);
      };

      existingScript.onerror = () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        reject(new Error('Failed to load Razorpay SDK'));
      };
    });
  }

  // Load the script
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Razorpay] Loading SDK script...');
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SDK_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      // Wait a bit for Razorpay to initialize
      setTimeout(() => {
        if (window.Razorpay) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Razorpay] SDK loaded successfully');
          }
          resolve(true);
        } else {
          reject(new Error('Razorpay SDK script loaded but window.Razorpay not available'));
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Razorpay] Script load error:', error);
      }
      reject(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
    };
    
    document.body.appendChild(script);
  });
}

/**
 * Get Razorpay key ID from backend or environment
 */
async function getRazorpayKeyId() {
  // Check environment variable first
  const envKey = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY;
  if (envKey) {
    return envKey;
  }

  // Fetch from backend
  try {
    const response = await fetch(`${BACKEND_API}/razorpay/key`, {
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
    if (process.env.NODE_ENV === 'development') {
      console.error('[Razorpay] Error fetching key:', error);
    }
    throw new Error('Razorpay key not configured');
  }
}

/**
 * Open Razorpay checkout modal
 * 
 * @param {Object} options
 * @param {string} options.key - Razorpay key ID
 * @param {string} options.orderId - Razorpay order ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code (default: 'INR')
 * @param {string} options.name - Merchant name
 * @param {string} options.description - Payment description
 * @param {Object} options.prefill - Prefill data (email, contact, name)
 * @param {Object} options.notes - Additional notes
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onDismiss - Dismiss callback (must reset processing state)
 * @param {Function} options.onFail - Failure callback (must reset processing state)
 * @param {Object} options.theme - Theme options
 * 
 * @returns {Object} Razorpay instance
 */
export async function openRazorpayCheckout({
  key,
  orderId,
  amount,
  currency = 'INR',
  name = 'ByOnco Care',
  description = 'Payment',
  prefill = {},
  notes = {},
  onSuccess,
  onDismiss,
  onFail,
  theme = { color: '#7c3aed' }
}) {
  // Ensure SDK is loaded
  const sdkLoaded = await loadRazorpaySdk();
  if (!sdkLoaded || !window.Razorpay) {
    const error = new Error('Razorpay SDK not available');
    if (onFail) {
      onFail(error);
    }
    throw error;
  }

  // Get key if not provided
  const razorpayKey = key || await getRazorpayKeyId();
  if (!razorpayKey) {
    const error = new Error('Razorpay key ID not found');
    if (onFail) {
      onFail(error);
    }
    throw error;
  }

  // Ensure callbacks reset processing state
  const safeOnDismiss = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Razorpay] Payment modal dismissed');
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const safeOnFail = (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Razorpay] Payment failed:', error);
    }
    if (onFail) {
      onFail(error);
    }
  };

  // Create Razorpay options
  const options = {
    key: razorpayKey,
    amount: amount, // Amount in paise
    currency: currency,
    name: name,
    description: description,
    order_id: orderId,
    prefill: prefill,
    notes: notes,
    theme: theme,
    handler: async function (response) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Razorpay] Payment successful:', response);
        }
        if (onSuccess) {
          onSuccess(response);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Razorpay] Success callback error:', error);
        }
        safeOnFail(error);
      }
    },
    modal: {
      ondismiss: safeOnDismiss
    }
  };

  // Create Razorpay instance
  let razorpayInstance;
  try {
    razorpayInstance = new window.Razorpay(options);
    
    // Attach payment failed event
    razorpayInstance.on('payment.failed', function (response) {
      const error = new Error(response.error?.description || 'Payment failed');
      safeOnFail(error);
    });

    // Open checkout modal
    // CRITICAL: This must be called synchronously after user gesture
    // Do NOT await anything between user click and this call
    razorpayInstance.open();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Razorpay] Checkout modal opened');
    }
    
    return razorpayInstance;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Razorpay] Error opening checkout:', error);
    }
    safeOnFail(error);
    throw error;
  }
}

/**
 * Create payment order on backend
 */
export async function createPaymentOrder({ amount, currency = 'INR', description, serviceType, metadata = {} }) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${BACKEND_API}/create-order`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount,
      currency,
      description,
      service_type: serviceType,
      ...metadata
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Order creation failed: ${response.status}`);
  }

  const data = await response.json();
  
  // Validate response
  if (!data.order_id) {
    throw new Error('Invalid order response: order_id missing');
  }
  if (!data.amount && amount) {
    throw new Error('Invalid order response: amount missing');
  }

  return {
    order_id: data.order_id,
    amount: data.amount || amount,
    currency: data.currency || currency
  };
}

/**
 * Verify payment on backend
 */
export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, metadata = {} }) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${BACKEND_API}/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      ...metadata
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Payment verification failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Complete payment flow: Create order + Open checkout + Verify payment
 * 
 * This is the main function that should be called from payment buttons.
 * It handles the entire flow and ensures proper state management.
 * 
 * @param {Object} params
 * @param {number} params.amount - Amount in rupees
 * @param {string} params.currency - Currency (default: 'INR')
 * @param {string} params.description - Payment description
 * @param {string} params.serviceType - Service type
 * @param {Object} params.prefill - Prefill data
 * @param {Object} params.metadata - Additional metadata
 * @param {Function} params.onSuccess - Success callback (receives verification result)
 * @param {Function} params.onDismiss - Dismiss callback (must reset processing state)
 * @param {Function} params.onFail - Failure callback (must reset processing state)
 * @param {Object} params.theme - Theme options
 */
export async function initiatePaymentFlow({
  amount,
  currency = 'INR',
  description,
  serviceType,
  prefill = {},
  metadata = {},
  onSuccess,
  onDismiss,
  onFail,
  theme = { color: '#7c3aed' }
}) {
  try {
    // Step 1: Load SDK (must be done early, but can be async)
    await loadRazorpaySdk();

    // Step 2: Create order
    const order = await createPaymentOrder({
      amount,
      currency,
      description,
      serviceType,
      metadata
    });

    // Step 3: Open checkout (must be called immediately after order creation)
    // DO NOT add any delays or extra async operations here
    await openRazorpayCheckout({
      orderId: order.order_id,
      amount: Math.round(order.amount * 100), // Convert to paise
      currency: order.currency,
      name: 'ByOnco Care',
      description: description,
      prefill: prefill,
      notes: {
        description,
        service_type: serviceType,
        ...metadata
      },
      theme: theme,
      onSuccess: async (response) => {
        try {
          // Verify payment
          const verificationResult = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amount,
            metadata: metadata
          });

          if (onSuccess) {
            onSuccess(verificationResult);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Razorpay] Payment verification error:', error);
          }
          if (onFail) {
            onFail(error);
          }
        }
      },
      onDismiss: onDismiss,
      onFail: onFail
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Razorpay] Payment flow error:', error);
    }
    if (onFail) {
      onFail(error);
    } else {
      throw error;
    }
  }
}
