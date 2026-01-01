# Deployment: Razorpay Key Fix for "Subscribe Now" Button

## ✅ Changes Made

### Backend (`backend/payments/api_routes.py`)
- ✅ Added `/api/payments/razorpay/key` endpoint
- ✅ Returns `{ "keyId": "rzp_test_..." }` (public key only, safe to expose)
- ✅ Reads from `RAZORPAY_KEY_ID` environment variable

### Frontend (`src/utils/payments/razorpayClient.js`)
- ✅ Added `getRazorpayKeyId()` function that:
  - First checks `REACT_APP_RAZORPAY_KEY_ID` env var (fallback)
  - If not found, fetches from backend `/api/payments/razorpay/key`
- ✅ Updated `openCheckout()` to be async and fetch keyId before opening modal

## 🚀 Deployment Status

### Render (Backend) - Auto-Deploy
- ✅ Changes pushed to GitHub (`main` branch, commit `2944300`)
- ✅ Render should auto-deploy if connected to GitHub
- ✅ **Manual Deploy (if needed):**
  1. Go to https://dashboard.render.com
  2. Select `byonco-fastapi-backend` service
  3. Click "Manual Deploy" → "Deploy latest commit"
  4. Wait 3-5 minutes for deployment

### Vercel (Frontend) - Auto-Deploy
- ✅ Changes pushed to GitHub (`main` branch, commit `2944300`)
- ✅ Vercel should auto-deploy if connected to GitHub
- ✅ **Manual Deploy (if needed):**
  1. Go to https://vercel.com/dashboard
  2. Select `byonco` project
  3. Click "Redeploy" on latest deployment
  4. Wait 2-3 minutes for deployment

## ✅ Verification Steps

### 1. Verify Backend Endpoint (After Render Deploy)

Test in browser or curl:
```bash
curl https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/key
```

**Expected Response:**
```json
{
  "keyId": "rzp_test_..."
}
```

**If 404 or 500:**
- Check Render logs for deployment errors
- Verify `RAZORPAY_KEY_ID` is set in Render environment variables
- Ensure `razorpay_router` is included in `server.py`

### 2. Verify Frontend (After Vercel Deploy)

1. **Open Browser DevTools (F12) → Network tab**
2. **Navigate to:** https://www.byoncocare.com
3. **Click "Subscribe Now" button**
4. **Check Network tab for:**
   - ✅ Request to `/api/payments/razorpay/key` → Should return 200 with `{ "keyId": "..." }`
   - ✅ Request to `checkout.razorpay.com/v1/checkout.js` → Should load successfully
   - ✅ Razorpay Test Mode modal should open

**If "Razorpay key not configured" error:**
- Check browser console for error details
- Verify backend endpoint is accessible
- Check Network tab for failed requests

### 3. Test Payment Flow

1. **Razorpay modal opens** ✅
2. **Select test payment method** (UPI, Card, etc.)
3. **Use test credentials:**
   - **Card:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
   - **UPI:** success@razorpay
4. **Complete payment**
5. **Verify success callback fires**
6. **Check localStorage for subscription status**

## 🔍 Troubleshooting

### Backend Endpoint Not Working

**Check Render Environment Variables:**
- `RAZORPAY_KEY_ID` must be set (e.g., `rzp_test_...`)
- `RAZORPAY_KEY_SECRET` must be set (for payment verification)

**Check Render Logs:**
- Look for import errors
- Check if `razorpay_router` is registered
- Verify FastAPI startup completed successfully

**Verify Router Registration:**
```python
# In backend/server.py, should have:
payments_router, razorpay_router = create_payments_router(db)
app.include_router(payments_router)
app.include_router(razorpay_router)  # ← This must be present
```

### Frontend Not Fetching Key

**Check Vercel Environment Variables:**
- `REACT_APP_BACKEND_URL` should be set to `https://byonco-fastapi-backend.onrender.com`
- `REACT_APP_RAZORPAY_KEY_ID` is optional (will use backend if not set)

**Check Browser Console:**
- Look for CORS errors
- Check for network errors to `/api/payments/razorpay/key`
- Verify `vercel.json` proxy is working

**Verify Vercel Proxy:**
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://byonco-fastapi-backend.onrender.com/api/$1"
    }
  ]
}
```

### Razorpay Modal Not Opening

**Check:**
1. Razorpay SDK loaded? (check Network tab for `checkout.js`)
2. KeyId is valid? (should start with `rzp_test_` or `rzp_live_`)
3. Order created successfully? (check Network tab for `/api/payments/create-order`)
4. No JavaScript errors in console?

## 📋 Pre-Deployment Checklist

### Backend (Render)
- [x] Code committed to GitHub
- [x] `/api/payments/razorpay/key` endpoint added
- [x] `razorpay_router` included in `server.py`
- [ ] `RAZORPAY_KEY_ID` set in Render environment variables
- [ ] `RAZORPAY_KEY_SECRET` set in Render environment variables
- [ ] Render service connected to GitHub (auto-deploy enabled)

### Frontend (Vercel)
- [x] Code committed to GitHub
- [x] `razorpayClient.js` updated to fetch key from backend
- [x] `vercel.json` has API proxy configured
- [ ] Vercel project connected to GitHub (auto-deploy enabled)

## 🎯 Success Criteria

Deployment is successful when:
1. ✅ `GET /api/payments/razorpay/key` returns `{ "keyId": "rzp_test_..." }`
2. ✅ Clicking "Subscribe Now" opens Razorpay Test Mode modal
3. ✅ No "Razorpay key not configured" error
4. ✅ Test payment completes successfully
5. ✅ Subscription status stored in localStorage

## 📝 Next Steps

After deployment:
1. Test "Subscribe Now" button on production
2. Verify test payment flow end-to-end
3. Monitor Render logs for any errors
4. Monitor Vercel logs for any build errors
5. Test on mobile devices

---

**Last Updated:** After Razorpay key fix implementation
**Commit:** `2944300` - Fix ByOncoCare Subscribe Now: fetch Razorpay key from backend endpoint
**Status:** ✅ Ready for deployment

