# Vercel Deployment - Step-by-Step Guide

## Prerequisites
- GitHub repository: `byoncocare/byonco` ✅ (already pushed)
- Render backend URL: `https://YOUR-RENDER-APP.onrender.com` (from Render deployment)
- Vercel account: https://vercel.com

## Step 1: Create Vercel Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in or create account (can use GitHub)

2. **Import Project**
   - Click **"Add New..."** button
   - Select **"Project"**
   - Click **"Import Git Repository"**

3. **Connect GitHub (if not connected)**
   - Click **"Connect GitHub"**
   - Authorize Vercel
   - Select repositories: `byoncocare/byonco`

4. **Select Repository**
   - Find `byoncocare/byonco`
   - Click **"Import"**

## Step 2: Configure Project

Vercel should auto-detect React. Verify these settings:

```
Framework Preset: Create React App
Root Directory: (leave empty - root is fine)
Build Command: npm run build
Output Directory: build
Install Command: npm install (default)
```

**Project Name:** `byonco` (or your preferred name)

## Step 3: Add Environment Variable

**Before clicking Deploy**, add environment variable:

1. Click **"Environment Variables"** section
2. Add:
   ```
   Name: REACT_APP_BACKEND_URL
   Value: https://YOUR-RENDER-APP.onrender.com
   ```
   Replace `YOUR-RENDER-APP` with your actual Render URL from Render deployment.

3. Select environments: **Production**, **Preview**, **Development** (all)

## Step 4: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies (`npm install`)
   - Build the app (`npm run build`)
   - Deploy to CDN
3. Wait for deployment (2-5 minutes)
4. You'll see build logs in real-time

## Step 5: Get Your Vercel URL

After successful deployment:
- Production URL: `https://byonco.vercel.app` (or your project name)
- Check **"Domains"** tab for custom domain options

## Step 6: Verify Deployment

### Test Order Page
Visit: `https://YOUR-VERCEL-APP.vercel.app/products/vayu/order`

Should show:
- Product images
- Price: ₹59,999 (with strikethrough ₹69,999)
- Variant selector (Non-prescription/Prescription)
- Quantity stepper
- "Order Now" button

### Test Checkout Page
Visit: `https://YOUR-VERCEL-APP.vercel.app/products/vayu/checkout`

Should show:
- Checkout form (Contact, Delivery, Payment sections)
- Order summary card
- "Pay now" button

### Test End-to-End Flow

1. **Go to Order Page**
   - Select variant (Non-prescription)
   - Set quantity: 1
   - Click "Order Now"

2. **On Checkout Page**
   - Fill in form:
     - Email: test@example.com
     - Phone: +91 9876543210
     - First Name: Test
     - Last Name: User
     - Address: 123 Test Street
     - City: Mumbai
     - State: Maharashtra
     - PIN: 400001
   - Click "Pay now"

3. **Razorpay Modal**
   - Should open Razorpay checkout
   - Use test card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: 123
   - OTP: 123456

4. **Success Page**
   - Should redirect to: `/products/vayu/checkout/success`
   - Should show order confirmation

### Check Browser Console

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Pay now"
4. Verify:
   - Request to: `https://YOUR-RENDER-APP.onrender.com/api/payments/razorpay/create-order`
   - Status: 200 OK
   - Response includes: `orderId`, `razorpayOrderId`, `amount`, `keyId`

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify `package.json` has correct scripts
- Check for TypeScript/ESLint errors

### "Failed to create order" Error
- Check `REACT_APP_BACKEND_URL` is set correctly
- Verify Render backend is running
- Check browser console for CORS errors

### Razorpay Modal Doesn't Open
- Check browser console for errors
- Verify Razorpay SDK loads: `https://checkout.razorpay.com/v1/checkout.js`
- Check network tab for failed requests

### CORS Errors
- Backend CORS is already configured in `server.py`
- Verify Render URL matches Vercel's `REACT_APP_BACKEND_URL`
- Check Render logs for CORS-related errors

## Environment Variables Reference

**Vercel Environment Variables:**
```
REACT_APP_BACKEND_URL = https://YOUR-RENDER-APP.onrender.com
```

**Render Environment Variables (already set):**
```
RAZORPAY_KEY_ID = [your key]
RAZORPAY_KEY_SECRET = [your secret]
SECRET_KEY = [generated key]
DB_NAME = byonco
MONGO_URL = [optional]
```

## Next Steps

1. ✅ Test checkout flow end-to-end
2. ✅ Verify payments work with test cards
3. ✅ Check Render logs for any errors
4. ✅ Set up custom domains (optional)
5. ✅ Configure production Razorpay keys (when ready)

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Backend API Docs**: `https://YOUR-RENDER-APP.onrender.com/docs`
- **Frontend**: `https://YOUR-VERCEL-APP.vercel.app`

