import { citizenApi, type SurveyListItemApi } from "@/lib/api-client";
import { mapApiArticle, type HubArticle } from "@/lib/learn-content";

export async function loadSurveyList(): Promise<SurveyListItemApi[]> {
  const data = await citizenApi.getSurveys();
  return data.results ?? [];
}

export async function loadArticleList(): Promise<HubArticle[]> {
  const data = await citizenApi.getArticles();
  const list =
    (data.results as Record<string, unknown>[] | undefined) ??
    ((data as unknown as { articles?: Record<string, unknown>[] }).articles ?? []);
  return list.map((item) => mapApiArticle(item));
}

export function contentLoadErrorMessage(err: unknown, resource: string): string {
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }
  return `Could not load ${resource}.`;
}
