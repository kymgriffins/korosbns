import { useQuery } from "@tanstack/react-query";
import { contentData } from "@/data/content";
import { citizenApi, type TriviaLeaderboardRow, type TriviaSetApi } from "@/lib/api-client";

export function useArticle(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => contentData.articles.fetchBySlug(slug),
    enabled: !!slug && enabled,
  });
}

export function useArticles(filters?: { search?: string }) {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: () => contentData.articles.fetch(filters).then((results) => ({ results })),
  });
}

export function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => contentData.stories.fetch().then((results) => ({ results })),
  });
}

export function useTriviaList() {
  return useQuery({
    queryKey: ["trivia-list"],
    queryFn: () => citizenApi.getTriviaList(),
  });
}

export function useTrivia(id: string, enabled = true) {
  return useQuery({
    queryKey: ["trivia", id],
    queryFn: () => contentData.trivia.fetchBySlug(id),
    enabled: !!id && enabled,
  });
}

export function useTriviaLeaderboard(id: string) {
  return useQuery({
    queryKey: ["trivia-leaderboard", id],
    queryFn: () => contentData.trivia.fetchLeaderboard(id),
    enabled: !!id,
  });
}

export function useKnowledge() {
  return useQuery({
    queryKey: ["knowledge"],
    queryFn: () => contentData.knowledge.fetch().then((results) => ({ results })),
  });
}

export function useKnowledgeEntry(id: string) {
  return useQuery({
    queryKey: ["knowledge", id],
    queryFn: () => contentData.knowledge.fetchById(id),
    enabled: !!id,
  });
}

export function useContentForSlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["content-by-slug", slug],
    queryFn: async (): Promise<{ type: "article" | "trivia" | "story"; data: Record<string, unknown> } | null> => {
      try {
        const artData = await contentData.articles.fetchBySlug(slug);
        if (artData && Object.keys(artData).length > 0) return { type: "article", data: artData as Record<string, unknown> };
      } catch {
        // Content type not found, try next
      }
      try {
        const trivData = await contentData.trivia.fetchBySlug(slug);
        if (trivData && Object.keys(trivData).length > 0) return { type: "trivia", data: trivData as Record<string, unknown> };
      } catch {
        // Content type not found, try next
      }
      try {
        const storiesRes = await contentData.stories.fetch();
        const match = storiesRes?.find((s: Record<string, unknown>) => s.id === slug);
        if (match) return { type: "story", data: match };
      } catch {
        // Content type not found
      }
      return null;
    },
    enabled: !!slug && enabled,
    retry: false,
  });
}
