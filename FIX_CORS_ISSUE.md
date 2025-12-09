# Fix CORS Issue - Add Frontend URL to Backend Allowed Origins

## 🔴 Problem
The backend's `ALLOWED_ORIGINS` doesn't include `https://byonco.onrender.com`, causing CORS errors.

## ✅ Solution: Update Backend ALLOWED_ORIGINS

### Step 1: Go to Backend Service on Render
1. Open Render Dashboard: https://dashboard.render.com
2. Click on **`byonco-fastapi-backend`** service (the backend, not frontend)

### Step 2: Update ALLOWED_ORIGINS Environment Variable
1. Go to **"Environment"** tab (left sidebar under "MANAGE")
2. Find **`ALLOWED_ORIGINS`** in the environment variables list
3. Click the **pencil/edit icon** next to it
4. Update the value to include `https://byonco.onrender.com`:

**Current value:**
```
https://www.byoncocare.com,https://byoncocare.com,https://byonco-fastapi-backend.onrender.com,http://localhost:5173
```

**New value (add `https://byonco.onrender.com`):**
```
https://www.byoncocare.com,https://byoncocare.com,https://byonco.onrender.com,https://byonco-fastapi-backend.onrender.com,http://localhost:5173
```

**Or if you want to allow all Render preview URLs:**
```
https://www.byoncocare.com,https://byoncocare.com,https://byonco.onrender.com,https://*.onrender.com,https://byonco-fastapi-backend.onrender.com,http://localhost:5173
```

5. Click **"Save Changes"**

### Step 3: Backend Will Auto-Redeploy
- Render will automatically restart the backend service
- Wait 1-2 minutes for the service to restart

### Step 4: Test
1. Refresh your frontend page: `https://byonco.onrender.com/rare-cancers`
2. Check browser console (F12)
3. CORS errors should be gone
4. The page should load successfully

## Why This Happens
CORS (Cross-Origin Resource Sharing) requires the backend to explicitly allow requests from the frontend's domain. Since your frontend is at `https://byonco.onrender.com` but it wasn't in the allowed origins list, the browser blocked the requests.

## Alternative: Allow All Origins (Development Only)
If you want to allow all origins (NOT recommended for production):
```
*
```

But it's better to explicitly list allowed domains for security.




