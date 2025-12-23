"""
FastAPI Backend Implementation for Razorpay Vayu Orders
========================================================

This file should be added to your FastAPI backend project.

File location suggestion: app/routes/razorpay_payments.py

To use:
1. Copy this file to your FastAPI backend
2. Install dependencies: pip install razorpay python-dotenv
3. Set environment variables: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
4. Register router in your main app (see bottom of file)
5. Set up database table (see schema below) or use in-memory store for MVP

SECURITY NOTES:
- NEVER commit RAZORPAY_KEY_SECRET to git
- Use environment variables only
- All pricing calculations happen server-side
- Payment signatures are verified server-side before marking orders as paid
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
import razorpay
import os
import hmac
import hashlib
from datetime import datetime
import uuid
import secrets

# ============================================================================
# CONFIGURATION & INITIALIZATION
# ============================================================================

router = APIRouter(prefix="/api/payments/razorpay", tags=["payments"])

# Load environment variables
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

# Validate that secrets are set
if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise ValueError(
        "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables"
    )

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# ============================================================================
# SERVER-SIDE PRICING LOGIC (CANONICAL SOURCE OF TRUTH)
# ============================================================================

# Vayu product pricing map (server-side canonical pricing)
VAYU_PRODUCT_PRICING = {
    "vayu-ai-glasses": {
        "base_price": 59999.0,  # Non-prescription base price in INR
        "variants": {
            "non-prescription": {"price_delta": 0, "compare_at_price": 69999.0},
            "prescription": {"price_delta": 5000, "compare_at_price": 74999.0},
        },
        "max_quantity": 5,
    }
}


def get_unit_price(product_id: str, variant_id: str) -> float:
    """Get unit price for a product variant (server-side calculation)."""
    if product_id not in VAYU_PRODUCT_PRICING:
        raise ValueError(f"Unknown product: {product_id}")
    
    product = VAYU_PRODUCT_PRICING[product_id]
    if variant_id not in product["variants"]:
        raise ValueError(f"Unknown variant: {variant_id} for product {product_id}")
    
    variant = product["variants"][variant_id]
    return product["base_price"] + variant["price_delta"]


def validate_quantity(product_id: str, quantity: int) -> None:
    """Validate quantity is within allowed range."""
    if product_id not in VAYU_PRODUCT_PRICING:
        raise ValueError(f"Unknown product: {product_id}")
    
    max_qty = VAYU_PRODUCT_PRICING[product_id]["max_quantity"]
    if quantity < 1 or quantity > max_qty:
        raise ValueError(f"Quantity must be between 1 and {max_qty}")


def apply_coupon(subtotal: float, coupon_code: Optional[str]) -> tuple[float, float]:
    """
    Apply coupon discount (server-side calculation).
    Returns: (discount_amount, final_amount)
    """
    if not coupon_code:
        return 0.0, subtotal
    
    coupon_code = coupon_code.strip().upper()
    
    if coupon_code == "LAUNCH2025":
        discount = round(subtotal * 0.10, 2)  # 10% off
        return discount, subtotal - discount
    elif coupon_code == "VAYU5000":
        discount = min(5000.0, subtotal)  # Flat ₹5,000 off (max discount = subtotal)
        return discount, subtotal - discount
    
    raise ValueError("Invalid coupon code")


def calculate_order_totals(
    product_id: str,
    variant_id: str,
    quantity: int,
    coupon_code: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Calculate order totals server-side (canonical pricing logic).
    Returns dict with: subtotal, discount, final_total, total_paise
    """
    # Validate inputs
    validate_quantity(product_id, quantity)
    unit_price = get_unit_price(product_id, variant_id)
    
    # Calculate subtotal
    subtotal = unit_price * quantity
    
    # Apply coupon
    discount, final_total = apply_coupon(subtotal, coupon_code)
    
    # Shipping is free for now (can be added later)
    shipping_cost = 0.0
    
    # Final total
    total = final_total + shipping_cost
    
    # Convert to paise for Razorpay (amount must be in smallest currency unit)
    total_paise = int(round(total * 100))
    
    return {
        "subtotal": subtotal,
        "discount": discount,
        "shipping": shipping_cost,
        "final_total": total,
        "total_paise": total_paise,
        "unit_price": unit_price,
    }


