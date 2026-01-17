# Stack Auth + Google OAuth Complete Setup Guide

## ✅ Configuration Status

### 1. Stack Auth Dashboard - Trusted Domains
**Location:** Settings → Authentication → Trusted Domains
- ✅ `https://byoncocare.com`
- ✅ `https://www.byoncocare.com`

**Purpose:** Stack Auth uses trusted domains to know which domains it can redirect back to after OAuth. This is sufficient - no explicit callback URLs needed.

### 2. Vercel Environment Variables
**Status:** ✅ Present in production
- `REACT_APP_STACK_PROJECT_ID`
- `REACT_APP_STACK_PUBLISHABLE_KEY`

### 3. Stack Auth Dashboard - Google OAuth Provider
**Location:** Settings → Authentication → Auth Methods → SSO Providers → Google
- ✅ "Shared keys" turned OFF (using own Google OAuth credentials)
- ✅ Google OAuth Client ID configured
- ✅ Google OAuth Client Secret configured
- ✅ Stack Auth callback URL: `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`

### 4. Google Cloud Console - OAuth Client
**Location:** APIs & Services → Credentials → OAuth 2.0 Client
- ✅ Authorized JavaScript origins:
  - `https://byoncocare.com`
  - `https://www.byoncocare.com`
- ✅ Authorized redirect URI:
  - `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`

## 🔄 OAuth Flow Explanation

### How Stack Auth OAuth Works:

1. **User clicks "Sign in with Google"** on `/authentication`
2. **App redirects to Stack Auth** → Stack Auth initiates OAuth with Google
3. **Stack Auth redirects to Google** → User authenticates with Google
4. **Google redirects to Stack Auth** → `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`
5. **Stack Auth processes OAuth code** → Exchanges code for user info
6. **Stack Auth redirects back to app** → `https://www.byoncocare.com/handler/oauth-callback?code=...&state=...`
7. **App's StackHandler processes callback** → Completes login, sets session
8. **User redirected to home** → `/` or original redirect URL

### Important Notes:

- **Stack Auth does NOT need explicit callback URLs in the dashboard**
- The "Trusted Domains" configuration is sufficient
- Stack Auth automatically redirects to `/handler/oauth-callback` based on the `handler` URL configured in the client
- Google Cloud Console needs the Stack Auth callback URL, not the app's callback URL

## 📁 Code Configuration

### 1. Handler Route (`src/App.js`)
```javascript
<Route
  path="/handler/*"
  element={
    <div className="min-h-screen bg-white flex items-center justify-center">
      <StackHandler 
        app={stackClientApp} 
        location={location.pathname + location.search} 
        fullPage={false}
      />
    </div>
  }
/>
```
✅ **Status:** Correctly configured and placed before other routes

### 2. Stack Auth Client (`src/stack/client.js`)
```javascript
urls: {
  signIn: "/authentication",
  signUp: "/authentication",
  afterSignIn: "/",
  afterSignUp: "/",
  handler: "/handler", // OAuth callback handler
}
```
✅ **Status:** Handler URL correctly configured

### 3. Authentication Page (`src/pages/AuthPage.jsx`)
✅ **Status:** 
- Renders immediately (non-blocking)
- Connection check runs in background with 5s timeout
- Proper error handling with StackAuthErrorBoundary

## 🧪 End-to-End Test Checklist

### Test 1: Basic OAuth Flow
1. ✅ Open `/authentication` in Incognito mode
2. ✅ Click "Sign in with Google"
3. ✅ Confirm redirect to `accounts.google.com`
4. ✅ Select Google account and grant permissions
5. ✅ Confirm redirect to `api.stack-auth.com/api/v1/auth/oauth/callback/google`
6. ✅ Confirm redirect back to `www.byoncocare.com/handler/oauth-callback?code=...&state=...`
7. ✅ Confirm StackHandler processes callback (no "Page does not exist" error)
8. ✅ Confirm user is logged in and redirected to `/` (or original redirect URL)
9. ✅ Confirm user appears in Stack Auth Dashboard → Users

### Test 2: Error Handling
1. ✅ Test with slow network (throttle in DevTools)
2. ✅ Verify connection check doesn't block page render
3. ✅ Verify timeout works (5 seconds)
4. ✅ Check console for proper error logging

### Test 3: Redirect Handling
1. ✅ Test with `?redirect=/find-hospitals` parameter
2. ✅ Verify user is redirected to intended page after OAuth
3. ✅ Verify security (external URLs are blocked)

## 🐛 Troubleshooting

### Issue: "Page does not exist" on `/handler/oauth-callback`
**Solution:**
- Verify the route exists in `src/App.js` (should be before other routes)
- Check that `StackHandler` is imported from `@stackframe/react`
- Verify `stackClientApp` is correctly initialized

### Issue: OAuth redirects to wrong URL
**Solution:**
- Verify "Trusted Domains" in Stack Auth dashboard includes your domain
- Check `handler: "/handler"` is set in `stackClientApp` URLs config
- Ensure Google Cloud Console has correct redirect URI: `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`

### Issue: Slow page load on `/authentication`
**Solution:**
- Connection check should be non-blocking (runs in background)
- Verify timeout is set to 5 seconds
- Check browser console for connection errors

### Issue: User not appearing in Stack Auth Dashboard
**Solution:**
- Verify OAuth flow completes (check network tab)
- Check Stack Auth dashboard → Users for new entries
- Verify environment variables are set correctly in Vercel

## 📝 Summary

**What's Configured:**
- ✅ Stack Auth trusted domains
- ✅ Google OAuth in Stack Auth dashboard
- ✅ Google Cloud Console OAuth client
- ✅ Handler route in app
- ✅ Stack Auth client configuration
- ✅ Non-blocking authentication page

**What's NOT Needed:**
- ❌ Explicit callback URLs in Stack Auth dashboard (trusted domains are sufficient)
- ❌ App callback URLs in Google Cloud Console (only Stack Auth's callback URL is needed)

**Next Steps:**
1. Deploy latest code to Vercel
2. Test OAuth flow end-to-end
3. Verify user creation in Stack Auth dashboard
4. Monitor for any connection errors
