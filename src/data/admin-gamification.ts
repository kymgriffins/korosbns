import { adminGamificationApi } from "@/lib/admin-api";
import type { AdminGamificationRule, AdminBadge } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminGamificationRule, AdminBadge };

let _rules: AdminGamificationRule[] = [];
let _badges: AdminBadge[] = [];

export const adminGamificationData = {
  rules: {
    get: () => _rules,
    set: (items: AdminGamificationRule[]) => { _rules = items; },
    fetch: () =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.listRules().then((r) => {
          const results = r.results ?? [];
          _rules = results;
          return results;
        }),
        () => _rules,
      ),
    save: (rules: Array<{ event_type: string; points: number; is_active?: boolean; description?: string }>) =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.saveRules(rules).then((r) => {
          _rules = r.results ?? [];
          return r.results;
        }),
        () => _rules,
      ),
    seed: () =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.seedRules(),
        () => ({ detail: "", created: 0 }),
      ),
  },
  badges: {
    get: () => _badges,
    set: (items: AdminBadge[]) => { _badges = items; },
    fetch: () =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.listBadges().then((r) => {
          const results = r.results ?? [];
          _badges = results;
          return results;
        }),
        () => _badges,
      ),
    create: (data: { slug: string; name: string; description?: string; icon?: string; points_required?: number; tier?: string }) =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.createBadge(data).then((r) => {
          _badges.unshift(r);
          return r;
        }),
        () => {
          const b: AdminBadge = {
            id: `new-${Date.now()}`,
            slug: data.slug,
            name: data.name,
            description: data.description ?? "",
            icon: data.icon ?? "award",
            points_required: data.points_required ?? 0,
            condition_type: "points",
            condition_value: data.points_required ?? 0,
            tier: data.tier ?? "bronze",
            family: "general",
            is_active: true,
          };
          _badges.unshift(b);
          return b;
        },
      ),
    update: (id: string, data: { name?: string; description?: string; icon?: string; points_required?: number; is_active?: boolean }) =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.updateBadge(id, data),
        () => {
          const idx = _badges.findIndex((b) => b.id === id);
          if (idx !== -1) _badges[idx] = { ..._badges[idx], ...data };
          return _badges[idx] ?? null;
        },
      ),
    deactivate: (id: string) =>
      withFallback(
        "admin-gamification",
        () => adminGamificationApi.deactivateBadge(id).then(() => {
          _badges = _badges.filter((b) => b.id !== id);
        }),
        () => { _badges = _badges.filter((b) => b.id !== id); },
      ),
  },
};
