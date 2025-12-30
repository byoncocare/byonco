# 🔧 Fix Razorpay Environment Variable Error

## ❌ Current Error
```
RazorPay client not initialized. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.
```

## ✅ Solution: Add Missing Environment Variable

### Step 1: Get Your Razorpay Key Secret

1. Go to Razorpay Dashboard: https://dashboard.razorpay.com
2. Navigate to **Settings** → **API Keys**
3. Find your **Test Key Secret** (or **Live Key Secret** for production)
4. Copy the secret key (it looks like: `xxxxxxxxxxxxxxxxxxxx`)

### Step 2: Add to Render Environment Variables

1. Go to Render Dashboard: https://dashboard.render.com
2. Select **`byonco-fastapi-backend`** service
3. Click on **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"** button
5. Add the following:

   **Key:** `RAZORPAY_KEY_SECRET`
   
   **Value:** Paste your Razorpay Key Secret from Step 1

6. Click **"Save Changes"**

### Step 3: Redeploy Backend

After adding the environment variable, Render will automatically redeploy. If not:

1. Go to **"Events"** tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete (3-5 minutes)

### Step 4: Verify

After deployment, test the checkout:

1. Go to: `https://www.byoncocare.com/products/vayu/checkout`
2. Fill out the form
3. Click **"Pay now"**
4. The Razorpay checkout modal should open (no error)

## 📋 Required Environment Variables Checklist

Make sure these are set in Render:

- ✅ `RAZORPAY_KEY_ID` - Already set (visible as `rzp test Rv170gLIunKMlu`)
- ❌ `RAZORPAY_KEY_SECRET` - **MISSING - NEEDS TO BE ADDED**
- ✅ `MONGO_URL` - Should be set
- ✅ `DB_NAME` - Should be set

## 🔍 Verify Environment Variables

After adding, you should see both:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Both should be visible in the Render Environment tab (values will be masked with `****` for security).

---

**Status:** Waiting for `RAZORPAY_KEY_SECRET` to be added to Render environment variables.

