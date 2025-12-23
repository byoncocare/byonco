"""
Razorpay Payment Integration for Vayu Orders
============================================

This module provides secure Razorpay payment endpoints for Vayu AI Glasses orders.

Security:
- All pricing is calculated server-side (client prices are ignored)
- Payment signatures are verified using HMAC-SHA256
- RAZORPAY_KEY_SECRET is never exposed to clients
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import os
import hmac
import hashlib
import secrets
from datetime import datetime
import uuid

# Import Razorpay SDK with alias to avoid naming collisions
try:
    import razorpay as razorpay_sdk
except ImportError:
    raise ImportError(
        "razorpay package not installed. Install with: pip install razorpay"
    )

router = APIRouter(prefix="/api/payments/razorpay", tags=["Razorpay"])


def _get_razorpay_client():
    """
    Helper function to safely create Razorpay client.
    Loads environment variables and validates they exist.
    
    Returns:
        razorpay_sdk.Client: Initialized Razorpay client
        
    Raises:
        ValueError: If environment variables are not set
    """
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    if not key_id or not key_secret:
        raise ValueError(
            "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables"
        )
    
    return razorpay_sdk.Client(auth=(key_id, key_secret))


def _get_key_id():
    """Get RAZORPAY_KEY_ID from environment (public key only)."""
    key_id = os.getenv("RAZORPAY_KEY_ID")
    if not key_id:
        raise ValueError("RAZORPAY_KEY_ID must be set in environment variables")
    return key_id


def _get_key_secret():
    """Get RAZORPAY_KEY_SECRET from environment (for signature verification only)."""
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    if not key_secret:
        raise ValueError("RAZORPAY_KEY_SECRET must be set in environment variables")
    return key_secret

# ============================================================================
# SERVER-SIDE PRODUCT CATALOG (Canonical Pricing Source)
# ============================================================================

VAYU_PRODUCT_CATALOG = {
    "vayu-ai-glasses": {
        "name": "Vayu AI Glasses",
        "base_price": 59999.0,  # INR - Non-prescription base price
        "variants": {
            "non-prescription": {
                "label": "Non-prescription",
                "price_delta": 0,
                "compare_at_price": 69999.0,
            },
            "prescription": {
                "label": "Prescription",
                "price_delta": 5000,  # Additional ₹5,000
                "compare_at_price": 74999.0,
            },
        },
        "max_quantity": 5,
    }
}


def get_unit_price(product_id: str, variant_id: str) -> float:
    """Get unit price for a product variant (server-side calculation)."""
    if product_id not in VAYU_PRODUCT_CATALOG:
        raise ValueError(f"Unknown product: {product_id}")

    product = VAYU_PRODUCT_CATALOG[product_id]
    if variant_id not in product["variants"]:
        raise ValueError(f"Unknown variant: {variant_id} for product {product_id}")

    variant = product["variants"][variant_id]
    return product["base_price"] + variant["price_delta"]


def validate_quantity(product_id: str, quantity: int) -> None:
    """Validate quantity is within allowed range."""
    if product_id not in VAYU_PRODUCT_CATALOG:
        raise ValueError(f"Unknown product: {product_id}")

    max_qty = VAYU_PRODUCT_CATALOG[product_id]["max_quantity"]
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
    product_id: str, variant_id: str, quantity: int, coupon_code: Optional[str] = None
) -> dict:
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

    # Shipping is free for now
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
# REQUEST/RESPONSE MODELS
# ============================================================================


class CustomerInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CreateOrderRequest(BaseModel):
    productId: str = Field(..., description="Product ID (e.g., 'vayu-ai-glasses')")
    variantId: str = Field(..., description="Variant ID (e.g., 'non-prescription' or 'prescription')")
    quantity: int = Field(..., gt=0, description="Quantity (1-5)")
    couponCode: Optional[str] = Field(None, description="Optional coupon code")
    customer: Optional[CustomerInfo] = Field(None, description="Optional customer info")


class CreateOrderResponse(BaseModel):
    orderId: str
    amount: float  # Final amount in INR (not paise)
    currency: str
    keyId: str  # Public key ID only


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    ok: bool
    error: Optional[str] = None


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
        # Server-side pricing calculation (IGNORE any client-provided prices)
        totals = calculate_order_totals(
            product_id=request.productId,
            variant_id=request.variantId,
            quantity=request.quantity,
            coupon_code=request.couponCode,
        )

        # Generate unique order ID
        order_id = f"VAYU-{datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"

        # Create Razorpay order
        try:
            client = _get_razorpay_client()
            razorpay_order = client.order.create(
                {
                    "amount": totals["total_paise"],  # Amount in paise
                    "currency": "INR",
                    "receipt": f"vayu_{order_id}",
                    "notes": {
                        "internal_order_id": order_id,
                        "product": request.productId,
                        "variant": request.variantId,
                        "quantity": str(request.quantity),
                    },
                }
            )
        except ValueError as e:
            # Environment variable error
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            # Log error but don't expose internal details
            print(f"Razorpay order creation failed: {str(e)}")
            raise HTTPException(
                status_code=500, detail="Failed to create payment order. Please try again."
            )

        return CreateOrderResponse(
            orderId=order_id,
            amount=totals["final_total"],  # Return in INR (not paise)
            currency="INR",
            keyId=_get_key_id(),  # Public key only
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in create_order: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating your order. Please try again.",
        )


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(request: VerifyPaymentRequest):
    """
    Verify Razorpay payment signature.

    SECURITY:
    - Signature is verified using HMAC-SHA256
    - Constant-time comparison to prevent timing attacks
    - Only returns success if signature is valid
    """
    try:
        # Verify payment signature (CRITICAL SECURITY STEP)
        key_secret = _get_key_secret()
        message = f"{request.razorpay_order_id}|{request.razorpay_payment_id}"
        generated_signature = hmac.new(
            key_secret.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        # Constant-time comparison to prevent timing attacks
        if not secrets.compare_digest(generated_signature, request.razorpay_signature):
            # Log failed verification attempt (for security monitoring)
            print(
                f"Payment signature verification failed for order {request.razorpay_order_id}"
            )
            return VerifyPaymentResponse(
                ok=False, error="Invalid payment signature"
            )

        # Signature is valid
        # TODO: Store payment confirmation in database
        # TODO: Send order confirmation email

        return VerifyPaymentResponse(ok=True)

    except Exception as e:
        print(f"Unexpected error in verify_payment: {str(e)}")
        return VerifyPaymentResponse(
            ok=False, error="An error occurred while verifying payment."
        )

