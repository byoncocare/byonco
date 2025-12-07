# Deployment Checklist for ByOnco Platform

## ✅ Completed Features

### Backend
- [x] Modular backend structure (hospitals, rare_cancers, cost_calculator, auth, payments)
- [x] User authentication (Email/Password registration and login)
- [x] JWT token-based authentication
- [x] RazorPay payment integration
- [x] All API endpoints working
- [x] MongoDB integration for user data and payments
- [x] In-memory data for hospitals, doctors, and cancer types

### Frontend
- [x] All pages connected to backend
- [x] Authentication pages (Login/Register)
- [x] Payment integration component
- [x] Responsive design for all pages
- [x] Consistent dark purple theme

## 🔧 Environment Variables Required

### Backend (.env file in `backend/` directory)
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=byonco_db

# JWT Secret (CHANGE IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-change-this-in-production

# RazorPay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Frontend (.env file in root directory)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 📦 Installation Steps

### Backend
1. Navigate to backend directory:
   ```powershell
   cd backend
   ```

2. Activate virtual environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Create `.env` file with required variables (see above)

5. Start server:
   ```powershell
   uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend
1. Install dependencies:
   ```powershell
   npm install
   ```

2. Create `.env` file with required variables (see above)

3. Start development server:
   ```powershell
   npm start
   ```

## 🚀 Deployment to Vercel

### Frontend Deployment
1. Install Vercel CLI:
   ```powershell
   npm i -g vercel
   ```

2. Login to Vercel:
   ```powershell
   vercel login
   ```

3. Deploy:
   ```powershell
   vercel
   ```

4. Add environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL` - Your backend API URL
   - `REACT_APP_RAZORPAY_KEY_ID` - Your RazorPay key

### Backend Deployment
For backend, you can use:
- **Railway** (recommended for Python/FastAPI)
- **Render**
- **Heroku**
- **AWS EC2**
- **DigitalOcean**

Make sure to:
1. Set all environment variables
2. Use production MongoDB (MongoDB Atlas recommended)
3. Change `SECRET_KEY` to a strong random value
4. Update CORS origins to your frontend domain

## 🔐 Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable RazorPay webhook verification
- [ ] Add rate limiting to API endpoints
- [ ] Implement proper error handling (don't expose sensitive info)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Payments
- `POST /api/payments/create-order` - Create RazorPay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/order/{order_id}` - Get payment status

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/{hospital_id}` - Get hospital details
- `GET /api/hospitals/{hospital_id}/doctors` - Get hospital doctors

### Rare Cancers
- `GET /api/rare-cancers` - Get all rare cancers
- `GET /api/rare-cancers/{cancer_name}` - Get cancer details

### Cost Calculator
- `POST /api/cost-calculator/calculate-cost` - Calculate treatment cost

## 🐛 Known Issues & Notes

1. **Google OAuth**: Currently not implemented. Users must use email/password registration.
2. **Password Reset**: Email sending not implemented. Token is generated but email must be sent manually.
3. **RazorPay**: Make sure to use test keys for development and production keys for production.

## 📞 Support

For issues or questions, check:
- Backend logs: Check console output when running `uvicorn`
- Frontend logs: Check browser console (F12)
- API docs: Visit `http://localhost:8000/docs` when backend is running

## ✅ Final Checks Before Deployment

- [ ] All environment variables set
- [ ] Backend server starts without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] All API endpoints tested
- [ ] Authentication flow works
- [ ] Payment integration tested (use RazorPay test mode)
- [ ] Mobile responsiveness checked
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] MongoDB connection working




