import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { learnHubApi } from "./learn-hub";
import { citizenApi } from "./api-client";

let cachedTeam: CivicModuleAuthor[] | null = null;

export type TeamMemberApi = {
  name: string;
  role: string;
  image: string;
  description?: string;
  bio?: string;
  socials?: { linkedin?: string; x?: string; website?: string };
};

function toAuthor(member: TeamMemberApi): CivicModuleAuthor {
  return {
    name: member.name,
    image: member.image || "",
    role: member.role || "",
    bio: member.bio || member.description || "",
    slug: slugify(member.name),
    socials: member.socials,
  };
}

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

export async function fetchTeamMembers(): Promise<CivicModuleAuthor[]> {
  if (cachedTeam) return cachedTeam;
  try {
    const members = await citizenApi.getTeamMembers();
    cachedTeam = members.filter((m) => m.name && m.name.trim()).map(toAuthor);
    return cachedTeam;
  } catch {
    cachedTeam = [];
    return cachedTeam;
  }
}

export function lookupAuthorByName(name: string): CivicModuleAuthor | undefined {
  if (!cachedTeam) return undefined;
  const lower = name.toLowerCase();
  return cachedTeam.find((a) => a.name.toLowerCase() === lower);
}

export function enrichAuthorFromTeam(author: Partial<CivicModuleAuthor>): CivicModuleAuthor | null {
  if (!author?.name) return null;
  const team = lookupAuthorByName(author.name);
  if (team) {
    return {
      name: team.name,
      image: author.image || team.image,
      role: author.role || team.role,
      bio: author.bio || team.bio,
      slug: author.slug || team.slug,
    };
  }
  return author as CivicModuleAuthor;
}

export async function fetchAllAuthors(): Promise<CivicModuleAuthor[]> {
  await fetchTeamMembers();
  const res = await learnHubApi.stages();
  const modules = res.results || res as unknown as CivicModule[];
  const seen = new Set<string>();
  const authors: CivicModuleAuthor[] = [];
  for (const mod of modules) {
    if (mod.author) {
      const key = mod.author.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        const enriched = enrichAuthorFromTeam(mod.author) || mod.author;
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
  await fetchTeamMembers();
  const res = await learnHubApi.stages();
  const modules = (res.results || res as unknown as CivicModule[]).filter(
    (m: CivicModule) => m.author
  );
  for (const mod of modules) {
    if (mod.author) {
      const enriched = enrichAuthorFromTeam(mod.author) || mod.author;
      const authorSlug = getAuthorSlug(enriched);
      if (authorSlug === slug) {
        const authorModules = modules.filter(
          (m: CivicModule) =>
            m.author &&
            m.author.name.toLowerCase() === mod.author!.name.toLowerCase()
        );
        return { author: enriched, modules: authorModules };
      }
    }
  }
  return null;
}
