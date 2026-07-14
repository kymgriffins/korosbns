/**
 * Org marketing data.
 *
 * Live roster for About / landing /team pages: `GET /api/v1/org/team/public/`
 * via `fetchPublicTeam()` in `@/lib/org-team` (falls back to this JSON if API is down).
 *
 * Keep `org.json` seed for offline deploys and fallback; edit live profiles in Django
 * (OrganizationMember + Profile) so public bios stay in the DB.
 */
import orgData from "@/data/org/org.json";

export type OrgTeamSocials = {
  linkedin?: string;
  x?: string;
  instagram?: string;
  email?: string;
};

export type OrgTeamMember = {
  name: string;
  role: string;
  image: string;
  description: string;
  bio: string;
  socials?: OrgTeamSocials;
};

export type OrgMeta = {
  name: string;
  short_name: string;
  tagline: string;
  site_url: string;
  contact_email: string;
};

export const orgMeta: OrgMeta = orgData.org;

/** Static fallback roster — prefer `fetchPublicTeam()` for UI. */
export const team: OrgTeamMember[] = orgData.team;

/** @deprecated Prefer `fetchPublicTeam()` from `@/lib/org-team` */
export default team;
