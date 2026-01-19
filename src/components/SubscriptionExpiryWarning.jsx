// src/components/SubscriptionExpiryWarning.jsx
// TASK 4: Non-intrusive subscription expiry warnings

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionState, isAdmin } from '@/utils/subscription';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WARNING_STORAGE_KEY = 'subscription_warning_last_shown';
const WARNING_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function SubscriptionExpiryWarning() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [warning, setWarning] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkExpiry = async () => {
      // Only show for authenticated, non-admin users
      if (!isAuthenticated || !user || isAdmin(user)) {
        return;
      }

      try {
        const subscriptionState = await getSubscriptionState(user);

        // No subscription or expired - don't show warning (guard will handle redirect)
        if (!subscriptionState.isActive || subscriptionState.daysLeft === null) {
          return;
        }

        const daysLeft = subscriptionState.daysLeft;

        // Show warning if <= 7 days and > 0
        if (daysLeft > 0 && daysLeft <= 7) {
          // Check if we've shown this warning recently (once per day)
          const lastShown = localStorage.getItem(WARNING_STORAGE_KEY);
          const now = Date.now();

          if (lastShown) {
            const lastShownTime = parseInt(lastShown, 10);
            const timeSinceLastShown = now - lastShownTime;

            // If shown within cooldown period, don't show again
            if (timeSinceLastShown < WARNING_COOLDOWN_MS) {
              return;
            }
          }

          // Show warning
          setWarning({
            daysLeft,
            message: `Your subscription expires in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}. Renew to keep access.`
          });

          // Mark as shown
          localStorage.setItem(WARNING_STORAGE_KEY, now.toString());
        }
      } catch (error) {
        console.error('Error checking subscription expiry:', error);
      }
    };

    checkExpiry();
  }, [user, isAuthenticated]);

  const handleDismiss = () => {
    setDismissed(true);
    setWarning(null);
  };

  const handleRenew = () => {
    const returnUrl = window.location.pathname + window.location.search;
    navigate(`/get-started?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  if (!warning || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/95 border-b border-yellow-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-900" />
          <p className="text-sm font-medium text-yellow-900">
            {warning.message}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRenew}
            size="sm"
            className="bg-yellow-700 hover:bg-yellow-800 text-white h-8 px-4 text-xs"
          >
            Renew Now
          </Button>
          <button
            onClick={handleDismiss}
            className="text-yellow-900 hover:text-yellow-950 p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
