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
  const [filterType, setFilterType] = useState<"all" | "video" | "image">(
    currentType === "image" ? "image" : currentType === "video" ? "video" : "all",
  );

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // YouTube / URL State
  const [externalUrl, setExternalUrl] = useState(
    currentType === "youtube" ? currentUrl : "",
  );
  const [mediaTitle, setMediaTitle] = useState(currentTitle || "");

  // Load R2 Media on mount
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

      // Add to local list and select
      const newMediaType: "video" | "image" = file.type.startsWith("video/")
        ? "video"
        : "image";

      onSelect({
        url: data.url,
        type: newMediaType,
        title: file.name,
      });

      fetchR2Media();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
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
    const matchesSearch = item.key
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || item.mediaType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-background text-foreground rounded-lg border border-border overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-muted/30">
        <div className="flex items-center gap-2">
          <Film className="size-5 text-primary" />
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/10 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("r2")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === "r2"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Film className="size-4" />
          Cloudflare R2 Bucket ({r2Items.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === "upload"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="size-4" />
          Direct Upload
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("youtube")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
            activeTab === "youtube"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="size-4 text-red-500" />
          YouTube / Video Link
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* TAB 1: R2 BUCKET */}
        {activeTab === "r2" ? (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter media by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/20 border border-border rounded pl-9 pr-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  className={`px-2.5 py-1 rounded ${
                    filterType === "all"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({r2Items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("video")}
                  className={`px-2.5 py-1 rounded ${
                    filterType === "video"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Videos ({r2Items.filter((i) => i.mediaType === "video").length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("image")}
                  className={`px-2.5 py-1 rounded ${
                    filterType === "image"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Images ({r2Items.filter((i) => i.mediaType === "image").length})
                </button>

                <button
                  type="button"
                  onClick={fetchR2Media}
                  disabled={isLoadingR2}
                  className="p-1.5 rounded bg-muted/40 text-muted-foreground hover:text-foreground ml-1"
                  title="Refresh bucket items"
                >
                  <RefreshCw
                    className={`size-3.5 ${isLoadingR2 ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* R2 Items Grid */}
            {isLoadingR2 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-xs gap-2">
                <RefreshCw className="size-6 animate-spin text-primary" />
                <span>Reading Cloudflare R2 bucket...</span>
              </div>
            ) : filteredR2.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg text-muted-foreground text-xs">
                No matching media found in Cloudflare R2 bucket.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {filteredR2.map((item) => {
                  const isSelected = currentUrl === item.url;
                  const isVideo = item.mediaType === "video";

                  return (
                    <div
                      key={item.key}
                      onClick={() =>
                        onSelect({
                          url: item.url,
                          type: isVideo ? "video" : "image",
                          title: item.key,
                        })
                      }
                      className={`group relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-border/60 hover:border-primary/50 bg-background"
                      }`}
                    >
                      {/* Media Preview Box */}
                      <div className="relative aspect-video w-full bg-black/90 flex items-center justify-center overflow-hidden">
                        {isVideo ? (
                          <video
                            src={item.url}
                            preload="metadata"
                            muted
                            className="size-full object-contain"
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.key}
                            className="size-full object-cover"
                          />
                        )}

                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-black/70 text-white font-medium">
                          {isVideo ? "VIDEO" : "IMAGE"}
                        </span>

                        {isSelected ? (
                          <span className="absolute top-2 right-2 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="size-3.5" />
                          </span>
                        ) : null}
                      </div>

                      {/* Details & Actions */}
                      <div className="p-2.5 flex flex-col gap-1.5">
                        <div className="font-mono text-xs font-semibold truncate text-foreground" title={item.key}>
                          {item.key}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            {(item.size / (1024 * 1024)).toFixed(1)} MB
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteR2(item.key, e)}
                              className="p-1 rounded text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete from R2"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
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

        {/* TAB 2: DIRECT UPLOAD */}
        {activeTab === "upload" ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-border rounded-lg bg-muted/10">
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
              className="flex flex-col items-center justify-center cursor-pointer space-y-3"
            >
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                {isUploading ? (
                  <RefreshCw className="size-8 animate-spin" />
                ) : (
                  <Upload className="size-8" />
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="font-semibold text-sm text-foreground">
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
              <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
                {uploadError}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* TAB 3: YOUTUBE / EXTERNAL LINK */}
        {activeTab === "youtube" ? (
          <div className="space-y-4 max-w-xl mx-auto py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                YouTube or Video Link URL
              </label>
              <input
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full bg-muted/20 border border-border rounded px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
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
                className="w-full bg-muted/20 border border-border rounded px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Live Video Preview */}
            {externalUrl.trim() ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Embed Preview:
                </span>
                <div className="rounded-lg overflow-hidden border border-border">
                  <MediaEmbed src={externalUrl} title={mediaTitle} />
                </div>
              </div>
            ) : null}

            <div className="pt-3">
              <button
                type="button"
                onClick={handleApplyExternal}
                disabled={!externalUrl.trim()}
                className="w-full py-2.5 rounded bg-primary text-primary-foreground font-semibold text-xs transition-colors hover:bg-primary/90 disabled:opacity-50"
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
