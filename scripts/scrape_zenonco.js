#!/usr/bin/env node
/**
 * ZenOnco Oncologist Data Scraper
 * 
 * Extracts all oncologists from https://zenonco.io/best-oncologist-in-india
 * Handles pagination, load more buttons, and infinite scroll
 */

import { chromium } from "playwright";
import pLimit from "p-limit";
import { config, getRandomDelay } from "./config.js";
import { DoctorSchema, validateDoctor } from "./schema.js";
import {
  sleep,
  normalizeText,
  extractText,
  extractArray,
  extractHref,
  retry,
  saveDebugHTML,
  writeJSONL,
  appendToCSV,
  loadProgress,
  saveProgress,
  generateSlug
} from "./utils.js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Parse CLI arguments
const args = process.argv.slice(2);
const headful = args.includes("--headful");
const limitArg = args.find(arg => arg.startsWith("--limit"));
const limit = limitArg ? parseInt(limitArg.split("=")[1]) : null;
const resume = !args.includes("--no-resume");

// Output paths
const outputDir = join(rootDir, "output");
const jsonlPath = join(outputDir, "zenonco_oncologists.jsonl");
const csvPath = join(outputDir, "zenonco_oncologists.csv");
const failedUrlsPath = join(outputDir, "failed_urls.csv");
const progressPath = join(outputDir, "progress.json");

// CSV headers
const csvHeaders = [
  "source",
  "listing_page_url",
  "profile_url",
  "name",
  "designation",
  "specialty",
  "sub_specialties",
  "years_experience",
  "hospital_affiliations",
  "clinic_address",
  "city",
  "state",
  "languages",
  "education",
  "qualifications",
  "awards_memberships",
  "conditions_treated",
  "procedures",
  "about",
  "consultation_fee",
  "availability",
  "phone",
  "rating",
  "reviews_count",
  "raw_text_snapshot",
  "scraped_at"
];

/**
 * Inspect DOM and determine actual selectors
 * This runs once to help identify the correct selectors
 */
async function inspectDOM(page) {
  console.log("\n🔍 Inspecting DOM structure...\n");
  
  try {
    // Wait for content to load
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    
    // Try to find doctor cards with multiple strategies
    const cardSelectors = [
      '[class*="doctor-card"]',
      '[class*="doctorCard"]',
      '[class*="DoctorCard"]',
      'article',
      '[data-testid*="doctor"]',
      '.doctor-item',
      '[class*="card"][class*="doctor"]'
    ];
    
    let foundCards = 0;
    for (const selector of cardSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`  ✓ Found ${count} elements with selector: ${selector}`);
        foundCards += count;
      }
    }
    
    // Log page structure hints
    const bodyText = await page.textContent("body");
    if (bodyText) {
      const hasDoctor = bodyText.toLowerCase().includes("doctor");
      const hasOncologist = bodyText.toLowerCase().includes("oncologist");
      console.log(`  ✓ Page contains 'doctor': ${hasDoctor}, 'oncologist': ${hasOncologist}`);
    }
    
    console.log(`\n  Found ${foundCards} potential doctor card elements\n`);
  } catch (error) {
    console.log(`  ⚠️  DOM inspection warning: ${error.message}\n`);
  }
}

/**
 * Extract all doctor profile URLs from listing page
 * Handles pagination, load more, and infinite scroll
 */