# ============================================================================
# ORDER STORAGE (MVP: In-Memory, TODO: Replace with Database)
# ============================================================================

# TODO: Replace this with actual database storage
# In-memory store for MVP (orders will be lost on server restart)
_orders_store: Dict[str, Dict[str, Any]] = {}


def store_order(order_data: Dict[str, Any]) -> None:
    """Store order in database (MVP: in-memory)."""
    # TODO: Replace with actual database insert
    # Example SQL:
    # INSERT INTO vayu_orders (
    #     internal_order_id, razorpay_order_id, status, cart_data,
    #     contact_info, shipping_address, coupon_code, subtotal,
    #     discount, shipping_cost, total_amount, currency, created_at
    # ) VALUES (...)
    
    _orders_store[order_data["internal_order_id"]] = order_data


def get_order(internal_order_id: str) -> Optional[Dict[str, Any]]:
    """Get order by internal order ID."""
    # TODO: Replace with actual database query
    return _orders_store.get(internal_order_id)


def update_order_status(
    internal_order_id: str,
    status: str,
    razorpay_payment_id: Optional[str] = None,
    payment_signature: Optional[str] = None,
) -> None:
    """Update order status (MVP: in-memory)."""
    # TODO: Replace with actual database update
    # Example SQL:
    # UPDATE vayu_orders
    # SET status = ?, razorpay_payment_id = ?, payment_signature = ?, paid_at = NOW()
    # WHERE internal_order_id = ?
    
    if internal_order_id in _orders_store:
        _orders_store[internal_order_id]["status"] = status
        if razorpay_payment_id:
            _orders_store[internal_order_id]["razorpay_payment_id"] = razorpay_payment_id
        if payment_signature:
            _orders_store[internal_order_id]["payment_signature"] = payment_signature
        if status == "PAID":
            _orders_store[internal_order_id]["paid_at"] = datetime.utcnow().isoformat()


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CartItem(BaseModel):
    productId: str
    productName: str
    variantId: str
    variantLabel: str
    quantity: int = Field(gt=0)
    unitPrice: float  # Client-provided, but we recalculate server-side
    image: Optional[str] = None


class ContactInfo(BaseModel):
    email: EmailStr
    phone: str
    emailUpdates: Optional[bool] = False


class ShippingAddress(BaseModel):
    country: str = "India"
    firstName: str
    lastName: str
    address1: str
    address2: Optional[str] = None
    city: str
    state: str
    pin: str


class CreateOrderRequest(BaseModel):
    cart: Dict[str, Any]  # Contains items array
    contact: Dict[str, Any]
    shippingAddress: Dict[str, Any]
    couponCode: Optional[str] = None


class CreateOrderResponse(BaseModel):
    razorpayOrderId: str
    amount: float  # Final amount in INR (not paise)
    currency: str
    keyId: str  # Public key ID only
    orderId: str  # Internal order ID


class VerifyPaymentRequest(BaseModel):
    razorpayOrderId: str
    razorpayPaymentId: str
    razorpaySignature: str
    internalOrderId: str


