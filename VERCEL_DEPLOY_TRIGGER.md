# Vercel Deployment Trigger Guide

## Issue
Vercel is not auto-deploying the latest commits to production.

## Solutions

### Option 1: Manual Deploy via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/byonco-cares-projects/byonco
2. Click on **"Deployments"** tab
3. Click the **"Deploy"** button (top right)
4. Select:
   - **Branch**: `main`
   - **Framework Preset**: Auto-detect (or React)
   - Click **"Deploy"**

### Option 2: Trigger via Git Push (Force)
If Vercel webhook is not working, we can trigger by making a small change:

```bash
# Create a trigger file
echo "$(Get-Date)" > .vercel-deploy-trigger.txt
git add .vercel-deploy-trigger.txt
git commit -m "chore: trigger Vercel production deployment"
git push origin main
```

### Option 3: Check Vercel Project Settings
1. Go to: https://vercel.com/byonco-cares-projects/byonco/settings
2. Check **"Git"** section:
   - Verify GitHub integration is connected
   - Check "Production Branch" is set to `main`
   - Verify "Auto-deploy" is enabled
3. Check **"Build & Development Settings"**:
   - Framework: React
   - Build Command: `npm run build` (or `yarn build`)
   - Output Directory: `build` (or `dist`)

### Option 4: Check Build Logs
1. Go to: https://vercel.com/byonco-cares-projects/byonco/deployments
2. Click on the latest deployment
3. Check **"Build Logs"** for errors
4. Common issues:
   - Missing environment variables
   - Build command failing
   - Dependency installation errors

## Quick Fix: Manual Trigger

Run these commands to trigger a deployment:

```powershell
cd C:\Users\AJINKYA\ByOnco
echo "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -FilePath .vercel-deploy-trigger.txt -Encoding utf8
git add .vercel-deploy-trigger.txt
git commit -m "chore: trigger Vercel production deployment for second opinion AI"
git push origin main
```

This will create a small change that triggers Vercel's webhook.


