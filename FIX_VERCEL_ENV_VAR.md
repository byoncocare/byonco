# Fix Vercel Environment Variable Error

## Issue
Error: `Environment Variable "REACT_APP_BACKEND_URL" references Secret "react_app_backend_url", which does not exist.`

## Solution: Set Environment Variable Directly

### Step 1: Go to Vercel Settings
1. In Vercel dashboard, click **"Settings"** tab
2. Click **"Environment Variables"** (left sidebar)

### Step 2: Fix REACT_APP_BACKEND_URL

**Option A: Update Existing Variable**
1. Find `REACT_APP_BACKEND_URL` in the list
2. Click the **three dots (⋯)** → **"Edit"**
3. Change from **"Secret"** to **"Value"**
4. Enter value: `https://byonco-fastapi-backend.onrender.com`
5. Select environments: **Production**, **Preview**, **Development** (all three)
6. Click **"Save"**

**Option B: Delete and Recreate**
1. Find `REACT_APP_BACKEND_URL`
2. Click **three dots (⋯)** → **"Delete"**
3. Click **"Add New"**
4. Enter:
   ```
   Name: REACT_APP_BACKEND_URL
   Value: https://byonco-fastapi-backend.onrender.com
   ```
5. Select environments: **Production**, **Preview**, **Development**
6. Click **"Save"**

### Step 3: Redeploy

After fixing the variable:
1. Go to **"Deployments"** tab
2. Click **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. OR: Make a small commit and push (triggers auto-deploy)

### Step 4: Verify

After redeploy, check:
- Deployment status: Should be "Ready" (not "Error")
- Checkout page: Should connect to backend correctly

## Alternative: If You Want to Use Secrets

If you prefer using Vercel Secrets:
1. Go to **Settings** → **Secrets**
2. Click **"Add New Secret"**
3. Name: `react_app_backend_url`
4. Value: `https://byonco-fastapi-backend.onrender.com`
5. Then the environment variable reference will work

## Recommended: Use Direct Value

For this use case, **direct value is simpler** - just set:
```
REACT_APP_BACKEND_URL = https://byonco-fastapi-backend.onrender.com
```


