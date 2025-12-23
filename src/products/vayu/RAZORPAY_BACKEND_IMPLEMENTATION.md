# Razorpay Backend Implementation Guide

## Overview
The Vayu checkout flow requires two backend endpoints to be implemented in your FastAPI backend:

1. `POST /api/payments/razorpay/create-order` - Creates a Razorpay order and calculates server-side pricing
2. `POST /api/payments/razorpay/verify` - Verifies payment signature and stores the order

## Frontend Contract

The frontend (`VayuCheckoutPage.jsx`) expects these endpoints at:
- Base URL: `process.env.REACT_APP_BACKEND_URL` or `https://byonco-fastapi-backend.onrender.com`
- Full paths:
  - `POST {BACKEND_URL}/api/payments/razorpay/create-order`
  - `POST {BACKEND_URL}/api/payments/razorpay/verify`

---

## Endpoint 1: Create Order

### Request
```json
POST /api/payments/razorpay/create-order
Content-Type: application/json

{
  "cart": {
    "productId": "vayu-x",
    "productName": "Vayu AI Glasses",
    "variant": "non-prescription",  // or "prescription"
    "quantity": 1,
    "unitPrice": 43700.00,
    "image": "/vayu/hero.webp"
  },
  "contact": {
    "email": "user@example.com",
    "phone": "+91 9876543210",
    "emailUpdates": true
  },
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zip": "400001",
    "country": "India"
  },
  "couponCode": "LAUNCH2025"  // optional, can be null/empty
}
```

### Response (Success)
```json
{
  "razorpayOrderId": "order_ABC123XYZ",
  "amount": 39348.37,  // in INR (after discount)
  "currency": "INR",
  "keyId": "rzp_test_...",  // Your Razorpay Key ID
  "orderId": "VAYU-2025-001234"  // Your internal order ID
}
```

### Response (Error)
```json
{
  "detail": "Invalid coupon code"  // or other error message
}
```

### Implementation Notes

1. **Server-Side Pricing Calculation** (CRITICAL):
   - Base price: ₹43,700.00 (from `cart.unitPrice`)
   - Calculate discount based on `couponCode`:
     - `LAUNCH2025`: 10% discount
     - `VAYU5000`: Flat ₹5,000 discount
   - Final amount = `(unitPrice * quantity) - discount`
   - **DO NOT trust client-calculated totals** - always recalculate on server

2. **Razorpay Order Creation**:
   ```python
   import razorpay
   
   razorpay_client = razorpay.Client(
       auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
   )
   
   order_data = razorpay_client.order.create({
       "amount": int(final_amount * 100),  # Convert to paise
       "currency": "INR",
       "receipt": f"vayu_{internal_order_id}",
       "notes": {
           "product": cart["productName"],
           "variant": cart["variant"],
           "quantity": cart["quantity"]
       }
   })
   ```

3. **Internal Order Storage** (before returning):
   - Create a pending order record in your database
   - Status: `PENDING`
   - Store: cart data, contact, shipping address, coupon code, calculated amounts, `razorpayOrderId`

---

## Endpoint 2: Verify Payment

### Request
```json
POST /api/payments/razorpay/verify
Content-Type: application/json

{
  "razorpayOrderId": "order_ABC123XYZ",
  "razorpayPaymentId": "pay_DEF456UVW",
  "razorpaySignature": "abc123def456...",
  "internalOrderId": "VAYU-2025-001234"
}
```

### Response (Success)
```json
{
  "success": true,
  "orderId": "VAYU-2025-001234",
  "message": "Payment verified and order confirmed"
}
```

### Response (Error)
```json
{
  "success": false,
  "detail": "Invalid payment signature"
}
```

### Implementation Notes

1. **Signature Verification** (CRITICAL):
   ```python
   import razorpay
   import hmac
   import hashlib
   
   razorpay_client = razorpay.Client(
       auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
   )
   
   # Verify signature
   generated_signature = hmac.new(
       RAZORPAY_KEY_SECRET.encode(),
       f"{razorpayOrderId}|{razorpayPaymentId}".encode(),
       hashlib.sha256
   ).hexdigest()
   
   if generated_signature != razorpaySignature:
       raise ValueError("Invalid payment signature")
   ```

