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

## 📱 WhatsApp Phone Registration

### One-Time Phone Number Registration

Before your WhatsApp Business number can receive messages, you must register it with Meta's Cloud API. This is a **one-time setup** step.

#### Prerequisites

- WhatsApp Business phone number
- Meta Business Account with WhatsApp Business API access
- 6-digit PIN from 2-step verification
- Certificate string from WhatsApp Manager
- Permanent System User access token

#### Step 1: Set Environment Variables

**Windows (PowerShell):**
```powershell
$env:WHATSAPP_ACCESS_TOKEN="your_permanent_token_here"
$env:WHATSAPP_PHONE_NUMBER_ID="958423034009998"
$env:WHATSAPP_PIN="123456"
$env:WHATSAPP_CERTIFICATE="your_certificate_string_here"
$env:WHATSAPP_GRAPH_VERSION="v21.0"
```

**Mac/Linux (Bash):**
```bash
export WHATSAPP_ACCESS_TOKEN="your_permanent_token_here"
export WHATSAPP_PHONE_NUMBER_ID="958423034009998"
export WHATSAPP_PIN="123456"
export WHATSAPP_CERTIFICATE="your_certificate_string_here"
export WHATSAPP_GRAPH_VERSION="v21.0"
```

**⚠️ Security Note:** Never commit these values to git. They are sensitive credentials.

#### Step 2: Run Registration Script

```bash
# From project root
python scripts/register_whatsapp_number.py
```

**Expected Success Output:**
```
✅ Registered successfully
Response keys: ['success']
```

#### Alternative: Using curl

If you prefer using curl instead of the Python script:

```bash
curl -X POST "https://graph.facebook.com/v21.0/958423034009998/register" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "pin": "YOUR_6_DIGIT_PIN",
    "certificate": "YOUR_CERTIFICATE_STRING"
  }'
```

**Replace placeholders:**
- `YOUR_ACCESS_TOKEN` - Your permanent System User token
- `YOUR_6_DIGIT_PIN` - 6-digit PIN from 2-step verification
- `YOUR_CERTIFICATE_STRING` - Certificate downloaded from WhatsApp Manager

#### Step 3: Verify Registration

After successful registration:

1. **Send a test message** from your personal WhatsApp to the business number
2. **Check webhook logs** at:
   ```
   https://byonco-fastapi-backend.onrender.com/api/whatsapp/webhook
   ```
3. **Verify backend response** - You should receive the disclaimer message

#### Troubleshooting

**Error Code #133010: Account not registered**
- Registration was not completed
- Verify Phone Number ID is correct
- Ensure phone number is eligible for WhatsApp Business API
- Check admin access to Meta Business account

**OAuth/Token Errors**
- Access token may be expired or invalid
- Verify token has required permissions (`whatsapp_business_messaging`)
- Generate a new System User token if needed
- Ensure you're using a **permanent token**, not a test token

**Incorrect PIN**
- PIN must be exactly 6 digits
- PIN comes from your 2-step verification setup
- If incorrect, reset 2-step verification and try again

**Wrong Certificate**
- Certificate string must be complete (no truncation)
- Re-download certificate from WhatsApp Manager
- Ensure no extra whitespace or newlines in the certificate
- Certificate should be a long string (typically 1000+ characters)

**Network Errors**
- Check internet connection
- Verify Graph API endpoint is accessible
- Try again in a few moments

#### Security Best Practices

- ✅ Never commit `.env` files or secrets to git
- ✅ Never log full tokens/certificates (script masks them automatically)
- ✅ Use environment variables only
- ✅ Rotate tokens if accidentally exposed
- ✅ Store secrets in Render environment variables for production

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
