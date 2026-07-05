/**
 * Admin routes hidden from primary nav until PRD + page spec exist (Phase 6).
 * Template/demo dashboards from shadcn admin kit — not product surfaces.
 */
export const ADMIN_NAV_HIDDEN_PREFIXES = [
  "/admin/dashboard/(legacy)",
  "/admin/dashboard/ecommerce",
  "/admin/dashboard/logistics",
  "/admin/dashboard/infrastructure",
  "/admin/dashboard/invoice",
  "/admin/dashboard/academy",
  "/admin/dashboard/crm",
  "/admin/dashboard/default",
  "/admin/dashboard/kanban",
] as const;

export function isAdminRouteHidden(href: string): boolean {
  return ADMIN_NAV_HIDDEN_PREFIXES.some((prefix) => href.startsWith(prefix.replace("(legacy)", "")) || href.includes("(legacy)"));
}
