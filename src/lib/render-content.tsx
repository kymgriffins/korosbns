import React from "react";
import { marked } from "marked";
import { sanitizeHtml } from "@/lib/sanitize";

marked.use({ gfm: true, breaks: true });

const HAS_HTML = /<[a-z][\s\S]*>/i;
const HAS_MD_SYNTAX = /(?:^|\s)(\*\*|__|`|#|-\s|\d+\.\s|\[.*\]\(|!\[.*\]\()/;

function renderMarkdownInTextNodes(html: string): string {
  if (!html) return html;
  return html.replace(/>([^<]+)</g, (full, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !HAS_MD_SYNTAX.test(trimmed)) return full;
    try {
      const converted = marked.parse(trimmed, { async: false }) as string;
      const inner = converted.replace(/^<p>|<\/p>$/g, "").trim();
      return `>${inner}<`;
    } catch {
      return full;
    }
  });
}

function toHtml(content: string): string {
  const trimmed = (content || "").trim();
  if (!trimmed) return "";
  if (HAS_HTML.test(trimmed)) {
    const withMd = renderMarkdownInTextNodes(trimmed);
    return sanitizeHtml(withMd);
  }
  try {
    const html = marked.parse(trimmed, { async: false }) as string;
    return sanitizeHtml(html);
  } catch {
    return sanitizeHtml(trimmed);
  }
}

const CLS =
  "notion-content prose dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-strong:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-img:rounded-xl prose-img:shadow-md";

export function renderContent(content: string): React.ReactNode {
  const html = toHtml(content);
  if (!html) return null;
  return <div className={CLS} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function renderContentHtml(content: string): string {
  return toHtml(content);
}
