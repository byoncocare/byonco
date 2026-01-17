# Payment Flow - Step by Step

## Current Flow When Clicking "Get Started"

### Scenario 1: User NOT Logged In

```
User clicks "Get Started" on service
    ↓
ProtectedRoute checks authentication
    ↓
NOT authenticated → Redirects to /auth (Login page)
    ↓
User logs in / signs up
    ↓
ProtectedRoute checks profile completion
    ↓
Profile incomplete → Redirects to /profile
    ↓
User completes profile
    ↓
PaymentGate checks subscription
    ↓
NO subscription → Shows Payment Gate (Razorpay)
    ↓
User pays ₹99/week
    ↓
Subscription saved → Access granted
```

### Scenario 2: User IS Logged In (No Subscription)

```
User clicks "Get Started" on service
    ↓
ProtectedRoute checks authentication
    ↓
✅ Authenticated → Continue
    ↓
ProtectedRoute checks profile
    ↓
✅ Profile complete → Continue
    ↓
PaymentGate checks subscription
    ↓
NO subscription → Shows Payment Gate (Razorpay)
    ↓
User pays ₹99/week
    ↓
Subscription saved → Access granted
```

### Scenario 3: User IS Logged In (Has Active Subscription)

```
User clicks "Get Started" on service
    ↓
ProtectedRoute checks authentication
    ↓
✅ Authenticated → Continue
    ↓
ProtectedRoute checks profile
    ↓
✅ Profile complete → Continue
    ↓
PaymentGate checks subscription
    ↓
✅ Active subscription → Access granted immediately
```

### Scenario 4: Admin User

```
User clicks "Get Started" on service
    ↓
ProtectedRoute checks authentication
    ↓
✅ Authenticated → Continue
    ↓
ProtectedRoute checks profile
    ↓
✅ Profile complete → Continue
    ↓
PaymentGate checks if admin
    ↓
✅ Admin → Access granted immediately (FREE)
```

---

## Answer to Your Question

**When you click "Get Started" on any paid service:**

1. **First**: Login/Signup (if not logged in)
2. **Second**: Complete Profile (if profile incomplete)
3. **Third**: Payment Gate (Razorpay) - if no subscription
4. **Finally**: Access to service

**Order: Login → Profile → Payment → Access**

---

## Services Flow

### Paid Services (Require Payment):
- Find Hospitals
- Cost Calculator
- Rare Cancers
- Teleconsultation
- AI Medical Tourism

### Free Service:
- Second Opinion (No payment required, but may need login)

---

## Quick Reference

| User State | What Happens |
|------------|--------------|
| Not logged in | → Redirect to `/auth` (Login) |
| Logged in, profile incomplete | → Redirect to `/profile` |
| Logged in, no subscription | → Show Payment Gate (Razorpay) |
| Logged in, active subscription | → Access granted |
| Admin user | → Access granted (FREE) |

---

**Current Implementation: Login FIRST, then Payment Gate**
