# 🔐 Stack Auth Production Setup for Vercel

## Required Environment Variables

Add these to **Vercel Dashboard → Project Settings → Environment Variables**:

### Production Environment Variables:

```
REACT_APP_STACK_PROJECT_ID=5a629032-2f33-46db-ac2c-134894a117eb
REACT_APP_STACK_PUBLISHABLE_KEY=pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg
REACT_APP_STACK_API_URL=https://api.stack-auth.com
REACT_APP_BASE_URL=https://www.byoncocare.com
```

## Steps to Configure:

### 1. Add Environment Variables in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project: `byonco` (or your project name)
3. Go to: **Settings** → **Environment Variables**
4. Add each variable:
   - **Key:** `REACT_APP_STACK_PROJECT_ID`
   - **Value:** `5a629032-2f33-46db-ac2c-134894a117eb`
   - **Environment:** Select `Production`, `Preview`, and `Development`
   - Click **Save**

   Repeat for:
   - `REACT_APP_STACK_PUBLISHABLE_KEY` = `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg`
   - `REACT_APP_STACK_API_URL` = `https://api.stack-auth.com`
   - `REACT_APP_BASE_URL` = `https://www.byoncocare.com`

### 2. Verify Stack Auth Trusted Domains:

1. Go to: https://app.stack-auth.com/projects/5a629032-2f33-46db-ac2c-134894a117eb/domains
2. Under **"Trusted Domains"**, ensure these are added (with `https://` prefix):
   - ✅ `https://www.byoncocare.com`
   - ✅ `https://byoncocare.com`

3. **Important:** Domains must include the `https://` protocol prefix

### 3. Redeploy on Vercel:

After adding environment variables:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment
5. Or push a new commit to trigger auto-deploy

### 4. Verify Deployment:

After redeploy, test:
- Visit: `https://www.byoncocare.com/authentication`
- Should load Stack Auth sign-in page without errors
- Check browser console (F12) - no CSP violations

## Troubleshooting

### If Still Getting Connection Error:

1. **Check Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure all 4 variables are set for **Production**
   - Values must match exactly (no extra spaces)

2. **Verify Trusted Domains:**
   - Stack Auth Dashboard → Trusted Domains
   - Must include `https://www.byoncocare.com` (with protocol)
   - Must include `https://byoncocare.com` (with protocol)

3. **Check Browser Console:**
   - Open DevTools (F12) → Console
   - Look for errors mentioning:
     - `api.stack-auth.com`
     - `Failed to fetch`
     - CSP violations

4. **Verify CSP in vercel.json:**
   - Should include `https://api.stack-auth.com` in `connect-src`
   - Should include `https://app.stack-auth.com` in `connect-src` and `frame-src`

5. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache and reload

## Expected Behavior After Fix:

✅ Authentication page loads without errors  
✅ Stack Auth sign-in/sign-up components render  
✅ OAuth flows work (if configured)  
✅ Email verification redirects work  
✅ Password reset flows work  
✅ No console errors related to Stack Auth  

---

**Status:** Ready for production after environment variables are set in Vercel
