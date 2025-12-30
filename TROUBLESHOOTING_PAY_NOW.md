# Troubleshooting "Pay Now" Error

## Issue
Error message: "Failed to create order. Please try again." when clicking "Pay now" button.

## Diagnostic Steps

### 1. Check Browser Console
Open DevTools (F12) → Console tab and look for:
- Error messages
- Network request failures
- CORS errors
- Backend URL being used

### 2. Check Network Tab
Open DevTools (F12) → Network tab:
- Click "Pay now"
- Look for request to `/api/payments/razorpay/create-order`
- Check:
  - **Status Code**: Should be 200, if 4xx/5xx check response
  - **Request URL**: Should be your Render backend URL
  - **Request Payload**: Should include cart, contact, shippingAddress, couponCode
  - **Response**: Check error details

### 3. Verify Backend is Running
Test backend directly:

```powershell
curl.exe https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/health
```

Expected: `{"status":"ok","razorpay_configured":true,"key_id_present":true}`

### 4. Verify Environment Variable
In Vercel dashboard:
- Go to your project → Settings → Environment Variables
- Check `REACT_APP_BACKEND_URL` is set to your Render URL
- If not set, add it and redeploy

### 5. Check CORS Configuration
If you see CORS errors in console:
- Verify Render backend `server.py` CORS config includes your Vercel domain
- Check Render logs for CORS-related errors

## Common Issues & Solutions

### Issue 1: Backend URL Not Set
**Symptom**: Request goes to wrong URL or localhost
**Solution**: Set `REACT_APP_BACKEND_URL` in Vercel environment variables

### Issue 2: Backend Not Deployed
**Symptom**: Network error, connection refused
**Solution**: Verify Render service is running and healthy

### Issue 3: CORS Error
**Symptom**: Console shows CORS policy error
**Solution**: Check backend CORS config in `server.py` includes Vercel domain

### Issue 4: Request Format Mismatch
**Symptom**: Backend returns 400/422 error
**Solution**: Backend accepts both formats, but check request payload in Network tab

### Issue 5: Environment Variables Not Set in Render
**Symptom**: Backend returns 500 error about missing keys
**Solution**: Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in Render

## Quick Test

Test backend endpoint directly:

```powershell
curl.exe -X POST https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/create-order `
  -H "Content-Type: application/json" `
  -d '{\"productId\": \"vayu-ai-glasses\", \"variantId\": \"non-prescription\", \"quantity\": 1}'
```

If this works but frontend doesn't, it's a CORS or environment variable issue.

## Updated Code

I've added better error logging to the checkout page. The updated code will:
- Log the actual error message from backend
- Log the backend URL being used
- Log the request payload
- Show more detailed error messages

Redeploy frontend to see better error messages.


