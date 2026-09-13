"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Film,
  Image as ImageIcon,
  Video,
  Trash2,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  FileText,
} from "lucide-react";
import { MediaEmbed, parseYouTubeId } from "@/components/ui/media-embed";

export type MediaSelection = {
  url: string;
  type: "video" | "youtube" | "image";
  title?: string;
  alt?: string;
};

export type MediaAssetPickerProps = {
  currentUrl?: string;
  currentType?: "video" | "youtube" | "image" | "auto";
  currentTitle?: string;
  onSelect: (media: MediaSelection) => void;
  onClose?: () => void;
  title?: string;
};

type R2Item = {
  key: string;
  size: number;
  lastModified: string;
  url: string;
  mimeType: string;
  mediaType: "video" | "image" | "document" | "other";
};

function previewSrcForKey(key: string): string {
  return `/api/cms/media/preview?key=${encodeURIComponent(key)}`;
}

function basename(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function R2Thumb({
  item,
}: {
  item: R2Item;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.mediaType === "video";
  const isImage = item.mediaType === "image";
  const previewSrc = previewSrcForKey(item.key);

  if (failed || (!isVideo && !isImage)) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-muted/40 px-2 text-center">
        {isVideo ? (
          <Film className="size-8 text-muted-foreground" />
        ) : item.mediaType === "document" ? (
          <FileText className="size-8 text-muted-foreground" />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
        <span className="line-clamp-2 font-mono text-[10px] text-muted-foreground">
          {basename(item.key)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative size-full">
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-muted/50" aria-hidden />
      ) : null}
      {isVideo ? (
        <video
          src={`${previewSrc}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          className={`size-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt={basename(item.key)}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`size-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            // Fallback to public CDN URL if same-origin preview fails
            setFailed(true);
          }}
        />
      )}
    </div>
  );
}

/** Image thumb that retries public URL when preview proxy fails. */
function R2ImageThumb({ item }: { item: R2Item }) {
  const [src, setSrc] = useState(previewSrcForKey(item.key));
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-1.5 bg-muted/40 px-2 text-center">
        <ImageIcon className="size-8 text-muted-foreground" />
        <span className="line-clamp-2 font-mono text-[10px] text-muted-foreground">
          {basename(item.key)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative size-full">
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-muted/50" aria-hidden />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={basename(item.key)}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`size-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (attempt === 0) {
            setAttempt(1);
            setLoaded(false);
            setSrc(item.url);
            return;
          }
          setFailed(true);
        }}
      />
    </div>
  );
}

function MediaThumb({ item }: { item: R2Item }) {
  if (item.mediaType === "video") {
    return <R2Thumb item={item} />;
  }
  if (item.mediaType === "image") {
    return <R2ImageThumb item={item} />;
  }
  return <R2Thumb item={item} />;
}

export function MediaAssetPicker({
  currentUrl = "",
  currentType = "image",
  currentTitle = "",
  onSelect,
  onClose,
  title = "Select or Upload Media",
}: MediaAssetPickerProps) {
  const [activeTab, setActiveTab] = useState<"r2" | "upload" | "youtube">("r2");
  const [r2Items, setR2Items] = useState<R2Item[]>([]);
  const [isLoadingR2, setIsLoadingR2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Default to all so editors see every visual immediately
  const [filterType, setFilterType] = useState<"all" | "video" | "image">(
    currentType === "video" ? "video" : "all",
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [externalUrl, setExternalUrl] = useState(
    currentType === "youtube" ? currentUrl : "",
  );
  const [mediaTitle, setMediaTitle] = useState(currentTitle || "");

  useEffect(() => {
    fetchR2Media();
  }, []);

  async function fetchR2Media() {
    setIsLoadingR2(true);
    try {
      const res = await fetch("/api/cms/media");
      const data = await res.json();
      if (data.items) {
        setR2Items(data.items);
      }
    } catch (err) {
      console.error("Failed to load R2 media", err);
    } finally {
      setIsLoadingR2(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "folder",
      file.type.startsWith("video/") ? "videos" : "images",
    );

    try {
      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      const newMediaType: "video" | "image" = file.type.startsWith("video/")
        ? "video"
        : "image";

      onSelect({
        url: data.url,
        type: newMediaType,
        title: file.name,
      });

      fetchR2Media();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteR2(key: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${key}" from Cloudflare R2?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/media?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setR2Items((prev) => prev.filter((item) => item.key !== key));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  function handleApplyExternal() {
    if (!externalUrl.trim()) return;
    const isYt = !!parseYouTubeId(externalUrl);
    onSelect({
      url: externalUrl.trim(),
      type: isYt ? "youtube" : "video",
      title: mediaTitle.trim() || undefined,
    });
  }

  const filteredR2 = r2Items.filter((item) => {
    const matchesSearch =
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      basename(item.key).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.mediaType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-full max-h-[85vh] flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Film className="size-5 text-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      <div className="flex border-b border-border bg-muted/10 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("r2")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 transition-colors ${
            activeTab === "r2"
              ? "border-primary bg-background text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Film className="size-4" />
          Cloudflare R2 Bucket ({r2Items.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 transition-colors ${
            activeTab === "upload"
              ? "border-primary bg-background text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="size-4" />
          Direct Upload
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("youtube")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 transition-colors ${
            activeTab === "youtube"
              ? "border-primary bg-background text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="size-4 text-red-500" />
          YouTube / Video Link
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "r2" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter media by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-border bg-muted/20 py-1.5 pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`rounded px-2.5 py-1 ${
                    filterType === "all"
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({r2Items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("video")}
                  className={`rounded px-2.5 py-1 ${
                    filterType === "video"
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Videos ({r2Items.filter((i) => i.mediaType === "video").length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("image")}
                  className={`rounded px-2.5 py-1 ${
                    filterType === "image"
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Images ({r2Items.filter((i) => i.mediaType === "image").length})
                </button>

                <button
                  type="button"
                  onClick={fetchR2Media}
                  disabled={isLoadingR2}
                  className="ml-1 rounded bg-muted/40 p-1.5 text-muted-foreground hover:text-foreground"
                  title="Refresh bucket items"
                >
                  <RefreshCw
                    className={`size-3.5 ${isLoadingR2 ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {isLoadingR2 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-xs text-muted-foreground">
                <RefreshCw className="size-6 animate-spin text-primary" />
                <span>Reading Cloudflare R2 bucket...</span>
              </div>
            ) : filteredR2.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-12 text-center text-xs text-muted-foreground">
                No matching media found in Cloudflare R2 bucket.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                {filteredR2.map((item) => {
                  const isSelected = currentUrl === item.url;
                  const isVideo = item.mediaType === "video";

                  return (
                    <div
                      key={item.key}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        onSelect({
                          url: item.url,
                          type: isVideo ? "video" : "image",
                          title: basename(item.key),
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect({
                            url: item.url,
                            type: isVideo ? "video" : "image",
                            title: basename(item.key),
                          });
                        }
                      }}
                      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border/60 bg-background hover:border-primary/50"
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
                        <MediaThumb item={item} />

                        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-white">
                          {isVideo ? "VIDEO" : item.mediaType === "image" ? "IMAGE" : item.mediaType.toUpperCase()}
                        </span>

                        {isSelected ? (
                          <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3.5" />
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-1.5 p-2.5">
                        <div
                          className="truncate font-mono text-xs font-semibold text-foreground"
                          title={item.key}
                        >
                          {basename(item.key)}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground" title={item.key}>
                          {item.key.includes("/") ? item.key : "root"}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{formatBytes(item.size)}</span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteR2(item.key, e)}
                              className="rounded p-1 text-red-500 opacity-0 transition-opacity hover:bg-red-500/10 group-hover:opacity-100"
                              title="Delete from R2"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title="Open original"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "upload" ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 px-4 py-10">
            <input
              type="file"
              id="r2-file-upload-input"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />

            <label
              htmlFor="r2-file-upload-input"
              className="flex cursor-pointer flex-col items-center justify-center space-y-3"
            >
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                {isUploading ? (
                  <RefreshCw className="size-8 animate-spin" />
                ) : (
                  <Upload className="size-8" />
                )}
              </div>

              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-foreground">
                  {isUploading
                    ? "Uploading directly to Cloudflare R2..."
                    : "Click to upload Image or Video to Cloudflare R2"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports MP4, WebM, MOV, JPG, PNG, WEBP, SVG (up to 100MB)
                </p>
              </div>
            </label>

            {uploadError ? (
              <div className="mt-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
                {uploadError}
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === "youtube" ? (
          <div className="mx-auto max-w-xl space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                YouTube or Video Link URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full rounded border border-border bg-muted/20 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
              <p className="text-[11px] text-muted-foreground">
                Paste any YouTube standard video, Shorts link, Vimeo link, or public MP4 URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Optional Title / Caption
              </label>
              <input
                type="text"
                placeholder="Video title or brief descriptive caption"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
                className="w-full rounded border border-border bg-muted/20 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            {externalUrl.trim() ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Embed Preview:
                </span>
                <div className="overflow-hidden rounded-lg border border-border">
                  <MediaEmbed src={externalUrl} title={mediaTitle} />
                </div>
              </div>
            ) : null}

            <div className="pt-3">
              <button
                type="button"
                onClick={handleApplyExternal}
                disabled={!externalUrl.trim()}
                className="w-full rounded bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Apply Video Embed
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
