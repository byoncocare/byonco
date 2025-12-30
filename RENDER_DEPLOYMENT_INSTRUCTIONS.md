# Render Backend Deployment Instructions

## Current Status
✅ Backend code is ready for deployment
✅ Razorpay endpoints are correctly configured:
   - `/api/payments/razorpay/create-order`
   - `/api/payments/razorpay/verify`

## Required Environment Variables on Render

Make sure these are set in your Render dashboard:

1. **RAZORPAY_KEY_ID** - Your Razorpay Key ID (from Razorpay dashboard)
2. **RAZORPAY_KEY_SECRET** - Your Razorpay Key Secret (from Razorpay dashboard)
3. **MONGO_URL** - MongoDB connection string
4. **DB_NAME** - Database name

## Deployment Steps

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (byonco-fastapi-backend)
3. **Click "Manual Deploy"** → **"Deploy latest commit"**
   OR
   **Push to main branch** (if auto-deploy is enabled)

## Verify Deployment

After deployment, test the endpoints:

```bash
# Test create-order endpoint
curl -X POST https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "cart": {
      "items": [{
        "productId": "vayu-ai-glasses",
        "name": "Vayu AI Glasses",
        "variantId": "non-prescription",
        "quantity": 1,
        "unitPrice": 59999
      }]
    },
    "couponCode": ""
  }'
```

Expected response:
```json
{
  "keyId": "rzp_test_...",
  "razorpayOrderId": "order_...",
  "orderId": "uuid-...",
  "amount": 59999,
  "currency": "INR"
}
```

## Frontend Configuration

The frontend is already configured to use:
- Backend URL: `https://byonco-fastapi-backend.onrender.com`
- Endpoints: `/api/payments/razorpay/create-order` and `/api/payments/razorpay/verify`

## Troubleshooting

If "Pay now" button doesn't work:

1. **Check browser console** for errors
2. **Check Network tab** to see if API calls are failing
3. **Verify environment variables** are set correctly on Render
4. **Check Render logs** for backend errors
5. **Ensure CORS is configured** correctly (already done in server.py)

## Code Status

✅ All code is committed and pushed to `main` branch
✅ Backend endpoints match frontend expectations
✅ Error handling is in place
✅ Payment verification flow is complete

---

**Next Step**: Deploy backend on Render using the steps above.

