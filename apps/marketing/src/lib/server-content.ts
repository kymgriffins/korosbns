import { buildApiUrl } from "@/lib/api-url";
import { SERVER_CONTENT_REVALIDATE_SECONDS } from "@/lib/fetch-policy";
import { mapApiArticle, type HubArticle } from "@/lib/learn-content";

function parseArticleList(data: Record<string, unknown>): Record<string, unknown>[] {
  return (
    (data.results as Record<string, unknown>[] | undefined) ??
    ((data as { articles?: Record<string, unknown>[] }).articles ?? [])
  );
}

export async function fetchArticleListServer(): Promise<HubArticle[]> {
  const response = await fetch(buildApiUrl("/content/articles/"), {
    next: { revalidate: SERVER_CONTENT_REVALIDATE_SECONDS },
  });
  if (!response.ok) {
    throw new Error(`Could not load articles (${response.status}).`);
  }
  const data = (await response.json()) as Record<string, unknown>;
  return parseArticleList(data).map((item) => mapApiArticle(item));
}

export async function fetchArticleBySlugServer(slug: string): Promise<HubArticle | null> {
  const response = await fetch(buildApiUrl(`/content/articles/${slug}/`), {
    next: { revalidate: SERVER_CONTENT_REVALIDATE_SECONDS },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Could not load article (${response.status}).`);
  }
  const data = (await response.json()) as Record<string, unknown>;
  return mapApiArticle(data);
}

export async function fetchArticleSlugsServer(): Promise<string[]> {
  try {
    const articles = await fetchArticleListServer();
    return articles.map((a) => a.id);
  } catch {
    return [];
  }
}
