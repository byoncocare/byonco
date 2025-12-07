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
sys.path.insert(0, str(backend_path))

# Change to project root directory
os.chdir(project_root)

try:
    from backend.server import app
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Project root: {project_root}")
    print(f"Backend path exists: {backend_path.exists()}")
    raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

