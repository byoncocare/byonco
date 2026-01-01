#!/usr/bin/env python3
"""
Quick verification script to check if /api/payments/razorpay/key endpoint exists
"""
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

try:
    from payments.api_routes import create_api_router
    from motor.motor_asyncio import AsyncIOMotorClient
    import os
    
    # Mock DB for testing
    os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
    os.environ['DB_NAME'] = 'test'
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['test']
    
    # Create routers
    payments_router, razorpay_router = create_api_router(db)
    
    # Check routes
    routes = [r.path for r in razorpay_router.routes]
    
    print("✅ Razorpay router routes:")
    for route in routes:
        print(f"   {route}")
    
    if "/api/payments/razorpay/key" in routes:
        print("\n✅ SUCCESS: /api/payments/razorpay/key endpoint exists!")
        print("   The endpoint is properly registered in the router.")
    else:
        print("\n❌ ERROR: /api/payments/razorpay/key endpoint NOT found!")
        print("   Available routes:", routes)
        sys.exit(1)
        
    # Check if router is included in server.py
    server_file = backend_path / "server.py"
    if server_file.exists():
        content = server_file.read_text()
        if "app.include_router(razorpay_router)" in content:
            print("\n✅ SUCCESS: razorpay_router is included in server.py")
        else:
            print("\n❌ ERROR: razorpay_router is NOT included in server.py")
            sys.exit(1)
    else:
        print("\n⚠️  WARNING: server.py not found")
        
    print("\n✅ All checks passed! Endpoint is ready for deployment.")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

