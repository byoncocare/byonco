# ✅ Razorpay Lazy Initialization Fix

## Problem
- Frontend calls `POST /api/payments/razorpay/create-order`
- Backend returns 400: "RazorPay client not initialized..."
- But `GET /api/payments/razorpay/health` returns `key_id_present=true` and `key_secret_present=true`
- **Root cause**: Global initialization pattern failed silently, leaving `razorpay_client = None`

## Solution: Lazy Initialization

### Changes Made

#### 1. **Removed Global Initialization** (`backend/payments/service.py`)
- ❌ Removed: `razorpay_client = None` global variable
- ❌ Removed: Module-level `if razorpay and RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET: razorpay_client = ...`
- ✅ Added: `get_razorpay_client()` function with lazy initialization

#### 2. **Lazy Initialization Function** (`backend/payments/service.py`)
```python
def get_razorpay_client():
    """
    Lazy initialization of Razorpay client.
    Creates the client on demand and caches it.
    """
    global _razorpay_client_cache
    
    # Return cached client if available
    if _razorpay_client_cache is not None:
        return _razorpay_client_cache
    
    # Read env vars EXACTLY
    key_id = os.getenv("RAZORPAY_KEY_ID", "").strip()
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "").strip()
    
    # Validate and raise HTTPException if missing
    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="...")
    
    # Create and cache client
    _razorpay_client_cache = razorpay.Client(auth=(key_id, key_secret))
    logger.info(f"Razorpay init ok: key_id_len={len(key_id)}, secret_len={len(key_secret)}")
    return _razorpay_client_cache
```

#### 3. **Updated PaymentService** (`backend/payments/service.py`)
- Removed `self.client = razorpay_client` from `__init__`
- Updated `create_order()` to call `get_razorpay_client()` inside the method
- Client is created on-demand, not at module load time

#### 4. **Updated Endpoints** (`backend/payments/api_routes.py`)
- `POST /api/payments/razorpay/create-order` - Now calls `payment_service.create_order()` which uses lazy init
- `POST /api/payments/razorpay/verify` - Uses `payment_service.verify_payment()` which reads secret directly
- Both endpoints no longer rely on global client

#### 5. **Added Diagnostic Endpoint** (`backend/payments/api_routes.py`)
- `GET /api/payments/razorpay/env-check`
- Returns:
  - `key_id_present` (bool)
  - `key_secret_present` (bool)
  - `key_id_len` (int)
  - `key_secret_len` (int)
  - `key_id_prefix` (first 6 chars)
  - `key_id_suffix` (last 4 chars)
  - `service_version` (git commit hash)

#### 6. **Enhanced Logging**
- On successful init: `"Razorpay init ok: key_id_len=..., secret_len=..."`
- On failure: Full exception stack trace with `exc_info=True`
- All error paths log with context

## Files Changed

1. **`backend/payments/service.py`**
   - Removed global `razorpay_client` variable
   - Added `get_razorpay_client()` function
   - Updated `PaymentService.create_order()` to use lazy init
   - Updated `PaymentService.verify_payment()` to read secret directly

2. **`backend/payments/api_routes.py`**
   - Removed global `RAZORPAY_KEY_ID` variable
   - Updated `create_vayu_order()` to read key_id from env when needed
   - Added `GET /api/payments/razorpay/env-check` endpoint
   - Enhanced error logging with `exc_info=True`

## Testing Commands

### 1. Test Health Endpoint
```bash
curl https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/health
```
Expected: `{"ok": true, "key_id_present": true, "key_secret_present": true}`

### 2. Test Diagnostic Endpoint
```bash
curl https://byonco-fastapi-backend.onrender.com/api/payments/razorpay/env-check
```
Expected: Detailed env info including lengths and prefixes

### 3. Test Create Order (Local)
```bash
# Start server locally
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Test create-order
curl -X POST http://localhost:8000/api/payments/razorpay/create-order \
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
Expected: `{"keyId": "...", "razorpayOrderId": "order_...", "orderId": "...", "amount": 59999, "currency": "INR"}`

### 4. Test Create Order (Production)
```bash
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

## Verification Checklist

- ✅ Global initialization removed
- ✅ Lazy initialization implemented
- ✅ Environment variables read with `.strip()`
- ✅ HTTPException raised if env vars missing
- ✅ Client cached after first creation
- ✅ Logging added for init success/failure
- ✅ Diagnostic endpoint added
- ✅ Both endpoints updated
- ✅ `razorpay` package confirmed in `requirements.txt`

## Deployment Status

✅ **Code committed and pushed to:**
- `byonco-fastapi-backend` repository (Render backend)
- `byonco` repository (main repo)

✅ **Render should auto-deploy** from the backend repository

## After Deployment

1. **Check Render Logs:**
   - Look for: `"Razorpay init ok: key_id_len=..., secret_len=..."`
   - Should appear on first payment request

2. **Test Payment Flow:**
   - Go to: `https://www.byoncocare.com/products/vayu/checkout`
   - Fill form and click "Pay now"
   - Should open Razorpay checkout modal (no error)

3. **If Still Failing:**
   - Check `/api/payments/razorpay/env-check` endpoint
   - Verify `key_id_len` and `key_secret_len` are > 0
   - Check Render logs for initialization errors

---

**Status:** ✅ Code deployed, waiting for Render to redeploy.

