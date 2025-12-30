# SEO & Google Setup Guide for ByOnco

## 📋 Overview

This guide covers setting up Google Search Console, submitting your sitemap, and optimizing your Google Business Profile for ByOnco.

## 🔍 Google Search Console Setup

### Step 1: Verify Ownership

1. **Go to Google Search Console**: https://search.google.com/search-console
2. **Add Property**: Click "Add Property" → Select "URL prefix"
3. **Enter URL**: `https://www.byoncocare.com`
4. **Choose Verification Method** (recommended: HTML file upload):
   - Download the HTML verification file
   - Upload it to `public/` directory in your repo
   - Commit and deploy
   - Click "Verify" in Search Console

**Alternative Methods**:
- HTML tag: Add meta tag to `public/index.html` `<head>`
- DNS record: Add TXT record to your domain DNS
- Google Analytics: If you have GA4 connected

### Step 2: Submit Sitemap

1. **In Search Console**, go to "Sitemaps" in left sidebar
2. **Enter sitemap URL**: `https://www.byoncocare.com/sitemap.xml`
3. **Click "Submit"**
4. **Wait for indexing** (usually 1-7 days)

### Step 3: Request Indexing for Key Pages

1. **Use URL Inspection Tool** in Search Console
2. **Enter URLs** for important pages:
   - `https://www.byoncocare.com/`
   - `https://www.byoncocare.com/about`
   - `https://www.byoncocare.com/find-hospitals`
   - `https://www.byoncocare.com/second-opinion`
   - `https://www.byoncocare.com/get-started`
3. **Click "Request Indexing"** for each

## 🏢 Google Business Profile (Optional but Recommended)

### If you have a physical office:

1. **Go to**: https://www.google.com/business/
2. **Create/Claim Business Profile**
3. **Business Details**:
   - Name: ByOnco (PraesidioCare Private Limited)
   - Category: Healthcare Technology / Medical Information Service
   - Address: Your registered office address
   - Phone: Contact number
   - Website: https://www.byoncocare.com
   - Hours: Business hours (if applicable)
4. **Add Services**: List your main services
5. **Add Photos**: Logo, office photos (if applicable)
6. **Verify**: Follow Google's verification process

## 📊 Monitoring & Optimization

### Key Metrics to Track:

1. **Search Console**:
   - Impressions
   - Clicks
   - Average position
   - Click-through rate (CTR)

2. **Core Web Vitals**:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

### Monthly Tasks:

- Review Search Console for errors
- Check indexing status
- Monitor search queries
- Update sitemap if new pages added
- Review and improve meta descriptions based on CTR

## 🔗 Additional SEO Resources

- **Schema.org**: Structured data already added to `index.html`
- **Sitemap**: Located at `/public/sitemap.xml`
- **Robots.txt**: Located at `/public/robots.txt`

## ✅ Checklist

- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Key pages requested for indexing
- [ ] Google Business Profile created (if applicable)
- [ ] Monitor Search Console weekly
- [ ] Update sitemap when adding new pages

## 📝 Notes

- Sitemap updates automatically when you deploy (static file)
- Update `lastmod` dates in sitemap.xml when making significant content changes
- Keep robots.txt updated if you add new admin/private routes

