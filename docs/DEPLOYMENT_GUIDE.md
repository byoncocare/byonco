# Production Deployment Guide

## 🚀 Deployment Status

All changes have been committed and pushed to the repository. Ready for deployment to:
- **Vercel** (Frontend)
- **Render** (Backend - `byonco-fastapi-backend`)

---

## 📦 What Was Deployed

### Frontend Changes (Vercel)
- ✅ Stack Auth integration (complete replacement of custom auth)
- ✅ 10 SEO-optimized cancer pages (`/cancer/*`)
- ✅ Cancer hub page (`/cancer`)
- ✅ Security hardening (anti-scraping, security headers)
- ✅ Payment gate for subscription-based services
- ✅ Error boundaries and improved error handling
- ✅ Updated legal documents (Privacy Policy, Terms, Medical Disclaimer)
- ✅ Subscription management utilities
- ✅ SEO utilities (analytics, rank tracking, A/B testing)

### Backend Changes (Render)
- ✅ Password reset email service
- ✅ Security headers middleware
- ✅ Updated authentication routes
- ✅ Email service integration

---

## 🌐 Vercel Deployment (Frontend)

### Automatic Deployment
If Vercel is connected to your GitHub repository, it will automatically deploy when you push to `main` branch.

### Manual Deployment Steps

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your ByOnco project

2. **Trigger Deployment:**
   - Click **"Deployments"** tab
   - Click **"Redeploy"** on the latest deployment
   - Or wait for automatic deployment (if enabled)

3. **Verify Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Ensure these are set (if needed):
     ```
     REACT_APP_BACKEND_URL=https://byonco-fastapi-backend.onrender.com
     REACT_APP_STACK_PROJECT_ID=5a629032-2f33-46db-ac2c-134894a117eb
     REACT_APP_STACK_PUBLISHABLE_KEY=pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg
     ```

4. **Check Build Logs:**
   - Monitor the deployment in **"Deployments"** tab
   - Ensure build completes successfully
   - Check for any errors in build logs

5. **Test Production Site:**
   - Visit: `https://www.byoncocare.com`
   - Test authentication: `/authentication`
   - Test cancer pages: `/cancer/breast`, `/cancer/lung`, etc.
   - Test cancer hub: `/cancer`

### Post-Deployment Checklist (Vercel)

- [ ] Verify Stack Auth works (add `www.byoncocare.com` to trusted domains)
- [ ] Test all 10 cancer pages load correctly
- [ ] Verify SEO metadata appears in page source
- [ ] Test payment gate functionality
- [ ] Verify security headers are present (check Network tab)
- [ ] Test authentication flow (sign in/sign up)
- [ ] Verify redirects work correctly

---

## 🔧 Render Deployment (Backend)

### Service: `byonco-fastapi-backend`

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Navigate to your service: `byonco-fastapi-backend`

2. **Trigger Manual Deploy:**
   - Click on **"Events"** tab
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Or wait for automatic deployment (if enabled)

3. **Monitor Deployment:**
   - Watch **"Logs"** tab during deployment
   - Look for: `Application startup complete`
   - Check for any import errors or startup failures

4. **Verify Environment Variables:**
   - Go to **Environment** tab
   - Ensure all required variables are set:
     ```
     MONGO_URL=your_mongodb_connection_string
     DB_NAME=byonco_db
     SECRET_KEY=your_secret_key
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_KEY_SECRET=your_razorpay_secret
     CORS_ORIGINS=https://www.byoncocare.com,https://byoncocare.com
     WHATSAPP_ACCESS_TOKEN=your_whatsapp_token (if using)
     WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id (if using)
     ```

5. **Test Backend Endpoints:**
   - Root: `https://byonco-fastapi-backend.onrender.com/`
   - Health: `https://byonco-fastapi-backend.onrender.com/health`
   - Auth: `https://byonco-fastapi-backend.onrender.com/api/auth/login`
   - Hospitals: `https://byonco-fastapi-backend.onrender.com/api/hospitals`
   - Cancer Types: `https://byonco-fastapi-backend.onrender.com/api/cancer-types`

### Post-Deployment Checklist (Render)

