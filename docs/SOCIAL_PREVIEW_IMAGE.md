# Social Media Preview Image Guide

## What is preview.png?

The `preview.png` file is a **social media preview image** (also called Open Graph image or Twitter Card image). It appears when someone shares a link to ByOnco on:

- Facebook
- LinkedIn
- Twitter/X
- WhatsApp
- Slack
- Other social platforms

## Current Status

❌ **Missing**: The file `public/preview.png` does not exist, but it's referenced in:
- All 10 cancer pages
- Cancer hub page
- Main landing page
- SEO meta tags

## Image Requirements

### Dimensions
- **Optimal Size**: 1200 x 630 pixels
- **Minimum Size**: 600 x 315 pixels
- **Aspect Ratio**: 1.91:1 (landscape)

### Format
- PNG (recommended for logos/text)
- JPG (acceptable, smaller file size)

### File Size
- **Maximum**: 8MB (but aim for < 1MB for fast loading)
- **Recommended**: 200-500KB

### Content Guidelines

The image should include:

1. **ByOnco Logo**
   - Prominently displayed
   - High resolution

2. **Tagline/Headline**
   - "AI-Powered Cancer Care"
   - Or "Find the Best Cancer Hospitals"
   - Clear, readable font

3. **Visual Elements**
   - Brand colors (purple/violet gradient)
   - Medical/healthcare imagery (optional)
   - Clean, professional design

4. **Text Readability**
   - Large, bold fonts
   - High contrast
   - Test on dark and light backgrounds

## Design Options

### Option 1: Simple Logo + Tagline
```
[ByOnco Logo]
AI-Powered Cancer Care
Find the Best Hospitals, Faster
```

### Option 2: Hero Section Style
- Use your landing page hero design
- Include key messaging
- Add visual elements

### Option 3: Branded Card
- Purple gradient background
- Logo centered
- Tagline below
- Subtle medical iconography

## How to Create

### Using Design Tools

1. **Canva** (Easiest)
   - Template: "Facebook Post" or "Open Graph Image"
   - Size: 1200 x 630px
   - Add logo, text, colors
   - Export as PNG

2. **Figma**
   - Create frame: 1200 x 630px
   - Design with brand elements
   - Export as PNG

3. **Photoshop/Illustrator**
   - New document: 1200 x 630px
   - Design with brand assets
   - Export optimized PNG

### Using Your Existing Assets

You can use:
- `public/byonco-logo.svg` - Convert to PNG
- `public/byonco-hero-illustration.webp` - Resize and add text
- Landing page screenshot - Crop to 1200x630

## Quick Fix: Use Existing Image

If you have a suitable image, you can:

1. **Rename existing image**
   ```bash
   # If you have a hero image or logo
   cp public/byonco-hero-illustration.webp public/preview.png
   ```

2. **Or create a simple placeholder**
   - Use your logo on a purple gradient background
   - Add tagline text
   - Export as PNG

## Implementation

Once you have the image:

1. **Save to public folder**
   ```
   public/preview.png
   ```

2. **Verify it's accessible**
   - Visit: `https://www.byoncocare.com/preview.png`
   - Should display the image

3. **Test on social platforms**
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Current References

The image is referenced in:
- ✅ `public/index.html` (line 40, 52)
- ✅ `src/data/cancerPagesData.js` (all 10 cancer types)
- ✅ `src/pages/CancerHub.jsx` (lines 116, 124)
- ✅ `src/pages/CancerPage.jsx` (uses meta.ogImage)
- ✅ `src/components/SEO/MetaTags.jsx` (default image)

## Next Steps

1. **Create or obtain** the preview image (1200x630px)
2. **Save** as `public/preview.png`
3. **Test** using social media debuggers
4. **Verify** it appears correctly when sharing links

## Alternative: Dynamic Images

For future enhancement, you could:
- Generate dynamic preview images per cancer type
- Use a service like Cloudinary or ImageKit
- Create template-based images

But for now, a single `preview.png` file is sufficient.
