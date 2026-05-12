/**
 * Primary organization slug served by the public marketing site.
 * Matches Django `Organization.slug` (multi-tenant: set per deployment).
 */
export const PRIMARY_ORG_SLUG =
  process.env.NEXT_PUBLIC_PRIMARY_ORG_SLUG ?? "budgetndiostory";

/** Canonical public inbox for mailto + footer consistency */
export const ORG_CONTACT_EMAIL = "info@budgetndiostory.org";

export const mailtoOrg = `mailto:${ORG_CONTACT_EMAIL}` as const;
