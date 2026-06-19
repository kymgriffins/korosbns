export function stripHtml(text: string): string {
  const trimmed = (text || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/<[^>]*>/g, "");
}

let purify: ((html: string, config?: object) => string) | null = null;

function getPurify(): ((html: string, config?: object) => string) | null {
  if (typeof window === "undefined") return null;
  if (!purify) {
    try {
      const mod = require("dompurify");
      purify = (html: string, config?: object) => mod.default?.sanitize?.(html, config) ?? html;
    } catch {
      return null;
    }
  }
  return purify;
}

const ALLOWED_TAGS = [
  "p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td",
  "img", "figure", "figcaption", "span", "div", "sub", "sup",
  "iframe",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "src", "alt", "class", "id", "width", "height",
  "allow", "allowfullscreen", "frameborder", "title", "style",
];

export function sanitizeHtml(html: string): string {
  const trimmed = (html || "").trim();
  if (!trimmed) return "";

  const p = getPurify();
  if (p) {
    return p(trimmed, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOW_DATA_ATTR: false });
  }

  return trimmed;
}
