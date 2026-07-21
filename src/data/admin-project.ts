import { adminProjectApi } from "@/lib/admin-api";
import type { AdminProjectMilestone, AdminProjectConfig } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminProjectMilestone, AdminProjectConfig };

let _milestones: AdminProjectMilestone[] = [];

export const adminProjectData = {
  milestones: {
    get: () => _milestones,
    set: (items: AdminProjectMilestone[]) => { _milestones = items; },
    fetch: () =>
      withFallback(
        "admin-project",
        () => adminProjectApi.listMilestones().then((r) => {
          const results = r.results ?? [];
          _milestones = results;
          return results;
        }),
        () => _milestones,
      ),
    create: (data: { title: string; description?: string; date?: string; milestone_type?: string; is_published?: boolean }) =>
      withFallback(
        "admin-project",
        () => adminProjectApi.createMilestone(data),
        () => {
          const m: AdminProjectMilestone = {
            id: `new-${Date.now()}`,
            title: data.title,
            description: data.description ?? "",
            date: data.date ?? null,
            image_url: "",
            milestone_type: data.milestone_type ?? "general",
            order: _milestones.length,
            is_published: data.is_published ?? false,
          };
          _milestones.unshift(m);
          return m;
        },
      ),
    update: (id: string, data: { title?: string; description?: string; date?: string; milestone_type?: string; is_published?: boolean; order?: number }) =>
      withFallback(
        "admin-project",
        () => adminProjectApi.updateMilestone(id, data),
        () => {
          const idx = _milestones.findIndex((m) => m.id === id);
          if (idx !== -1) _milestones[idx] = { ..._milestones[idx], ...data };
          return _milestones[idx] ?? null;
        },
      ),
    delete: (id: string) =>
      withFallback(
        "admin-project",
        () => adminProjectApi.deleteMilestone(id).then(() => {
          _milestones = _milestones.filter((m) => m.id !== id);
        }),
        () => { _milestones = _milestones.filter((m) => m.id !== id); },
      ),
  },
  config: {
    fetch: () =>
      withFallback(
        "admin-project",
        () => adminProjectApi.getConfig(),
        () => ({ mission: "", vision: "", about_text: "" }),
      ),
    update: (data: { mission?: string; vision?: string; about_text?: string }) =>
      withFallback(
        "admin-project",
        () => adminProjectApi.updateConfig(data),
        () => null,
      ),
  },
};
