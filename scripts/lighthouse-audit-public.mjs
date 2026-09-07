/**
 * Comprehensive Lighthouse Audit Runner for all Public (Non-Admin) Routes.
 * 
 * Strict Constraint: Audits ONLY public marketing/studio/programme routes,
 * NEVER routes under /admin.
 * 
 * Usage:
 *   node scripts/lighthouse-audit-public.mjs [baseUrl]
 * 
 * Example:
 *   node scripts/lighthouse-audit-public.mjs http://localhost:3005
 */

import * as chromeLauncher from "file:///C:/Users/wkimu/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/chrome-launcher/dist/chrome-launcher.js";
import lighthouse from "file:///C:/Users/wkimu/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/index.js";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = (process.argv[2] || "http://localhost:3005").replace(/\/$/, "");

const PUBLIC_ROUTES = [
  { path: "/", name: "Homepage" },
  { path: "/bns-project", name: "Projects Index" },
  { path: "/bns-project/terra", name: "Project Terra Case Study" },
  { path: "/work", name: "Evidence & Production Archive" },
  { path: "/bns-studio", name: "BNS Studios Overview" },
  { path: "/programmes", name: "Operational Programmes" },
  { path: "/programmes/connect", name: "BNS Connect Programme" },
  { path: "/programmes/mashinani", name: "BNS Mashinani Programme" },
  { path: "/programmes/wanahabari-lab", name: "Wanahabari Lab Programme" },
  { path: "/programmes/studios", name: "BNS Studios Programme" },
  { path: "/about", name: "About BNS" },
  { path: "/reports", name: "Reports Bulletin" },
  { path: "/budgetnews", name: "Budget News Portal" },
  { path: "/learn", name: "Learn Hub" },
  { path: "/events", name: "Events & Townhalls" },
  { path: "/contact", name: "Contact & Inquiries" },
  { path: "/faq", name: "Frequently Asked Questions" },
  { path: "/privacy", name: "Privacy Policy" },
  { path: "/terms", name: "Terms of Service" },
  { path: "/security", name: "Security Standards" },
  { path: "/analytics", name: "Civic Analytics" },
];

const REPORTS_DIR = path.resolve(__dirname, "../reports/lighthouse");
const PROFILE_DIR = path.resolve(__dirname, "../.lh-profile");

async function main() {
  console.log("==========================================================");
  console.log(" 🌟 BNS PUBLIC ROUTES LIGHTHOUSE COMPREHENSIVE AUDIT");
  console.log(" Base URL: " + baseUrl);
  console.log(" Strict Constraint: NO /admin routes included");
  console.log(" Routes to audit: " + PUBLIC_ROUTES.length);
  console.log("==========================================================\n");

  if (!fsSync.existsSync(REPORTS_DIR)) {
    fsSync.mkdirSync(REPORTS_DIR, { recursive: true });
  }
  if (!fsSync.existsSync(PROFILE_DIR)) {
    fsSync.mkdirSync(PROFILE_DIR, { recursive: true });
  }

  console.log("Launching headless Chrome...");
  const chrome = await chromeLauncher.launch({
    chromePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    userDataDir: PROFILE_DIR,
  });
  console.log(`Chrome operational on port ${chrome.port}\n`);

  const results = [];

  try {
    for (let i = 0; i < PUBLIC_ROUTES.length; i++) {
      const route = PUBLIC_ROUTES[i];
      const fullUrl = `${baseUrl}${route.path}`;
      const safeName = route.path === "/" ? "homepage" : route.path.replace(/^\//, "").replace(/\//g, "-");
      const jsonPath = path.join(REPORTS_DIR, `${safeName}.json`);

      console.log(`[${i + 1}/${PUBLIC_ROUTES.length}] Auditing ${route.name} (${fullUrl})...`);

      try {
        const options = {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        };

        const runnerResult = await lighthouse(fullUrl, options);
        const lhr = runnerResult.lhr;
        const cats = lhr.categories || {};

        const perf = Math.round((cats.performance?.score || 0) * 100);
        const a11y = Math.round((cats.accessibility?.score || 0) * 100);
        const bestPractices = Math.round((cats["best-practices"]?.score || 0) * 100);
        const seo = Math.round((cats.seo?.score || 0) * 100);

        // Save raw LHR report
        await fs.writeFile(jsonPath, JSON.stringify(lhr, null, 2), "utf-8");

        results.push({
          route: route.path,
          name: route.name,
          performance: perf,
          accessibility: a11y,
          bestPractices,
          seo,
          status: "SUCCESS",
        });

        console.log(`   ✓ Perf: ${perf} | A11y: ${a11y} | BP: ${bestPractices} | SEO: ${seo}\n`);
      } catch (auditErr) {
        console.error(`   ✗ Error auditing ${route.path}:`, auditErr.message);
        results.push({
          route: route.path,
          name: route.name,
          status: "FAILED",
          error: auditErr.message,
        });
      }
    }
  } finally {
    console.log("Shutting down Chrome...");
    await chrome.kill();
    console.log("Chrome shutdown complete.");
  }

  // Summary Table
  console.log("\n==========================================================");
  console.log(" 📊 PUBLIC ROUTES LIGHTHOUSE AUDIT SUMMARY TABLE");
  console.log("==========================================================");
  console.table(
    results.map((r) => ({
      Route: r.route,
      Name: r.name,
      Perf: r.performance !== undefined ? `${r.performance}%` : "N/A",
      A11y: r.accessibility !== undefined ? `${r.accessibility}%` : "N/A",
      "Best Practices": r.bestPractices !== undefined ? `${r.bestPractices}%` : "N/A",
      SEO: r.seo !== undefined ? `${r.seo}%` : "N/A",
      Status: r.status,
    }))
  );

  const summaryPath = path.join(REPORTS_DIR, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\nAudit summary saved to ${summaryPath}`);
}

main().catch((err) => {
  console.error("Lighthouse audit script failed:", err);
  process.exit(1);
});
