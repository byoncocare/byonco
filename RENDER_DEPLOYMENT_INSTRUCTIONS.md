# Render Deployment Instructions - Razorpay Key Endpoint

## ✅ Code Status

The endpoint `/api/payments/razorpay/key` is **already implemented** in the codebase:

- **File:** `backend/payments/api_routes.py`
- **Line:** 269-278
- **Route:** `GET /api/payments/razorpay/key`
- **Router:** `razorpay_router` (prefix: `/api/payments/razorpay`)
- **Registered in:** `backend/server.py` line 806

## 🔍 Verification

The endpoint exists in the code and is properly registered. The 404 error indicates Render is running **old code** that doesn't include this endpoint.

## 🚀 Manual Deployment Steps

### Step 1: Go to Render Dashboard
1. Navigate to: https://dashboard.render.com
2. Sign in to your account
3. Find the service: `byonco-fastapi-backend`

### Step 2: Trigger Manual Deploy
1. Click on the `byonco-fastapi-backend` service
2. Go to the **"Events"** tab (or look for **"Manual Deploy"** button)
3. Click **"Deploy latest commit"** or **"Manual Deploy"**
4. Select the latest commit: `0ae2c47` or `2944300`
5. Click **"Deploy"**

### Step 3: Monitor Deployment
1. Watch the **"Logs"** tab during deployment
2. Look for:
   - ✅ `Application startup complete`
   - ✅ No import errors
   - ✅ FastAPI routes registered

### Step 4: Verify Deployment

After deployment completes (3-5 minutes), test the endpoint:

**Direct Backend URL:**
```bash
curl https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/key
```

**Expected Response:**
```json
{
  "keyId": "rzp_test_..."
}
```

**Via Vercel Proxy:**
```bash
curl https://www.byoncocare.com/api/payments/razorpay/key
```

**Expected Response:** Same JSON as above

## 🔧 Troubleshooting

### If endpoint still returns 404:

1. **Check Render Logs:**
   - Look for import errors
   - Check if `razorpay_router` is being registered
   - Verify FastAPI startup completed

2. **Verify Code is Deployed:**
   - Check Render deployment commit hash matches `0ae2c47` or `2944300`
   - Verify `backend/payments/api_routes.py` contains the `/key` endpoint

3. **Check Environment Variables:**
   - `RAZORPAY_KEY_ID` must be set in Render
   - If missing, endpoint will return 500 (not 404)

4. **Verify Router Registration:**
   - In `backend/server.py`, ensure:
     ```python
     payments_router, razorpay_router = create_payments_router(db)
     app.include_router(payments_router)
     app.include_router(razorpay_router)  # ← Must be present
     ```

### If endpoint returns 500:

- Check `RAZORPAY_KEY_ID` is set in Render environment variables
- Check Render logs for error details

## ✅ Success Criteria

Deployment is successful when:
1. ✅ `GET /api/payments/razorpay/key` returns `{ "keyId": "rzp_test_..." }`
2. ✅ No 404 errors
3. ✅ Frontend "Subscribe Now" button opens Razorpay modal

---

**Last Updated:** After verifying endpoint exists in code
**Status:** ✅ Code ready, waiting for Render deployment
