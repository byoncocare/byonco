# ✅ Admin Script Fixed - Environment Variable Issue

## 🔧 Issue Fixed

The `create_admin_user.py` script was looking for `MONGODB_URI` but the backend uses:
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name

## ✅ Solution Applied

Updated the script to:
1. Check for `MONGO_URL` first (matches backend config)
2. Fallback to `MONGODB_URI` if `MONGO_URL` not found
3. Extract `DB_NAME` from URI if not set separately
4. Use `"byonco"` as default database name if not specified

## 🚀 How to Run

**Option 1: Using .env file (local)**
```bash
cd ../byonco-fastapi-backend
# Make sure .env file has:
# MONGO_URL=mongodb://your-connection-string
# DB_NAME=byonco
python scripts/create_admin_user.py
```

**Option 2: Using environment variables (Render Shell)**
```bash
# In Render Shell, set:
export MONGO_URL="your-mongodb-connection-string"
export DB_NAME="byonco"
python scripts/create_admin_user.py
```

**Option 3: Set environment variables inline**
```bash
# Windows PowerShell
$env:MONGO_URL="mongodb://your-connection-string"; $env:DB_NAME="byonco"; python scripts/create_admin_user.py

# Or check if .env file exists and has the right values
```

## 📋 Next Steps

1. ✅ **Commit pushed** - Script fixed and pushed to repository
2. ⏳ **Set environment variables** - Ensure `.env` file or environment has `MONGO_URL` and `DB_NAME`
3. ⏳ **Run script** - Execute `python scripts/create_admin_user.py`

---

**Note:** The `.env` file is usually in the root of `byonco-fastapi-backend` directory. Make sure it contains the correct MongoDB connection string.
