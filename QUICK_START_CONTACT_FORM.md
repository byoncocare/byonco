# Quick Start: Contact Form Setup & Notifications

## ✅ What I Fixed

1. **Fixed the error handling** - Better error messages and database connection handling
2. **Added email notifications** - You'll get notified when someone submits the form
3. **Created admin endpoints** - View all submissions via API
4. **Documented everything** - See `CONTACT_FORM_DOCUMENTATION.md` for details

## 🚀 Quick Setup (5 minutes)

### Step 1: Set Up Email Notifications

Add these to your `.env` file in the `backend/` directory:

```bash
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=contact@byoncocare.com
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Go to: Google Account → Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Use that password (NOT your regular Gmail password)

### Step 2: Restart Your Backend

After adding environment variables, restart your backend server.

## 📍 Where Data Goes

### Contact Form (Modal on Landing Page)
- **Database**: MongoDB collection `contacts`
- **Endpoint**: `POST /api/contact`
- **View submissions**: `GET /api/contacts`

### Get Started Form (Full Page)
- **Database**: MongoDB collection `get_started_submissions`
- **Endpoint**: `POST /api/get-started/submit`
- **View submissions**: `GET /api/get-started/submissions` (requires auth)

## 📧 How Notifications Work

1. User submits form → Data saved to MongoDB
2. Email automatically sent to `ADMIN_EMAIL`
3. You receive email with all form details
4. Reply directly to email (Reply-To is set to user's email)

**Note**: If email fails, the form submission still succeeds. Check logs to see if emails are working.

## 🔍 View Submissions

### Option 1: API Endpoint (Easiest)
```bash
# View all contact form submissions
curl https://your-backend-url/api/contacts?limit=10

# View in browser
https://your-backend-url/api/contacts?limit=10
```

### Option 2: MongoDB Direct
```javascript
// In MongoDB shell or Compass
db.contacts.find().sort({created_at: -1}).limit(10)
db.get_started_submissions.find().sort({created_at: -1}).limit(10)
```

### Option 3: Build Admin Dashboard (Future)
Use the API endpoints to build a simple admin page to view/manage submissions.

## 🐛 Troubleshooting

### Still Getting "Service Temporarily Unavailable" Error?

**Check:**
1. MongoDB connection - Is `MONGO_URL` set correctly?
2. Backend logs - What's the actual error?
3. Database access - Can backend reach MongoDB?

**Common fixes:**
- Verify `MONGO_URL` in `.env`
- Check MongoDB is running/accessible
- Look at backend console for specific errors

### Not Receiving Emails?

**Check:**
1. Environment variables set correctly?
2. Gmail App Password (not regular password)?
3. Backend logs show "email sent successfully"?
4. Check spam folder

**Test:**
- Submit a test form
- Check backend logs for email status
- Look for "Contact notification email sent successfully"

## 📚 Full Documentation

See `CONTACT_FORM_DOCUMENTATION.md` for:
- Complete data structure
- All API endpoints
- Email configuration details
- Security notes
- Advanced troubleshooting

## 🎯 Next Steps

1. ✅ Set up email notifications (add env vars)
2. ✅ Test form submission
3. ✅ Verify email received
4. 🔄 Build admin dashboard (optional)
5. 🔄 Add rate limiting (optional, prevent spam)

---

**Questions?** Check the logs first - they'll tell you exactly what's happening!

