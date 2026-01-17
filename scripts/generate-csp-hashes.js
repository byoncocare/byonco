// scripts/generate-csp-hashes.js
// Generate SHA256 hashes for inline scripts in index.html

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract inline scripts (not external scripts with src attribute)
const scriptRegex = /<script[^>]*(?:src=)?[^>]*>([\s\S]*?)<\/script>/g;
let match;
const hashes = [];

while ((match = scriptRegex.exec(html)) !== null) {
  const scriptTag = match[0];
  const scriptContent = match[1];
  
  // Skip external scripts (with src attribute)
  if (scriptTag.includes('src=') && !scriptTag.includes('id="ios-error-capture"')) {
    continue;
  }
  
  // Get the actual script content (remove script tags)
  const content = scriptContent.trim();
  
  if (content) {
    // Generate SHA256 hash
    const hash = crypto.createHash('sha256').update(content, 'utf8').digest('base64');
    hashes.push(`'sha256-${hash}'`);
    console.log(`Script hash: 'sha256-${hash}'`);
    console.log(`Content preview: ${content.substring(0, 100)}...\n`);
  }
}

console.log('\n=== CSP script-src directive ===');
console.log(`script-src 'self' ${hashes.join(' ')} https://checkout.razorpay.com https://fonts.googleapis.com;`);
