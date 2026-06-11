import type { CivicModule, CivicModuleAuthor } from "@/types/learn";
import { learnHubApi } from "./learn-hub";
import { citizenApi } from "./api-client";

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
  try {
    const members = await citizenApi.getTeamMembers();
    return members.filter((m) => m.name && m.name.trim()).map(toAuthor);
  } catch {
    return [];
  }
}

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

export async function fetchAllAuthors(): Promise<CivicModuleAuthor[]> {
  try {
    const res = await learnHubApi.authors();
    return (res.results || []).map((a) => ({
      ...a,
      slug: a.slug || slugify(a.name),
    }));
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

export function enrichAuthorFromTeam(
  author: Partial<CivicModuleAuthor>,
): CivicModuleAuthor | null {
  if (!author?.name) return null;
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
