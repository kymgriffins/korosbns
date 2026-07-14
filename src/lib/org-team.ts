/**
 * Org roster helpers.
 *
 * - Landing homepage: read `@/data/org` JSON only (brochure, zero API).
 * - `/about` + `/team/[username]`: `fetchPublicTeam()` → live Django DB
 *   (`GET /org/team/public/`), with org.json only as offline fallback.
 */
import { citizenApi } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";
import { team as staticTeam, type OrgTeamMember } from "@/data/org";

export type PublicTeamSocials = {
  linkedin?: string;
  x?: string;
  instagram?: string;
  email?: string;
  website?: string;
  [key: string]: string | undefined;
};

export type PublicTeamMember = {
  id?: string;
  profile_id?: string;
  /** Preferred URL slug when set by org admin metadata */
  username?: string | null;
  name: string;
  role: string;
  image: string;
  description: string;
  bio: string;
  socials?: PublicTeamSocials;
};

function normalizeMember(raw: Partial<PublicTeamMember> & OrgTeamMember): PublicTeamMember {
  const socials = { ...(raw.socials || {}) } as PublicTeamSocials;
  if (socials.twitter && !socials.x) {
    socials.x = socials.twitter;
    delete socials.twitter;
  }
  return {
    id: raw.id,
    profile_id: raw.profile_id,
    username: raw.username ?? null,
    name: raw.name?.trim() || "Team member",
    role: raw.role?.trim() || "",
    image: raw.image?.trim() || "/logo.svg",
    description: (raw.description || raw.bio || "").trim(),
    bio: (raw.bio || raw.description || "").trim(),
    socials: Object.keys(socials).length ? socials : undefined,
  };
}

/** Client or server: fetch roster from Django, fallback to static org.json. */
export async function fetchPublicTeam(): Promise<PublicTeamMember[]> {
  const members = await withFallback(
    "org-team",
    async () => {
      const rows = await citizenApi.getTeamMembers();
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("Empty team list from API");
      }
      return rows.map((row) => normalizeMember(row as PublicTeamMember & OrgTeamMember));
    },
    () => staticTeam.map((m) => normalizeMember(m)),
  );
  return members.filter((m) => Boolean(m.name));
}
