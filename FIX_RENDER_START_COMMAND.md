# 🔧 Fix Render Start Command

## 🔴 Current Issue

Your Render **Start Command** is:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

This is pointing to `app.main:app` which doesn't exist. That's why Render is running the old GPT-only backend.

## ✅ Fix

### Step 1: Update Start Command

1. In the Render dashboard, click **"Edit"** next to the **Start Command** field
2. Change it from:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
   To:
   ```
   uvicorn backend.server:app --host 0.0.0.0 --port $PORT
   ```
3. Click **"Save Changes"**

### Step 2: Verify Build Command

Your **Build Command** looks correct:
```
pip install -r requirements.txt
```

Make sure `requirements.txt` is in the root directory, or update it to:
```
pip install -r backend/requirements.txt
```
(if requirements.txt is in the backend folder)

### Step 3: Redeploy

After saving:
1. Go to **"Events"** tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 3-5 minutes

### Step 4: Verify

After deployment, check:
```
https://byonco-fastapi-backend.onrender.com/docs
```

You should now see:
- ✅ `GET /api/rare-cancers`
- ✅ `GET /api/rare-cancers/{cancer_name}`
- ✅ `GET /api/hospitals`
- ✅ `GET /api/cancer-types`
- ✅ All other endpoints

## 🎯 Summary

**Current:** `uvicorn app.main:app` ❌  
**Should be:** `uvicorn backend.server:app` ✅

This is why Render is running the old backend - it's pointing to the wrong file!

