# ByOnco Platform

A comprehensive medical tourism platform connecting patients with top cancer hospitals in India.

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\Activate.ps1
   # Linux/Mac
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=byonco_db
   SECRET_KEY=your-secret-key-here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   CORS_ORIGINS=http://localhost:3000
   ```

5. Start server:
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. Start development server:
   ```bash
   npm start
   ```

## 📚 Documentation

- **PROJECT_SUMMARY.md** - Complete project overview and features
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step deployment guide
- **backend/README_MODULES.md** - Backend module structure

## 🔑 Key Features

- ✅ User Authentication (Email/Password)
- ✅ Hospital Search and Filtering
- ✅ Cost Calculator
- ✅ Rare Cancer Information
- ✅ Second Opinion Requests
- ✅ Teleconsultation Booking
- ✅ RazorPay Payment Integration

## 🛠️ Tech Stack

- **Backend**: FastAPI, MongoDB, JWT, RazorPay
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## 📝 License

Private - All rights reserved
