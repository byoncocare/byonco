# Security Implementation - Anti-Scraping Protection

## Overview

This document describes the security hardening measures implemented to protect the ByOnco frontend against casual scraping while maintaining full SEO compatibility and accessibility.

## Features Implemented

### 1. Rate Limiting Headers Awareness
- **Location**: `src/utils/security/antiScraping.js`
- **Function**: `checkRateLimitHeaders()`
- Monitors server response headers for rate limit information:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After`
- Logs rate limit events for monitoring
- Stores rate limit info in sessionStorage for UI awareness

### 2. Right-Click Context Menu Protection
- **Location**: `src/components/Security/SecurityProtection.jsx`
- Disables right-click on non-input elements
- **SEO-Friendly**: Allows right-click on form elements (input, textarea, select)
- **Accessibility**: Does not interfere with screen readers or assistive technologies

### 3. Copy/Paste Protection
- **Location**: `src/components/Security/SecurityProtection.jsx`
- Blocks copy/paste operations on static content
- **Allows**: Copy/paste in form elements (input, textarea, contenteditable)
- **SEO-Friendly**: Does not block legitimate crawlers

### 4. Text Selection Protection
- **Location**: `src/components/Security/SecurityProtection.jsx`
- Disables text selection on sensitive UI blocks only
- **Configurable**: Uses `sensitiveSelector` prop to target specific elements
- **Default Selectors**: `[data-sensitive]`, `.sensitive-content`, `.pricing-card`, `.subscription-details`
- **Allows**: Full text selection in form elements

### 5. Headless Browser Detection
- **Location**: `src/utils/security/antiScraping.js`
- **Function**: `detectHeadlessBrowser()`
- Detects common headless browser indicators:
  - `navigator.webdriver` flag
  - Missing browser plugins
  - PhantomJS, Selenium, Puppeteer, Playwright indicators
  - Missing window properties
- Logs detection events for monitoring

### 6. Request Fingerprinting
- **Location**: `src/utils/security/antiScraping.js`
- **Function**: `generateFingerprint()`
- Creates unique client fingerprint using:
  - User-Agent
  - Browser language settings
  - Screen resolution
  - Timezone
  - Browser capabilities (WebGL, Canvas, Storage)
  - Page load timing
- Adds fingerprint to all requests via `X-Client-Fingerprint` header
- Used for abuse detection and rate limiting

### 7. Window Object Sanitization
- **Location**: `src/utils/security/windowSanitizer.js`
- **Function**: `sanitizeWindowObject()`
- Removes sensitive data from global `window` object:
  - API keys and secrets
  - Internal data structures
  - Development tools
- Prevents accidental exposure of structured datasets

### 8. Abuse Pattern Detection
- **Location**: `src/utils/security/antiScraping.js`
- **Function**: `detectAbusePattern()`
- Monitors security events in sessionStorage
- Detects rapid-fire events (>10 events per minute)
- Logs suspicious activity for review

## SEO Compatibility

### Legitimate Crawler Detection
- **Function**: `isLegitimateCrawler()`
- Allows access for:
  - Googlebot
  - Bingbot
  - Yahoo Slurp
  - DuckDuckBot
  - BaiduSpider
  - YandexBot
  - And 30+ other legitimate crawlers
- **All protections are bypassed for legitimate crawlers**

### Content Accessibility
- All SEO content remains fully accessible to crawlers
- Meta tags, structured data (JSON-LD), and page content are not blocked
- Forms remain fully functional for accessibility

## Implementation Details

### Component Integration

The `SecurityProtection` component wraps the entire app in `App.js`:

```jsx
<SecurityProtection
  disableRightClick={true}
  disableCopyPaste={true}
  disableTextSelection={false}
  sensitiveSelector="[data-sensitive], .sensitive-content, .pricing-card, .subscription-details"
>
  {/* App content */}
</SecurityProtection>
```

### Request Interceptors

All fetch and axios requests are automatically intercepted to:
- Add fingerprinting headers
- Monitor rate limit responses
- Detect abuse patterns
- Log security events

### Event Logging

Security events are logged to:
- Console (development mode)
- SessionStorage (for abuse pattern detection)
- Can be sent to backend endpoint (commented out, ready for production)

## Configuration

### Sensitive Content Selectors

To mark content as sensitive (disable text selection), add one of these classes or attributes:

```html
<div data-sensitive>Protected content</div>
<div class="sensitive-content">Protected content</div>
<div class="pricing-card">Pricing information</div>
<div class="subscription-details">Subscription info</div>
```

### Customizing Protection

Edit `src/components/Security/SecurityProtection.jsx` to customize:
- Which elements allow right-click
- Which elements allow copy/paste
- Which elements allow text selection

## Monitoring

### Security Events Tracked

1. **Right-click blocked**: When right-click is prevented on non-input elements
2. **Copy blocked**: When copy operation is prevented on static content
3. **Paste blocked**: When paste operation is prevented on static content
4. **Headless browser detected**: When headless browser indicators are found
5. **Abuse pattern detected**: When rapid-fire events are detected
6. **Rate limit hit**: When rate limit headers are received
7. **Image drag blocked**: When image drag is prevented

### Viewing Events

In development mode, events are logged to console with `[Security Event]` prefix.

In production, events are stored in `sessionStorage` under `security_events` key.

## Best Practices

1. **Don't over-protect**: Only disable text selection on truly sensitive content
2. **Test with crawlers**: Verify that Googlebot can still access content
3. **Monitor events**: Review security event logs regularly
4. **Update selectors**: Add new sensitive content selectors as needed
5. **Rate limiting**: Coordinate with backend for WAF integration

## Limitations

1. **Not 100% secure**: Determined attackers can still scrape content
2. **Client-side only**: All protections are client-side and can be bypassed
3. **Headless detection**: Basic heuristics, not foolproof
4. **Fingerprinting**: Can be spoofed by sophisticated bots

## Future Enhancements

1. **Backend integration**: Send security events to backend for analysis
2. **Machine learning**: Use ML to detect more sophisticated bots
3. **CAPTCHA integration**: Add CAPTCHA for suspicious activity
4. **IP-based blocking**: Coordinate with backend for IP blocking
5. **Behavioral analysis**: Track user behavior patterns for anomaly detection

## Testing

### Test Legitimate Crawlers

```bash
# Test with Googlebot user agent
curl -A "Googlebot/2.1" https://www.byoncocare.com
```

### Test Security Events

1. Right-click on static content → Should be blocked
2. Try to copy text from static content → Should be blocked
3. Try to select text in sensitive blocks → Should be blocked
4. Check console for security event logs

### Test Form Functionality

1. Right-click in input field → Should work
2. Copy/paste in textarea → Should work
3. Select text in form → Should work

## Support

For questions or issues, contact the security team or refer to the code comments in:
- `src/utils/security/antiScraping.js`
- `src/components/Security/SecurityProtection.jsx`
- `src/utils/security/windowSanitizer.js`
- `src/utils/security/requestInterceptor.js`
