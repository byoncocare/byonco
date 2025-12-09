"""
Diagnostic script to check what's actually deployed on Render
"""
import requests
import json

BACKEND_URL = "https://byonco-fastapi-backend.onrender.com"

print("=" * 70)
print("🔍 Diagnosing Backend Deployment")
print("=" * 70)
print(f"Backend URL: {BACKEND_URL}\n")

# Test 1: Root endpoint
print("1. Testing root endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/", timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Message: {data.get('message', 'N/A')}")
        
        # Check registered routes
        if 'registered_routes' in data:
            routes = data['registered_routes']
            print(f"   Registered routes: {len(routes)}")
            
            # Check for specific routes
            route_paths = [r.get('path', '') for r in routes]
            
            if '/api/cancer-types' in route_paths:
                print("   ✅ /api/cancer-types is registered")
            else:
                print("   ❌ /api/cancer-types is NOT registered")
                print(f"   Available routes: {route_paths[:10]}")
            
            if '/api/rare-cancers' in route_paths:
                print("   ✅ /api/rare-cancers is registered")
            else:
                print("   ❌ /api/rare-cancers is NOT registered")
        else:
            print("   ⚠️  No 'registered_routes' in response")
            print(f"   Response: {json.dumps(data, indent=2)[:500]}")
    else:
        print(f"   ❌ Error: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print()

# Test 2: Cancer types endpoint
print("2. Testing /api/cancer-types endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/api/cancer-types", timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("   ✅ Endpoint works!")
        if isinstance(data, dict):
            print(f"   Keys: {list(data.keys())}")
    else:
        print(f"   ❌ Error: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print()

# Test 3: Rare cancers endpoint
print("3. Testing /api/rare-cancers endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/api/rare-cancers", timeout=30)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("   ✅ Endpoint works!")
        if isinstance(data, list):
            print(f"   Returned {len(data)} items")
    else:
        print(f"   ❌ Error: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print()
print("=" * 70)
print("Diagnosis complete!")
print("=" * 70)



