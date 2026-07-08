import { contentData } from "@/data/content";

export type BudgetHubContentResolved =
  | { type: "article"; data: Record<string, unknown> }
  | { type: "trivia"; data: Record<string, unknown> }
  | { type: "story"; data: Record<string, unknown> }
  | null;

async function resolveStoryById(idOrSlug: string) {
  try {
    const storyBySlug = await contentData.stories.fetchBySlug(idOrSlug);
    if (storyBySlug) {
      return { type: "story" as const, data: storyBySlug as Record<string, unknown> };
    }
  } catch {
    // continue fallbacks
  }

  try {
    const stories = await contentData.stories.fetch();
    const match = stories.find(
      (story) => story.id === idOrSlug || story.slug === idOrSlug,
    );
    if (match) {
      return { type: "story" as const, data: match as unknown as Record<string, unknown> };
    }
  } catch {
    // no-op
  }

  return null;
}

/**
 * Existing Learn resolver: slug-first lookup.
 */
export async function resolveBudgetHubContentBySlug(
  slug: string,
): Promise<BudgetHubContentResolved> {
  try {
    const artData = await contentData.articles.fetchBySlug(slug);
    if (artData && Object.keys(artData).length > 0) {
      return { type: "article", data: artData as Record<string, unknown> };
    }
  } catch {
    // continue
  }

  try {
    const trivData = await contentData.trivia.fetchBySlug(slug);
    if (trivData && Object.keys(trivData).length > 0) {
      return { type: "trivia", data: trivData as Record<string, unknown> };
    }
  } catch {
    // continue
  }

  return resolveStoryById(slug);
}

/**
 * Budget Hub resolver for content-id route.
 * Uses list APIs to map content id -> slug where needed.
 */
export async function resolveBudgetHubContentById(
  contentId: string,
): Promise<BudgetHubContentResolved> {
  try {
    const articles = await contentData.articles.fetch();
    const articleMatch = articles.find((item) => item.id === contentId);
    if (articleMatch) {
      const lookup = articleMatch.slug || articleMatch.id;
      const artData = await contentData.articles.fetchBySlug(lookup);
      if (artData && Object.keys(artData).length > 0) {
        return { type: "article", data: artData as Record<string, unknown> };
      }
    }
  } catch {
    // continue
  }

  try {
    const triviaList = await contentData.trivia.fetchList();
    const triviaMatch = triviaList.find((item) => item.id === contentId);
    if (triviaMatch) {
      const slug =
        (triviaMatch as unknown as { slug?: string }).slug || triviaMatch.id;
      const lookup = slug || triviaMatch.id;
      const trivData = await contentData.trivia.fetchBySlug(lookup);
      if (trivData && Object.keys(trivData).length > 0) {
        return { type: "trivia", data: trivData as Record<string, unknown> };
      }
    }
  } catch {
    // continue
  }

  return resolveStoryById(contentId);
}