2. **Update Order Status**:
   - Find the order by `internalOrderId` or `razorpayOrderId`
   - Update status to `PAID` or `CONFIRMED`
   - Store: `razorpayPaymentId`, `razorpaySignature`, payment timestamp

3. **Optional: Send Confirmation Email**:
   - Use the contact email from the order
   - Include order details, shipping address, order ID

---

## Environment Variables Required

```bash
RAZORPAY_KEY_ID=rzp_test_...  # or rzp_live_... for production
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## Database Schema (Suggested)

```sql
CREATE TABLE vayu_orders (
    id SERIAL PRIMARY KEY,
    internal_order_id VARCHAR(50) UNIQUE NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, PAID, FAILED, CANCELLED
    cart_data JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    coupon_code VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    payment_signature TEXT
);
```

---

## FastAPI Implementation Example

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import razorpay
import os
import hmac
import hashlib
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/payments/razorpay", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# Coupon logic (match frontend)
def apply_coupon(subtotal: float, coupon_code: str) -> tuple[float, float]:
    """Returns (discount_amount, final_amount)"""
    if not coupon_code:
        return 0.0, subtotal
    
    coupon_code = coupon_code.upper().strip()
    
    if coupon_code == "LAUNCH2025":
        discount = subtotal * 0.10
        return discount, subtotal - discount
    elif coupon_code == "VAYU5000":
        discount = min(5000.0, subtotal)
        return discount, subtotal - discount
    
    raise ValueError("Invalid coupon code")

class CreateOrderRequest(BaseModel):
    cart: dict
    contact: dict
    shippingAddress: dict
    couponCode: str | None = None

class CreateOrderResponse(BaseModel):
    razorpayOrderId: str
    amount: float
    currency: str
    keyId: str
    orderId: str

@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    # Calculate server-side pricing
    unit_price = request.cart["unitPrice"]
    quantity = request.cart["quantity"]
    subtotal = unit_price * quantity
    
    # Apply coupon
    try:
        discount, final_amount = apply_coupon(subtotal, request.couponCode)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Generate internal order ID
    internal_order_id = f"VAYU-{datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"
    
    # Create Razorpay order
    try:
        razorpay_order = razorpay_client.order.create({
            "amount": int(final_amount * 100),  # Convert to paise
            "currency": "INR",
            "receipt": f"vayu_{internal_order_id}",
            "notes": {
                "product": request.cart["productName"],
                "variant": request.cart["variant"],
                "quantity": quantity
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")
    
    # Store order in database (PENDING status)
    # TODO: Insert into vayu_orders table
    
    return CreateOrderResponse(
        razorpayOrderId=razorpay_order["id"],
        amount=final_amount,
        currency="INR",
        keyId=RAZORPAY_KEY_ID,
        orderId=internal_order_id
    )

class VerifyPaymentRequest(BaseModel):
    razorpayOrderId: str
    razorpayPaymentId: str
    razorpaySignature: str
    internalOrderId: str

class VerifyPaymentResponse(BaseModel):
    success: bool
    orderId: str
    message: str

@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(request: VerifyPaymentRequest):
    # Verify signature
    message = f"{request.razorpayOrderId}|{request.razorpayPaymentId}"
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if generated_signature != request.razorpaySignature:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update order status in database
    # TODO: Update vayu_orders table
    # SET status = 'PAID', razorpay_payment_id = ..., paid_at = NOW()
    
    return VerifyPaymentResponse(
        success=True,
        orderId=request.internalOrderId,
        message="Payment verified and order confirmed"
    )
```

---

## Testing

1. **Test with Razorpay Test Keys**:
   - Use test mode keys from Razorpay dashboard
   - Test cards: https://razorpay.com/docs/payments/test-cards/

2. **Test Coupon Codes**:
   - `LAUNCH2025` → 10% discount
   - `VAYU5000` → ₹5,000 flat discount
   - Invalid code → 400 error

3. **Test Payment Flow**:
   - Create order → Get `razorpayOrderId`
   - Complete payment in Razorpay modal
   - Verify payment → Confirm order status updated

---

## Next Steps

1. Add these endpoints to your FastAPI backend
2. Set up database table for order storage
3. Configure environment variables
4. Test with Razorpay test keys
5. Deploy to production with live keys

---

## Questions?

If you need help implementing these endpoints or have questions about the contract, let me know!

