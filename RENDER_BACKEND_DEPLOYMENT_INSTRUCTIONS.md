# 🚀 Render Backend Deployment Instructions

## ✅ Backend Changes Ready for Production

All backend code changes are complete and ready to deploy to Render. The following updates need to be deployed:

### 📦 Changes Made

1. **Payment Service (`backend/payments/service.py`)**
   - Added `subscriptions_collection` for MongoDB storage
   - Added `create_subscription()` method to create subscriptions linked to user email
   - Added `get_active_subscription()` method to check active subscriptions

2. **Payment API Routes (`backend/payments/api_routes.py`)**
   - Updated `/api/payments/verify` endpoint to create subscriptions after payment verification
   - Added `/api/payments/subscription/status` endpoint to check subscription status for logged-in users
   - Subscriptions are saved with: user_email, plan_id, expires_at, payment_id, order_id

3. **Admin User Script (`backend/scripts/create_admin_user.py`)**
   - Script to create/update admin user with email: `imajinkyajadhav@gmail.com`
   - Password: `,t$+.VNq6Tmk6+:`
   - Run this script after deployment to ensure admin account exists

### 🎯 Deployment Steps

#### Step 1: Sync Backend Repository (if using separate repo)

If your Render backend uses a separate repository (`byonco-fastapi-backend`), sync the changes:

```bash
# In the backend repository directory
git pull origin main  # Pull latest from main repo (if changes are there)
# OR manually copy the changed files:
# - backend/payments/service.py
# - backend/payments/api_routes.py
# - backend/scripts/create_admin_user.py
```

#### Step 2: Deploy on Render

1. **Go to Render Dashboard:**
   - Navigate to: https://dashboard.render.com
   - Click on `byonco-fastapi-backend` service

2. **Trigger Manual Deploy:**
   - Click on **"Manual Deploy"** button (or **"Events"** tab)
   - Click **"Deploy latest commit"**
   - Wait for deployment (3-5 minutes)

3. **Monitor Deployment:**
   - Watch the **"Logs"** tab during deployment
   - Look for: `Application startup complete`
   - Check for any import errors

#### Step 3: Verify Deployment

After deployment completes, test these endpoints:

1. **Subscription Status Endpoint:**
   ```
   GET https://byonco-fastapi-backend.onrender.com/api/payments/subscription/status
   Headers: Authorization: Bearer {your_jwt_token}
   ```
   **Expected:** `{"has_subscription": false, "subscription": null}` for new users

2. **Payment Verification (creates subscription):**
   ```
   POST https://byonco-fastapi-backend.onrender.com/api/payments/verify
   Body: {razorpay_order_id, razorpay_payment_id, razorpay_signature, amount}
   Headers: Authorization: Bearer {your_jwt_token}
   ```
   **Expected:** Returns subscription object in response

#### Step 4: Create Admin User (Optional)

Run the admin user creation script to ensure admin account exists:

**Option A: Run locally (if MongoDB connection works from local):**
```bash
cd backend
python scripts/create_admin_user.py
```

**Option B: Run via Render Shell (if available):**
- Go to Render Dashboard → Service → Shell
- Run: `python scripts/create_admin_user.py`

**Option C: Manually create admin user via API:**
- Use the registration endpoint with:
  - Email: `imajinkyajadhav@gmail.com`
  - Password: `,t$+.VNq6Tmk6+:`
  - Then manually mark as verified in MongoDB

### ✅ Verification Checklist

- [ ] Backend code deployed successfully
- [ ] No errors in Render logs
- [ ] `/api/payments/subscription/status` endpoint works
- [ ] Payment verification creates subscriptions in MongoDB
- [ ] Admin account exists with correct password
- [ ] Admin can login and has free access to all services
- [ ] Regular users can pay and get subscriptions saved

### 📝 MongoDB Collections

After deployment, you should see:
- `payments` collection (existing) - stores payment records
- `subscriptions` collection (new) - stores subscription records with:
  - `user_email`: User's email address
  - `plan_id`: "byonco-pro" or "hospital-saas"
  - `expires_at`: ISO timestamp when subscription expires
  - `active`: Boolean flag
  - `payment_id`: Razorpay payment ID
  - `order_id`: Razorpay order ID

### 🔧 Troubleshooting

**If subscription status endpoint returns 401:**
- Check JWT token is valid and included in Authorization header
- Verify token hasn't expired (7-day expiry)

**If payment verification doesn't create subscription:**
- Check MongoDB connection in Render
- Verify `subscriptions` collection exists
- Check logs for any errors during subscription creation

**If admin account doesn't work:**
- Run the `create_admin_user.py` script
- Verify email is exactly: `imajinkyajadhav@gmail.com` (lowercase)
- Check password is set correctly in MongoDB

---

## ✅ Frontend Already Deployed

Frontend changes are already pushed to Vercel and will auto-deploy. All subscription UI, profile badges, and payment gates are live.

## 🎉 Production Status

**Frontend (Vercel):** ✅ Deployed
**Backend (Render):** ⏳ Ready - Deploy when ready

Once backend is deployed, the complete subscription system will be fully operational!
