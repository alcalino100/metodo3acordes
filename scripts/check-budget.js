import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const BUDGETS = {
  "index.html": 120 * 1024, // 120 KB uncompressed HTML budget
  "admin/index.html": 80 * 1024, // 80 KB uncompressed Admin HTML budget
  assetsTotal: 5 * 1024 * 1024, // 5 MB assets budget
};

let hasErrors = false;

// 1. Check index.html size
const htmlPath = path.join(rootDir, "index.html");
if (fs.existsSync(htmlPath)) {
  const stat = fs.statSync(htmlPath);
  const sizeKB = (stat.size / 1024).toFixed(2);
  const limitKB = (BUDGETS["index.html"] / 1024).toFixed(0);
  if (stat.size > BUDGETS["index.html"]) {
    console.error(
      `❌ Performance Budget FAILED: index.html is ${sizeKB} KB (Limit: ${limitKB} KB)`,
    );
    hasErrors = true;
  } else {
    console.log(
      `✅ Performance Budget PASSED: index.html is ${sizeKB} KB (Limit: ${limitKB} KB)`,
    );
  }
} else {
  console.error("❌ index.html not found!");
  hasErrors = true;
}

// 2. Check admin/index.html size
const adminPath = path.join(rootDir, "admin", "index.html");
if (fs.existsSync(adminPath)) {
  const stat = fs.statSync(adminPath);
  const sizeKB = (stat.size / 1024).toFixed(2);
  const limitKB = (BUDGETS["admin/index.html"] / 1024).toFixed(0);
  if (stat.size > BUDGETS["admin/index.html"]) {
    console.error(
      `❌ Performance Budget FAILED: admin/index.html is ${sizeKB} KB (Limit: ${limitKB} KB)`,
    );
    hasErrors = true;
  } else {
    console.log(
      `✅ Performance Budget PASSED: admin/index.html is ${sizeKB} KB (Limit: ${limitKB} KB)`,
    );
  }
}

// 3. Check total assets size
const assetsDir = path.join(rootDir, "assets");
if (fs.existsSync(assetsDir)) {
  let totalAssetSize = 0;
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      totalAssetSize += stat.size;
    }
  }
  const totalMB = (totalAssetSize / (1024 * 1024)).toFixed(2);
  const limitMB = (BUDGETS.assetsTotal / (1024 * 1024)).toFixed(0);
  if (totalAssetSize > BUDGETS.assetsTotal) {
    console.error(
      `❌ Assets Budget FAILED: assets total is ${totalMB} MB (Limit: ${limitMB} MB)`,
    );
    hasErrors = true;
  } else {
    console.log(
      `✅ Assets Budget PASSED: assets total is ${totalMB} MB (Limit: ${limitMB} MB)`,
    );
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log("🚀 All performance budgets met!");
}
