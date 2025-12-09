# How to Find and Update REACT_APP_BACKEND_URL in Render

## ⚠️ Important: You Need the FRONTEND Service, Not Backend!

You're currently looking at:
- ❌ **Backend Service**: `byonco-fastapi-backend` (Python 3)
- ✅ **Frontend Service**: `byonco` (Node.js) ← **YOU NEED THIS ONE!**

## Step-by-Step Instructions

### Step 1: Go to the Frontend Service
1. In Render Dashboard, look at the **left sidebar**
2. At the top, you should see **"My Workspace"** or **"Dashboard"**
3. Look for a service called **`byonco`** (NOT `byonco-fastapi-backend`)
4. Click on **`byonco`** service

### Step 2: Navigate to Environment Settings
1. Once you're in the **`byonco`** service dashboard
2. In the left sidebar, look for **"MANAGE"** section
3. Click on **"Environment"** (it should be highlighted in purple when selected)

### Step 3: Check for REACT_APP_BACKEND_URL
1. You should see a section called **"Environment Variables"**
2. Look for a variable named **`REACT_APP_BACKEND_URL`**
3. **If it exists:**
   - Click the **eye icon** to see its value
   - If it says `http://localhost:8000`, click **Edit** and change it to: `https://byonco-fastapi-backend.onrender.com`
4. **If it doesn't exist:**
   - Click **"+ Add"** or **"+ Add Environment Variable"**
   - Key: `REACT_APP_BACKEND_URL`
   - Value: `https://byonco-fastapi-backend.onrender.com`
   - Click **"Save"**

### Step 4: Save and Redeploy
1. After adding/updating the variable, click **"Save, rebuild, and deploy"** button
2. Wait for the build to complete (3-5 minutes)
3. The service will automatically redeploy with the new environment variable

## Visual Guide

**What you're currently seeing:**
```
byonco-fastapi-backend (Python 3) ← Backend service
├── Environment Variables:
    ├── ALLOW_DEV_TOKEN
    ├── ALLOWED_ORIGINS
    └── ... (backend variables)
```

**What you need to find:**
```
byonco (Node.js) ← Frontend service
├── Environment Variables:
    ├── REACT_APP_BACKEND_URL ← THIS IS WHAT YOU NEED!
    └── ... (other frontend variables)
```

## Alternative: If You Can't Find the Frontend Service

1. Go to Render Dashboard main page: https://dashboard.render.com
2. Look for **"Ungrouped Services"** section
3. Find the service with:
   - Name: `byonco`
   - Runtime: `Node` (not Python)
   - URL: `https://byonco.onrender.com`
4. Click on that service
5. Then follow Step 2 above

## Quick Check: Which Service Am I On?

Look at the **top of the page**:
- If it says **"byonco-fastapi-backend"** → You're on the backend (wrong one)
- If it says **"byonco"** → You're on the frontend (correct one)

Also check the **live URL**:
- Backend: `https://byonco-fastapi-backend.onrender.com`
- Frontend: `https://byonco.onrender.com`




