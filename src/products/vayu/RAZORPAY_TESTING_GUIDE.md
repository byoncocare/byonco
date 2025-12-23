# Razorpay Backend Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Ensure `.env` file contains (DO NOT commit this file):
```bash
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_test_secret
```

### 3. Run Server Locally
```bash
uvicorn server:app --reload
```

Server will start at `http://localhost:8000`

### 4. Verify Environment Variables Loaded
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "razorpay_configured": true
}
```

---

## Testing Create Order Endpoint

### Request
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1,
    "couponCode": "LAUNCH2025",
    "customer": {
      "name": "John Doe",
      "email": "test@example.com",
      "phone": "+91 9876543210"
    }
  }'
```

### Expected Response (Success)
```json
{
  "orderId": "VAYU-2025-ABC123",
  "amount": 53999.1,
  "currency": "INR",
  "keyId": "rzp_test_..."
}
```

### Test Cases

#### 1. Non-prescription without coupon
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1
  }'
```
Expected: `amount: 59999.0`

#### 2. Prescription without coupon
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "prescription",
    "quantity": 1
  }'
```
Expected: `amount: 64999.0`

#### 3. With LAUNCH2025 coupon (10% off)
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1,
    "couponCode": "LAUNCH2025"
  }'
```
Expected: `amount: 53999.1` (10% off ₹59,999)

#### 4. With VAYU5000 coupon (flat ₹5,000 off)
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1,
    "couponCode": "VAYU5000"
  }'
```
Expected: `amount: 54999.0` (₹59,999 - ₹5,000)

#### 5. Invalid product ID
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "invalid-product",
    "variantId": "non-prescription",
    "quantity": 1
  }'
```
Expected: `400 Bad Request` - "Unknown product: invalid-product"

#### 6. Invalid variant ID
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "invalid-variant",
    "quantity": 1
  }'
```
Expected: `400 Bad Request` - "Unknown variant: invalid-variant"

#### 7. Invalid coupon code
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1,
    "couponCode": "INVALID"
  }'
```
Expected: `400 Bad Request` - "Invalid coupon code"

#### 8. Quantity out of range
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 10
  }'
```
Expected: `400 Bad Request` - "Quantity must be between 1 and 5"

---

## Testing Verify Payment Endpoint

**Note**: This endpoint requires actual payment data from Razorpay. Use the full payment flow below for testing.

### Request Format
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_ABC123XYZ",
    "razorpay_payment_id": "pay_DEF456UVW",
    "razorpay_signature": "abc123def456..."
  }'
```

### Expected Response (Success)
```json
{
  "ok": true
}
```

### Expected Response (Invalid Signature)
```json
{
  "ok": false,
  "error": "Invalid payment signature"
}
```

---

## End-to-End Payment Flow Testing

### Step 1: Create Order
```bash
# Save response to variable or file
ORDER_RESPONSE=$(curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "vayu-ai-glasses",
    "variantId": "non-prescription",
    "quantity": 1
  }')

# Extract orderId and keyId from response
echo $ORDER_RESPONSE
```

### Step 2: Use Razorpay Test Payment
1. Use the `keyId` from the response
2. Use Razorpay test credentials:
   - **Test Card**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: `123`
   - **OTP**: `123456`
3. Complete payment in Razorpay checkout
4. Get payment response with `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`

### Step 3: Verify Payment
```bash
curl -X POST http://localhost:8000/api/payments/razorpay/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "<from_payment_response>",
    "razorpay_payment_id": "<from_payment_response>",
    "razorpay_signature": "<from_payment_response>"
  }'
```

---

## Razorpay Test Credentials

### Test Cards
- **Success**: `4111 1111 1111 1111` (any future expiry, CVV: 123, OTP: 123456)
- **Failure**: `4000 0000 0000 0002`

### Test UPI
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Test NetBanking
- Select any bank, payment will succeed automatically in test mode

---

## Security Verification

### ✅ Checklist
- [ ] `RAZORPAY_KEY_SECRET` is NOT in any code files
- [ ] `.env` is in `.gitignore`
- [ ] No secrets are logged or printed
- [ ] Health endpoint confirms config without exposing secrets
- [ ] All pricing calculated server-side
- [ ] Payment signatures verified server-side

---

## Troubleshooting

### Issue: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set"
**Solution**: Ensure `.env` file exists and contains both variables, or export them in your shell.

### Issue: "Failed to create payment order"
**Solution**: 
- Check Razorpay dashboard for API key validity
- Verify network connectivity
- Check backend logs for detailed error

### Issue: "Invalid payment signature"
**Solution**:
- Ensure using correct `RAZORPAY_KEY_SECRET` that matches the key used to create order
- Verify signature is not modified before sending to verify endpoint

### Issue: CORS errors
**Solution**: 
- Check CORS middleware configuration in `server.py`
- Ensure frontend origin is in `allow_origins` list

---

## Production Checklist

Before deploying:
1. [ ] Switch to Razorpay **LIVE** keys (not test keys)
2. [ ] Update environment variables in production environment
3. [ ] Test with real payment (small amount)
4. [ ] Set up order storage in database
5. [ ] Configure order confirmation emails
6. [ ] Set up monitoring/alerts for failed payments
7. [ ] Review CORS origins (remove localhost, add production domain only)
