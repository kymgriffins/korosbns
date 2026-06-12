import { useQuery } from "@tanstack/react-query";
import { citizenApi } from "@/lib/api-client";
import type { TriviaSetApi, TriviaLeaderboardRow } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";

export function useArticle(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => citizenApi.getArticle(slug),
    enabled: !!slug && enabled,
  });
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => citizenApi.getArticles(),
  });
}

export function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => citizenApi.getStories(),
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
    queryFn: () => citizenApi.getTrivia(id),
    enabled: !!id && enabled,
  });
}

export function useTriviaLeaderboard(id: string) {
  return useQuery({
    queryKey: ["trivia-leaderboard", id],
    queryFn: () => citizenApi.getTriviaLeaderboard(id),
    enabled: !!id,
  });
}

export function useKnowledge() {
  return useQuery({
    queryKey: ["knowledge"],
    queryFn: () => citizenApi.getKnowledge(),
  });
}

export function useKnowledgeEntry(id: string) {
  return useQuery({
    queryKey: ["knowledge", id],
    queryFn: () => citizenApi.getKnowledgeEntry(id),
    enabled: !!id,
  });
}

export function useContentForSlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["content-by-slug", slug],
    queryFn: async (): Promise<{ type: "article" | "trivia" | "story"; data: any } | null> => {
      try {
        const artData = await citizenApi.getArticle(slug);
        if (artData && Object.keys(artData).length > 0) return { type: "article", data: artData };
      } catch { }
      try {
        const trivData = await citizenApi.getTrivia(slug);
        if (trivData && Object.keys(trivData).length > 0) return { type: "trivia", data: trivData };
      } catch { }
      try {
        const storiesRes = await citizenApi.getStories();
        const match = (storiesRes as any)?.results?.find((s: any) => s.id === slug);
        if (match) return { type: "story", data: match };
      } catch { }
      return null;
    },
    enabled: !!slug && enabled,
    retry: false,
  });
}
