"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Folder,
  Download,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Search,
  File,
  Image,
  FileCode,
} from "lucide-react";
import { cn } from "@/utils";

type RepoItem = {
  name: string;
  path: string;
  is_directory: boolean;
  size: number | null;
  modified: number;
  mime_type?: string;
};

type RepoListResponse = {
  path: string;
  items: RepoItem[];
  count: number;
};

function formatSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFileIcon(item: RepoItem) {
  if (item.is_directory) return <Folder className="size-5 text-amber-500" />;
  const mime = item.mime_type || "";
  if (mime.startsWith("image/")) return <Image className="size-5 text-emerald-500" />;
  if (mime === "application/pdf") return <FileText className="size-5 text-red-500" />;
  if (mime.includes("html") || mime.includes("xml")) return <FileCode className="size-5 text-blue-500" />;
  if (mime.includes("word") || mime.includes("document")) return <FileText className="size-5 text-blue-600" />;
  if (mime.includes("sheet") || mime.includes("excel")) return <FileText className="size-5 text-green-600" />;
  return <File className="size-5 text-muted-foreground" />;
}

function Breadcrumbs({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: (path: string) => void;
}) {
  if (!path || path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
      <button
        onClick={() => onNavigate("")}
        className="hover:text-foreground transition-colors"
      >
        Documents
      </button>
      {parts.map((part, i) => {
        const subPath = parts.slice(0, i + 1).join("/");
        return (
          <span key={subPath} className="flex items-center gap-1">
            <ChevronRight className="size-3" />
            <button
              onClick={() => onNavigate(subPath)}
              className={cn(
                "hover:text-foreground transition-colors",
                i === parts.length - 1 && "text-foreground font-medium"
              )}
            >
              {part}
            </button>
          </span>
        );
      })}
    </nav>
  );
}

function FolderCard({
  item,
  onNavigate,
}: {
  item: RepoItem;
  onNavigate: (path: string) => void;
}) {
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm w-full text-left"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
        <Folder className="size-5 text-amber-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(item.modified)}
        </p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function FileCard({ item }: { item: RepoItem }) {
  const download = () => {
    const a = document.createElement("a");
    a.href = `/api/docrepository?path=${encodeURIComponent(item.path)}`;
    a.download = item.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {getFileIcon(item)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          <span>{formatSize(item.size)}</span>
          <span>·</span>
          <span>{formatDate(item.modified)}</span>
          {item.mime_type && (
            <>
              <span>·</span>
              <span className="truncate max-w-[120px]">
                {item.mime_type.split("/").pop()?.toUpperCase()}
              </span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={download}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
        title="Download"
      >
        <Download className="size-3.5" />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  );
}

function DocumentsPageContent() {
  const searchParams = useSearchParams();
  const initialPath = searchParams.get("path") || "";

  const [currentPath, setCurrentPath] = useState(initialPath);
  const [items, setItems] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async (path: string) => {
    setLoading(true);
    setError("");
    try {
      const qs = path ? `?path=${encodeURIComponent(path)}` : "";
      const res = await fetch(`/api/docrepository${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RepoListResponse = await res.json();
      setItems(data.items || []);
      setCurrentPath(data.path || "");
    } catch {
      setError("Could not load documents. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(currentPath);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    void load(path);
    const url = path ? `?path=${encodeURIComponent(path)}` : "/documents";
    window.history.pushState({}, "", url);
  };

  const folders = items.filter((i) => i.is_directory);
  const files = items.filter((i) => !i.is_directory);
  const filtered = searchQuery
    ? items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Repository</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and download official documents, reports, and resources.
          </p>
        </div>
        {currentPath && (
          <button
            onClick={() => {
              const parts = currentPath.split("/").filter(Boolean);
              parts.pop();
              navigate(parts.join("/"));
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        )}
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs path={currentPath} onNavigate={navigate} />

      {/* Search */}
      {items.length > 5 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        </div>
      ) : filtered !== null ? (
        /* Search results */
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState message="No files match your search." />
          ) : (
            filtered.map((item) =>
              item.is_directory ? (
                <FolderCard
                  key={item.path}
                  item={item}
                  onNavigate={navigate}
                />
              ) : (
                <FileCard key={item.path} item={item} />
              )
            )
          )}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          message={
            currentPath
              ? "This folder is empty."
              : "No documents available yet."
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Folders */}
          {folders.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Folders ({folders.length})
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {folders.map((item) => (
                  <FolderCard
                    key={item.path}
                    item={item}
                    onNavigate={navigate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Files */}
          {files.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Files ({files.length})
              </h2>
              <div className="space-y-2">
                {files.map((item) => (
                  <FileCard key={item.path} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
        <FileText className="size-8 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <DocumentsPageContent />
    </Suspense>
  );
}
