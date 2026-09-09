const MARKETING_PATTERNS = [
  /^\/$/,
  /^\/about(?:\/|$)/,
  /^\/services(?:\/|$)/,
  /^\/features(?:\/|$)/,
  /^\/team(?:\/|$)/,
  /^\/contact(?:\/|$)/,
  /^\/faq(?:\/|$)/,
  /^\/blog(?:\/|$)/,
  /^\/articles(?:\/|$)/,
  /^\/news(?:\/|$)/,
  /^\/events(?:\/|$)/,
  /^\/partners(?:\/|$)/,
  /^\/testimonials(?:\/|$)/,
  /^\/pricing(?:\/|$)/,
  /^\/budget-hub(?:\/|$)/,
  /^\/learn(?:\/|$)/,
  /^\/bnske(?:\/|$)/,
  /^\/landing(?:\/|$)/,
  /^\/press(?:\/|$)/,
  /^\/careers(?:\/|$)/,
  /^\/donate(?:\/|$)/,
  /^\/support(?:\/|$)/,
  /^\/bns-studio(?:\/|$)/,
  /^\/work(?:\/|$)/,
  /^\/programmes(?:\/|$)/,
  /^\/help(?:\/|$)/,
  /^\/glossary(?:\/|$)/,
];

const API_PATTERNS = [
  /^\/api\//,
  /^\/admin\/api\//,
  /\/api\/v\d/,
  /\/api\/auth\//,
  /\/api\/content\//,
  /\/api\/users\//,
  /\/api\/analytics\//,
];

const INTERNAL_PATTERNS = [
  /^\/admin(?:\/|$)/,
  /^\/dashboard(?:\/|$)/,
  /^\/auth(?:\/|$)/,
  /^\/_next\//,
  /^\/__nextjs_original-stack-frame/,
  /^\/favicon\./,
  /^\/robots\.txt/,
  /^\/sitemap/,
  /^\/manifest\//,
  /^\/sw\./,
  /^\/workbox-/,
];

export type PageCategory = "marketing" | "api" | "internal" | "other";

export function categorizePath(path: string): PageCategory {
  const cleaned = path.split("?")[0]?.split("#")[0] ?? path;
  for (const pattern of API_PATTERNS) {
    if (pattern.test(cleaned)) return "api";
  }
  for (const pattern of INTERNAL_PATTERNS) {
    if (pattern.test(cleaned)) return "internal";
  }
  for (const pattern of MARKETING_PATTERNS) {
    if (pattern.test(cleaned)) return "marketing";
  }
  return "other";
}

export function isShowcasePage(path: string): boolean {
  const category = categorizePath(path);
  return category === "marketing" || category === "other";
}
