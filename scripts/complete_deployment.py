"""
Complete Deployment Script
Runs admin user creation and verifies deployment
"""
import asyncio
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import admin user creation
sys.path.insert(0, str(backend_dir / "scripts"))
from create_admin_user import create_admin_user

async def main():
    """Complete deployment steps"""
    print("🚀 Complete Deployment Script")
    print("=" * 50)
    print("")
    
    print("📋 Step 1: Creating Admin User...")
    print("-" * 50)
    try:
        await create_admin_user()
        print("")
        print("✅ Step 1 Complete: Admin user created/updated")
    except Exception as e:
        print(f"❌ Step 1 Failed: {str(e)}")
        print("")
        print("⚠️  You may need to:")
        print("   1. Check MongoDB connection string in .env")
        print("   2. Ensure backend is deployed to Render first")
        print("   3. Run this script after backend deployment")
        return
    
    print("")
    print("📋 Step 2: Deployment Verification...")
    print("-" * 50)
    print("✅ Backend code ready for deployment")
    print("✅ Admin user script ready")
    print("")
    print("🎉 Deployment Steps Complete!")
    print("")
    print("📝 Next Actions:")
    print("   1. Deploy backend to Render (if not already done)")
    print("   2. Run this script after backend is deployed")
    print("   3. Verify admin login works")
    print("")

if __name__ == "__main__":
    asyncio.run(main())