async function discoverDoctorUrls(page, baseUrl) {
  console.log("📋 Discovering doctor URLs from listing page...\n");
  
  const doctorUrls = new Set();
  let currentPage = 1;
  let hasMore = true;
  const maxPages = 50; // Safety limit
  
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: config.timeout });
    await sleep(2000); // Wait for JS to render
    
    // Run DOM inspection
    await inspectDOM(page);
    
    while (hasMore && currentPage <= maxPages) {
      console.log(`  Processing page ${currentPage}...`);
      
      // Wait for content to load
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
      await sleep(1000);
      
      // Try multiple selector strategies for doctor cards
      const cardSelectors = [
        // Common patterns
        'a[href*="/doctor/"]',
        'a[href*="/oncologist/"]',
        'a[href*="/profile/"]',
        '[class*="doctor-card"] a',
        '[class*="doctorCard"] a',
        'article a',
        '[data-testid*="doctor"] a'
      ];
      
      let foundOnPage = 0;
      for (const selector of cardSelectors) {
        try {
          const links = await page.locator(selector).all();
          for (const link of links) {
            const href = await link.getAttribute("href");
            if (href && (href.includes("/doctor/") || href.includes("/oncologist/") || href.includes("/profile/"))) {
              const fullUrl = href.startsWith("http") ? href : new URL(href, baseUrl).href;
              if (fullUrl.includes("zenonco.io") && !fullUrl.includes("#") && !fullUrl.includes("javascript:")) {
                doctorUrls.add(fullUrl);
                foundOnPage++;
              }
            }
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      console.log(`    Found ${foundOnPage} new doctor URLs on this page (total: ${doctorUrls.size})`);
      
      // Check for pagination / load more
      const loadMoreSelectors = [
        'button:has-text("Load More")',
        'button:has-text("Load more")',
        'a:has-text("Next")',
        'a:has-text("Next Page")',
        '[aria-label*="next" i]',
        '[class*="next"]',
        '[class*="load-more"]',
        '[class*="loadMore"]'
      ];
      
      let clicked = false;
      for (const selector of loadMoreSelectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.count() > 0) {
            const isVisible = await element.isVisible();
            const isDisabled = await element.getAttribute("disabled") !== null;
            
            if (isVisible && !isDisabled) {
              await element.click();
              await sleep(2000);
              clicked = true;
              break;
            }
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      // Try infinite scroll
      if (!clicked) {
        const previousCount = doctorUrls.size;
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(2000);
        
        // Check if new content loaded
        if (doctorUrls.size === previousCount) {
          // Try scrolling up and down again
          await page.evaluate(() => {
            window.scrollTo(0, 0);
            setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
          });
          await sleep(3000);
          
          // Re-extract URLs after scroll
          for (const selector of cardSelectors) {
            try {
              const links = await page.locator(selector).all();
              for (const link of links) {
                const href = await link.getAttribute("href");
                if (href && (href.includes("/doctor/") || href.includes("/oncologist/") || href.includes("/profile/"))) {
                  const fullUrl = href.startsWith("http") ? href : new URL(href, baseUrl).href;
                  if (fullUrl.includes("zenonco.io")) {
                    doctorUrls.add(fullUrl);
                  }
                }
              }
            } catch (error) {
              // Continue
            }
          }
        }
      }
      
      // Check if we should continue
      if (!clicked && doctorUrls.size === previousCount) {
        hasMore = false;
        console.log("    No more pages/content found");
      } else {
        currentPage++;
        if (limit && doctorUrls.size >= limit) {
          console.log(`    Reached limit of ${limit} URLs`);
          hasMore = false;
        }
      }
    }
    
  } catch (error) {
    console.error(`  ❌ Error discovering URLs: ${error.message}`);
    // Save page HTML for debugging
    const html = await page.content();
    await saveDebugHTML(html, "listing-page-error");
  }
  
  const urlsArray = Array.from(doctorUrls);
  if (limit) {
    return urlsArray.slice(0, limit);
  }
  return urlsArray;
}

/**
 * Extract doctor data from profile page
 */
async function extractDoctorProfile(page, profileUrl, listingUrl) {
  const doctor = {
    source: "zenonco",
    listing_page_url: listingUrl,
    profile_url: profileUrl,
    name: null,
    designation: null,
    specialty: null,
    sub_specialties: [],
    years_experience: null,
    hospital_affiliations: [],
    clinic_address: null,
    city: null,
    state: null,
    languages: [],
    education: [],
    qualifications: [],
    awards_memberships: [],
    conditions_treated: [],
    procedures: [],
    about: null,
    consultation_fee: null,
    availability: null,
    phone: null,
    rating: null,
    reviews_count: null,
    raw_text_snapshot: null,
    scraped_at: new Date().toISOString()
  };
  
  try {
    await page.goto(profileUrl, { waitUntil: "networkidle", timeout: config.timeout });
    await sleep(1500); // Wait for JS rendering
    
    // Get raw text snapshot (first 500 chars)
    const bodyText = await page.textContent("body");
    if (bodyText) {
      doctor.raw_text_snapshot = normalizeText(bodyText).substring(0, 500);
    }
    
    // Extract name - try multiple selectors
    const nameSelectors = [
      "h1",
      '[class*="doctor-name"]',
      '[class*="doctorName"]',
      '[class*="name"]',
      'h2:has-text("Dr")',
      '[itemprop="name"]'
    ];
    for (const selector of nameSelectors) {
      const name = await extractText(page, selector);
      if (name && name.length > 2) {
        doctor.name = normalizeText(name);
        break;
      }
    }
    
    // Extract designation/title
    const designationSelectors = [
      '[class*="designation"]',
      '[class*="title"]',
      '[class*="specialization"]',
      '[class*="specialty"]',
      'p:has-text("Oncologist")'
    ];
    for (const selector of designationSelectors) {
      const text = await extractText(page, selector);
      if (text) {
        doctor.designation = normalizeText(text);
        break;
      }
    }
    
    // Extract specialty
    const specialtySelectors = [
      '[class*="specialty"]',
      '[class*="department"]',
      '[class*="specialization"]'
    ];
    for (const selector of specialtySelectors) {
      const text = await extractText(page, selector);
      if (text && text !== doctor.designation) {
        doctor.specialty = normalizeText(text);
        break;
      }
    }
    
    // Extract years of experience
    const experiencePatterns = [
      /(\d+)\s*years?\s*experience/i,
      /experience[:\s]+(\d+)/i,
      /(\d+)\+?\s*years?/i
    ];
    const pageText = bodyText || "";
    for (const pattern of experiencePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        doctor.years_experience = match[1];
        break;
      }
    }
    
    // Extract hospital affiliations
    const hospitalSelectors = [
      '[class*="hospital"]',
      '[class*="affiliation"]',
      '[class*="clinic"]'
    ];
    for (const selector of hospitalSelectors) {
      const hospitals = await extractArray(page, selector);
      if (hospitals.length > 0) {
        doctor.hospital_affiliations = hospitals.filter(h => h && h.length > 3);
        break;
      }
    }
    
    // Extract address/location
    const addressSelectors = [
      '[class*="address"]',
      '[class*="location"]',
      '[class*="city"]',
      '[itemprop="address"]'
    ];
    for (const selector of addressSelectors) {
      const text = await extractText(page, selector);
      if (text) {
        doctor.clinic_address = normalizeText(text);
        // Try to extract city/state
        const cityMatch = text.match(/([A-Z][a-z]+),?\s*([A-Z][a-z]+)?/);
        if (cityMatch) {
          doctor.city = cityMatch[1];
          if (cityMatch[2]) doctor.state = cityMatch[2];
        }
        break;
      }
    }
    
    // Extract consultation fee
    const feePatterns = [
      /₹\s*([\d,]+)/,
      /Rs\.?\s*([\d,]+)/,
      /INR\s*([\d,]+)/,
      /fee[:\s]+₹?\s*([\d,]+)/i
    ];
    for (const pattern of feePatterns) {
      const match = pageText.match(pattern);
      if (match) {
        doctor.consultation_fee = `₹${match[1]}`;
        break;
      }
    }
    
    // Extract phone (only if explicitly shown)
    const phoneSelectors = [
      'a[href^="tel:"]',
      '[class*="phone"]',
      '[class*="contact"]'
    ];
    for (const selector of phoneSelectors) {
      const text = await extractText(page, selector);
      if (text && /\d{10,}/.test(text)) {
        doctor.phone = normalizeText(text);
        break;
      }
    }
    
    // Extract rating
    const ratingSelectors = [
      '[class*="rating"]',
      '[class*="star"]',
      '[itemprop="ratingValue"]'
    ];
    for (const selector of ratingSelectors) {
      const text = await extractText(page, selector);
      if (text && /[\d.]+/.test(text)) {
        doctor.rating = normalizeText(text);
        break;
      }
    }
    
    // Extract about/bio
    const aboutSelectors = [
      '[class*="about"]',
      '[class*="bio"]',
      '[class*="description"]',
      '[class*="summary"]'
    ];
    for (const selector of aboutSelectors) {
      const text = await extractText(page, selector);
      if (text && text.length > 50) {
        doctor.about = normalizeText(text);
        break;
      }
    }
    
    // Extract education, qualifications, awards (common patterns)
    const allText = pageText.toLowerCase();
    if (allText.includes("mbbs") || allText.includes("md") || allText.includes("dm")) {
      const eduMatch = pageText.match(/(MBBS|MD|DM|MS|MCh|FRCS|MRCP)[^.]*/gi);
      if (eduMatch) {
        doctor.qualifications = [...new Set(eduMatch.map(e => normalizeText(e)))];
      }
    }
    
  } catch (error) {
    console.error(`  ❌ Error extracting profile: ${error.message}`);
    throw error;
  }
  
  return doctor;
}

/**
 * Main scraping function
 */
async function main() {
  console.log("🚀 ZenOnco Oncologist Scraper\n");
  console.log(`Configuration:
  - Base URL: ${config.baseUrl}
  - Headless: ${!headful}
  - Concurrency: ${config.concurrency}
  - Delay: ${config.minDelay}-${config.maxDelay}ms
  - Resume: ${resume}
  ${limit ? `- Limit: ${limit} doctors` : "- No limit"}
  `);
  
  // Ensure output directories exist
  await mkdir(join(outputDir, "debug"), { recursive: true });
  
  // Load progress if resuming
  let progress = { processedUrls: [], failedUrls: [] };
  if (resume) {
    try {
      const progressData = await readFile(progressPath, "utf-8");
      progress = JSON.parse(progressData);
      console.log(`📂 Resuming: ${progress.processedUrls.length} URLs already processed, ${progress.failedUrls?.length || 0} previously failed\n`);
    } catch (error) {
      console.log("📂 Starting fresh scrape\n");
    }
  }
  
  const processedUrls = new Set(progress.processedUrls || []);
  const failedUrls = Array.isArray(progress.failedUrls) ? [...progress.failedUrls] : [];
  
  // Launch browser
  console.log("🌐 Launching browser...\n");
  const browser = await chromium.launch({
    headless: !headful,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  
  const context = await browser.newContext({
    userAgent: config.userAgent,
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Discover all doctor URLs
    const allDoctorUrls = await discoverDoctorUrls(page, config.baseUrl);
    console.log(`\n✅ Discovered ${allDoctorUrls.length} unique doctor URLs\n`);
    
    // Filter out already processed URLs
    const urlsToProcess = allDoctorUrls.filter(url => !processedUrls.has(url));
    console.log(`📊 URLs to process: ${urlsToProcess.length} (${allDoctorUrls.length - urlsToProcess.length} already processed)\n`);
    
    if (urlsToProcess.length === 0) {
      console.log("✨ All URLs already processed. Exiting.\n");
      await browser.close();
      return;
    }
    
    // Step 2: Extract profiles with concurrency limit
    const limit = pLimit(config.concurrency);
    const results = [];
    let processed = 0;
    let successful = 0;
    let failed = 0;
    
    console.log(`🔄 Processing ${urlsToProcess.length} profiles...\n`);
    
    const processUrl = async (profileUrl) => {
      const slug = generateSlug(profileUrl);
      
      return limit(async () => {
        try {
          const profilePage = await context.newPage();
          
          try {
            const doctor = await retry(
              () => extractDoctorProfile(profilePage, profileUrl, config.baseUrl),
              config.maxRetries,
              config.retryDelay
            );
            
            // Validate data
            const validation = validateDoctor(doctor);
            if (!validation.success) {
              console.log(`  ⚠️  ${slug}: Validation failed`);
              failedUrls.push({ url: profileUrl, error: "Validation failed", timestamp: new Date().toISOString() });
              failed++;
            } else {
              // Write to JSONL
              await writeJSONL([validation.data], jsonlPath);
              
              // Append to CSV
              const csvRow = csvHeaders.reduce((obj, key) => {
                const value = validation.data[key];
                obj[key] = Array.isArray(value) ? value.join("; ") : (value || "");
                return obj;
              }, {});
              await appendToCSV(csvPath, [csvRow], csvHeaders);
              
              processedUrls.add(profileUrl);
              successful++;
              console.log(`  ✅ ${slug}: ${doctor.name || "Unknown"}`);
            }
          } catch (error) {
            console.log(`  ❌ ${slug}: ${error.message}`);
            
            // Save debug HTML
            try {
              const html = await profilePage.content();
              await saveDebugHTML(html, slug);
            } catch (e) {
              // Ignore
            }
            
            failedUrls.push({
              url: profileUrl,
              error: error.message,
              timestamp: new Date().toISOString()
            });
            failed++;
          } finally {
            await profilePage.close();
            
            // Save progress periodically
            processed++;
            if (processed % 10 === 0) {
              await saveProgress(processedUrls, failedUrls);
            }
            
            // Random delay between requests
            await sleep(getRandomDelay());
          }
        } catch (error) {
          console.error(`  💥 Fatal error processing ${profileUrl}: ${error.message}`);
          failed++;
        }
      });
    };
    
    // Process all URLs
    await Promise.all(urlsToProcess.map(processUrl));
    
    // Save final progress
    await saveProgress(processedUrls, failedUrls);
    
    // Save failed URLs CSV
    if (failedUrls.length > 0) {
      const failedHeaders = ["url", "error", "timestamp"];
      await appendToCSV(failedUrlsPath, failedUrls, failedHeaders);
      // Overwrite to avoid duplicates - clear and rewrite
      const fs = await import("fs/promises");
      await fs.writeFile(
        failedUrlsPath,
        failedHeaders.join(",") + "\n" +
        failedUrls.map(f => `"${f.url}","${f.error}","${f.timestamp}"`).join("\n"),
        "utf-8"
      );
    }
    
    console.log(`\n✨ Scraping complete!
  ✅ Successful: ${successful}
  ❌ Failed: ${failed}
  📊 Total processed: ${processed}
  📁 Output: ${jsonlPath}
  📁 CSV: ${csvPath}
  ${failedUrls.length > 0 ? `📁 Failed URLs: ${failedUrlsPath}` : ""}
    `);
    
  } catch (error) {
    console.error(`\n💥 Fatal error: ${error.message}`);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

// Run the scraper
main().catch(console.error);

