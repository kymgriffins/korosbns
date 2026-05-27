import { apiFetch } from "@/lib/api-client";

export type DeepDiveArticle = {
  slug: string;
  title: string;
  summary: string;
  sourceLabel: string;
  html: string;
  updatedAt?: string;
  category?: string;
};

export type DeepDiveCard = {
  slug: string;
  title: string;
  summary: string;
  icon?: string;
  gradient?: string;
};

/** Fetch a deep-dive article from the API. Returns null if not found. */
export async function fetchDeepDiveArticle(slug: string): Promise<DeepDiveArticle | null> {
  try {
    return await apiFetch<DeepDiveArticle>(`/content/articles/${slug}/`);
  } catch {
    return null;
  }
}

/** Fetch deep-dive cards from the API (summary list). */
export async function fetchDeepDiveCards(): Promise<DeepDiveCard[]> {
  try {
    const resp = await apiFetch<{ results: DeepDiveCard[] }>("/content/learn/articles/");
    return resp.results ?? [];
  } catch {
    return [];
  }
}
