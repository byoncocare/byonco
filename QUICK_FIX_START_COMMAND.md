# ⚡ Quick Fix: Update Render Start Command

## 🔴 The Error

```
ModuleNotFoundError: No module named 'backend'
```

## ✅ The Solution

I've created a `main.py` file in the project root that imports from `backend.server`.

**Update your Render Start Command to:**

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instead of:**
```
uvicorn backend.server:app --host 0.0.0.0 --port $PORT
```

## 📋 Steps

1. Go to Render Dashboard → `byonco-fastapi-backend` → **Settings**
2. Find **"Start Command"**
3. Click **"Edit"**
4. Change it to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Save Changes"**
6. Go to **"Events"** tab
7. Click **"Manual Deploy"** → **"Deploy latest commit"**
8. Wait 3-5 minutes

## ✅ After Deployment

Check: `https://byonco-fastapi-backend.onrender.com/docs`

You should see all your endpoints including:
- `GET /api/rare-cancers`
- `GET /api/hospitals`
- `GET /api/cancer-types`

---

**The `main.py` file is already created and pushed to GitHub. Just update the start command!**

