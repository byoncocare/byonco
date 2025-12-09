# Render Environment Variable Setup Guide

## Problem
The frontend is still connecting to `localhost:8000` because the environment variable `REACT_APP_BACKEND_URL` is set incorrectly in the Render dashboard.

## Solution: Update Environment Variable in Render

### Step 1: Go to Frontend Service Dashboard
1. Open [Render Dashboard](https://dashboard.render.com)
2. Click on the **`byonco`** service (the frontend Node.js service, NOT the backend)

### Step 2: Navigate to Environment Settings
1. In the left sidebar, click **"Environment"** (under "MANAGE" section)
2. Or go to **"Settings"** → **"Environment"**

### Step 3: Update REACT_APP_BACKEND_URL
1. Look for the environment variable `REACT_APP_BACKEND_URL`
2. **If it exists and is set to `http://localhost:8000`:**
   - Click **"Edit"** button
   - Change the value to: `https://byonco-fastapi-backend.onrender.com`
   - Click **"Save Changes"**

3. **If it doesn't exist:**
   - Click **"+ Add Environment Variable"** or **"Create environment group"**
   - Key: `REACT_APP_BACKEND_URL`
   - Value: `https://byonco-fastapi-backend.onrender.com`
   - Click **"Save Changes"**

### Step 4: Clear Build Cache and Redeploy
1. Go to **"Manual Deploy"** dropdown
2. Select **"Clear build cache & deploy"**
3. Wait for the build to complete (usually 3-5 minutes)

### Step 5: Verify
1. After deployment, open your site: `https://byonco.onrender.com`
2. Open browser console (F12)
3. You should see logs showing: `🔗 Backend URL configured as: https://byonco-fastapi-backend.onrender.com`
4. The page should now connect to the backend successfully

## Backend Service Info
- **Backend URL**: `https://byonco-fastapi-backend.onrender.com`
- **Frontend URL**: `https://byonco.onrender.com`
- **Backend Status**: Free tier (may sleep after inactivity)

## Important Notes
- React environment variables are **baked into the build** at build time
- You MUST rebuild after changing environment variables
- The backend may take 30-60 seconds to wake up if it's been sleeping (free tier)

## Troubleshooting
If still seeing `localhost:8000`:
1. Check browser console for the actual URL being used
2. Verify the environment variable is saved correctly in Render
3. Make sure you cleared the build cache before redeploying
4. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)




