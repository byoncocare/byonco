# Second Opinion AI Implementation

## Overview
Implemented an AI-powered second opinion interface that shows BEFORE the premium form. Users get limited free access, then must subscribe for unlimited access and premium second opinions from actual oncologists.

## Features Implemented

### 1. AI-Powered Chat Interface
- **Location**: `src/pages/SecondOpinionAIPage.jsx`
- Modern, Perplexity-style UI with dark theme
- Real-time chat with AI assistant
- File upload support (PDF, DOC, DOCX, images)

### 2. Usage Limits
- **2 free text prompts** per user (tracked in localStorage)
- **1 free file prompt** per user (tracked in localStorage)
- After limits, users see upgrade prompt
- Subscription status checked from localStorage

### 3. Health/Oncology Restrictions
- **Backend**: `backend/second_opinion/service.py`
- System prompt restricts AI to ONLY answer:
  - Cancer diagnosis, treatment, and management
  - Oncology-related health concerns
  - Treatment options, side effects, recovery
  - Nutrition during cancer treatment
  - Hospital and specialist recommendations
  - Medical report interpretation
- AI redirects non-oncology questions and encourages premium service

### 4. Backend API
- **Endpoint**: `/api/second-opinion-ai/chat`
- **Models**: `backend/second_opinion/models.py`
- **Service**: `backend/second_opinion/service.py`
- **Routes**: `backend/second_opinion/api_routes.py`
- Uses OpenAI GPT-4o-mini for cost efficiency
- PDF text extraction using PyPDF2

### 5. Premium Form Gate
- **Modified**: `src/pages/SecondOpinionPage.jsx`
- Checks subscription status on load
- If NOT subscribed: Shows AI interface (`SecondOpinionAIPage`)
- If subscribed: Shows premium form (existing form)
- Users can navigate to premium form from AI interface

### 6. File Upload & Privacy
- File size limit: 10MB per file
- Supported formats: PDF, DOC, DOCX, JPG, PNG
- Files processed server-side (text extraction)
- Privacy notice displayed
- Data encrypted and stored securely (HIPAA compliance mentioned)

## File Structure

```
backend/
├── second_opinion/
│   ├── __init__.py
│   ├── api_routes.py      # API endpoints
│   ├── models.py          # Pydantic models
│   └── service.py         # OpenAI integration & health restrictions

src/
├── pages/
│   ├── SecondOpinionAIPage.jsx    # New AI interface
│   └── SecondOpinionPage.jsx      # Modified to gate premium form
```

## Environment Variables Required

### Backend (Render)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://byonco-fastapi-backend.onrender.com
```

## Usage Flow

1. **User visits `/second-opinion`**
   - If NOT subscribed → Shows AI interface
   - If subscribed → Shows premium form

2. **AI Interface (Free Users)**
   - User can ask 2 text questions
   - User can upload 1 file for analysis
   - After limits, upgrade prompt appears
   - AI answers only health/oncology questions
   - Non-medical questions redirected

3. **Premium Form (Subscribed Users)**
   - Full form submission
   - Multiple file uploads
   - Direct submission to oncologists
   - 12-24 hour response time

## Storage Keys (localStorage)

- `byonco_ai_text_prompts`: Count of text prompts used
- `byonco_ai_file_prompts`: Count of file prompts used
- `byonco_subscription_status`: "true" or not set

## API Endpoints

### POST `/api/second-opinion-ai/chat`
Request:
```json
{
  "message": "What are the treatment options for Stage 2 breast cancer?",
  "file_content": "Optional extracted text from medical reports"
}
```

Response:
```json
{
  "response": "AI response text...",
  "usage_info": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

### POST `/api/second-opinion-ai/upload-files`
Request: Multipart form data with files
Response:
```json
{
  "extracted_text": "Extracted text from all files...",
  "file_count": 2
}
```

## System Prompt Highlights

The AI is instructed to:
- Only answer oncology-related questions
- Redirect non-medical questions
- Encourage premium service for detailed second opinions
- Emphasize this is AI assistance, not medical diagnosis
- Be empathetic and evidence-based

## Next Steps

1. **Integrate with actual subscription system**
   - Replace localStorage check with API call
   - Connect to payment/subscription backend

2. **Enhanced file processing**
   - OCR for images (Tesseract.js or cloud service)
   - DOC/DOCX parsing (python-docx or similar)
   - Better error handling

3. **Analytics & Monitoring**
   - Track usage patterns
   - Monitor AI response quality
   - User feedback collection

4. **Security Enhancements**
   - Rate limiting
   - User authentication enforcement
   - File scanning for malware

## Testing

1. Test free limits:
   - Send 2 text messages → Should work
   - Send 3rd text message → Should show upgrade prompt
   - Upload 1 file → Should work
   - Upload 2nd file → Should show upgrade prompt

2. Test health restrictions:
   - Ask oncology question → Should answer
   - Ask non-medical question → Should redirect
   - Ask non-oncology medical question → Should redirect

3. Test subscription gate:
   - Without subscription → Shows AI interface
   - With subscription → Shows premium form

## Deployment Checklist

- [ ] Add `OPENAI_API_KEY` to Render environment variables
- [ ] Install `PyPDF2==3.0.1` in backend requirements
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Test AI chat endpoint
- [ ] Test file upload endpoint
- [ ] Verify usage limits work
- [ ] Test subscription gate

