# Contact Form & Get Started Form - Data Flow & Notifications

## 📍 Where Data Goes

### Contact Form ("Get Started with ByOnco" Modal)
- **Endpoint**: `POST /api/contact`
- **Database Collection**: `contacts` (MongoDB)
- **Location**: `backend/server.py` - `submit_contact()` function

**Data Stored:**
```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@email.com",
  "phone": "+91 1234567890",
  "message": "User message",
  "status": "pending",
  "created_at": "2025-01-XX ISO timestamp"
}
```

### Get Started Form (Full Page Form)
- **Endpoint**: `POST /api/get-started/submit`
- **Database Collection**: `get_started_submissions` (MongoDB)
- **Location**: `backend/get_started/service.py` - `create_submission()` method

**Data Stored:**
```json
{
  "id": "uuid",
  "full_name": "User Name",
  "email": "user@email.com",
  "phone": "+91 1234567890",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "cancer_type": "Breast Cancer",
  "cancer_stage": "Stage II",
  "has_insurance": true/false,
  "insurance_provider": "...",
  "preferred_cities": ["Mumbai", "Delhi"],
  "budget_range": "...",
  "urgency": "immediately",
  "status": "pending_review",
  "created_at": "2025-01-XX ISO timestamp",
  "updated_at": "2025-01-XX ISO timestamp"
}
```

## 📧 Email Notifications

### How It Works
1. When a form is submitted, data is saved to MongoDB
2. An email notification is automatically sent to the admin email
3. If email fails, the submission still succeeds (email is non-blocking)

### Email Service Configuration
The email service is located in `backend/email_service.py` and uses SMTP.

**Required Environment Variables:**
```bash
# SMTP Configuration
SMTP_SERVER=smtp.gmail.com          # Your SMTP server
SMTP_PORT=587                        # SMTP port (usually 587 for TLS)
SMTP_USERNAME=your-email@gmail.com   # Your email address
SMTP_PASSWORD=your-app-password      # App-specific password (not regular password)
FROM_EMAIL=your-email@gmail.com      # From address (defaults to SMTP_USERNAME)
ADMIN_EMAIL=contact@byoncocare.com  # Where notifications are sent
```

### Setting Up Gmail SMTP
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password (not your regular Gmail password) as `SMTP_PASSWORD`

### Email Content
**Contact Form Notification:**
- Subject: "New Contact Form Submission - [Name]"
- Contains: Name, Email, Phone, Message, Contact ID
- Reply-To: User's email (you can reply directly)

**Get Started Form Notification:**
- Subject: "New Get Started Submission - [Name]"
- Contains: All form fields including medical info, preferences, etc.
- Reply-To: User's email

## 🔍 Viewing Submissions

### API Endpoints

#### View All Contact Form Submissions
```bash
GET /api/contacts?status=pending&limit=50
```
- Query params:
  - `status`: Filter by status (pending, contacted, resolved, archived)
  - `limit`: Number of results (max 1000, default 100)

#### View Specific Contact Submission
```bash
GET /api/contact/{contact_id}
```

#### Update Contact Status
```bash
PATCH /api/contact/{contact_id}/status
Body: { "status": "contacted" }
```
Valid statuses: `pending`, `contacted`, `resolved`, `archived`

#### View All Get Started Submissions
```bash
GET /api/get-started/submissions?status=pending_review&limit=50
```
- Requires authentication (Admin only)
- Query params:
  - `status`: Filter by status
  - `limit`: Number of results

#### View Specific Get Started Submission
```bash
GET /api/get-started/submission/{submission_id}
```
- Requires authentication (Admin only)

### Direct Database Access (MongoDB)
If you have MongoDB access, you can query directly:

```javascript
// Contact form submissions
db.contacts.find().sort({created_at: -1}).limit(50)

// Get Started form submissions
db.get_started_submissions.find().sort({created_at: -1}).limit(50)

// Filter by status
db.contacts.find({status: "pending"})
db.get_started_submissions.find({status: "pending_review"})
```

## 🐛 Troubleshooting

### Error: "Our service is temporarily unavailable"
This error occurs when:
1. **Database connection fails** - Check MongoDB connection string in environment variables
2. **Database timeout** - MongoDB server may be slow or unreachable
3. **Network issues** - Backend can't reach MongoDB

**To Fix:**
- Check `MONGO_URL` environment variable
- Verify MongoDB is accessible
- Check backend logs for specific error messages

### Email Notifications Not Working
If emails aren't being sent:
1. Check environment variables are set correctly
2. Verify SMTP credentials (especially App Password for Gmail)
3. Check backend logs for email errors
4. Email failures don't block form submissions - check logs to see if emails are failing silently

**To Test Email:**
- Check backend logs when submitting a form
- Look for: "Contact notification email sent successfully" or "Failed to send contact notification email"

## 📊 Monitoring

### Check Recent Submissions
```bash
# Using curl
curl https://your-backend-url/api/contacts?limit=10

# Using browser
https://your-backend-url/api/contacts?limit=10
```

### Check Email Service Status
The email service logs its status:
- If disabled: "Email service is disabled. Set SMTP_USERNAME and SMTP_PASSWORD..."
- If enabled: "Contact notification email sent successfully..."

## 🔐 Security Notes

1. **Admin Endpoints**: The Get Started submissions endpoints require authentication
2. **Contact Endpoints**: Currently public (consider adding rate limiting)
3. **Email**: Uses TLS encryption (port 587)
4. **Data**: All data stored in MongoDB with proper indexing

## 📝 Next Steps

1. **Set up email notifications**: Add SMTP environment variables
2. **Create admin dashboard**: Build a UI to view and manage submissions
3. **Add rate limiting**: Prevent spam submissions
4. **Add webhook support**: Optional webhook notifications for integrations

