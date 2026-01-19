"""
Subscription middleware for backend endpoints
TASK 3: Enforce subscription checks at API level
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import sys
from pathlib import Path

# Add auth module to path
auth_path = Path(__file__).parent.parent / "auth"
sys.path.insert(0, str(auth_path))
from auth.service import AuthService

security = HTTPBearer(auto_error=False)


async def require_subscription(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db=None
) -> dict:
    """
    Dependency that requires active subscription for premium endpoints.
    Returns user info if subscription is active, otherwise raises HTTPException.
    
    Usage:
        @router.post("/premium-endpoint")
        async def premium_endpoint(user: dict = Depends(require_subscription)):
            # user contains user info
            ...
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    token = credentials.credentials
    
    # Verify token and get user
    auth_service = AuthService(db)
    payload = auth_service.verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user from database
    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_email = user.get("email", "").lower()
    
    # Admin bypass (check admin emails)
    ADMIN_EMAILS = [
        'admin@byoncocare.com',
        'ajinkya@byoncocare.com',
        'imajinkyajadhav@gmail.com'
    ]
    if user_email in [email.lower() for email in ADMIN_EMAILS]:
        return user
    
    # Check subscription
    from payments.service import PaymentService
    payment_service = PaymentService(db)
    subscription = await payment_service.get_active_subscription(user_email)
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "code": "SUBSCRIPTION_REQUIRED",
                "message": "Active subscription required to access this feature"
            }
        )
    
    return user


def create_subscription_checker(db):
    """
    Factory function to create subscription checker with database dependency.
    Use this in router creation.
    
    Usage:
        subscription_checker = create_subscription_checker(db)
        
        @router.post("/premium-endpoint")
        async def premium_endpoint(user: dict = Depends(subscription_checker)):
            ...
    """
    async def check_subscription(
        credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
    ) -> dict:
        return await require_subscription(credentials, db)
    
    return check_subscription
