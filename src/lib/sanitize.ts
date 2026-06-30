import DOMPurify from "isomorphic-dompurify";

export function stripHtml(text: string): string {
  const trimmed = (text || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/<[^>]*>/g, "");
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
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOW_DATA_ATTR: false });
}
