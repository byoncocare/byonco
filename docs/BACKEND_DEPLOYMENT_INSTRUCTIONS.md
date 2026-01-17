# Backend Deployment to Render - Instructions

## 🔍 Current Situation

You have **two separate repositories**:
1. **Main Repo:** `byoncocare/byonco` (frontend + backend code together)
2. **Backend Repo:** `byoncocare/byonco-fastapi-backend` (separate backend repo for Render)

**Render is connected to:** `byoncocare/byonco-fastapi-backend`

## ✅ Solution: Manual Deployment on Render

Since the repositories have diverged, the easiest solution is to **trigger a manual deployment** on Render, which will deploy the latest code from the backend repository.

### Step 1: Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Navigate to: **`byonco-fastapi-backend`** service
3. You should see the service dashboard

### Step 2: Trigger Manual Deployment

1. **Click on "Manual Deploy" button** (top right, black dropdown button)
2. **Select "Deploy latest commit"**
3. **Wait 3-5 minutes** for deployment to complete

### Step 3: Monitor Deployment

1. **Click on "Logs" tab** (in the left sidebar under MONITOR)
2. **Watch for:**
   - `Application startup complete`
   - Any import errors
   - Any startup failures

### Step 4: Verify Deployment

After deployment completes, test these endpoints:

```bash
# Health check
curl https://byonco-fastapi-backend.onrender.com/health

# Root endpoint (should show routes)
curl https://byonco-fastapi-backend.onrender.com/

# Hospitals endpoint
curl https://byonco-fastapi-backend.onrender.com/api/hospitals

# Cancer types
curl https://byonco-fastapi-backend.onrender.com/api/cancer-types
```

## 🔄 Alternative: Sync Backend Repository

If you want to sync the backend repository with the latest changes from the main repo:

### Option A: Copy Backend Files to Backend Repo

1. **Clone the backend repository separately:**
   ```bash
   git clone https://github.com/byoncocare/byonco-fastapi-backend.git
   cd byonco-fastapi-backend
   ```

2. **Copy backend files from main repo:**
   ```bash
   # Copy entire backend/ directory
   cp -r ../byonco/backend/* .
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update backend with latest changes"
   git push origin main
   ```

4. **Render will auto-deploy** (if auto-deploy is enabled)

### Option B: Use Git Subtree (Advanced)

This requires more Git knowledge but keeps repos in sync automatically.

## 📋 What Changed in Backend

The latest backend changes include:
- ✅ Password reset email service
- ✅ Security headers middleware
- ✅ Updated authentication routes
- ✅ Email service integration

## ✅ Recommended Approach

**For now, use Manual Deployment on Render:**
1. It's the quickest solution
2. No need to sync repositories
3. Render will deploy whatever is in the backend repo

**For future updates:**
- Consider syncing the backend repository with main repo
- Or keep backend changes in sync manually

---

**Status:** Ready for manual deployment on Render
