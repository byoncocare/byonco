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
 * Get subscription status from localStorage
 */
export const getSubscriptionStatus = () => {
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
 * Save subscription after payment
 */
export const saveSubscription = (planId, paymentId, orderId) => {
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
export const hasPaidAccess = (user) => {
  // Admin has free access
  if (isAdmin(user)) {
    return { hasAccess: true, reason: 'admin' };
  }
  
  // Check subscription
  const subscription = getSubscriptionStatus();
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
 * Clear subscription (on logout or cancellation)
 */
export const clearSubscription = () => {
  localStorage.removeItem('subscription_status');
};
