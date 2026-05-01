import { socialLinks as defaultSocialLinks } from "@/constants/links";

/** Mirrors Django OrganizationSiteContent + organization snapshot. */
export type OrgSiteSocialLink = {
  platform: string;
  href: string;
  label?: string;
  icon?: string;
};

export type OrgSiteManifest = {
  schema_version?: number;
  organization_id?: string;
  organization_name?: string;
  organization_slug?: string;
  organization?: { slug?: string; name?: string; description?: string };
  tagline?: string;
  about_short?: string;
  about_markdown?: string;
  mission?: string;
  vision?: string;
  social_links?: OrgSiteSocialLink[];
  contact?: Record<string, string | undefined>;
  logo_url?: string;
  wordmark_url?: string;
  og_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  legal_footer_note?: string;
  content_blocks?: Array<Record<string, unknown>>;
};

const PLATFORM_ICON: Record<string, string> = {
  x: "x",
  twitter: "x",
  linkedin: "linkedin",
  whatsapp: "whatsapp",
  youtube: "youtube",
  tiktok: "tiktok",
  instagram: "instagram",
  facebook: "facebook",
  github: "github",
};

export function normalizeSocialLinksForFooter(manifest?: OrgSiteManifest | null) {
  const api = manifest?.social_links?.filter((l) => l?.href && l?.platform);
  if (api?.length) {
    return api.map((l) => ({
      label: l.label?.trim() || capitalize(l.platform.replace(/-/g, " ")),
      href: l.href,
      icon: l.icon?.trim() || PLATFORM_ICON[l.platform.toLowerCase()] || "link",
      platform: l.platform,
    }));
  }
  return defaultSocialLinks.map((s) => ({ ...s, platform: s.icon }));
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function footerBlurbFromManifest(manifest?: OrgSiteManifest | null): string {
  const fromApi = manifest?.about_short?.trim();
  if (fromApi) return fromApi;
  return "Youth-led budget clarity for Kenya. We turn complex budget data into simple stories everyone can understand.";
}

export function orgDisplayNameFromManifest(manifest?: OrgSiteManifest | null): string {
  return (
    manifest?.organization?.name?.trim() ||
    manifest?.organization_name?.trim() ||
    "Budget Ndio Story"
  );
}
