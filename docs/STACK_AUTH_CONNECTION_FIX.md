# Stack Auth Connection Error - Fix Guide

## Error Message
```
Stack Auth is unable to connect to the server. Please check your internet connection and try again.
TypeError: Failed to fetch
```

## Root Cause
Stack Auth cannot connect to its backend API. This is typically due to:
1. **Missing Trusted Domain** - `localhost:3000` not added in Stack Auth dashboard
2. **CORS Issues** - Domain not whitelisted
3. **Network/Firewall** - Blocking requests to Stack Auth API
4. **Invalid API Keys** - Project ID or keys don't match

## ✅ Solution Steps

### Step 1: Add Trusted Domains in Stack Auth Dashboard

1. **Go to Stack Auth Dashboard:**
   - Visit: https://stack-auth.com/dashboard
   - Login with your Stack Auth account

2. **Navigate to Settings:**
   - Click on your project: `5a629032-2f33-46db-ac2c-134894a117eb`
   - Go to **Settings** → **Trusted Domains**

3. **Add Domains:**
   - Click **Add Domain**
   - Add: `localhost:3000` (for development)
   - Add: `www.byoncocare.com` (for production)
   - Add: `byoncocare.com` (for production)
   - Save changes

### Step 2: Verify API Keys

**Current Configuration:**
- **Project ID:** `5a629032-2f33-46db-ac2c-134894a117eb`
- **Publishable Client Key:** `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg`

**Verify in Dashboard:**
1. Go to Stack Auth Dashboard → Your Project
2. Navigate to **API Keys** section
3. Verify:
   - Project ID matches: `5a629032-2f33-46db-ac2c-134894a117eb`
   - Publishable Client Key matches: `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg`

### Step 3: Check Network Connectivity

**In Browser DevTools:**
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests to Stack Auth API
5. Check:
   - **Status Code:** 401, 403, 404, or CORS error?
   - **Request URL:** What endpoint is failing?
   - **Response:** What error message?

**Common Network Issues:**
- **CORS Error:** Domain not in trusted domains list
- **401 Unauthorized:** Invalid API keys
- **404 Not Found:** Wrong project ID
- **Failed to Fetch:** Network/firewall blocking

### Step 4: Test Connection

**After adding trusted domains:**
1. Clear browser cache
2. Restart development server:
   ```bash
   npm start
   ```
3. Visit: `http://localhost:3000/authentication`
4. Check browser console for errors
5. Check Network tab for successful API calls

## 🔧 Alternative: Use Environment Variables

If you want to use environment variables instead of hardcoded keys:

1. **Create `.env` file in project root:**
   ```env
   REACT_APP_STACK_PROJECT_ID=5a629032-2f33-46db-ac2c-134894a117eb
   REACT_APP_STACK_PUBLISHABLE_KEY=pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg
   ```

2. **Restart dev server** after adding `.env` file

3. **Verify keys are loaded:**
   - Check browser console
   - Stack Auth should connect successfully

## 🚨 Still Not Working?

### Check Stack Auth Service Status
- Visit: https://status.stack-auth.com
- Check if Stack Auth services are operational

### Verify Project Status
1. Go to Stack Auth Dashboard
2. Check project status
3. Verify project is active (not suspended/disabled)

### Contact Stack Auth Support
If all above steps fail:
1. Go to Stack Auth Dashboard → Support
2. Provide:
   - Project ID: `5a629032-2f33-46db-ac2c-134894a117eb`
   - Error message from browser console
   - Network request details from DevTools

## ✅ Success Indicators

**When Stack Auth is working correctly:**
- ✅ No connection errors in console
- ✅ Sign In/Sign Up forms load properly
- ✅ Network tab shows successful API calls to Stack Auth
- ✅ OAuth buttons appear (if enabled)
- ✅ "Forgot password?" link works

## 📝 Notes

- **Development:** `localhost:3000` must be in trusted domains
- **Production:** Production domain must be in trusted domains
- **HTTPS:** Production requires HTTPS (Stack Auth enforces this)
- **API Keys:** Never commit secret server key to frontend code

---

**Last Updated:** 2026-01-15
**Status:** Connection error handling added to AuthPage.jsx
