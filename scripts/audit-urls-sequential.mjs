/**
 * Sequential URL status audit — concurrency 1, polite delays.
 * node scripts/audit-urls-sequential.mjs [base]
 */
import fs from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const SEED = [
  "/",
  "/about/",
  "/programmes/",
  "/programmes/connect/",
  "/programmes/mashinani/",
  "/programmes/wanahabari-lab/",
  "/bns-studio/",
  "/contact/",
  "/contact/?intent=partner",
  "/reports/",
  "/projects/",
  "/learn/",
  "/budgetnews/",
  "/faq/",
  "/careers/",
  "/privacy/",
  "/terms/",
  "/security/",
  "/events/",
  "/surveys/",
  "/weekly-notes/",
  "/glossary/",
  "/help/",
  "/capabilities/",
  "/auth/login/",
  "/auth/register/",
  "/analytics/",
  "/team/",
  "/impact/",
  "/consortium/",
  "/login/",
  "/bns-project/terra/",
  "/bns-project/story-mty40jp1/",
  "/bns-studio/cabri-digital-pfm-reforms/",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(path) {
  const url = `${BASE}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "bns-sequential-audit/1.0", accept: "text/html" },
      signal: AbortSignal.timeout(45000),
    });
    const text = await res.text();
    const title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || null;
    const looks404 =
      res.status >= 400 ||
      /page not found|404/i.test(title || "") ||
      /This page could not be found/i.test(text.slice(0, 2000));
    return {
      path,
      status: res.status,
      ok: !looks404 && res.status < 400,
      finalPath: new URL(res.url).pathname + new URL(res.url).search,
      title,
      ms: Date.now() - started,
      bytes: text.length,
    };
  } catch (e) {
    return {
      path,
      status: null,
      ok: false,
      error: String(e.message || e).slice(0, 160),
      ms: Date.now() - started,
    };
  }
}

function extractSameOriginHrefs(html, fromPath) {
  const out = [];
  const re = /href=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    try {
      const abs = new URL(href, BASE);
      if (abs.origin !== new URL(BASE).origin) continue;
      out.push({ from: fromPath, href: abs.pathname + abs.search });
    } catch {}
  }
  return out;
}

async function main() {
  const results = [];
  console.log(`Sequential audit → ${BASE}\n`);

  for (const path of SEED) {
    const r = await probe(path);
    results.push({ ...r, via: "seed" });
    const mark = r.ok ? "OK " : "FAIL";
    console.log(`${mark} ${String(r.status ?? "ERR").padStart(3)} ${String(r.ms).padStart(5)}ms  ${path}  ${r.title || r.error || ""}`);
    await sleep(400);
  }

  // Harvest from successful seed pages (re-fetch HTML lightly)
  const harvested = new Set();
  for (const r of results.filter((x) => x.ok)) {
    try {
      const res = await fetch(`${BASE}${r.path}`, {
        redirect: "follow",
        signal: AbortSignal.timeout(45000),
      });
      const html = await res.text();
      for (const link of extractSameOriginHrefs(html, r.path)) {
        harvested.add(link.href);
      }
    } catch {}
    await sleep(200);
  }

  const extra = [...harvested].filter((p) => !results.some((r) => r.path === p || r.finalPath === p)).slice(0, 80);
  console.log(`\nHarvested ${harvested.size} unique paths; probing ${extra.length} extras…\n`);

  for (const path of extra) {
    const r = await probe(path);
    results.push({ ...r, via: "harvested" });
    const mark = r.ok ? "OK " : "FAIL";
    console.log(`${mark} ${String(r.status ?? "ERR").padStart(3)} ${String(r.ms).padStart(5)}ms  ${path}  ${r.title || r.error || ""}`);
    await sleep(300);
  }

  const failed = results.filter((r) => !r.ok);
  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    summary: {
      probed: results.length,
      failed: failed.length,
      ok: results.filter((r) => r.ok).length,
    },
    failed,
    results,
  };
  fs.writeFileSync("tmp-url-button-audit.json", JSON.stringify(report, null, 2));
  console.log(`\n=== SUMMARY ===`);
  console.log(`${report.summary.ok}/${report.summary.probed} OK, ${report.summary.failed} failed`);
  if (failed.length) {
    console.log("\nFailures:");
    for (const f of failed) console.log(`  ${f.status ?? "ERR"} ${f.path} ${f.error || f.title || ""}`);
  }
  console.log("\nWrote tmp-url-button-audit.json");
  process.exit(failed.length ? 1 : 0);
}

main();
