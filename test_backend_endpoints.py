"""
Test script to verify backend endpoints after deployment
Run this after redeploying the backend on Render
"""
import requests
import json
from typing import Dict, Any

BACKEND_URL = "https://byonco-fastapi-backend.onrender.com"

def test_endpoint(url: str, method: str = "GET", data: Dict = None) -> tuple[bool, Any]:
    """Test an endpoint and return (success, response_data)"""
    try:
        if method == "GET":
            response = requests.get(url, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=30)
        else:
            return False, f"Unsupported method: {method}"
        
        if response.status_code == 200:
            return True, response.json()
        else:
            return False, f"Status {response.status_code}: {response.text[:200]}"
    except requests.exceptions.Timeout:
        return False, "Request timeout (backend may be sleeping)"
    except requests.exceptions.ConnectionError:
        return False, "Connection error (backend may be down)"
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    print("=" * 70)
    print("🧪 Testing Backend Endpoints After Deployment")
    print("=" * 70)
    print(f"Backend URL: {BACKEND_URL}\n")
    
    tests = [
        ("Root Endpoint", f"{BACKEND_URL}/", "GET"),
        ("Cancer Types", f"{BACKEND_URL}/api/cancer-types", "GET"),
        ("Rare Cancers", f"{BACKEND_URL}/api/rare-cancers", "GET"),
        ("Rare Cancers (Ultra-Rare)", f"{BACKEND_URL}/api/rare-cancers?category=ultra-rare", "GET"),
        ("DIPG Specialists", f"{BACKEND_URL}/api/rare-cancers/Diffuse%20Intrinsic%20Pontine%20Glioma%20(DIPG)/specialists", "GET"),
        ("Hospitals", f"{BACKEND_URL}/api/hospitals", "GET"),
        ("Doctors", f"{BACKEND_URL}/api/doctors", "GET"),
    ]
    
    results = []
    for name, url, method in tests:
        print(f"Testing: {name}")
        print(f"  URL: {url}")
        success, data = test_endpoint(url, method)
        
        if success:
            print(f"  ✅ SUCCESS")
            if isinstance(data, dict):
                if "registered_routes" in data:
                    routes = data.get("registered_routes", [])
                    print(f"  📊 Found {len(routes)} registered routes")
                    # Check for key routes
                    route_paths = [r.get("path", "") for r in routes]
                    if "/api/cancer-types" in route_paths:
                        print(f"  ✅ /api/cancer-types route found")
                    if "/api/rare-cancers" in route_paths:
                        print(f"  ✅ /api/rare-cancers route found")
                elif "rare_cancers" in data:
                    print(f"  📊 Found {len(data.get('rare_cancers', []))} rare cancers")
                elif isinstance(data, list):
                    print(f"  📊 Returned {len(data)} items")
            print()
            results.append((name, True, "Success"))
        else:
            print(f"  ❌ FAILED: {data}")
            print()
            results.append((name, False, data))
    
    # Summary
    print("=" * 70)
    print("📊 Test Summary")
    print("=" * 70)
    passed = sum(1 for _, success, _ in results if success)
    total = len(results)
    
    for name, success, message in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if not success:
            print(f"      Error: {message}")
    
    print()
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())

