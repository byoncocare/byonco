// src/utils/security/cspNonce.js
// Generate and manage CSP nonces for inline scripts

/**
 * Generate a random nonce for CSP
 */
export const generateNonce = () => {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for older browsers
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Get or create nonce for current page
 * Stores in sessionStorage to persist across page loads
 */
export const getNonce = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let nonce = sessionStorage.getItem('csp_nonce');
    if (!nonce) {
      nonce = generateNonce();
      sessionStorage.setItem('csp_nonce', nonce);
    }
    return nonce;
  } catch (e) {
    // If sessionStorage fails, generate a new nonce each time
    return generateNonce();
  }
};

/**
 * Set nonce on script tag
 */
export const setScriptNonce = (scriptElement) => {
  const nonce = getNonce();
  if (nonce && scriptElement) {
    scriptElement.setAttribute('nonce', nonce);
  }
};
