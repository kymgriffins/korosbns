import type { UserProfileApi, SocialLinkApi, ApiListResponse } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
import { adminUsersApi, adminAuthorsApi, adminRolesApi } from "@/lib/admin-api";
import type { AdminUser, AdminAuthor, AdminRole } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";
import bnsConfig from "@/constants/bnsConfig.json";

export type { UserProfileApi, AdminUser, AdminAuthor, AdminRole };

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  description?: string;
  bio?: string;
  socials?: { linkedin?: string; x?: string; website?: string };
};

const config = bnsConfig as {
  leadership?: {
    advisor?: TeamMember[];
    executive?: TeamMember[];
    directors?: TeamMember[];
    operations?: TeamMember[];
  };
};

const DEFAULT_TEAM: TeamMember[] = [];
const leaderData = config.leadership ?? {};
for (const group of Object.values(leaderData)) {
  if (Array.isArray(group)) DEFAULT_TEAM.push(...group);
}

let _team: TeamMember[] = [...DEFAULT_TEAM];
let _roles: AdminRole[] = [];

export interface UserDataStore {
  team: {
    get: () => TeamMember[];
    set: (members: TeamMember[]) => void;
    fetch: () => Promise<TeamMember[]>;
  };
  profile: {
    fetch: () => Promise<UserProfileApi | null>;
    fetchPublic: (id: string) => Promise<Record<string, unknown> | null>;
    fetchNotifications: () => Promise<ApiListResponse<Record<string, unknown>>>;
    fetchBookmarks: () => Promise<{ results: Record<string, unknown>[] }>;
    toggleBookmark: (contentType: string, objectId: string) => Promise<{ toggle: boolean; bookmarks: Record<string, unknown>[] } | null>;
    fetchSocialLinks: () => Promise<SocialLinkApi[]>;
  };
  admin: {
    users: {
      fetch: (params?: { page?: number; search?: string }) => Promise<{ count: number; results: AdminUser[] }>;
      create: (data: Partial<AdminUser>) => Promise<AdminUser | null>;
      update: (id: string, data: Partial<AdminUser>) => Promise<AdminUser | null>;
      delete: (id: string) => Promise<boolean>;
    };
    authors: {
      fetch: (params?: { page?: number; search?: string }) => Promise<{ count: number; results: AdminAuthor[] }>;
      fetchBySlug: (slug: string) => Promise<AdminAuthor | null>;
      create: (data: Partial<AdminAuthor>) => Promise<AdminAuthor | null>;
      update: (slug: string, data: Partial<AdminAuthor>) => Promise<AdminAuthor | null>;
      delete: (slug: string) => Promise<boolean>;
    };
    roles: {
      fetch: () => Promise<{ count: number; results: AdminRole[] }>;
      create: (data: Partial<AdminRole>) => Promise<AdminRole | null>;
      update: (id: string, data: Partial<AdminRole>) => Promise<AdminRole | null>;
      delete: (id: string) => Promise<boolean>;
    };
  };
}

