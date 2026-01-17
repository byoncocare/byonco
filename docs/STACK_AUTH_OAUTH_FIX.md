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

## Stack Auth Dashboard Configuration Required

**IMPORTANT:** You must configure the OAuth callback URL in the Stack Auth dashboard:

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com)
2. Select your project: `5a629032-2f33-46db-ac2c-134894a117eb`
3. Navigate to **Settings** → **OAuth Providers** (or **Redirect URLs**)
4. Add the following callback URLs:
   - `https://www.byoncocare.com/handler/oauth-callback`
   - `https://byoncocare.com/handler/oauth-callback`
   - `http://localhost:3000/handler/oauth-callback` (for development)

5. For Google OAuth specifically:
   - Go to **Settings** → **OAuth** → **Google**
   - Ensure the **Authorized redirect URIs** includes:
     - `https://www.byoncocare.com/handler/oauth-callback`
     - `https://byoncocare.com/handler/oauth-callback`

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
