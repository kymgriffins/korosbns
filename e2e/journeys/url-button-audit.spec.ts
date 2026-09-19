import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SEED = [
  "/",
  "/about",
  "/programmes",
  "/programmes/connect",
  "/programmes/mashinani",
  "/programmes/wanahabari-lab",
  "/programmes/studios",
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
];

const BUTTON_PAGES = ["/", "/programmes", "/programmes/connect", "/about", "/bns-studio", "/contact", "/learn", "/reports"];

function pathOf(url: string, base: string) {
  try {
    const u = new URL(url, base);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

function isSkippableHref(href: string | null | undefined) {
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

test("audit public URLs + user-facing buttons and responses", async ({ page, request, baseURL }) => {
  test.setTimeout(300_000);
  const base = (baseURL || "http://localhost:3000").replace(/\/$/, "");

  type UrlResult = {
    path: string;
    via: string;
    status: number | null;
    ok: boolean;
    redirectedTo?: string;
    error?: string;
  };

  const urlResults = new Map<string, UrlResult>();
  const linkInventory: Array<Record<string, unknown>> = [];
  const buttonResults: Array<Record<string, unknown>> = [];

  async function probe(urlPath: string, via: string) {
    const key = pathOf(urlPath, base);
    if (urlResults.has(key)) return urlResults.get(key)!;
    const result: UrlResult = { path: key, via, status: null, ok: false };
    try {
      const res = await request.get(key.startsWith("http") ? key : `${base}${key}`, {
        maxRedirects: 5,
        timeout: 20000,
      });
      result.status = res.status();
      result.ok = result.status < 400;
      const final = res.url();
      if (final && pathOf(final, base) !== key) result.redirectedTo = pathOf(final, base);
    } catch (e) {
      result.error = String((e as Error).message || e).slice(0, 180);
    }
    urlResults.set(key, result);
    return result;
  }

  // 1) Probe seed URLs fast
  for (const route of SEED) {
    await probe(route, "seed");
  }

  // 2) Harvest visible links from seed pages that loaded
  const harvested = new Set<string>();
  for (const route of SEED) {
    const seed = urlResults.get(route);
    if (!seed?.ok) continue;
    try {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 25000 });
      const links = await page.$$eval("a[href]", (as) =>
        as.map((a) => ({
          href: a.getAttribute("href"),
          text: ((a as HTMLElement).innerText || a.getAttribute("aria-label") || "")
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 100),
        })),
      );
      for (const link of links) {
        if (isSkippableHref(link.href)) {
          linkInventory.push({ from: route, href: link.href, text: link.text, kind: "non-http" });
          continue;
        }
        let absolute: string;
        try {
          absolute = new URL(link.href!, base).href;
        } catch {
          continue;
        }
        const sameOrigin = new URL(absolute).origin === new URL(base).origin;
        const entry: Record<string, unknown> = {
          from: route,
          href: link.href,
          text: link.text,
          absolute,
          sameOrigin,
        };
        linkInventory.push(entry);
        if (sameOrigin) harvested.add(pathOf(absolute, base));
      }
    } catch (e) {
      linkInventory.push({ from: route, error: String((e as Error).message || e).slice(0, 160) });
    }
  }

  // 3) Probe harvested same-origin paths
  for (const p of harvested) {
    await probe(p, "link");
  }

  for (const entry of linkInventory) {
    if (!entry.sameOrigin || !entry.absolute) continue;
    const r = urlResults.get(pathOf(String(entry.absolute), base));
    entry.status = r?.status ?? null;
    entry.ok = r?.ok ?? false;
    entry.redirectedTo = r?.redirectedTo;
  }

  // 4) Button/CTA interaction on key pages
  for (const route of BUTTON_PAGES) {
    if (!urlResults.get(route)?.ok) continue;
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(250);

    const controls = await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll(
          'header a[href], header button, nav a[href], nav button, main a[href], main button, [role="button"], form button, input[type="submit"]',
        ),
      ] as HTMLElement[];
      const seen = new Set<string>();
      const out: Array<{
        key: string;
        tag: string;
        text: string;
        href: string | null;
        disabled: boolean;
      }> = [];
      for (const el of nodes) {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (s.display === "none" || s.visibility === "hidden" || r.width < 2 || r.height < 2) continue;
        const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("value") || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 80);
        const href = el.getAttribute("href");
        const key = `${el.tagName}:${text}:${href || ""}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          key,
          tag: el.tagName.toLowerCase(),
          text,
          href,
          disabled: el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true",
        });
        if (out.length >= 25) break;
      }
      return out;
    });

    for (const ctrl of controls) {
      const record: Record<string, unknown> = {
        page: route,
        tag: ctrl.tag,
        text: ctrl.text,
        href: ctrl.href,
        response: null,
        ok: true,
      };

      if (ctrl.disabled) {
        record.response = "disabled";
        buttonResults.push(record);
        continue;
      }

      if (ctrl.tag === "a" && ctrl.href && !isSkippableHref(ctrl.href)) {
        try {
          const full = new URL(ctrl.href, base).href;
          if (new URL(full).origin === new URL(base).origin) {
            const r = await probe(pathOf(full, base), "cta-link");
            record.response = `http_${r.status}`;
            record.target = r.path;
            record.redirectedTo = r.redirectedTo;
            record.ok = r.ok;
          } else {
            record.response = "external";
            record.target = full;
          }
        } catch {
          record.ok = false;
          record.response = "invalid_href";
        }
        buttonResults.push(record);
        continue;
      }

      if (ctrl.tag === "a" && isSkippableHref(ctrl.href)) {
        record.response = `special:${ctrl.href}`;
        buttonResults.push(record);
        continue;
      }

      // Real button click
      const before = pathOf(page.url(), base);
      try {
        const btn = ctrl.text
          ? page.getByRole("button", { name: ctrl.text, exact: true }).first()
          : page.locator("button").first();
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(400);
        const after = pathOf(page.url(), base);
        const dialog = await page.locator('[role="dialog"]').first().isVisible().catch(() => false);
        if (after !== before) {
          record.response = `navigated:${after}`;
          const r = await probe(after, "button-nav");
          record.ok = r.ok;
        } else if (dialog) {
          record.response = "dialog_open";
          await page.keyboard.press("Escape").catch(() => {});
        } else {
          record.response = "no_route_change";
        }
        if (pathOf(page.url(), base) !== route) {
          await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 20000 });
        }
      } catch (e) {
        record.ok = false;
        record.response = "click_failed";
        record.error = String((e as Error).message || e).slice(0, 160);
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      }
      buttonResults.push(record);
    }
  }

  const urls = [...urlResults.values()].sort((a, b) => a.path.localeCompare(b.path));
  const failedUrls = urls.filter((u) => !u.ok);
  const brokenLinks = linkInventory.filter((l) => l.sameOrigin && l.ok === false);
  const failedButtons = buttonResults.filter((b) => b.ok === false);

  const report = {
    base,
    generatedAt: new Date().toISOString(),
    summary: {
      urlsProbed: urls.length,
      urlsFailed: failedUrls.length,
      linksHarvested: linkInventory.filter((l) => l.href).length,
      brokenInPageLinks: brokenLinks.length,
      buttonsChecked: buttonResults.length,
      buttonsFailed: failedButtons.length,
    },
    failedUrls,
    brokenLinks: uniqueBroken(brokenLinks),
    failedButtons,
    softButtons: buttonResults.filter((b) => b.response === "no_route_change" || b.response === "click_failed"),
    urls,
    buttonResults,
  };

  const out = path.join(process.cwd(), "tmp-url-button-audit.json");
  fs.writeFileSync(out, JSON.stringify(report, null, 2));

  console.log("\n=== URL & BUTTON AUDIT ===");
  console.log(JSON.stringify(report.summary, null, 2));
  if (failedUrls.length) {
    console.log("\nFailed URLs:");
    for (const u of failedUrls) console.log(`  ${u.status ?? "ERR"} ${u.path} ${u.error || ""}`);
  }
  if (report.brokenLinks.length) {
    console.log("\nBroken in-page links:");
    for (const l of report.brokenLinks) console.log(`  ${l.from} → ${l.href} (${l.text}) [${l.status}]`);
  }
  if (failedButtons.length) {
    console.log("\nFailed buttons/CTAs:");
    for (const b of failedButtons) console.log(`  [${b.page}] ${b.tag} "${b.text}" → ${b.response}`);
  }
  if (report.softButtons.length) {
    console.log("\nButtons with no route change (may be intentional):");
    for (const b of report.softButtons.slice(0, 30)) {
      console.log(`  [${b.page}] "${b.text}" → ${b.response}`);
    }
  }
  console.log(`\nWrote ${out}`);

  expect(
    failedUrls,
    `Broken URLs:\n${failedUrls.map((u) => `${u.status} ${u.path}`).join("\n")}`,
  ).toEqual([]);
});

function uniqueBroken(rows: Array<Record<string, unknown>>) {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];
  for (const row of rows) {
    const key = `${row.from}=>${row.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}
