#!/bin/bash
# Script to deploy backend changes to Render
# This script helps sync backend code if using a separate backend repository

echo "🚀 Backend Deployment Script"
echo "============================"
echo ""

# Check if backend repo exists
if [ ! -d "../byonco-fastapi-backend" ]; then
    echo "⚠️  Backend repository 'byonco-fastapi-backend' not found in parent directory."
    echo "📋 Manual Deployment Required:"
    echo ""
    echo "Option 1: Deploy via Render Dashboard (Recommended)"
    echo "   1. Go to: https://dashboard.render.com"
    echo "   2. Select: byonco-fastapi-backend"
    echo "   3. Click: 'Manual Deploy' → 'Deploy latest commit'"
    echo ""
    echo "Option 2: Sync to separate backend repo"
    echo "   1. Copy these files to your backend repo:"
    echo "      - backend/payments/service.py"
    echo "      - backend/payments/api_routes.py"
    echo "      - backend/scripts/create_admin_user.py"
    echo "   2. Commit and push to backend repo"
    echo "   3. Render will auto-deploy"
    echo ""
    exit 0
fi

echo "✅ Backend repository found. Syncing files..."
echo ""

# Copy backend files to backend repo
cp backend/payments/service.py ../byonco-fastapi-backend/backend/payments/service.py
cp backend/payments/api_routes.py ../byonco-fastapi-backend/backend/payments/api_routes.py
cp -r backend/scripts ../byonco-fastapi-backend/backend/

echo "✅ Files copied to backend repository"
echo ""
echo "Next steps:"
echo "   1. cd ../byonco-fastapi-backend"
echo "   2. git add ."
echo "   3. git commit -m 'Add subscription management and admin user script'"
echo "   4. git push origin main"
echo ""
echo "Render will auto-deploy after push."
