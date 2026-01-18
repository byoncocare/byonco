# ✅ Complete Remaining 2 Steps

## 📋 Steps 5 & 6 - Final Deployment

### **Step 5: Deploy Backend to Render** ⏳

**Option A: If Render uses same repo (auto-deploy)**
✅ Code is already pushed to GitHub main branch
✅ Render should auto-deploy (if configured)

**Option B: If Render uses separate backend repo**
1. Go to backend repository: `../byonco-fastapi-backend`
2. Copy these files:
   - `backend/payments/service.py`
   - `backend/payments/api_routes.py`
   - `backend/scripts/create_admin_user.py`
3. Commit and push to backend repo
4. Render will auto-deploy

**Option C: Manual Deploy on Render**
1. Go to: https://dashboard.render.com
2. Select: `byonco-fastapi-backend`
3. Click: **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 3-5 minutes

### **Step 6: Create Admin User** ⏳

**After backend is deployed, run:**

```bash
cd backend
python scripts/create_admin_user.py
```

**Admin Credentials:**
- Email: `imajinkyajadhav@gmail.com`
- Password: `,t$+.VNq6Tmk6+:`

**Alternative: Create via API**
1. Register at `/api/auth/register`
2. Email: `imajinkyajadhav@gmail.com`
3. Password: `,t$+.VNq6Tmk6+:`

---

## 🎯 Quick Commands

```bash
# Step 5: Check backend files are committed
git status

# Step 6: Create admin user (after backend deployed)
cd backend
python scripts/create_admin_user.py
```

---

## ✅ Verification

After both steps complete:

1. **Test Admin Login:**
   - Email: `imajinkyajadhav@gmail.com`
   - Password: `,t$+.VNq6Tmk6+:`
   - Should show "Subscribed" badge

2. **Test Subscription Endpoint:**
   ```
   GET /api/payments/subscription/status
   ```

3. **Test Payment Flow:**
   - Regular user pays → Subscription created ✅

---

**Status:** Steps 5 & 6 require manual action (Render dashboard + script run)
