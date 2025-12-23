/**
 * Utility functions for the scraper
 */
import { createWriteStream } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalize text: trim, remove extra whitespace
 */
export function normalizeText(text) {
  if (!text) return null;
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Extract text from element, return null if not found
 */
export async function extractText(page, selector, all = false) {
  try {
    if (all) {
      const elements = await page.locator(selector).all();
      return await Promise.all(elements.map(el => el.textContent()));
    }
    const element = page.locator(selector).first();
    if (await element.count() === 0) return null;
    return normalizeText(await element.textContent());
  } catch (error) {
    return null;
  }
}

/**
 * Extract array of text from multiple elements
 */
export async function extractArray(page, selector) {
  try {
    const elements = await page.locator(selector).all();
    if (elements.length === 0) return [];
    const texts = await Promise.all(
      elements.map(async (el) => {
        const text = await el.textContent();
        return normalizeText(text);
      })
    );
    return texts.filter(Boolean);
  } catch (error) {
    return [];
  }
}

/**
 * Extract href from link element
 */
export async function extractHref(page, selector) {
  try {
    const element = page.locator(selector).first();
    if (await element.count() === 0) return null;
    const href = await element.getAttribute("href");
    if (!href) return null;
    // Make absolute URL if relative
    if (href.startsWith("/")) {
      return new URL(href, page.url()).href;
    }
    if (href.startsWith("http")) {
      return href;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`  Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

/**
 * Save HTML for debugging
 */
export async function saveDebugHTML(html, filename) {
  try {
    const debugDir = join(__dirname, "..", "output", "debug");
    await mkdir(debugDir, { recursive: true });
    const filepath = join(debugDir, `${filename}.html`);
    await writeFile(filepath, html, "utf-8");
    console.log(`  Debug HTML saved: ${filepath}`);
  } catch (error) {
    console.error(`  Failed to save debug HTML: ${error.message}`);
  }
}

/**
 * Write JSONL file (one JSON object per line)
 */
export async function writeJSONL(data, filepath) {
  try {
    const fullPath = join(__dirname, "..", filepath);
    await mkdir(dirname(fullPath), { recursive: true });
    const stream = createWriteStream(fullPath, { flags: "a" });
    for (const item of data) {
      stream.write(JSON.stringify(item) + "\n");
    }
    stream.end();
    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  } catch (error) {
    console.error(`Failed to write JSONL: ${error.message}`);
    throw error;
  }
}

/**
 * Append to CSV (simple implementation)
 */
export async function appendToCSV(filepath, rows, headers) {
  try {
    const fullPath = join(__dirname, "..", filepath);
    await mkdir(dirname(fullPath), { recursive: true });
    
    const fs = await import("fs/promises");
    const fileExists = await fs.access(fullPath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      // Write headers
      await fs.appendFile(fullPath, headers.join(",") + "\n", "utf-8");
    }
    
    // Write rows
    for (const row of rows) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        if (Array.isArray(val)) return JSON.stringify(val);
        const str = String(val);
        // Escape commas and quotes
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      await fs.appendFile(fullPath, values.join(",") + "\n", "utf-8");
    }
  } catch (error) {
    console.error(`Failed to append to CSV: ${error.message}`);
    throw error;
  }
}

/**
 * Load progress from file
 */
export async function loadProgress() {
  try {
    const fs = await import("fs/promises");
    const progressPath = join(__dirname, "..", "output", "progress.json");
    const data = await fs.readFile(progressPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { processedUrls: new Set(), failedUrls: [] };
  }
}

/**
 * Save progress to file
 */
export async function saveProgress(processedUrls, failedUrls) {
  try {
    const fs = await import("fs/promises");
    const progressPath = join(__dirname, "..", "output", "progress.json");
    await mkdir(dirname(progressPath), { recursive: true });
    await fs.writeFile(
      progressPath,
      JSON.stringify({
        processedUrls: Array.from(processedUrls),
        failedUrls: failedUrls,
        lastUpdated: new Date().toISOString()
      }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error(`Failed to save progress: ${error.message}`);
  }
}

/**
 * Generate slug from URL or name
 */
export function generateSlug(url, name = "") {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      return pathParts[pathParts.length - 1];
    }
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
  } catch {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) || "unknown";
  }
}

