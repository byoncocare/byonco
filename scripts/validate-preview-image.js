#!/usr/bin/env node
/**
 * Validate Preview Image for Social Media Sharing
 * 
 * This script checks if preview.png exists and validates its properties
 * 
 * Usage:
 *   node scripts/validate-preview-image.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PREVIEW_IMAGE_PATH = path.join(__dirname, '../public/preview.png');
const OPTIMAL_WIDTH = 1200;
const OPTIMAL_HEIGHT = 630;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

console.log('🔍 Validating preview.png for social media sharing...\n');

// Check if file exists
if (!fs.existsSync(PREVIEW_IMAGE_PATH)) {
  console.error('❌ ERROR: preview.png not found at:', PREVIEW_IMAGE_PATH);
  console.log('\n💡 Solution: Add preview.png to the public/ folder');
  process.exit(1);
}

console.log('✅ File exists:', PREVIEW_IMAGE_PATH);

// Check file size
const stats = fs.statSync(PREVIEW_IMAGE_PATH);
const fileSizeKB = (stats.size / 1024).toFixed(2);
const fileSizeMB = (stats.size / 1020000).toFixed(2);

console.log(`📦 File size: ${fileSizeKB} KB (${fileSizeMB} MB)`);

if (stats.size > MAX_FILE_SIZE) {
  console.warn('⚠️  WARNING: File size exceeds 8MB. Consider optimizing.');
} else if (stats.size > 1024 * 1024) {
  console.warn('⚠️  WARNING: File size > 1MB. Consider optimizing for faster loading.');
} else {
  console.log('✅ File size is acceptable');
}

// Check file extension
if (!PREVIEW_IMAGE_PATH.endsWith('.png') && !PREVIEW_IMAGE_PATH.endsWith('.jpg')) {
  console.warn('⚠️  WARNING: File should be .png or .jpg format');
} else {
  console.log('✅ File format is correct');
}

console.log('\n📋 Image Requirements:');
console.log(`   Optimal dimensions: ${OPTIMAL_WIDTH} x ${OPTIMAL_HEIGHT} pixels`);
console.log(`   Aspect ratio: 1.91:1 (landscape)`);
console.log(`   Format: PNG or JPG`);
console.log(`   Max size: 8MB (recommended: < 1MB)`);

console.log('\n🧪 Testing Steps:');
console.log('1. Visit: https://www.byoncocare.com/preview.png');
console.log('2. Test on Facebook: https://developers.facebook.com/tools/debug/');
console.log('3. Test on Twitter: https://cards-dev.twitter.com/validator');
console.log('4. Test on LinkedIn: https://www.linkedin.com/post-inspector/');

console.log('\n✅ Validation complete!');
console.log('💡 Tip: Use image optimization tools to reduce file size if needed.');
