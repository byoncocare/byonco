# Stack Auth SignUp Component Not Rendering - Fix Guide

## Issue
When clicking "Sign up" on the authentication page, no registration form appears.

## Possible Causes

### 1. Stack Auth Email/Password Provider Not Enabled
**Most Likely Cause**

Stack Auth requires the Email/Password provider to be explicitly enabled in the dashboard.

**Fix:**
1. Go to Stack Auth Dashboard: https://app.stack-auth.com
2. Navigate to your project: `5a629032-2f33-46db-ac2c-134894a117eb`
3. Go to **Auth Methods** or **Providers** section
4. Ensure **Email/Password** is enabled
5. If not enabled, enable it and save

### 2. Environment Variables Missing
**Check Vercel Production Environment Variables:**

Required variables (with `REACT_APP_` prefix for CRA):
- `REACT_APP_STACK_PROJECT_ID` = `5a629032-2f33-46db-ac2c-134894a117eb`
- `REACT_APP_STACK_PUBLISHABLE_KEY` = `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg`

**Verify:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Ensure both variables exist for **Production** environment
3. If missing, add them and redeploy

### 3. CSP Blocking Stack Auth Requests
**Check Browser Console:**
- Open DevTools → Console
- Look for CSP violations or blocked requests to `api.stack-auth.com`
- If found, update `vercel.json` CSP headers

### 4. Component Not Rendering Due to Error
**Check Browser Console:**
- Look for errors from Stack Auth
- Check if `SignUp` component is mounting (debug logs added)
- Look for connection errors

## Debug Steps

1. **Open Browser Console** (F12)
2. **Navigate to** `/authentication?mode=signup`
3. **Check Console Logs:**
   - Should see: `[AuthPage] URL mode changed: signup`
   - Should see: `[AuthPage] Switching to signup mode`
   - Should see: `[AuthPage] Current mode: signup`
   - Should see: `[AuthPage] Rendering SignUp component`

4. **If logs show SignUp is rendering but no form appears:**
   - Stack Auth SignUp component might be failing silently
   - Check Network tab for failed requests to Stack Auth API
   - Verify email/password provider is enabled in dashboard

5. **If mode isn't switching:**
   - Check URL: should be `/authentication?mode=signup`
   - Check if SignIn component's "Sign up" link is working
   - Verify navigation is happening

## Quick Fix: Rollback to Custom Auth

If Stack Auth continues to have issues, rollback to custom auth:

```bash
git checkout fix-auth-rollback
git reset --hard 7c59675
# This restores working RegisterForm component
```

## Current Status

- ✅ Debug logging added
- ✅ Mode switching logic verified
- ⚠️ Need to verify Stack Auth dashboard configuration
- ⚠️ Need to check Vercel environment variables
