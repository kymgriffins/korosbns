import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { team } from "@/constants/team";
import { learnHubApi } from "./learn-hub";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function enrichAuthorWithTeamData(author: CivicModuleAuthor): CivicModuleAuthor {
  const teamMember = team.find(
    (t) => t.name.toLowerCase() === author.name.toLowerCase()
  );
  if (!teamMember) return author;
  return {
    ...author,
    image: author.image || teamMember.image,
    bio: author.bio || teamMember.bio,
    role: author.role || teamMember.role,
    socials: {
      linkedin: teamMember.socials?.linkedin,
      x: teamMember.socials?.x,
    },
  };
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
      const enriched = enrichAuthorWithTeamData(mod.author);
      const key = enriched.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        enriched.slug = getAuthorSlug(enriched);
        authors.push(enriched);
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
      const enriched = enrichAuthorWithTeamData(mod.author);
      const authorSlug = getAuthorSlug(enriched);
      if (authorSlug === slug) {
        const authorModules = modules.filter(
          (m: CivicModule) =>
            m.author &&
            m.author.name.toLowerCase() === enriched.name.toLowerCase()
        );
        return { author: enriched, modules: authorModules };
      }
    }
  }
  return null;
}
