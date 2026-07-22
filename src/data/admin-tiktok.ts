import { adminTikTokApi } from "@/lib/admin-api";
import type { AdminTikTokVideo } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminTikTokVideo };

let _videos: AdminTikTokVideo[] = [];

export const adminTikTokData = {
  get: () => _videos,
  set: (items: AdminTikTokVideo[]) => { _videos = items; },
  fetch: (params?: { is_featured?: boolean; is_active?: boolean }) =>
    withFallback(
      "admin-tiktok",
      () => adminTikTokApi.list(params).then((r) => {
        const results = r.results ?? [];
        _videos = results;
        return results;
      }),
      () => _videos,
    ),
  fetchById: (id: string) =>
    withFallback(
      "admin-tiktok",
      () => adminTikTokApi.get(id),
      () => _videos.find((v) => v.id === id) ?? null,
    ),
  create: (data: { tiktok_url?: string; caption?: string; is_featured?: boolean; display_order?: number }) =>
    withFallback(
      "admin-tiktok",
      () => adminTikTokApi.create(data).then((r) => {
        _videos.unshift(r);
        return r;
      }),
      () => {
        const v: AdminTikTokVideo = {
          id: `new-${Date.now()}`,
          tiktok_url: data.tiktok_url ?? "",
          video_url: "",
          cover_image_url: "",
          embed_html: "",
          caption: data.caption ?? "",
          is_active: true,
          is_featured: data.is_featured ?? false,
          display_order: data.display_order ?? 0,
          like_count: 0,
        };
        _videos.unshift(v);
        return v;
      },
    ),
  update: (id: string, data: { caption?: string; is_active?: boolean; is_featured?: boolean; display_order?: number }) =>
    withFallback(
      "admin-tiktok",
      () => adminTikTokApi.update(id, data),
      () => {
        const idx = _videos.findIndex((v) => v.id === id);
        if (idx !== -1) _videos[idx] = { ..._videos[idx], ...data };
        return _videos[idx] ?? null;
      },
    ),
  delete: (id: string) =>
    withFallback(
      "admin-tiktok",
      () => adminTikTokApi.delete(id).then(() => {
        _videos = _videos.filter((v) => v.id !== id);
      }),
      () => { _videos = _videos.filter((v) => v.id !== id); },
    ),
};
