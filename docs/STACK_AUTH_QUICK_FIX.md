# Stack Auth Connection Error - Quick Fix Guide

## ❌ The Problem
Stack Auth can't connect to its server. Error: "Failed to fetch"

## ✅ The Solution (2 Steps)

### Step 1: Add Trusted Domain in Stack Auth Dashboard (REQUIRED)

**This is the main fix!** Stack Auth needs to know that `localhost:3000` is allowed.

1. **Go to Stack Auth Dashboard:**
   - Visit: https://stack-auth.com/dashboard
   - Login with your Stack Auth account

2. **Select Your Project:**
   - Project ID: `5a629032-2f33-46db-ac2c-134894a117eb`

3. **Add Trusted Domain:**
   - Go to **Settings** → **Trusted Domains** (or **Security** → **Trusted Domains**)
   - Click **"Add Domain"** or **"+ Add"**
   - Enter: `localhost:3000`
   - Click **Save**

4. **For Production (add these too):**
   - `www.byoncocare.com`
   - `byoncocare.com`

### Step 2: Verify Keys (Already Correct ✅)

Your keys are already in the code and are correct:
- **Project ID:** `5a629032-2f33-46db-ac2c-134894a117eb` ✅
- **Publishable Key:** `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg` ✅

**No changes needed here!**

## 🔍 Why This Happens

Stack Auth's frontend SDK tries to connect to Stack Auth's cloud API. If your domain (`localhost:3000`) isn't in the trusted domains list, Stack Auth blocks the connection for security.

## ✅ After Adding Trusted Domain

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Refresh the page:** `http://localhost:3000/authentication`
3. **Stack Auth should connect successfully!**

## 📝 About Keys on Render

**You DON'T need to put keys on Render** because:

1. **Frontend Keys (Public):**
   - `projectId` and `publishableClientKey` are **public** and safe to expose
   - They're already in your code (`src/stack/client.js`)
   - These work fine in frontend code

2. **Backend (Render):**
   - Your backend uses **custom auth** (not Stack Auth)
   - Stack Auth is only used on the frontend
   - No Stack Auth keys needed on Render backend

3. **For Production (Vercel):**
   - When you deploy frontend to Vercel, you can optionally use environment variables
   - But hardcoded keys in code also work (they're public anyway)

## 🚨 Still Not Working?

If adding trusted domain doesn't fix it:

1. **Check Browser Console:**
   - Open DevTools (F12) → Console tab
   - Look for CORS errors or network errors
   - Share the exact error message

2. **Check Network Tab:**
   - DevTools → Network tab
   - Refresh page
   - Look for failed requests to Stack Auth API
   - Check the status code (401, 403, CORS error?)

3. **Verify in Stack Auth Dashboard:**
   - Go to your project
   - Check that `localhost:3000` is actually saved in trusted domains
   - Sometimes you need to save twice

4. **Test Connection:**
   - Try visiting: `http://localhost:3000/handler/signin`
   - This uses Stack Auth's built-in handler route
   - If this works, the issue is with the custom `/authentication` route

---

**TL;DR:** Add `localhost:3000` to trusted domains in Stack Auth dashboard. That's it! 🎯
