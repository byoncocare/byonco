"""
Alternative entry point for Render deployment
This file imports the app from backend.server
"""
import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.absolute()
sys.path.insert(0, str(project_root))

# Also add backend directory to path
backend_path = project_root / "backend"
if backend_path.exists():
    sys.path.insert(0, str(backend_path))

# Change to project root directory
os.chdir(project_root)

# Import the app - this must succeed
try:
    from backend.server import app as fastapi_app
    # Ensure app variable exists for uvicorn
    app = fastapi_app
except ImportError as e:
    import traceback
    print("=" * 70)
    print("CRITICAL: Failed to import backend.server")
    print("=" * 70)
    print(f"Error: {e}")
    print(f"Python path: {sys.path}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Project root: {project_root}")
    print(f"Backend path: {backend_path}")
    print(f"Backend exists: {backend_path.exists()}")
    if backend_path.exists():
        print(f"Backend contents: {list(backend_path.iterdir())[:10]}")
    print("=" * 70)
    traceback.print_exc()
    print("=" * 70)
    # Re-raise to fail deployment
    raise

# Verify app exists
if 'app' not in globals():
    raise RuntimeError("App variable not set after import")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

