import { resolveArticleContentHtml } from "@/lib/render-content";

export function ArticleBody({
  body,
  bodyHtml,
  snippet,
}: {
  body?: string;
  bodyHtml?: string;
  snippet?: string;
}) {
  const html = resolveArticleContentHtml(bodyHtml, body, snippet);

  if (!html) {
    return (
      <p className="text-muted-foreground">This article has no body content yet.</p>
    );
  }

  return (
    <div
      className="budget-hub-prose mx-auto max-w-[var(--bh-prose)] pb-[var(--bh-section-y)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
