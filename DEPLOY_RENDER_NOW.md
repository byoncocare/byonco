# Deploy Render Backend - Step by Step

## ✅ Code Status
- **Latest Commit:** `531fa99` - "Add Render deployment instructions for Razorpay key endpoint"
- **Endpoint:** `/api/payments/razorpay/key` is implemented and ready
- **Router:** Properly registered in `server.py`

## 🚀 Quick Deployment Steps

### Option 1: Via Render Dashboard (Recommended)

1. **Open Render Dashboard:**
   - Go to: https://dashboard.render.com
   - Sign in to your account

2. **Find Your Service:**
   - Look for service named: `byonco-fastapi-backend`
   - Or search for services connected to repo: `byoncocare/byonco-fastapi-backend`

3. **Trigger Manual Deploy:**
   - Click on the service
   - Click **"Manual Deploy"** button (usually in top right)
   - Select **"Deploy latest commit"**
   - Confirm deployment

4. **Monitor Deployment:**
   - Watch the **"Logs"** tab
   - Wait for: `Application startup complete`
   - Deployment takes 3-5 minutes

### Option 2: Via Render API (If you have API key)

If you have a Render API key, you can trigger deployment via API:

```bash
# Get your service ID from Render dashboard
# Then use this curl command:
curl -X POST "https://api.render.com/v1/services/{service_id}/deploys" \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": false}'
```

### Option 3: Push to Backend Repository (If separate repo)

If your backend is in a separate repository (`byonco-fastapi-backend`), you may need to:

1. **Check if backend code needs to be synced:**
   ```bash
   # Check if backend/ directory matches the backend repo
   git remote show render-backend
   ```

2. **If backend is in separate repo, sync the code:**
   - The backend code in `backend/` directory needs to be in the `byonco-fastapi-backend` repo
   - Push the latest `backend/payments/api_routes.py` changes to that repo
   - Render will auto-deploy if auto-deploy is enabled

## ✅ Verification After Deployment

Once deployment completes, test:

```bash
# Test direct backend
curl https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/key

# Test via Vercel proxy
curl https://www.byoncocare.com/api/payments/razorpay/key
```

**Expected Response:**
```json
{
  "keyId": "rzp_test_..."
}
```

## 🔍 Troubleshooting

### If deployment fails:
- Check Render logs for errors
- Verify `RAZORPAY_KEY_ID` is set in Render environment variables
- Check if all dependencies are installed

### If endpoint still 404:
- Verify the deployment commit matches `531fa99` or `2944300`
- Check Render logs for route registration
- Ensure `razorpay_router` is included in `server.py`

---

**Note:** I cannot directly access Render dashboard, so you'll need to trigger the deployment manually via the dashboard or API.

