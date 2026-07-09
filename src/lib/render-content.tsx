import React from "react";
import { marked } from "marked";
import { editorBlocksToHtml, parseEditorJsBody, resolveArticleBodyHtml } from "@/lib/editorjs";
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

function wrapImagesWithFigure(html: string): string {
  return html.replace(
    /<img\s+([^>]*?)>/gi,
    (full, attrs: string) => {
      const altMatch = attrs.match(/alt\s*=\s*"([^"]*)"/i);
      const alt = altMatch ? altMatch[1] : "";
      const loadingAttr = attrs.includes('loading=') ? '' : ' loading="lazy"';
      const imgTag = `<img ${attrs}${loadingAttr} />`;
      if (alt) {
        return `<figure class="my-6">${imgTag}<figcaption class="mt-2 text-center text-xs text-muted-foreground">${alt}</figcaption></figure>`;
      }
      return `<figure class="my-6">${imgTag}</figure>`;
    },
  );
}

function extractAndLinkHeadings(html: string): string {
  let idCounter = 0;
  return html.replace(/<h([2-3])\b([^>]*)>(.*?)<\/h\1>/g, (_full, level: string, attrs: string, text: string) => {
    const cleaned = text.replace(/<[^>]*>/g, "").trim();
    if (!cleaned) return _full;
    idCounter += 1;
    const id = `section-${idCounter}`;
    return `<h${level} ${attrs} id="${id}"><a href="#${id}" class="anchor-link">${cleaned}</a></h${level}>`;
  });
}

function applyDropCap(html: string): string {
  return html.replace(
    /^(<div[^>]*>\s*)?(<p[^>]*>)([A-Z"'])/
  , (_full, divOpen: string, pTag: string, firstChar: string) => {
    return `${divOpen || ""}${pTag}<span class="drop-cap text-4xl font-bold float-left leading-none mr-2 mt-0.5 text-primary">${firstChar === '"' ? "&ldquo;" : firstChar}</span>`;
  });
}

function toHtml(content: string): string {
  const trimmed = (content || "").trim();
  if (!trimmed) return "";

  const editorParsed = parseEditorJsBody(trimmed);
  if (editorParsed) {
    if (!editorParsed.blocks.length) return "";
    return sanitizeHtml(editorBlocksToHtml(editorParsed.blocks));
  }

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

export function renderContent(content: string): React.ReactNode {
  const html = toHtml(content);
  if (!html) return null;
  const withImages = wrapImagesWithFigure(html);
  const withAnchors = extractAndLinkHeadings(withImages);
  const withDropCap = applyDropCap(withAnchors);
  return (
    <div className={CLS} dangerouslySetInnerHTML={{ __html: withDropCap }} />
  );
}

export function renderContentHtml(content: string): string {
  return toHtml(content);
}

export function resolveArticleContentHtml(
  bodyHtml?: string | null,
  body?: string | null,
  fallback?: string | null,
): string {
  return toHtml(resolveArticleBodyHtml(bodyHtml, body) || (fallback || "").trim());
}

export function renderArticleBody(
  bodyHtml?: string | null,
  body?: string | null,
  fallback?: string | null,
): React.ReactNode {
  const resolved = resolveArticleBodyHtml(bodyHtml, body) || (fallback || "").trim();
  if (!resolved) return null;
  return renderContent(resolved);
}

const CLS =
  "notion-content prose dark:prose-invert max-w-none " +
  "prose-sm sm:prose-base lg:prose-lg " +
  "prose-headings:font-black prose-p:leading-relaxed " +
  "prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 " +
  "prose-blockquote:border-primary prose-blockquote:text-foreground/80 prose-blockquote:not-italic " +
  "prose-strong:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded " +
  "prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto " +
  "[&_.anchor-link]:no-underline [&_.anchor-link:hover]:text-primary/80 " +
  "[&_.drop-cap]:text-4xl [&_.drop-cap]:sm:text-5xl";

export function extractTocHeadings(html: string): { id: string; level: number; text: string }[] {
  const headings: { id: string; level: number; text: string }[] = [];
  const regex = /<h([2-3])\b[^>]*id="(section-\d+)"[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    headings.push({ id, level, text });
  }
  return headings;
}