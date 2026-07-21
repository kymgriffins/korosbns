import { adminDocRepositoryApi } from "@/lib/admin-api";
import type { AdminDocItem, AdminDocLink, AdminDocListResponse } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminDocItem, AdminDocLink, AdminDocListResponse };

const DEFAULT_LIST: AdminDocListResponse = { path: "", items: [], count: 0, links: [], link_count: 0 };
let _cached: AdminDocListResponse = { ...DEFAULT_LIST };

export const adminDocRepositoryData = {
  get: () => _cached,
  set: (data: AdminDocListResponse) => { _cached = data; },
  fetch: (path = "") =>
    withFallback(
      "admin-docrepository",
      () => adminDocRepositoryApi.list(path).then((r) => {
        _cached = r;
        return r;
      }),
      () => _cached,
    ),
  upload: (file: File, path = "") =>
    withFallback(
      "admin-docrepository",
      () => adminDocRepositoryApi.upload(file, path),
      () => null,
    ),
  deleteFile: (filePath: string) =>
    withFallback(
      "admin-docrepository",
      () => adminDocRepositoryApi.deleteFile(filePath).then(() => {
        _cached = { ..._cached, items: _cached.items.filter((i) => i.path !== filePath), count: _cached.count - 1 };
      }),
      () => {},
    ),
  folders: {
    create: (name: string, path = "") =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.createFolder(name, path),
        () => null,
      ),
    delete: (folderPath: string) =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.deleteFolder(folderPath),
        () => {},
      ),
    rename: (path: string, name: string) =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.renameFolder(path, name),
        () => null,
      ),
  },
  links: {
    list: (folder = "") =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.listLinks(folder),
        () => ({ links: [] as AdminDocLink[], count: 0 }),
      ),
    create: (data: { title: string; url: string; folder?: string; description?: string; mime_type?: string }) =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.createLink(data),
        () => null,
      ),
    update: (linkId: string, data: { title?: string; url?: string; description?: string; mime_type?: string; is_active?: boolean }) =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.updateLink(linkId, data),
        () => null,
      ),
    delete: (linkId: string) =>
      withFallback(
        "admin-docrepository",
        () => adminDocRepositoryApi.deleteLink(linkId),
        () => {},
      ),
  },
  fileUrl: (filePath: string, download = false) => adminDocRepositoryApi.fileUrl(filePath, download),
  proxyLinkUrl: (linkId: string, mode: "view" | "download" = "view") => adminDocRepositoryApi.proxyLinkUrl(linkId, mode),
};
