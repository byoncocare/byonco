# Test Cost Calculator Backend - Step by Step

## 🎯 Your Inputs Are CORRECT!

Based on your screenshots, you filled everything correctly:
- ✅ India, Tier 2, NABH
- ✅ Adult, Common, Breast Cancer, Stage I, Curative
- ✅ Surgery: Lobectomy, 7 days, 1 ICU, Semi-private
- ✅ Insurance: HDFC ERGO, Domestic
- ✅ All other fields have defaults

**The problem is NOT your inputs - it's the backend connection!**

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Test if Backend is Alive

**Open this URL in your browser:**
```
https://byonco-fastapi-backend.onrender.com/
```

**Expected:**
- ✅ Should show JSON with routes or "Hello World"
- ❌ If timeout/error → Backend is sleeping or not deployed

### Step 2: Test Cost Calculator Endpoint Exists

**Open this URL:**
```
https://byonco-fastapi-backend.onrender.com/api/cost-calculator/countries
```

**Expected:**
- ✅ Should return JSON array: `[{id: "india", name: "India", ...}, ...]`
- ❌ If 404 → Endpoint not registered
- ❌ If timeout → Service sleeping (wait 50 seconds)

### Step 3: Test Calculate Endpoint with Your Exact Inputs

**Open browser console (F12) and run this:**

```javascript
fetch('https://byonco-fastapi-backend.onrender.com/api/cost-calculator/calculate-cost', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "country": "india",
    "hospital_tier": "tier_2",
    "age_group": "adult",
    "cancer_category": "common",
    "cancer_type": "breast",
    "stage": "stage_1",
    "intent": "curative",
    "include_surgery": true,
    "surgery_type": "lobectomy",
    "surgery_days": 7,
    "icu_days": 1,
    "room_category": "semi_private",
    "include_chemo": false,
    "include_radiation": false,
    "include_transplant": false,
    "has_insurance": true,
    "insurer": null,
    "policy_type": "domestic",
    "accreditation": ["NABH"]
  })
})
.then(r => r.json())
.then(data => console.log('SUCCESS:', data))
.catch(err => console.error('ERROR:', err));
```

**Check the console output:**
- ✅ If you see cost data → Backend works! Frontend issue.
- ❌ If 404 → Backend endpoint not found
- ❌ If 400 → Validation error (check error message)
- ❌ If 500 → Server error (check error message)
- ❌ If timeout → Service sleeping

---

## 🚨 Most Common Issues

### Issue 1: Backend Not Deployed (MOST LIKELY)

**Symptom:** 404 on all endpoints

**Fix:**
1. Go to: https://dashboard.render.com/web/srv-d1qgrq8dl3ps738tof60/events
2. Check if commit `a8f6703` is deployed
3. If not, click "Manual Deploy" → "Deploy latest commit"
4. Wait 3-5 minutes
5. Try again

### Issue 2: Backend Sleeping (Free Tier)

**Symptom:** First request times out, second works

**Fix:**
- Wait 50 seconds after clicking "Calculate Cost"
- Or upgrade Render plan

### Issue 3: Route Not Registered

**Symptom:** `/api/cost-calculator/countries` works but `/calculate-cost` returns 404

**Fix:**
- Check `backend/server.py` line 588 has: `app.include_router(cost_calculator_router)`
- Redeploy backend

---

## ✅ Quick Test Commands

### Test 1: Backend Health
```bash
curl https://byonco-fastapi-backend.onrender.com/
```

### Test 2: Countries Endpoint
```bash
curl https://byonco-fastapi-backend.onrender.com/api/cost-calculator/countries
```

### Test 3: Calculate Cost (Your Exact Inputs)
```bash
curl -X POST https://byonco-fastapi-backend.onrender.com/api/cost-calculator/calculate-cost \
  -H "Content-Type: application/json" \
  -d '{"country":"india","hospital_tier":"tier_2","age_group":"adult","cancer_category":"common","cancer_type":"breast","stage":"stage_1","intent":"curative","include_surgery":true,"surgery_type":"lobectomy","surgery_days":7,"icu_days":1,"room_category":"semi_private","accreditation":["NABH"],"has_insurance":true,"policy_type":"domestic"}'
```

---

## 📊 What to Check

1. **Render Dashboard:**
   - Service status: Live / Sleeping / Failed?
   - Latest deployment: Success / Failed?
   - Logs: Any errors?

2. **Browser Console:**
   - Network tab: What status code?
   - Console tab: What error message?
   - Request URL: Is it correct?

3. **Backend Test:**
   - Does `/api/cost-calculator/countries` work?
   - Does `/api/cost-calculator/calculate-cost` work with curl?

---

## 🎯 Expected Behavior

**When it works:**
- Backend returns 200 OK
- Response includes: `total_cost_local`, `total_cost_usd`, `currency_code`, etc.
- Frontend displays cost breakdown

**When it fails:**
- 404 → Backend not deployed or route missing
- 400 → Validation error (check error message)
- 500 → Server error (check logs)
- Timeout → Service sleeping

---

**Your inputs are perfect! The issue is backend deployment/connection. Follow the steps above to diagnose.**





