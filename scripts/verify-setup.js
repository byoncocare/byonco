#!/usr/bin/env node
/**
 * Verification script to check if scraper setup is correct
 */

import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🔍 Verifying ZenOnco Scraper Setup...\n");

let allGood = true;

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
if (majorVersion < 18) {
  console.log(`❌ Node.js version ${nodeVersion} detected. Node 18+ required.`);
  allGood = false;
} else {
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

// Check required files
const requiredFiles = [
  "scripts/scrape_zenonco.js",
  "scripts/config.js",
  "scripts/schema.js",
  "scripts/utils.js",
  "package.json"
];

console.log("\n📁 Checking required files:");
for (const file of requiredFiles) {
  const filepath = join(rootDir, file);
  if (existsSync(filepath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allGood = false;
  }
}

// Check package.json for dependencies
console.log("\n📦 Checking dependencies in package.json:");
try {
  const { readFile } = await import("fs/promises");
  const packageJsonPath = join(rootDir, "package.json");
  const packageJsonContent = await readFile(packageJsonPath, "utf-8");
  const pkg = JSON.parse(packageJsonContent);
  
  const requiredDeps = ["playwright", "p-limit", "zod"];
  const devDeps = pkg.devDependencies || {};
  
  for (const dep of requiredDeps) {
    if (devDeps[dep]) {
      console.log(`   ✅ ${dep}: ${devDeps[dep]}`);
    } else {
      console.log(`   ⚠️  ${dep} - Not found in devDependencies`);
      console.log(`      Run: npm install ${dep} --save-dev`);
      allGood = false;
    }
  }
  
  // Check scripts
  if (pkg.scripts && pkg.scripts.scrape) {
    console.log(`   ✅ npm script 'scrape' found`);
  } else {
    console.log(`   ⚠️  npm script 'scrape' not found`);
    allGood = false;
  }
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
  allGood = false;
}

// Try to import modules (dry run)
console.log("\n🔧 Testing module imports:");
try {
  // This will fail if modules have syntax errors
  const configModule = await import("./config.js");
  console.log("   ✅ config.js imports successfully");
  
  const schemaModule = await import("./schema.js");
  console.log("   ✅ schema.js imports successfully");
  
  const utilsModule = await import("./utils.js");
  console.log("   ✅ utils.js imports successfully");
} catch (error) {
  console.log(`   ❌ Import error: ${error.message}`);
  allGood = false;
}

console.log("\n" + "=".repeat(50));
if (allGood) {
  console.log("✅ Setup verification complete! Everything looks good.");
  console.log("\n📝 Next steps:");
  console.log("   1. Install dependencies: npm install");
  console.log("   2. Install Playwright: npx playwright install chromium");
  console.log("   3. Test scraper: npm run scrape -- --limit 5 --headful");
} else {
  console.log("⚠️  Setup verification found some issues.");
  console.log("   Please fix the issues above and run this script again.");
  process.exit(1);
}

