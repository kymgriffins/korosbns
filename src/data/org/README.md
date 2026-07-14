/**
 * Org JSON (landing brochure seed)
 *
 * Split model:
 * - Landing (`/`) → this file only — curated faces/roles, no API.
 * - About + `/team/[username]` → `fetchPublicTeam()` → Django DB;
 *   this JSON is fallback if the API is down.
 *
 * Keep landing names/slugs aligned with live profiles so `/team/...` links resolve.
 */
export {};
