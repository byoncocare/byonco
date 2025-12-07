"""
Main entry point for Render deployment
This file allows Render to import the app from backend.server
"""
from backend.server import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

