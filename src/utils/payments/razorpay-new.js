/**
 * NEW Razorpay Payment Gateway - Built from Scratch
 * 
 * This is a clean, simple implementation that ensures:
 * 1. CSP compliance
 * 2. Proper iframe loading
 * 3. Mobile compatibility
 * 4. Error handling
 */

const RAZORPAY_SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const BACKEND_API = '/api/payments';

/**
 * Load Razorpay SDK - Simple and reliable
 */
export function loadRazorpaySdk() {
  return new Promise((resolve, reject) => {
    // Already loaded?
    if (window.Razorpay) {
      console.log('[Razorpay] SDK already loaded');
      resolve(true);
      return;
    }

    // Script already exists?
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SDK_URL}"]`);
    if (existingScript) {
      console.log('[Razorpay] Script exists, waiting...');
      existingScript.onload = () => {
        setTimeout(() => {
          if (window.Razorpay) {
            resolve(true);
          } else {
            reject(new Error('SDK not available after script load'));
          }
        }, 100);
      };
      existingScript.onerror = () => reject(new Error('Script load failed'));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = RAZORPAY_SDK_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      setTimeout(() => {
        if (window.Razorpay) {
          console.log('[Razorpay] SDK loaded successfully');
          resolve(true);
        } else {
          reject(new Error('SDK not available'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };
    
    document.body.appendChild(script);
  });
}

/**
 * Get Razorpay Key ID
 */
async function getRazorpayKeyId() {
  // Check env first
  const envKey = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY;
  if (envKey) {
    return envKey;
  }

  // Fetch from backend
  try {
    const response = await fetch(`${BACKEND_API}/razorpay/key`);
    if (!response.ok) throw new Error('Key fetch failed');
    const data = await response.json();
    return data?.keyId;
  } catch (error) {
    console.error('[Razorpay] Key fetch error:', error);
    throw new Error('Razorpay key not configured');
  }
}

/**
 * Create payment order on backend
 */
async function createOrder({ amount, currency = 'INR', description, serviceType, metadata = {} }) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const payload = {
    amount: Number(amount),
    currency: currency || 'INR',
    description: description || 'Payment',
    service_type: serviceType || null,
    ...metadata
  };

  console.log('[Razorpay] Creating order:', payload);

  const response = await fetch(`${BACKEND_API}/create-order`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.detail || errorData.message || `Order failed: ${response.status}`;
    console.error('[Razorpay] Order creation failed:', errorMsg);
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data.order_id) {
    throw new Error('Invalid order response');
  }

  return data;
}

/**
 * Verify payment on backend
 */
async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }) {
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
      amount
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Verification failed');
  }

  return await response.json();
}

/**
 * MAIN PAYMENT FLOW - Call this from Subscribe Now button
 */
export async function initiatePayment({
  amount,
  currency = 'INR',
  description,
  serviceType,
  metadata = {},
  onSuccess,
  onDismiss,
  onFail
}) {
  try {
    console.log('[Razorpay] Starting payment flow...');

    // Step 1: Load SDK
    await loadRazorpaySdk();
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not available');
    }

    // Step 2: Get Key
    const keyId = await getRazorpayKeyId();
    if (!keyId) {
      throw new Error('Razorpay key not found');
    }

    // Step 3: Create Order
    const order = await createOrder({
      amount,
      currency,
      description,
      serviceType,
      metadata
    });

    console.log('[Razorpay] Order created:', order.order_id);

    // Step 4: Open Checkout
    const options = {
      key: keyId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      name: 'ByOnco Care',
      description: description,
      order_id: order.order_id,
      handler: async function (response) {
        try {
          console.log('[Razorpay] Payment successful, verifying...');
          
          // Verify payment
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amount
          });

          console.log('[Razorpay] Payment verified:', result);
          
          if (onSuccess) {
            onSuccess(result);
          }
        } catch (error) {
          console.error('[Razorpay] Verification error:', error);
          if (onFail) {
            onFail(error);
          }
        }
      },
      modal: {
        ondismiss: function() {
          console.log('[Razorpay] Modal dismissed');
          if (onDismiss) {
            onDismiss();
          }
        }
      },
      theme: {
        color: '#7c3aed'
      }
    };

    // Create and open Razorpay instance
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('[Razorpay] Payment failed:', response);
      if (onFail) {
        onFail(new Error(response.error?.description || 'Payment failed'));
      }
    });

    // Open modal - MUST be called synchronously
    rzp.open();
    console.log('[Razorpay] Checkout modal opened');

  } catch (error) {
    console.error('[Razorpay] Payment flow error:', error);
    if (onFail) {
      onFail(error);
    } else {
      throw error;
    }
  }
}
