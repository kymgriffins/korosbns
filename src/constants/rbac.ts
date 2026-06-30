export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EDITOR: "editor",
  CITIZEN: "citizen",
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROLES: ReadonlySet<string> = new Set([
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.EDITOR,
]);

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MANAGER]: "Manager",
  [ROLES.EDITOR]: "Editor",
  [ROLES.CITIZEN]: "Citizen",
};
