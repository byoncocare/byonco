// src/utils/apiErrorHandler.js
// Handle API errors, especially SUBSCRIPTION_REQUIRED (402)

import { toast } from '@/hooks/use-toast';

/**
 * Handle API error response, especially subscription-related errors
 * @param {Response} response - Fetch response object
 * @param {Function} navigate - React Router navigate function
 * @returns {Promise<{handled: boolean, error: any}>}
 */
export async function handleApiError(response, navigate) {
  const status = response.status;
  const errorBody = await response.json().catch(() => ({}));

  // Handle subscription required (402)
  if (status === 402 || (errorBody.code === 'SUBSCRIPTION_REQUIRED')) {
    const returnUrl = window.location.pathname + window.location.search;
    
    toast({
      variant: "error",
      title: "Subscription Required",
      description: errorBody.message || errorBody.detail || "Active subscription required to access this feature",
    });

    // Redirect to paywall with returnUrl
    if (navigate) {
      navigate(`/get-started?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      window.location.href = `/get-started?returnUrl=${encodeURIComponent(returnUrl)}`;
    }

    return { handled: true, error: errorBody };
  }

  // Handle unauthorized (401)
  if (status === 401) {
    const returnUrl = window.location.pathname + window.location.search;
    
    toast({
      variant: "error",
      title: "Authentication Required",
      description: "Please log in to access this feature",
    });

    if (navigate) {
      navigate(`/authentication?redirect=${encodeURIComponent(returnUrl)}`);
    } else {
      window.location.href = `/authentication?redirect=${encodeURIComponent(returnUrl)}`;
    }

    return { handled: true, error: errorBody };
  }

  // Other errors - return for component to handle
  return { handled: false, error: errorBody };
}