class VerifyPaymentResponse(BaseModel):
    success: bool
    orderId: str
    message: str


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    """
    Create a Razorpay order with server-side pricing calculation.
    
    SECURITY:
    - All pricing is calculated server-side (client prices are ignored)
    - Product ID and variant are validated
    - Quantity is validated against max allowed
    - Coupon codes are validated server-side
    """
    try:
        # Extract cart item (assuming single item for MVP)
        if not request.cart.get("items") or len(request.cart["items"]) == 0:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        item = request.cart["items"][0]
        product_id = item.get("productId", "")
        variant_id = item.get("variantId", "")
        quantity = item.get("quantity", 1)
        
        # Server-side pricing calculation (IGNORE client-provided unitPrice)
        totals = calculate_order_totals(
            product_id=product_id,
            variant_id=variant_id,
            quantity=quantity,
            coupon_code=request.couponCode,
        )
        
        # Generate internal order ID
        internal_order_id = f"VAYU-{datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"
        
        # Create Razorpay order
        try:
            razorpay_order = razorpay_client.order.create({
                "amount": totals["total_paise"],  # Amount in paise
                "currency": "INR",
                "receipt": f"vayu_{internal_order_id}",
                "notes": {
                    "internal_order_id": internal_order_id,
                    "product": item.get("productName", ""),
                    "variant": variant_id,
                    "quantity": str(quantity),
                    "email": request.contact.get("email", ""),
                },
            })
        except Exception as e:
            # Log error but don't expose internal details
            print(f"Razorpay order creation failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to create payment order. Please try again."
            )
        
        # Store order in database (status: CREATED)
        order_data = {
            "internal_order_id": internal_order_id,
            "razorpay_order_id": razorpay_order["id"],
            "status": "CREATED",
            "cart_data": request.cart,
            "contact_info": request.contact,
            "shipping_address": request.shippingAddress,
            "coupon_code": request.couponCode,
            "subtotal": totals["subtotal"],
            "discount": totals["discount"],
            "shipping_cost": totals["shipping"],
            "total_amount": totals["final_total"],
            "currency": "INR",
            "created_at": datetime.utcnow().isoformat(),
        }
        store_order(order_data)
        
        return CreateOrderResponse(
            razorpayOrderId=razorpay_order["id"],
            amount=totals["final_total"],  # Return in INR (not paise)
            currency="INR",
            keyId=RAZORPAY_KEY_ID,  # Public key only
            orderId=internal_order_id,
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in create_order: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating your order. Please try again."
        )


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(request: VerifyPaymentRequest):
    """
    Verify Razorpay payment signature and mark order as paid.
    
    SECURITY:
    - Signature is verified using HMAC-SHA256
    - Constant-time comparison to prevent timing attacks
    - Order must exist and match razorpay_order_id
    - Only mark as PAID after successful signature verification
    """
    try:
        # Retrieve order from database
        order = get_order(request.internalOrderId)
        if not order:
            raise HTTPException(
                status_code=404,
                detail=f"Order {request.internalOrderId} not found"
            )
        
        # Verify razorpay_order_id matches
        if order["razorpay_order_id"] != request.razorpayOrderId:
            raise HTTPException(
                status_code=400,
                detail="Order ID mismatch"
            )
        
        # Verify payment signature (CRITICAL SECURITY STEP)
        message = f"{request.razorpayOrderId}|{request.razorpayPaymentId}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        
        # Constant-time comparison to prevent timing attacks
        if not secrets.compare_digest(generated_signature, request.razorpaySignature):
            # Log failed verification attempt (for security monitoring)
            print(f"Payment signature verification failed for order {request.internalOrderId}")
            raise HTTPException(
                status_code=400,
                detail="Invalid payment signature"
            )
        
        # Signature is valid - mark order as PAID
        update_order_status(
            internal_order_id=request.internalOrderId,
            status="PAID",
            razorpay_payment_id=request.razorpayPaymentId,
            payment_signature=request.razorpaySignature,
        )
        
        # TODO: Send confirmation email here
        # Example:
        # send_order_confirmation_email(
        #     email=order["contact_info"]["email"],
        #     order_id=request.internalOrderId,
        #     order_details=order
        # )
        
        return VerifyPaymentResponse(
            success=True,
            orderId=request.internalOrderId,
            message="Payment verified and order confirmed",
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in verify_payment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while verifying payment. Please contact support."
        )


# ============================================================================
# REGISTRATION IN MAIN APP
# ============================================================================

"""
To register this router in your FastAPI app:

In your main.py or app.py:

from fastapi import FastAPI
from app.routes import razorpay_payments  # Adjust import path as needed

app = FastAPI()

# Add CORS middleware (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "https://your-frontend-domain.com",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register router
app.include_router(razorpay_payments.router)

# Or if using a router prefix:
# app.include_router(razorpay_payments.router, prefix="/api")
"""


# ============================================================================
# DATABASE SCHEMA (PostgreSQL Example)
# ============================================================================

"""
CREATE TABLE vayu_orders (
    id SERIAL PRIMARY KEY,
    internal_order_id VARCHAR(50) UNIQUE NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'CREATED',  -- CREATED, PAID, FAILED, CANCELLED
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
    payment_signature TEXT,
    INDEX idx_internal_order_id (internal_order_id),
    INDEX idx_razorpay_order_id (razorpay_order_id),
    INDEX idx_status (status)
);
"""

