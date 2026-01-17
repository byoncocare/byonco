// src/components/SubscriptionStatus.jsx
// Component to display subscription status

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionStatus, isSubscriptionActive, getDaysRemaining, isAdmin } from '@/utils/subscription';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function SubscriptionStatus({ className = "" }) {
  const { user } = useAuth();
  const subscription = getSubscriptionStatus();
  const admin = isAdmin(user);

  if (admin) {
    return (
      <Badge className={`bg-green-500/20 text-green-400 border-green-500/30 ${className}`}>
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Admin Access
      </Badge>
    );
  }

  if (!subscription) {
    return (
      <Badge className={`bg-gray-500/20 text-gray-400 border-gray-500/30 ${className}`}>
        <AlertCircle className="w-3 h-3 mr-1" />
        No Subscription
      </Badge>
    );
  }

  if (!isSubscriptionActive(subscription)) {
    return (
      <Badge className={`bg-red-500/20 text-red-400 border-red-500/30 ${className}`}>
        <AlertCircle className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }

  const daysRemaining = getDaysRemaining(subscription);

  return (
    <Badge className={`bg-purple-500/20 text-purple-400 border-purple-500/30 ${className}`}>
      <CheckCircle2 className="w-3 h-3 mr-1" />
      Active ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
    </Badge>
  );
}
