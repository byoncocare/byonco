// src/utils/subscription.js
// Subscription management utilities

/**
 * Admin email addresses that have free access to all services
 */
const ADMIN_EMAILS = [
  'admin@byoncocare.com',
  'ajinkya@byoncocare.com',
  'imajinkyajadhav@gmail.com', // Admin access - free access to all services
];

/**
 * Check if user is an admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  const email = user.email || user.user_email || '';
  return ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
};

/**
 * Get subscription status from backend or localStorage
 */
export const getSubscriptionStatus = async (user) => {
  // First check backend if user is logged in
  if (user && user.email) {
    try {
      // Try multiple token keys for compatibility
      const token = localStorage.getItem('byonco_jwt') || localStorage.getItem('auth_token');
      if (token) {
        const response = await fetch('/api/payments/subscription/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.has_subscription && data.subscription) {
            // Save to localStorage for offline access
            localStorage.setItem('subscription_status', JSON.stringify(data.subscription));
            return data.subscription;
          }
        }
      }
    } catch (error) {
      console.warn('Error fetching subscription from backend:', error);
      // Fallback to localStorage
    }
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('subscription_status');
    if (!stored) return null;
    
    const subscription = JSON.parse(stored);
    return subscription;
  } catch (error) {
    console.error('Error reading subscription status:', error);
    return null;
  }
};

/**
 * Check if subscription is active
 */
export const isSubscriptionActive = (subscription) => {
  if (!subscription) return false;
  
  const { expiresAt, planId } = subscription;
  if (!expiresAt) return false;
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  
  return expiryDate > now;
};

/**
 * Save subscription after payment (from backend response or local creation)
 */
export const saveSubscription = (subscriptionData) => {
  // If subscriptionData is already a subscription object from backend, use it
  if (subscriptionData && subscriptionData.expires_at) {
    const subscription = {
      planId: subscriptionData.plan_id,
      planName: subscriptionData.plan_name,
      subscribedAt: subscriptionData.subscribed_at,
      expiresAt: subscriptionData.expires_at,
      paymentId: subscriptionData.payment_id,
      orderId: subscriptionData.order_id,
      active: subscriptionData.active
    };
    localStorage.setItem('subscription_status', JSON.stringify(subscription));
    return subscription;
  }
  
  // Legacy: create subscription from planId, paymentId, orderId
  const planId = subscriptionData.planId || subscriptionData;
  const paymentId = subscriptionData.paymentId || subscriptionData;
  const orderId = subscriptionData.orderId || subscriptionData;
  
  const plan = planId === 'byonco-pro' 
    ? { id: 'byonco-pro', durationDays: 7 } // 1 week
    : { id: 'hospital-saas', durationDays: 30 }; // 1 month
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.durationDays);
  
  const subscription = {
    planId: plan.id,
    planName: plan.id === 'byonco-pro' ? 'ByOnco PRO' : 'Hospital SaaS',
    subscribedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    paymentId,
    orderId,
    active: true
  };
  
  localStorage.setItem('subscription_status', JSON.stringify(subscription));
  return subscription;
};

/**
 * Check if user has access to paid services
 */
export const hasPaidAccess = async (user) => {
  // Admin has free access
  if (isAdmin(user)) {
    return { hasAccess: true, reason: 'admin' };
  }
  
  // Check subscription (from backend or localStorage)
  const subscription = await getSubscriptionStatus(user);
  if (!subscription) {
    return { hasAccess: false, reason: 'no_subscription' };
  }
  
  if (!isSubscriptionActive(subscription)) {
    return { hasAccess: false, reason: 'expired' };
  }
  
  return { hasAccess: true, reason: 'active_subscription', subscription };
};

/**
 * Get days remaining in subscription
 */
export const getDaysRemaining = (subscription) => {
  if (!subscription || !subscription.expiresAt) return 0;
  
  const expiryDate = new Date(subscription.expiresAt);
  const now = new Date();
  const diffTime = expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * TASK 1: Single source of truth for subscription state
 * Returns unified subscription state object
 * 
 * @param {Object} user - User object from auth context
 * @returns {Promise<{isActive: boolean, expiresAt: string|null, daysLeft: number|null}>}
 */
export const getSubscriptionState = async (user) => {
  // Admin has perpetual access
  if (isAdmin(user)) {
    return {
      isActive: true,
      expiresAt: null, // Admin never expires
      daysLeft: null
    };
  }

  // Get subscription from backend (preferred) or localStorage (fallback)
  const subscription = await getSubscriptionStatus(user);
  
  // No subscription
  if (!subscription) {
    return {
      isActive: false,
      expiresAt: null,
      daysLeft: null
    };
  }

  // Handle missing expiresAt - treat as NOT subscribed
  if (!subscription.expiresAt && !subscription.expires_at) {
    return {
      isActive: false,
      expiresAt: null,
      daysLeft: null
    };
  }

  // Normalize expiresAt field (backend uses expires_at, frontend uses expiresAt)
  const expiresAt = subscription.expiresAt || subscription.expires_at;
  
  // Parse expiry date (handle both ISO strings and timestamps)
  let expiryDate;
  try {
    if (typeof expiresAt === 'string') {
      // Handle ISO string (with or without Z)
      expiryDate = new Date(expiresAt.replace('Z', '+00:00'));
    } else if (typeof expiresAt === 'number') {
      // Handle timestamp
      expiryDate = new Date(expiresAt);
    } else {
      // Invalid format
      return {
        isActive: false,
        expiresAt: null,
        daysLeft: null
      };
    }
  } catch (error) {
    console.error('Error parsing expiresAt:', error);
    return {
      isActive: false,
      expiresAt: null,
      daysLeft: null
    };
  }

  // Check if expired (using UTC to avoid timezone issues)
  const now = new Date();
  const isActive = expiryDate > now;
  
  // Calculate days left (only if active)
  let daysLeft = null;
  if (isActive) {
    const diffTime = expiryDate - now;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysLeft = Math.max(0, daysLeft); // Ensure non-negative
  }

  return {
    isActive,
    expiresAt: expiresAt, // Return original value
    daysLeft
  };
};

/**
 * Clear subscription (on logout or cancellation)
 */
export const clearSubscription = () => {
  localStorage.removeItem('subscription_status');
};