- [ ] Verify backend starts without errors
- [ ] Test authentication endpoints
- [ ] Verify password reset email service works
- [ ] Check security headers in API responses
- [ ] Test payment endpoints (if applicable)
- [ ] Verify CORS is configured correctly
- [ ] Check MongoDB connection

---

## 🔐 Stack Auth Configuration (Required)

### Add Trusted Domains

**Critical:** Stack Auth requires trusted domains to be configured.

1. **Go to Stack Auth Dashboard:**
   - Visit: https://stack-auth.com/dashboard
   - Login with your account

2. **Select Project:**
   - Project ID: `5a629032-2f33-46db-ac2c-134894a117eb`

3. **Add Trusted Domains:**
   - Navigate to **Settings** → **Trusted Domains**
   - Add these domains:
     - `localhost:3000` (for local development)
     - `www.byoncocare.com` (production)
     - `byoncocare.com` (production)
   - Click **Save**

4. **Verify API Keys:**
   - Ensure Project ID matches: `5a629032-2f33-46db-ac2c-134894a117eb`
   - Verify Publishable Key: `pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg`

---

## ✅ Post-Deployment Verification

### Frontend (Vercel)

1. **Homepage:**
   ```
   https://www.byoncocare.com
   ```
   - Should load without errors
   - Check browser console for errors

2. **Authentication:**
   ```
   https://www.byoncocare.com/authentication
   ```
   - Should show Stack Auth Sign In form
   - Test sign up flow
   - Test forgot password

3. **Cancer Pages:**
   ```
   https://www.byoncocare.com/cancer/breast
   https://www.byoncocare.com/cancer/lung
   https://www.byoncocare.com/cancer/oral
   ... (all 10 pages)
   ```
   - Should load with SEO metadata
   - Check page source for meta tags
   - Verify schema markup

4. **Cancer Hub:**
   ```
   https://www.byoncocare.com/cancer
   ```
   - Should show grid of all 10 cancers
   - Test navigation links

5. **Security Headers:**
   - Open DevTools → Network tab
   - Check response headers for:
     - `Content-Security-Policy`
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security`

### Backend (Render)

1. **Health Check:**
   ```bash
   curl https://byonco-fastapi-backend.onrender.com/health
   ```

2. **API Endpoints:**
   ```bash
   curl https://byonco-fastapi-backend.onrender.com/api/hospitals
   curl https://byonco-fastapi-backend.onrender.com/api/cancer-types
   ```

3. **Security Headers:**
   - Check API responses include security headers
   - Verify CORS is working

---

## 🐛 Troubleshooting

### Frontend Issues

**Stack Auth Connection Error:**
- ✅ Add trusted domains in Stack Auth dashboard
- ✅ Verify API keys are correct
- ✅ Check browser console for CORS errors

**Build Fails:**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

**Pages Not Loading:**
- Verify routes are correct in `src/App.js`
- Check browser console for errors
- Verify environment variables are set

### Backend Issues

**Deployment Fails:**
- Check Render logs for errors
- Verify Python version matches requirements
- Check for missing dependencies in `requirements.txt`

**API Returns 500:**
- Check Render logs for error details
- Verify MongoDB connection string
- Check environment variables

**CORS Errors:**
- Verify `CORS_ORIGINS` includes production domain
- Check backend logs for CORS configuration

---

## 📊 Monitoring

### Vercel
- Monitor deployments in Vercel dashboard
- Check Analytics for traffic
- Monitor function logs for errors

### Render
- Monitor service logs
- Check for uptime issues
- Monitor resource usage

### Stack Auth
- Monitor authentication events in Stack Auth dashboard
- Check for failed login attempts
- Review user activity

---

## 🔄 Rollback (If Needed)

### Vercel
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Render
1. Go to Events tab
2. Find previous successful deployment
3. Click "Redeploy" on that commit

---

## 📝 Next Steps

1. ✅ **Add Stack Auth Trusted Domains** (Critical!)
2. ✅ **Test all authentication flows**
3. ✅ **Verify SEO pages are indexed** (submit sitemap to Google)
4. ✅ **Monitor error logs** for first 24 hours
5. ✅ **Test payment flows** in production
6. ✅ **Verify security headers** are present

---

**Last Updated:** 2026-01-15
**Status:** ✅ Ready for Production Deployment
