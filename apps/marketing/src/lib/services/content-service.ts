import { citizenApi } from "@/lib/api-client";

export async function fetchArticle(slug: string) {
  return citizenApi.getArticle(slug);
}

export async function fetchTrivia(slug: string) {
  return citizenApi.getTrivia(slug);
}

export async function fetchStories() {
  return citizenApi.getStories();
}

export async function fetchArticleBySlug(slug: string) {
  try {
    const data = await citizenApi.getArticle(slug);
    if (data && Object.keys(data).length > 0) return data;
  } catch {
    // Article not found
  }
  return null;
}

export async function resolveContentSlug(slug: string) {
  try {
    const artData = await citizenApi.getArticle(slug);
    if (artData && Object.keys(artData).length > 0) return { type: "article" as const, data: artData };
  } catch {
    // Try next content type
  }
  try {
    const trivData = await citizenApi.getTrivia(slug);
    if (trivData && Object.keys(trivData).length > 0) return { type: "trivia" as const, data: trivData };
  } catch {
    // Try next content type
  }
  try {
    const storiesRes = await citizenApi.getStories();
    const match = (storiesRes as any)?.results?.find((s: any) => s.id === slug);
    if (match) return { type: "story" as const, data: match };
  } catch {
    // Story not found
  }
  return null;
}
