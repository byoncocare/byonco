# Stack Auth User Access & Subscription Flow

## Overview

New users who sign in with Stack Auth (Google OAuth) can access services according to our payment architecture:

- **Free Services:** Second Opinion (always accessible)
- **Paid Services:** Find Hospitals, Cost Calculator, Rare Cancers, Teleconsultation, AI Medical Tourism
- **Payment Required:** Users must subscribe (₹99/week) to access paid services

## How It Works

### 1. User Signs In with Google OAuth

1. User clicks "Sign in with Google" on `/authentication`
2. OAuth flow completes → User is logged in via Stack Auth
3. `AuthContext` syncs Stack Auth user with our system
4. User is redirected to home page or original destination

### 2. Access Control Flow

**Stack Auth users are integrated with our subscription system:**

- Stack Auth user data is synced to `AuthContext`
- Subscription status is stored in `localStorage` (works with any auth provider)
- `PaymentGate` component checks:
  1. Is user admin? → Free access
  2. Does user have active subscription? → Allow access
  3. Is user authenticated? → Show payment prompt
  4. Not authenticated? → Redirect to login

### 3. Subscription Purchase Flow

When a Stack Auth user tries to access a paid service:

1. **PaymentGate** checks subscription status
2. If no subscription → Shows payment prompt with subscription details
3. User clicks "Subscribe Now" → Razorpay payment gateway opens
4. After successful payment → Subscription saved to `localStorage`
5. User gets access to all paid services for 7 days (₹99/week plan)

### 4. Service Access After Payment

Once payment is complete:

- Subscription saved to `localStorage` with expiry date
- `hasPaidAccess()` function returns `{ hasAccess: true }`
- User can access:
  - ✅ Find Hospitals
  - ✅ Cost Calculator
  - ✅ Rare Cancers
  - ✅ Teleconsultation
  - ✅ AI Medical Tourism (Journey Builder)
- Access lasts for 7 days (subscription period)

## Technical Details

### AuthContext Integration

`src/contexts/AuthContext.jsx` handles Stack Auth users:

```javascript
// Stack Auth user is synced to our context
const stackUser = useUser(); // From Stack Auth
if (stackUser) {
  // Convert Stack Auth user to our format
  const userData = {
    id: stackUser.id,
    email: stackUser.primaryEmail,
    full_name: stackUser.displayName,
    // ... other fields
  };
  setUser(userData);
  setIsAuthenticated(true);
}
```

### Subscription System

`src/utils/subscription.js` manages subscriptions:

- **Storage:** `localStorage.getItem('subscription_status')`
- **Compatible:** Works with any auth provider (Stack Auth, email/password, etc.)
- **Check:** `hasPaidAccess(user)` returns access status
- **Admin Bypass:** `imajinkyajadhav@gmail.com` has free access

### PaymentGate Component

`src/components/PaymentGate.jsx` enforces access control:

```javascript
// Wraps paid service routes
<PaymentGate serviceName="Find Hospitals">
  <FindHospitalsPage />
</PaymentGate>
```

**Access Logic:**
1. Admin? → Allow
2. Active subscription? → Allow
3. Authenticated? → Show payment prompt
4. Not authenticated? → Redirect to login

## User Journey Examples

### Example 1: New User (Free Service)

1. User signs in with Google
2. User navigates to `/second-opinion`
3. ✅ **Access granted** (free service, no payment required)

### Example 2: New User (Paid Service)

1. User signs in with Google
2. User navigates to `/find-hospitals`
3. ❌ **Payment required** → Payment prompt shown
4. User clicks "Subscribe Now" → Razorpay opens
5. User completes payment
6. ✅ **Access granted** → Can use Find Hospitals for 7 days

### Example 3: Returning User (Active Subscription)

1. User signs in with Google
2. User has active subscription (not expired)
3. User navigates to `/cost-calculator`
4. ✅ **Access granted** (subscription active)

### Example 4: Returning User (Expired Subscription)

1. User signs in with Google
2. User's subscription expired
3. User navigates to `/rare-cancers`
4. ❌ **Payment required** → Payment prompt shown (with "expired" message)
5. User renews subscription
6. ✅ **Access granted**

## Admin Access

Admin users (configured in `src/utils/subscription.js`) have free access:

- `imajinkyajadhav@gmail.com` → Free access to all services
- No payment required
- Bypasses all payment gates

## Important Notes

1. **Subscription is per-device:** Stored in `localStorage`, so it's tied to the browser/device
2. **Subscription persists across logins:** Once paid, user has access even after logout/login
3. **Stack Auth compatible:** Subscription system works independently of auth provider
4. **7-day subscription:** ₹99/week plan gives 7 days of access
5. **Second Opinion is always free:** No payment required

## Troubleshooting

### User can't access services after payment

1. Check `localStorage.getItem('subscription_status')` in browser console
2. Verify subscription has `expiresAt` in the future
3. Check `hasPaidAccess(user)` returns `{ hasAccess: true }`
4. Verify user email matches (case-insensitive)

### User sees payment prompt even after payment

1. Clear browser cache and localStorage
2. Re-subscribe (payment will be processed again)
3. Check browser console for errors
4. Verify Razorpay payment was successful

### OAuth callback not working

1. Check `/handler/oauth-callback` route exists in `src/App.js`
2. Verify Stack Auth trusted domains are configured
3. Check browser console for Stack Auth errors
4. Verify environment variables are set in Vercel

## Summary

✅ **Stack Auth users can:**
- Sign in with Google OAuth
- Access free services (Second Opinion) immediately
- Purchase subscription to access paid services
- Use all services for 7 days after payment

✅ **Subscription system:**
- Works with Stack Auth users
- Uses localStorage (device-specific)
- Persists across logins
- Admin bypass available

✅ **Payment flow:**
- Razorpay integration
- ₹99/week subscription
- 7-day access period
- Automatic access after payment
