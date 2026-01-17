# Stack Auth OAuth Callback Fix

## Issue
After clicking "Sign in with Google", the OAuth flow redirects to `/handler/oauth-callback` but shows "Page does not exist" error.

## Root Cause
The OAuth callback handler route was not properly configured to handle Stack Auth's OAuth redirects.

## Code Changes Made

### 1. Updated `src/App.js`
- Added proper container wrapper for `StackHandler` with white background
- Ensured the route is placed before other routes (already done)

### 2. Updated `src/stack/client.js`
- Added `handler: "/handler"` to the `urls` configuration
- This tells Stack Auth where to redirect after OAuth completes

## Stack Auth Dashboard Configuration

**IMPORTANT:** Stack Auth does NOT require explicit callback URLs in the dashboard.

**What IS Required:**
1. **Trusted Domains** (Settings → Authentication → Trusted Domains):
   - `https://byoncocare.com`
   - `https://www.byoncocare.com`
   
   Stack Auth uses trusted domains to know which domains it can redirect back to after OAuth. This is sufficient.

2. **Google OAuth Provider** (Settings → Authentication → Auth Methods → SSO Providers → Google):
   - Configure your Google OAuth Client ID and Secret
   - Stack Auth will use its own callback URL: `https://api.stack-auth.com/api/v1/auth/oauth/callback/google`

**What is NOT Required:**
- ❌ Explicit callback URLs like `/handler/oauth-callback` in Stack Auth dashboard
- ❌ App callback URLs in Stack Auth settings

**Why:** Stack Auth automatically redirects to your app's `/handler/oauth-callback` route based on the `handler: "/handler"` URL configured in your Stack Auth client. The trusted domains tell Stack Auth which domains are allowed to receive these redirects.

## Testing

After deploying and configuring:

1. Go to `/authentication`
2. Click "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected back to `/handler/oauth-callback` which will:
   - Process the OAuth code
   - Create/login the user
   - Redirect to `/` (home page) or the original redirect URL

## Troubleshooting

If you still see "Page does not exist":

1. **Check the route is deployed:**
   - Visit `https://www.byoncocare.com/handler/test` (should show Stack Auth handler, not 404)

2. **Check Stack Auth dashboard:**
   - Verify callback URLs are added
   - Verify Google OAuth is enabled
   - Check for any error messages in the dashboard

3. **Check browser console:**
   - Look for any CORS errors
   - Look for Stack Auth connection errors
   - Check network tab for failed requests to `/handler/oauth-callback`

4. **Verify environment variables:**
   - `REACT_APP_STACK_PROJECT_ID` is set in Vercel
   - `REACT_APP_STACK_PUBLISHABLE_KEY` is set in Vercel

## Files Changed

- `src/App.js` - Added container wrapper for StackHandler
- `src/stack/client.js` - Added handler URL to configuration
