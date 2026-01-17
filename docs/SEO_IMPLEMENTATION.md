# SEO Implementation Guide - ByOnco

## Phase 1: Sitemap Submission to Google Search Console

### Manual Submission Steps

1. **Access Google Search Console**
   - Go to: https://search.google.com/search-console
   - Sign in with your Google account
   - Add property: `https://www.byoncocare.com`

2. **Verify Ownership**
   - Choose verification method (HTML file, meta tag, or DNS)
   - Follow verification steps

3. **Submit Sitemap**
   - Navigate to: Sitemaps section (left sidebar)
   - Enter sitemap URL: `https://www.byoncocare.com/sitemap.xml`
   - Click "Submit"
   - Wait for Google to process (usually 24-48 hours)

### Automated Submission (Using Google Search Console API)

If you have API access, use the provided script: `scripts/submit-sitemap.js`

### Sitemap URL
```
https://www.byoncocare.com/sitemap.xml
```

### Pages Included in Sitemap
- Homepage
- Cancer Hub: `/cancer`
- 10 Cancer Type Pages: `/cancer/{type}`
- Key Conversion Pages: `/get-started`, `/find-hospitals`, `/cost-calculator`, `/second-opinion`
- Other pages: `/about`, `/careers`, `/rare-cancers`, `/teleconsultation`

---

## Phase 2: Keyword Ranking Monitoring

### Target Keywords by Cancer Type

Each cancer page targets 200+ keywords across 5 intent categories:
- Symptoms intent
- Diagnosis intent
- Treatment intent
- Cost/Insurance intent
- Hospital/Doctor intent

### Monitoring Setup

1. **Google Search Console**
   - Monitor "Performance" tab
   - Track impressions, clicks, CTR, average position
   - Filter by cancer-related queries

2. **Rank Tracking Tool**
   - Use provided `src/utils/seo/rankTracker.js`
   - Tracks positions for target keywords
   - Stores data in localStorage/backend

3. **Dashboard**
   - Access at: `/admin/seo-dashboard` (if admin route exists)
   - View keyword positions over time
   - Export reports

---

## Phase 3: CTA Conversion Tracking

### CTAs Tracked

All conversion CTAs now include analytics events:
- Get Matched → `/get-started`
- Find Hospitals → `/find-hospitals`
- Estimate Cost → `/cost-calculator`
- Second Opinion → `/second-opinion`
- WhatsApp Chat

### Event Names
- `cta_click_get_matched`
- `cta_click_find_hospitals`
- `cta_click_estimate_cost`
- `cta_click_second_opinion`
- `cta_click_whatsapp`

### Analytics Integration
- Google Analytics 4 (GA4)
- Custom event tracking
- Conversion goals setup

---

## Phase 4: A/B Testing CTA Placements

### Test Variants

**Variant A (Control)**
- CTAs in hero section
- Sticky bar on mobile
- Inline cards after key sections

**Variant B (Test)**
- CTAs in sidebar (desktop)
- Floating button (mobile)
- Popup modal after scroll

### Testing Framework
- Uses `src/utils/seo/abTesting.js`
- Random assignment (50/50 split)
- Tracks conversion rates per variant
- Statistical significance testing

---

## Implementation Status

✅ **Completed:**
- Sitemap generation
- All 10 cancer pages with SEO metadata
- Schema markup (JSON-LD)
- Internal linking structure
- E-E-A-T signals (sources, reviewed dates)

🔄 **In Progress:**
- Analytics integration
- Rank tracking dashboard
- A/B testing framework

---

## Next Steps

1. Submit sitemap to Google Search Console
2. Set up Google Analytics 4
3. Configure conversion goals
4. Start A/B testing
5. Monitor rankings weekly
6. Optimize based on data
