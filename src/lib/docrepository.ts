import { apiFetch } from "@/lib/api-client";

export type DocRepositoryItem = {
  name: string;
  path: string;
  is_directory: boolean;
  size: number | null;
  modified: number;
  mime_type?: string;
};

export type DocRepositoryListResponse = {
  path: string;
  items: DocRepositoryItem[];
  count: number;
};

async function repoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(`/docrepository${path}`, { auth: true, ...init });
}

export const docrepository = {
  /** List files and folders at the given path (empty string = root). */
  async list(path = ""): Promise<DocRepositoryListResponse> {
    const qs = path ? `?path=${encodeURIComponent(path)}` : "";
    return repoFetch<DocRepositoryListResponse>(`/files/${qs}`);
  },

  /** Upload a file. Returns the created item metadata. */
  async upload(file: File, path = ""): Promise<DocRepositoryItem> {
    const form = new FormData();
    form.append("file", file);
    if (path) form.append("path", path);
    const qs = path ? `?path=${encodeURIComponent(path)}` : "";
    return repoFetch<DocRepositoryItem>(`/files/upload/${qs}`, {
      method: "POST",
      body: form,
    });
  },

  /** Get the download URL for a file (for use in <a> href or fetch). */
  downloadUrl(filePath: string): string {
    return `/api/docrepository?path=${encodeURIComponent(filePath)}`;
  },

  /** Fetch file content as a Blob (for client-side download). */
  async download(filePath: string): Promise<Blob> {
    const res = await repoFetch<Response>(`/files/${encodeURIComponent(filePath)}`, {});
    return res.blob ? res.blob() : new Response(res).blob();
  },

  /** Create a new folder. */
  async createFolder(name: string, path = ""): Promise<DocRepositoryItem> {
    return repoFetch<DocRepositoryItem>("/folders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, path }),
    });
  },

  /** Delete a file or folder. */
  async delete(filePath: string): Promise<void> {
    await repoFetch(`/files/${encodeURIComponent(filePath)}`, { method: "DELETE" });
  },

  /** Delete a folder by path (body param). */
  async deleteFolder(folderPath: string): Promise<void> {
    await repoFetch("/folders/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: folderPath }),
    });
  },
};
