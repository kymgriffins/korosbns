/**
 * HTTP smoke for korosbns routes (follows redirects, checks HTML body).
 * Usage: node scripts/audit-page-smoke.mjs [baseUrl]
 */
import fs from "node:fs/promises";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const publicRoutes = [
  "/",
  "/about/",
  "/analytics/",
  "/bns-project/",
  "/bns-studio/",
  "/budgetnews/",
  "/contact/",
  "/events/",
  "/faq/",
  "/learnhub/",
  "/privacy/",
  "/reports/",
  "/security/",
  "/surveys/",
  "/team/",
  "/terms/",
  "/weekly-notes/",
  "/weekly-notes/audit/",
  "/weekly-notes/manage/",
  "/learn/",
  "/learn/modules/",
  "/learn/documents/",
  "/learn/forum/",
  "/learn/alerts/",
  "/learn/profile/",
  "/learn/account/",
  "/learn/account/notifications/",
  "/learn/account/password/",
  "/learn/account/sign-out/",
  "/learn/analytics/",
  "/learn/articles/",
  "/learn/videos/",
  "/learn/stories/",
  "/learn/quests/",
  "/auth/login/",
  "/auth/register/",
  "/auth/verify/",
  "/auth/reset/",
  "/auth/forgot-password/",
  "/offline/",
  "/team/movine-omondi/",
  "/team/peculiar-koros/",
  "/team/not-a-real-person-xyz/",
  "/insights/",
  "/partners/",
  "/trivia/",
  "/learn/paths/",
  "/dashboard/",
  "/admin/dashboard/communication/email-hooks/",
];

const adminRoutes = [
  "/admin/",
  "/admin/dashboard/",
  "/admin/auth/v1/login/",
  "/admin/auth/v2/login/",
  "/admin/dashboard/modules/",
  "/admin/dashboard/modules/new/",
  "/admin/dashboard/stories/",
  "/admin/dashboard/forum/",
  "/admin/dashboard/surveys/",
  "/admin/dashboard/trivia/",
  "/admin/dashboard/events/",
  "/admin/dashboard/settings/",
  "/admin/dashboard/communication/",
  "/admin/dashboard/users/",
  "/admin/dashboard/authors/",
  "/admin/dashboard/media/",
  "/admin/dashboard/knowledge/",
  "/admin/dashboard/courses/",
  "/admin/dashboard/docrepository/",
  "/admin/dashboard/engagement/",
  "/admin/dashboard/feedback/",
  "/admin/dashboard/partners/",
  "/admin/dashboard/roles/",
  "/admin/dashboard/gamification/",
  "/admin/dashboard/studio/",
  "/admin/dashboard/ke-budget/",
  "/admin/dashboard/invoices/",
  "/admin/dashboard/privacy/",
  "/admin/dashboard/security/",
  "/admin/dashboard/social/",
  "/admin/dashboard/content/",
  "/admin/dashboard/analytics/",
  "/admin/dashboard/invitations/",
  "/admin/dashboard/task/",
  "/admin/dashboard/notes/",
  "/admin/dashboard/calendar/",
  "/admin/dashboard/coming-soon/",
];

const all = [...publicRoutes, ...adminRoutes];

function looksLikeNotFound(html) {
  const h = (html || "").toLowerCase();
  return (
    h.includes("this page could not be found") ||
    h.includes("404") && h.includes("not found") ||
    h.includes(">404<") ||
    h.includes("page not found")
  );
}

function looksBroken(html) {
  const h = (html || "").toLowerCase();
  return (
    h.includes("application error") ||
    h.includes("internal server error") ||
    h.includes("uncaught") ||
    h.includes("__next_error__")
  );
}

function classify(status, html, path) {
  if (status === 0) return "unreachable";
  if (status >= 500) return "error";
  if (status === 401 || status === 403) return "auth";
  if (status === 404 || looksLikeNotFound(html)) return "missing";
  if (looksBroken(html)) return "error";
  if (status >= 200 && status < 300) return "ok";
  if (status >= 300 && status < 400) return "redirect";
  return "other";
}

async function hit(path) {
  const url = `${base}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { Accept: "text/html,application/json,*/*" },
    });
    const ct = res.headers.get("content-type") || "";
    let html = "";
    if (ct.includes("text/html") || ct.includes("text/plain") || !ct) {
      html = await res.text();
    }
    const finalUrl = res.url || url;
    return {
      path,
      status: res.status,
      finalUrl: finalUrl.replace(base, ""),
      kind: classify(res.status, html, path),
      title: (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [,""])[1].trim().slice(0, 120),
      ms: Date.now() - started,
      bytes: html.length,
      notFoundBody: looksLikeNotFound(html),
    };
  } catch (err) {
    return {
      path,
      status: 0,
      kind: "unreachable",
      finalUrl: path,
      title: "",
      ms: Date.now() - started,
      bytes: 0,
      error: String(err?.message || err),
    };
  }
}

const results = [];
// sequential to avoid melting the webpack compiler
for (const path of all) {
  const r = await hit(path);
  results.push(r);
  process.stdout.write(`${r.status}\t${r.kind}\t${r.path}\t${r.title}\n`);
}

const byKind = {};
for (const r of results) byKind[r.kind] = (byKind[r.kind] || 0) + 1;

const out = {
  base,
  checkedAt: new Date().toISOString(),
  totals: { routes: results.length, ...byKind },
  results,
};

await fs.writeFile(
  new URL("./audit-page-smoke-results.json", import.meta.url),
  JSON.stringify(out, null, 2),
  "utf8",
);

console.log("\nTOTALS", JSON.stringify(out.totals, null, 2));
console.log("\nISSUES");
for (const r of results.filter((x) => !["ok", "auth", "redirect"].includes(x.kind))) {
  console.log(`${r.status}\t${r.kind}\t${r.path} => ${r.finalUrl}\t${r.title}`);
}
