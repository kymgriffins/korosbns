import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { learnHubApi } from "./learn-hub";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAuthorSlug(author: CivicModuleAuthor): string {
  return author.slug || slugify(author.name);
}

export async function fetchAllAuthors(): Promise<CivicModuleAuthor[]> {
  const res = await learnHubApi.stages();
  const modules = res.results || res as unknown as CivicModule[];
  const seen = new Set<string>();
  const authors: CivicModuleAuthor[] = [];
  for (const mod of modules) {
    if (mod.author) {
      const key = mod.author.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        mod.author.slug = getAuthorSlug(mod.author);
        authors.push(mod.author);
      }
    }
  }
  return authors;
}

export async function fetchAuthorBySlug(slug: string): Promise<{
  author: CivicModuleAuthor;
  modules: CivicModule[];
} | null> {
  const res = await learnHubApi.stages();
  const modules = (res.results || res as unknown as CivicModule[]).filter(
    (m: CivicModule) => m.author
  );
  for (const mod of modules) {
    if (mod.author) {
      const authorSlug = getAuthorSlug(mod.author);
      if (authorSlug === slug) {
        const authorModules = modules.filter(
          (m: CivicModule) =>
            m.author &&
            m.author.name.toLowerCase() === mod.author!.name.toLowerCase()
        );
        return { author: mod.author, modules: authorModules };
      }
    }
  }
  return null;
}
