import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { sanitizeHtml } from "@/lib/sanitize";

const HAS_HTML = /<[a-z][\s\S]*>/i;

export function isHtmlContent(text: string): boolean {
  return HAS_HTML.test(text);
}

export function renderContent(content: string): React.ReactNode {
  const trimmed = (content || "").trim();
  if (!trimmed) return null;

  if (isHtmlContent(trimmed)) {
    return (
      <div
        className="notion-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(trimmed) }}
      />
    );
  }

  const clsPrefix =
    "prose dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80";

  return (
    <div className={clsPrefix}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
