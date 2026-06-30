import type { UserProfileApi } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
import { adminUsersApi, adminAuthorsApi, adminRolesApi } from "@/lib/admin-api";
import type { AdminUser, AdminAuthor, AdminRole } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { UserProfileApi, AdminUser, AdminAuthor, AdminRole };

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  description?: string;
  bio?: string;
  socials?: { linkedin?: string; x?: string; website?: string };
};

export interface UserDataStore {
  team: { get: () => TeamMember[]; set: (members: TeamMember[]) => void; fetch: () => Promise<TeamMember[]> };
  profile: { fetch: () => Promise<UserProfileApi | null>; fetchPublic: (id: string) => Promise<Record<string, unknown> | null> };
  admin: {
    users: { fetch: (params?: { page?: number; search?: string }) => Promise<{ count: number; results: AdminUser[] }> };
    authors: {
      fetch: (params?: { page?: number; search?: string }) => Promise<{ count: number; results: AdminAuthor[] }>;
      fetchBySlug: (slug: string) => Promise<AdminAuthor | null>;
      create: (data: Partial<AdminAuthor>) => Promise<AdminAuthor | null>;
      update: (slug: string, data: Partial<AdminAuthor>) => Promise<AdminAuthor | null>;
      delete: (slug: string) => Promise<boolean>;
    };
    roles: { fetch: () => Promise<{ count: number; results: AdminRole[] }> };
  };
}

const _team: TeamMember[] = [];

export const userData: UserDataStore = {
  team: {
    get: () => _team,
    set: (members: TeamMember[]) => { _team.length = 0; _team.push(...members); },
    fetch: () => withFallback("users", () => citizenApi.getTeamMembers(), () => _team),
  },
  profile: {
    fetch: () => withFallback("users", () => citizenApi.getMe(), () => null as unknown as UserProfileApi),
    fetchPublic: (id: string) => withFallback("users", () => citizenApi.getPublicUser(id), () => null),
  },
  admin: {
    users: { fetch: (params) => withFallback("users", () => adminUsersApi.list(params), () => ({ count: 0, results: [] as AdminUser[] })) },
    authors: {
      fetch: (params) => withFallback("users", () => adminAuthorsApi.list(params), () => ({ count: 0, results: [] as AdminAuthor[] })),
      fetchBySlug: (slug) => withFallback("users", () => adminAuthorsApi.get(slug), () => null),
      create: (data) => withFallback("users", () => adminAuthorsApi.create(data), () => null),
      update: (slug, data) => withFallback("users", () => adminAuthorsApi.update(slug, data), () => null),
      delete: (slug) => withFallback("users", () => adminAuthorsApi.delete(slug).then(() => true), () => false),
    },
    roles: { fetch: () => withFallback("users", () => adminRolesApi.list(), () => ({ count: 0, results: [] as AdminRole[] })) },
  },
};

export const users = [
  { id: "1", name: "Arham Khan", username: "Aarhamkhnz", email: "hello@arhamkhnz.com", avatar: "https://avatars.githubusercontent.com/u/43849669", role: "administrator" },
  { id: "2", name: "Ammar Khan", username: "ammarkhnz", email: "hello@ammarkhnz.com", avatar: "", role: "admin" },
];
export const rootUser = users[0];
