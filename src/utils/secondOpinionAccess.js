/**
 * Second Opinion Access Control Utility
 * Manages daily limits and payment entitlements for Second Opinion feature
 */

const USAGE_STORAGE_KEY = 'byonco_second_opinion_usage_v1';
const ENTITLEMENT_STORAGE_KEY = 'byonco_second_opinion_entitlement_v1';

// Free user limits
const FREE_QUESTIONS_PER_DAY = 2;
const FREE_ATTACHMENTS_PER_DAY = 1; // Combined: 1 file OR 1 image

/**
 * Get today's date key in YYYY-MM-DD format (user's local timezone)
 */
export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current usage data
 */
export function getUsage() {
  try {
    const stored = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!stored) {
      return {
        dateKey: getTodayKey(),
        questionsUsed: 0,
        attachmentUsed: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    const parsed = JSON.parse(stored);
    return {
      dateKey: parsed.dateKey || getTodayKey(),
      questionsUsed: parsed.questionsUsed || 0,
      attachmentUsed: parsed.attachmentUsed || 0,
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch (e) {
    console.error('Error reading usage data:', e);
    return {
      dateKey: getTodayKey(),
      questionsUsed: 0,
      attachmentUsed: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Save usage data
 */
function saveUsage(usage) {
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify({
      ...usage,
      lastUpdated: new Date().toISOString()
    }));
  } catch (e) {
    console.error('Error saving usage data:', e);
  }
}

/**
 * Reset usage if it's a new day
 */
export function resetIfNewDay() {
  const usage = getUsage();
  const today = getTodayKey();
  
  if (usage.dateKey !== today) {
    saveUsage({
      dateKey: today,
      questionsUsed: 0,
      attachmentUsed: 0
    });
    return true; // Was reset
  }
  return false; // Not reset
}

/**
 * Check if user can ask a question
 */
export function canAskQuestion() {
  resetIfNewDay();
  const usage = getUsage();
  return usage.questionsUsed < FREE_QUESTIONS_PER_DAY;
}

/**
 * Check if user can attach a file/image
 */
export function canAttach() {
  resetIfNewDay();
  const usage = getUsage();
  return usage.attachmentUsed < FREE_ATTACHMENTS_PER_DAY;
}

/**
 * Record that a question was used
 */
export function recordQuestionUsed() {
  resetIfNewDay();
  const usage = getUsage();
  saveUsage({
    ...usage,
    questionsUsed: usage.questionsUsed + 1
  });
}

/**
 * Record that an attachment was used
 */
export function recordAttachmentUsed() {
  resetIfNewDay();
  const usage = getUsage();
  saveUsage({
    ...usage,
    attachmentUsed: usage.attachmentUsed + 1
  });
}

/**
 * Get entitlement data
 */
export function getEntitlement() {
  try {
    const stored = localStorage.getItem(ENTITLEMENT_STORAGE_KEY);
    if (!stored) {
      return {
        active: false,
        activatedAt: null,
        source: null,
        entitlementId: null
      };
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading entitlement data:', e);
    return {
      active: false,
      activatedAt: null,
      source: null,
      entitlementId: null
    };
  }
}

/**
 * Set entitlement as active
 */
export function setEntitlementActive(source = 'razorpay', entitlementId = null) {
  try {
    const entitlement = {
      active: true,
      activatedAt: new Date().toISOString(),
      source,
      entitlementId
    };
    localStorage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(entitlement));
    return entitlement;
  } catch (e) {
    console.error('Error setting entitlement:', e);
    return null;
  }
}

/**
 * Check if user has active entitlement
 */
export function hasEntitlement() {
  const entitlement = getEntitlement();
  return entitlement.active === true;
}

/**
 * Clear entitlement (for testing/logout)
 */
export function clearEntitlement() {
  try {
    localStorage.removeItem(ENTITLEMENT_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing entitlement:', e);
  }
}

