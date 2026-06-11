import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { learnHubApi } from "./learn-hub";
import { citizenApi } from "./api-client";

let mergedAuthors: CivicModuleAuthor[] | null = null;

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

type TeamMemberApi = {
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

function dedupeByName(list: CivicModuleAuthor[]): CivicModuleAuthor[] {
  const seen = new Set<string>();
  return list.filter((a) => {
    const key = a.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadMergedAuthors(): Promise<CivicModuleAuthor[]> {
  if (mergedAuthors) return mergedAuthors;
  const [authorRes, teamMembers] = await Promise.allSettled([
    learnHubApi.authors(),
    citizenApi.getTeamMembers(),
  ]);
  const fromContent: CivicModuleAuthor[] =
    authorRes.status === "fulfilled"
      ? (authorRes.value.results || []).map((a) => ({
          ...a,
          slug: a.slug || slugify(a.name),
        }))
      : [];
  const fromTeam: CivicModuleAuthor[] =
    teamMembers.status === "fulfilled"
      ? teamMembers.value.filter((m) => m.name && m.name.trim()).map(toAuthor)
      : [];
  mergedAuthors = dedupeByName([...fromContent, ...fromTeam]);
  return mergedAuthors;
}

export function findAuthorByName(name: string): CivicModuleAuthor | undefined {
  if (!mergedAuthors) return undefined;
  const lower = name.toLowerCase();
  return mergedAuthors.find((a) => a.name.toLowerCase() === lower);
}

export function enrichAuthor(author: Partial<CivicModuleAuthor>): CivicModuleAuthor | null {
  if (!author?.name) return null;
  const existing = findAuthorByName(author.name);
  if (existing) {
    return {
      ...existing,
      image: author.image || existing.image,
      role: author.role || existing.role,
      bio: author.bio || existing.bio,
      slug: author.slug || existing.slug,
    };
  }
  return {
    name: author.name,
    image: author.image || "",
    role: author.role || "",
    bio: author.bio || "",
    slug: author.slug || slugify(author.name),
    socials: author.socials,
    intro_video_url: author.intro_video_url,
  } as CivicModuleAuthor;
}

export async function fetchAllAuthors(): Promise<CivicModuleAuthor[]> {
  const authors = await loadMergedAuthors();
  return authors;
}

export async function fetchAuthorBySlug(slug: string): Promise<{
  author: CivicModuleAuthor;
  modules: CivicModule[];
} | null> {
  try {
    return await learnHubApi.author(slug);
  } catch {
    // Fallback: search merged authors + modules
    const all = await loadMergedAuthors();
    const match = all.find(
      (a) => getAuthorSlug(a).toLowerCase() === slug.toLowerCase(),
    );
    if (!match) return null;
    const res = await learnHubApi.stages();
    const modules = (res.results || []).filter(
      (m: CivicModule) =>
        m.author?.name?.toLowerCase() === match.name.toLowerCase(),
    );
    return { author: match, modules };
  }
}

export async function fetchTeamMembers(): Promise<CivicModuleAuthor[]> {
  return loadMergedAuthors();
}
