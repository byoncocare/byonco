# ⚡ Quick Fix: Render Start Command

## 🔴 The Issue

Render is running the **OLD GPT-only backend** because it's using the wrong start command or pointing to the wrong file.

## ✅ The Fix

### Step 1: Check Render Start Command

1. Go to: https://dashboard.render.com
2. Click: `byonco-fastapi-backend` service
3. Go to: **"Settings"** tab
4. Scroll to: **"Build & Deploy"**
5. Check: **"Start Command"**

### Step 2: Update Start Command

**It should be:**
```bash
uvicorn backend.server:app --host 0.0.0.0 --port 8000
```

**If it's different** (like `uvicorn server:app` or `uvicorn main:app`), **change it** to the above.

### Step 3: Save and Redeploy

1. Click **"Save Changes"**
2. Go to **"Events"** tab
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 3-5 minutes

### Step 4: Verify

After deployment, test:
```
https://byonco-fastapi-backend.onrender.com/api/cancer-types
```

Should return JSON (not 404).

## 🎯 That's It!

The code is correct - Render just needs to use the right start command pointing to `backend.server:app`.

---

**Quick Checklist:**
- [ ] Start command is: `uvicorn backend.server:app --host 0.0.0.0 --port 8000`
- [ ] Saved changes
- [ ] Redeployed
- [ ] Endpoints work

