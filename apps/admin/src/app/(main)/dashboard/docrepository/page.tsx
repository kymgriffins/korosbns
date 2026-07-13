"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  ExternalLink,
  File,
  Folder,
  FolderPlus,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormDialog } from "@/components/admin/form-dialog";
import {
  adminDocRepositoryApi,
  type AdminDocItem,
  type AdminDocLink,
} from "@/lib/admin-api";

function formatBytes(size: number | null | undefined) {
  if (size == null) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatModified(ts: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString();
}

async function openAuthenticatedUrl(url: string, filename?: string, download = false) {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  if (download) {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename || "download";
    a.click();
  } else {
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  }
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export default function DocRepositoryPage() {
  const [path, setPath] = useState("");
  const [items, setItems] = useState<AdminDocItem[]>([]);
  const [links, setLinks] = useState<AdminDocLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderSaving, setFolderSaving] = useState(false);

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: "", url: "", description: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminDocRepositoryApi.list(path);
      setItems(res.items ?? []);
      setLinks(res.links ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repository");
      setItems([]);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const crumbs = path ? path.split("/").filter(Boolean) : [];

  const goToCrumb = (index: number) => {
    if (index < 0) setPath("");
    else setPath(crumbs.slice(0, index + 1).join("/"));
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await adminDocRepositoryApi.upload(file, path);
      }
      toast.success(fileList.length === 1 ? "File uploaded" : `${fileList.length} files uploaded`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name is required");
      return;
    }
    setFolderSaving(true);
    try {
      await adminDocRepositoryApi.createFolder(folderName.trim(), path);
      toast.success("Folder created");
      setFolderOpen(false);
      setFolderName("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create folder");
    } finally {
      setFolderSaving(false);
    }
  };

  const handleCreateLink = async () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }
    setLinkSaving(true);
    try {
      await adminDocRepositoryApi.createLink({
        title: linkForm.title.trim(),
        url: linkForm.url.trim(),
        description: linkForm.description.trim(),
        folder: path,
      });
      toast.success("Link added");
      setLinkOpen(false);
      setLinkForm({ title: "", url: "", description: "" });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create link");
    } finally {
      setLinkSaving(false);
    }
  };

  const handleDeleteItem = async (item: AdminDocItem) => {
    const label = item.is_directory ? "folder" : "file";
    if (!confirm(`Delete this ${label}? "${item.name}"`)) return;
    try {
      if (item.is_directory) {
        await adminDocRepositoryApi.deleteFolder(item.path);
      } else {
        await adminDocRepositoryApi.deleteFile(item.path);
      }
      toast.success(`${label[0].toUpperCase()}${label.slice(1)} deleted`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleDeleteLink = async (link: AdminDocLink) => {
    if (!confirm(`Delete link "${link.title}"?`)) return;
    try {
      await adminDocRepositoryApi.deleteLink(link.id);
      toast.success("Link deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const folders = items.filter((i) => i.is_directory);
  const files = items.filter((i) => !i.is_directory);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Document repository</h1>
          <p className="text-sm text-muted-foreground">
            Browse folders, upload files, and manage pinned links via `/api/v1/docrepository/*`.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 size-4" />
            )}
            Upload
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFolderName("");
              setFolderOpen(true);
            }}
          >
            <FolderPlus className="mr-1.5 size-4" />
            New folder
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setLinkForm({ title: "", url: "", description: "" });
              setLinkOpen(true);
            }}
          >
            <Link2 className="mr-1.5 size-4" />
            Add link
          </Button>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <button type="button" className="hover:text-foreground hover:underline" onClick={() => goToCrumb(-1)}>
          Root
        </button>
        {crumbs.map((crumb, i) => (
          <span key={`${crumb}-${i}`} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            <button
              type="button"
              className="hover:text-foreground hover:underline"
              onClick={() => goToCrumb(i)}
            >
              {crumb}
            </button>
          </span>
        ))}
      </nav>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : folders.length === 0 && files.length === 0 ? (
            <p className="text-sm text-muted-foreground">This folder is empty.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {folders.map((item) => (
                <li key={item.path} className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left hover:underline"
                    onClick={() => setPath(item.path)}
                  >
                    <Folder className="size-4 shrink-0 text-amber-600" />
                    <span className="truncate font-medium">{item.name}</span>
                  </button>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatModified(item.modified)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
              {files.map((item) => (
                <li key={item.path} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <File className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(item.size)} · {formatModified(item.modified)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="View"
                    onClick={async () => {
                      try {
                        await openAuthenticatedUrl(adminDocRepositoryApi.fileUrl(item.path), item.name);
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "View failed");
                      }
                    }}
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Download"
                    onClick={async () => {
                      try {
                        await openAuthenticatedUrl(
                          adminDocRepositoryApi.fileUrl(item.path, true),
                          item.name,
                          true,
                        );
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Download failed");
                      }
                    }}
                  >
                    <Download className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(item)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pinned links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links pinned to this folder.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {links.map((link) => (
                <li key={link.id} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{link.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                    {link.description ? (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{link.description}</p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Proxy view"
                    onClick={async () => {
                      try {
                        await openAuthenticatedUrl(adminDocRepositoryApi.proxyLinkUrl(link.id, "view"));
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Proxy view failed");
                      }
                    }}
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Proxy download"
                    onClick={async () => {
                      try {
                        await openAuthenticatedUrl(
                          adminDocRepositoryApi.proxyLinkUrl(link.id, "download"),
                          `${link.title || "document"}.pdf`,
                          true,
                        );
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Proxy download failed");
                      }
                    }}
                  >
                    <Download className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteLink(link)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={folderOpen}
        onOpenChange={setFolderOpen}
        title="Create folder"
        onSubmit={handleCreateFolder}
        loading={folderSaving}
        submitLabel="Create"
      >
        <div className="space-y-2">
          <Label htmlFor="folder-name">Name</Label>
          <Input
            id="folder-name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. finance-bill-2025"
          />
        </div>
      </FormDialog>

      <FormDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        title="Add pinned link"
        onSubmit={handleCreateLink}
        loading={linkSaving}
        submitLabel="Add link"
      >
        <div className="space-y-2">
          <Label htmlFor="link-title">Title</Label>
          <Input
            id="link-title"
            value={linkForm.title}
            onChange={(e) => setLinkForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-url">URL</Label>
          <Input
            id="link-url"
            value={linkForm.url}
            onChange={(e) => setLinkForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-desc">Description</Label>
          <Textarea
            id="link-desc"
            rows={3}
            value={linkForm.description}
            onChange={(e) => setLinkForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
      </FormDialog>
    </div>
  );
}
