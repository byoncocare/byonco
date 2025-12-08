"""
Alternative entry point for Render deployment
This file imports the app from backend.server
"""
import sys
import os
from pathlib import Path

# Add project root to Python path FIRST
project_root = Path(__file__).parent.absolute()
sys.path.insert(0, str(project_root))

# Also add backend directory to path
backend_path = project_root / "backend"
if backend_path.exists():
    sys.path.insert(0, str(backend_path))

# Change to project root directory
os.chdir(project_root)

# Print diagnostics BEFORE import
print("=" * 70)
print("DIAGNOSTICS: Before import")
print("=" * 70)
print(f"Python path: {sys.path[:3]}")
print(f"Current directory: {os.getcwd()}")
print(f"Project root: {project_root}")
print(f"Backend path: {backend_path}")
print(f"Backend exists: {backend_path.exists()}")
if backend_path.exists():
    backend_files = [f.name for f in backend_path.iterdir() if f.is_file()]
    print(f"Backend files: {backend_files[:10]}")
print("=" * 70)

# Initialize app variable to None (so it always exists)
app = None

# Import the app - this must succeed
try:
    print("Attempting to import backend.server...")
    from backend.server import app as fastapi_app
    # Ensure app variable exists for uvicorn
    app = fastapi_app
    print("✅ Successfully imported backend.server")
    print(f"✅ App type: {type(app)}")
except Exception as e:
    import traceback
    print("=" * 70)
    print("CRITICAL: Failed to import backend.server")
    print("=" * 70)
    print(f"Error type: {type(e).__name__}")
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
    # Create a minimal app so uvicorn can at least start and show the error
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/")
    def error():
        return {"error": f"Import failed: {str(e)}", "traceback": traceback.format_exc()}
    # Don't raise - let uvicorn start so we can see the error

# Verify app exists
if app is None:
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/")
    def error():
        return {"error": "App variable not set after import"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

