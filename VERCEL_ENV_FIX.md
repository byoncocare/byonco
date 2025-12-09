# Fix Vercel Environment Variable - CRITICAL

## ⚠️ Problem
Your Vercel deployment has `REACT_APP_BACKEND_URL=http://localhost:8000` set, which overrides the code default.

## ✅ Solution: Update Vercel Environment Variable

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Login to your account
3. Find your project: **`byonco`** or **`byonco-cares-projects`**

### Step 2: Navigate to Environment Variables
1. Click on your project
2. Go to **"Settings"** tab (top navigation)
3. Click **"Environment Variables"** in the left sidebar

### Step 3: Find and Update REACT_APP_BACKEND_URL
1. Look for `REACT_APP_BACKEND_URL` in the list
2. **If it exists:**
   - Click the **pencil/edit icon** next to it
   - Change the value from `http://localhost:8000` to:
     ```
     https://byonco-fastapi-backend.onrender.com
     ```
   - Make sure it's set for **Production**, **Preview**, and **Development** environments
   - Click **"Save"**

3. **If it doesn't exist:**
   - Click **"Add New"** button
   - Key: `REACT_APP_BACKEND_URL`
   - Value: `https://byonco-fastapi-backend.onrender.com`
   - Select all environments: **Production**, **Preview**, **Development**
   - Click **"Save"**

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (⋯)** menu
4. Select **"Redeploy"**
5. Or push a new commit to trigger auto-deploy

### Step 5: Verify
1. After redeploy, open your Vercel URL
2. Open browser console (F12)
3. You should see:
   ```
   🔗 Backend URL configured as: https://byonco-fastapi-backend.onrender.com
   ```
4. The page should now connect successfully

## Alternative: Quick Fix via Vercel CLI

If you have Vercel CLI installed:
```bash
vercel env add REACT_APP_BACKEND_URL production
# When prompted, enter: https://byonco-fastapi-backend.onrender.com

vercel env add REACT_APP_BACKEND_URL preview
# When prompted, enter: https://byonco-fastapi-backend.onrender.com

vercel env add REACT_APP_BACKEND_URL development
# When prompted, enter: https://byonco-fastapi-backend.onrender.com

# Then redeploy
vercel --prod
```

## Important Notes
- Environment variables are **baked into the build** at build time
- You MUST redeploy after changing environment variables
- The change takes effect on the NEXT deployment, not immediately
- Make sure to set it for ALL environments (Production, Preview, Development)