export const userData: UserDataStore = {
  team: {
    get: () => _team,
    set: (members: TeamMember[]) => { _team = members; },
    fetch: () =>
      withFallback(
        "users",
        () => citizenApi.getTeamMembers(),
        () => _team,
      ),
  },
  profile: {
    fetch: () =>
      withFallback(
        "users",
        () => citizenApi.getMe(),
        () => null as unknown as UserProfileApi,
      ),
    fetchPublic: (id: string) =>
      withFallback(
        "users",
        () => citizenApi.getPublicUser(id),
        () => null,
      ),
    fetchNotifications: () =>
      withFallback(
        "users",
        () => citizenApi.getNotifications(),
        () => ({ results: [] }),
      ),
    fetchBookmarks: () =>
      withFallback(
        "users",
        () => citizenApi.getBookmarks(),
        () => ({ results: [] }),
      ),
    toggleBookmark: (contentType: string, objectId: string) =>
      withFallback(
        "users",
        () => citizenApi.toggleBookmark(contentType, objectId),
        () => null,
      ),
    fetchSocialLinks: () =>
      withFallback(
        "users",
        () => citizenApi.getSocialLinks(),
        () => [],
      ),
  },
  admin: {
    users: {
      fetch: (params?: { page?: number; search?: string }) =>
        withFallback(
          "users",
          () => adminUsersApi.list(params),
          () => ({ count: 0, results: [] as AdminUser[] }),
        ),
      create: (data: Partial<AdminUser>) =>
        withFallback(
          "users",
          () => adminUsersApi.create(data),
          () => {
            const u: AdminUser = {
              id: `new-${Date.now()}`,
              email: data.email ?? "",
              first_name: data.first_name ?? "",
              last_name: data.last_name ?? "",
              display_name: data.display_name,
              avatar: data.avatar ?? null,
              role: data.role ?? "viewer",
              is_active: data.is_active ?? true,
              date_joined: new Date().toISOString(),
              last_login: null,
            };
            return u;
          },
        ),
      update: (id: string, data: Partial<AdminUser>) =>
        withFallback(
          "users",
          () => adminUsersApi.update(id, data),
          () => null as unknown as AdminUser,
        ),
      delete: (id: string) =>
        withFallback(
          "users",
          () => adminUsersApi.delete(id).then(() => true),
          () => true,
        ),
    },
    authors: {
      fetch: (params?: { page?: number; search?: string }) =>
        withFallback(
          "users",
          () => adminAuthorsApi.list(params),
          () => ({ count: 0, results: [] as AdminAuthor[] }),
        ),
      fetchBySlug: (slug: string) =>
        withFallback(
          "users",
          () => adminAuthorsApi.get(slug),
          () => null as unknown as AdminAuthor,
        ),
      create: (data: Partial<AdminAuthor>) =>
        withFallback(
          "users",
          () => adminAuthorsApi.create(data),
          () => {
            const a: AdminAuthor = {
              id: `new-${Date.now()}`,
              name: data.name ?? "Untitled",
              slug: `untitled-${Date.now()}`,
              image: data.image ?? "",
              role: data.role ?? "",
              bio: data.bio ?? "",
              created_at: new Date().toISOString(),
            };
            return a;
          },
        ),
      update: (slug: string, data: Partial<AdminAuthor>) =>
        withFallback(
          "users",
          () => adminAuthorsApi.update(slug, data),
          () => null as unknown as AdminAuthor,
        ),
      delete: (slug: string) =>
        withFallback(
          "users",
          () => adminAuthorsApi.delete(slug).then(() => true),
          () => true,
        ),
    },
    roles: {
      fetch: () =>
        withFallback(
          "users",
          () => adminRolesApi.list().then((r) => {
            _roles = r.results ?? [];
            return r;
          }),
          () => ({ count: _roles.length, results: _roles }),
        ),
      create: (data: Partial<AdminRole>) =>
        withFallback(
          "users",
          () => adminRolesApi.create(data),
          () => {
            const r: AdminRole = {
              id: `new-${Date.now()}`,
              name: data.name ?? "Untitled",
              description: data.description ?? "",
              permissions: data.permissions ?? [],
              user_count: data.user_count ?? 0,
              created_at: new Date().toISOString(),
            };
            _roles.unshift(r);
            return r;
          },
        ),
      update: (id: string, data: Partial<AdminRole>) =>
        withFallback(
          "users",
          () => adminRolesApi.update(id, data),
          () => {
            const idx = _roles.findIndex((r) => r.id === id);
            if (idx !== -1) _roles[idx] = { ..._roles[idx], ...data };
            return _roles[idx] ?? null;
          },
        ),
      delete: (id: string) =>
        withFallback(
          "users",
          () => adminRolesApi.delete(id).then(() => {
            _roles = _roles.filter((r) => r.id !== id);
            return true;
          }),
          () => {
            _roles = _roles.filter((r) => r.id !== id);
            return true;
          },
        ),
    },
  },
};
