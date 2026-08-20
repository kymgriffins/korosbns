/**
 * Org marketing data — re-exports from the JSON “org database”.
 * Prefer `@/data/org` for new code. Landing / About / team pages read this,
 * not live DB, for mundane roster fields.
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
  tagline?: string;
  profileText?: string;
  missionImpact?: string;
  visionContribution?: string;
  focusAreas?: string[];
  achievements?: string[];
  quote?: string;
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

export const team: OrgTeamMember[] = orgData.team;

/** @deprecated Prefer importing `team` / `orgMeta` from `@/data/org` */
export default team;
