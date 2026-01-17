# Auth Rollback Plan

## Last Working Custom Auth Commit

**LAST_GOOD_AUTH_COMMIT: `7c59675`**
- Commit: `feat: add navigation to byoncocare.com for brand logo and login icons`
- This is the commit RIGHT BEFORE Stack Auth integration (`9fbe251`)
- Custom auth was working at this point

## Current Issues

1. **`/handler/*` showing "Page does not exist"**
   - Route is correctly positioned first in React Router
   - But still hitting catch-all 404 route
   - Possible causes:
     - React Router not matching correctly
     - SecurityProtection wrapper interfering
     - AuthContext/ProtectedRoute blocking

2. **Email/password signup not working**
   - Currently using Stack Auth components
   - But Stack Auth email/password may not be enabled
   - Or env vars not configured correctly

## Rollback Steps (if needed)

```bash
# Create safety branch (already done)
git branch fix-auth-rollback

# Option 1: Revert Stack Auth commits
git revert 9fbe251..HEAD

# Option 2: Hard reset to last working commit (DESTRUCTIVE - only if safe)
git reset --hard 7c59675
```

## Current Auth Architecture

### Stack Auth (Current)
- **Frontend**: `src/pages/AuthPage.jsx` uses `<SignIn />` and `<SignUp />` from `@stackframe/react`
- **Backend**: Still has custom auth endpoints at `/api/auth/*`
- **Session**: Stack Auth manages its own session (cookies)
- **Handler**: `/handler/*` routes for OAuth callbacks

### Custom Auth (Before Stack Auth)
- **Frontend**: `src/components/Auth/LoginForm.jsx` and `RegisterForm.jsx`
- **Backend**: FastAPI endpoints at `/api/auth/register`, `/api/auth/login`
- **Session**: JWT tokens stored in localStorage
- **AuthContext**: `src/contexts/AuthContext.jsx` manages auth state

## Next Steps

1. **Immediate Fix**: Ensure `/handler/*` route bypasses all guards
2. **Decision Point**: Rollback to custom auth OR fix Stack Auth email/password
3. **After Stable**: Re-introduce Google OAuth cleanly
