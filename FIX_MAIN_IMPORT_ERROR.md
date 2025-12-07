# 🔧 Fix: Could not import module "main"

## 🔴 The Error

```
ERROR: Error loading ASGI app. Could not import module "main".
```

Render can't find the `main.py` file. This could be because:

1. **Root Directory** is set incorrectly in Render
2. The file path is wrong
3. Render is looking in the wrong directory

## ✅ Solutions

### Solution 1: Check Root Directory Setting

1. Go to Render Dashboard → `byonco-fastapi-backend` → **Settings**
2. Look for **"Root Directory"** setting
3. It should be **empty** or set to **`.`** (project root)
4. If it's set to `backend` or something else, **clear it** or set to `.`
5. Save and redeploy

### Solution 2: Use Full Path in Start Command

If Root Directory doesn't work, try updating the **Start Command** to:

```bash
cd /opt/render/project/src && uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or:

```bash
PYTHONPATH=/opt/render/project/src uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Solution 3: Move server.py to Root (Alternative)

If the above don't work, we can copy `backend/server.py` to the root as `server.py` and use:

**Start Command:**
```bash
uvicorn server:app --host 0.0.0.0 --port $PORT
```

But this requires updating all imports in server.py.

### Solution 4: Use Python -m (Recommended)

Try this **Start Command**:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or with explicit path:

```bash
cd /opt/render/project/src && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🎯 Recommended Steps

1. **First, check Root Directory:**
   - Settings → Look for "Root Directory"
   - Should be empty or `.`
   - If set to `backend`, clear it

2. **Update Start Command to:**
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Save and redeploy**

4. **If still fails, try:**
   ```bash
   cd /opt/render/project/src && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

## 📋 Verification

After deployment, check logs for:
- ✅ No import errors
- ✅ "Application startup complete"
- ✅ Routes registered successfully

Then test: `https://byonco-fastapi-backend.onrender.com/docs`

---

**The `main.py` file exists in the repo root. The issue is likely the Root Directory setting or the start command format.**

