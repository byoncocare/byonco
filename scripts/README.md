# ZenOnco Oncologist Data Scraper

Production-ready web scraper to extract all oncologist data from [ZenOnco.io](https://zenonco.io/best-oncologist-in-india).

## 📋 Features

- ✅ Extracts all doctors from listing pages
- ✅ Handles pagination, "Load More" buttons, and infinite scroll
- ✅ Opens each doctor's profile page and extracts detailed information
- ✅ Outputs to JSONL and CSV formats
- ✅ Resume capability (skips already processed URLs)
- ✅ Retry logic with exponential backoff
- ✅ Polite crawling (concurrency limits + random delays)
- ✅ Debug HTML saving for troubleshooting
- ✅ Data validation with Zod schemas

## 🚨 Important: Compliance & Legal

**⚠️ Before running at scale, please:**
1. Check ZenOnco's `robots.txt`: https://zenonco.io/robots.txt
2. Review their Terms of Service for scraping policies
3. Respect rate limits and use reasonable delays
4. Only collect publicly visible information
5. Consider reaching out to ZenOnco for API access if available

## 🛠️ Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project root directory:
   ```bash
   cd /path/to/ByOnco
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## 📖 Usage

### Basic Usage

Run the scraper (headless mode):
```bash
npm run scrape
```

Run with visible browser (for debugging):
```bash
npm run scrape:headful
```

### Advanced Options

Limit the number of doctors to scrape (useful for testing):
```bash
node scripts/scrape_zenonco.js --limit 20
```

Disable resume (start fresh, overwrite progress):
```bash
node scripts/scrape_zenonco.js --no-resume
```

Combine options:
```bash
node scripts/scrape_zenonco.js --headful --limit 50
```

### Configuration

Edit `scripts/config.js` to customize:

- `concurrency`: Number of parallel profile page requests (default: 3)
- `minDelay` / `maxDelay`: Random delay range between requests (default: 500-1500ms)
- `timeout`: Page load timeout in ms (default: 30000)
- `maxRetries`: Maximum retry attempts for failed pages (default: 3)
- `headless`: Run browser in headless mode (default: true)

## 📊 Output Files

All output files are saved to the `output/` directory:

### `zenonco_oncologists.jsonl`
JSON Lines format - one JSON object per line, suitable for streaming and processing.

### `zenonco_oncologists.csv`
CSV format with all fields, suitable for Excel/spreadsheet applications.

### `failed_urls.csv`
List of URLs that failed to scrape, with error messages and timestamps.

### `progress.json`
Tracks which URLs have been processed, enabling resume functionality.

### `debug/*.html`
HTML snapshots of pages that failed to parse (for debugging selector issues).

## 📝 Data Fields Extracted

For each doctor, the scraper attempts to extract:

- **Basic Info**: name, designation, specialty, sub-specialties
- **Experience**: years of experience
- **Location**: clinic address, city, state
- **Affiliations**: hospital affiliations
- **Contact**: phone (if publicly visible)
- **Services**: consultation fee, availability/timings
- **Credentials**: education, qualifications, awards/memberships
- **Practice**: conditions treated, procedures
- **About**: bio/description
- **Reviews**: rating, review count (if available)
- **Metadata**: source, profile URL, scraped timestamp, raw text snapshot

Fields are set to `null` or empty arrays if not found on the page.

## 🔧 Troubleshooting

### Selector Issues

If the scraper isn't finding doctors or data correctly:

1. **Run in headful mode** to see what's happening:
   ```bash
   npm run scrape:headful
   ```

2. **Check debug HTML files** in `output/debug/` to see what the page structure looks like

3. **Update selectors** in `scripts/config.js` based on the actual DOM structure

4. **Inspect the page manually**:
   - Open the listing page in your browser
   - Use DevTools to inspect doctor cards and profile pages
   - Update selectors to match the actual structure

### Common Issues

**"No doctor URLs found"**
- The site structure may have changed
- Run in headful mode and inspect the page
- Check if the site requires authentication or has anti-bot measures
- Review `output/debug/listing-page-error.html`

**"Rate limiting / blocking"**
- Increase delays in `config.js` (set `minDelay: 2000, maxDelay: 5000`)
- Reduce concurrency (set `concurrency: 1`)
- Add longer delays between requests

**"Validation errors"**
- Some required fields might be missing
- Check `scripts/schema.js` to adjust validation rules
- Review individual doctor entries in the JSONL file

**"Browser launch errors"**
- Ensure Playwright browsers are installed: `npx playwright install chromium`
- On Linux, you may need additional dependencies (check Playwright docs)

### Resuming After Interruption

The scraper automatically saves progress. To resume:

1. Simply run the scraper again - it will skip already processed URLs
2. To start fresh, use `--no-resume` flag
3. To process only failed URLs, check `output/failed_urls.csv` and modify the script

## 📁 Project Structure

```
scripts/
├── scrape_zenonco.js    # Main scraper script
├── config.js            # Configuration and selectors
├── schema.js            # Zod validation schemas
├── utils.js             # Utility functions (retry, CSV, JSONL, etc.)
└── README.md            # This file

output/
├── zenonco_oncologists.jsonl
├── zenonco_oncologists.csv
├── failed_urls.csv
├── progress.json
└── debug/
    └── *.html (debug snapshots)
```

## 🧪 Testing

Test with a small limit first:
```bash
node scripts/scrape_zenonco.js --limit 5 --headful
```

This will:
- Scrape only 5 doctors
- Show the browser window
- Help you verify selectors are working correctly

## 🔄 Updating Selectors

The scraper uses multiple selector strategies automatically. If the site structure changes:

1. Run in headful mode to see the page
2. Use browser DevTools to identify the correct selectors
3. Update `scripts/config.js` with new selectors (the scraper tries them in order)
4. Add new selector patterns to the arrays in the config

## 📚 Technical Details

- **Browser**: Chromium (via Playwright)
- **Concurrency**: Controlled with `p-limit`
- **Retries**: Exponential backoff (1s, 2s, 4s)
- **Validation**: Zod schemas ensure data consistency
- **Output**: JSONL for streaming, CSV for compatibility

## ⚙️ Environment Variables

Currently, no environment variables are required. All configuration is in `config.js`.

## 🤝 Contributing

When updating selectors or adding features:

1. Test with `--limit 5 --headful` first
2. Verify output data quality
3. Update this README if adding new features
4. Ensure compliance with robots.txt and ToS

## 📄 License

MIT License - Use responsibly and in compliance with ZenOnco's Terms of Service.

## ⚠️ Disclaimer

This scraper is for educational and research purposes. Users are responsible for:
- Complying with ZenOnco's Terms of Service
- Respecting rate limits and website resources
- Obtaining proper authorization if required
- Using scraped data responsibly and ethically

---

**Built for ByOnco Platform** 🏥





