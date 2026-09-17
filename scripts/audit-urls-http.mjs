/**
 * Fast HTTP audit of seed + harvested URLs from rendered HTML.
 * Then prints link graph status. Buttons are listed from HTML forms/controls.
 *
 * node scripts/audit-urls-http.mjs [baseURL]
 */
import fs from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const OUT = "tmp-url-button-audit.json";

const SEED = [
  "/",
  "/about",
  "/programmes",
  "/programmes/connect",
  "/programmes/mashinani",
  "/programmes/wanahabari-lab",
  "/bns-studio",
  "/contact",
  "/contact?intent=partner",
  "/reports",
  "/projects",
  "/learn",
  "/budgetnews",
  "/faq",
  "/careers",
  "/privacy",
  "/terms",
  "/security",
  "/events",
  "/surveys",
  "/weekly-notes",
  "/glossary",
  "/help",
  "/capabilities",
  "/auth/login",
  "/auth/register",
  "/analytics",
  "/team",
  "/impact",
  "/consortium",
  "/login",
];

function pathOf(url) {
  try {
    const u = new URL(url, BASE);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function isSkippable(href) {
  if (!href) return true;
  const h = href.trim().toLowerCase();
  return (
    h.startsWith("mailto:") ||
    h.startsWith("tel:") ||
    h.startsWith("javascript:") ||
    h.startsWith("#") ||
    h.startsWith("data:")
  );
}

async function fetchStatus(urlPath) {
  const url = urlPath.startsWith("http") ? urlPath : `${BASE}${urlPath}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "bns-url-audit/1.0" },
    });
    clearTimeout(timer);
    return {
      path: pathOf(urlPath),
      status: res.status,
      ok: res.status < 400,
      finalPath: pathOf(res.url),
      contentType: res.headers.get("content-type"),
    };
  } catch (e) {
    clearTimeout(timer);
    return {
      path: pathOf(urlPath),
      status: null,
      ok: false,
      error: String(e.message || e).slice(0, 180),
    };
  }
}

async function fetchHtml(urlPath) {
  const url = `${BASE}${urlPath}`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "bns-url-audit/1.0" },
  });
  const html = await res.text();
  return { status: res.status, ok: res.status < 400, finalPath: pathOf(res.url), html };
}

function extractLinks(html, from) {
  const links = [];
  const re = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[2];
    const text = m[3]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
    links.push({ from, href, text });
  }
  return links;
}

function extractButtons(html, from) {
  const buttons = [];
  const btnRe = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  let m;
  while ((m = btnRe.exec(html))) {
    const attrs = m[1];
    const text = m[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
    const type = (attrs.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1] || "submit";
    const disabled = /\bdisabled\b/i.test(attrs);
    buttons.push({ from, tag: "button", text, type, disabled, response: null });
  }
  // CTA-looking anchors with button-ish classes
  const ctaRe =
    /<a\b[^>]*class=["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = ctaRe.exec(html))) {
    const text = m[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
    buttons.push({ from, tag: "a.cta", text, href: m[1], response: null });
  }
  return buttons;
}

async function main() {
  const urlResults = new Map();
  const linkInventory = [];
  const buttonInventory = [];

  console.log(`Probing seed URLs against ${BASE} …`);
  for (const route of SEED) {
    const r = await fetchStatus(route);
    r.via = "seed";
    urlResults.set(r.path, r);
    process.stdout.write(r.ok ? "." : "x");
  }
  console.log("");

  console.log("Harvesting links + buttons from seed HTML …");
  const harvested = new Set();
  for (const route of SEED) {
    const seed = urlResults.get(route) || urlResults.get(pathOf(route));
    if (!seed?.ok) continue;
    try {
      const page = await fetchHtml(route);
      const links = extractLinks(page.html, route);
      const buttons = extractButtons(page.html, route);
      buttonInventory.push(...buttons);
      for (const link of links) {
        if (isSkippable(link.href)) {
          linkInventory.push({ ...link, kind: "non-http" });
          continue;
        }
        let absolute;
        try {
          absolute = new URL(link.href, BASE).href;
        } catch {
          continue;
        }
        const sameOrigin = new URL(absolute).origin === new URL(BASE).origin;
        const entry = { ...link, absolute, sameOrigin };
        linkInventory.push(entry);
        if (sameOrigin) harvested.add(pathOf(absolute));
      }
      process.stdout.write(".");
    } catch (e) {
      process.stdout.write("!");
      linkInventory.push({ from: route, error: String(e.message || e).slice(0, 160) });
    }
  }
  console.log(`\nProbing ${harvested.size} harvested same-origin URLs …`);

  for (const p of harvested) {
    if (urlResults.has(p)) continue;
    const r = await fetchStatus(p);
    r.via = "link";
    urlResults.set(r.path, r);
    process.stdout.write(r.ok ? "." : "x");
  }
  console.log("");

  for (const entry of linkInventory) {
    if (!entry.sameOrigin || !entry.absolute) continue;
    const r = urlResults.get(pathOf(entry.absolute));
    entry.status = r?.status ?? null;
    entry.ok = r?.ok ?? false;
    entry.finalPath = r?.finalPath;
  }

  // Attach responses for CTA links
  for (const b of buttonInventory) {
    if (b.href && !isSkippable(b.href)) {
      try {
        const abs = new URL(b.href, BASE).href;
        if (new URL(abs).origin === new URL(BASE).origin) {
          const key = pathOf(abs);
          let r = urlResults.get(key);
          if (!r) {
            r = await fetchStatus(key);
            r.via = "cta";
            urlResults.set(r.path, r);
          }
          b.response = `http_${r.status}`;
          b.target = r.path;
          b.ok = r.ok;
          b.finalPath = r.finalPath;
        } else {
          b.response = "external";
          b.ok = true;
        }
      } catch {
        b.response = "invalid_href";
        b.ok = false;
      }
    } else if (b.tag === "button") {
      b.response = b.disabled ? "disabled" : "client_handler_needs_browser";
      b.ok = true;
    }
  }

  const urls = [...urlResults.values()].sort((a, b) => a.path.localeCompare(b.path));
  const failedUrls = urls.filter((u) => !u.ok);
  const brokenLinks = [];
  const seen = new Set();
  for (const l of linkInventory) {
    if (!l.sameOrigin || l.ok !== false) continue;
    const key = `${l.from}=>${l.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    brokenLinks.push(l);
  }
  const failedButtons = buttonInventory.filter((b) => b.ok === false);

  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    summary: {
      urlsProbed: urls.length,
      urlsFailed: failedUrls.length,
      linksHarvested: linkInventory.filter((l) => l.href).length,
      brokenInPageLinks: brokenLinks.length,
      buttonsFound: buttonInventory.length,
      buttonsFailed: failedButtons.length,
      buttonsNeedingBrowser: buttonInventory.filter((b) => b.response === "client_handler_needs_browser").length,
    },
    failedUrls,
    brokenLinks,
    failedButtons,
    urls,
    buttonInventory,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

  console.log("\n=== URL & BUTTON AUDIT ===");
  console.log(JSON.stringify(report.summary, null, 2));
  if (failedUrls.length) {
    console.log("\nFailed URLs:");
    for (const u of failedUrls) console.log(`  ${u.status ?? "ERR"} ${u.path} ${u.error || ""} → ${u.finalPath || ""}`);
  }
  if (brokenLinks.length) {
    console.log("\nBroken in-page links:");
    for (const l of brokenLinks) console.log(`  ${l.from} → ${l.href} ("${l.text}") [${l.status}]`);
  }
  if (failedButtons.length) {
    console.log("\nFailed CTAs:");
    for (const b of failedButtons) console.log(`  [${b.from}] ${b.tag} "${b.text}" → ${b.response}`);
  }
  console.log(`\nWrote ${OUT}`);
  process.exit(failedUrls.length || failedButtons.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
