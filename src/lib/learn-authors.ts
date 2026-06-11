import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { learnHubApi } from "./learn-hub";

export function getAuthorSlug(author: CivicModuleAuthor): string {
  return author.slug || "";
}

export async function fetchAllAuthors(): Promise<CivicModuleAuthor[]> {
  try {
    const res = await learnHubApi.authors();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function fetchAuthorBySlug(slug: string): Promise<{
  author: CivicModuleAuthor;
  modules: CivicModule[];
} | null> {
  try {
    return await learnHubApi.author(slug);
  } catch {
    return null;
  }
}
