"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, Search, X } from "lucide-react";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { embedUrl, videoData } from "@/data/videos";
import type { LearnHubItem } from "@/types/learn";

export function LearnHubVideos() {
  const [query, setQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<LearnHubItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await videoData.fetch();
        if (!cancelled) setVideos(v);
      } catch {
        /* seed fallback keeps UI functional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return videos;
    const q = query.trim().toLowerCase();
    return videos.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) || v.summary?.toLowerCase().includes(q),
    );
  }, [videos, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageBreadcrumbs
        items={[{ label: "Learn", href: Routes.Learn }, { label: "Videos" }]}
      />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Learn · Watch
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Budget explainers, on video
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {filtered.length} field recordings · tap any thumbnail to watch inline.
          </p>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to Learn
        </Link>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos…"
          aria-label="Search videos"
          className="h-11 w-full rounded-full border border-border/60 bg-card pl-10 pr-11 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {activeVideo ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/40 bg-black">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl(activeVideo)}
              title={filtered.find((v) => v.id === activeVideo)?.title ?? "Video"}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-6 divide-y divide-border/40">
          {filtered.map((video, i) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)}
              className="group flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:gap-6"
            >
              <span className="mt-1 w-8 shrink-0 text-center text-xs font-bold tabular-nums text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 160px, 224px"
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/95 text-black">
                    <Play className="size-4 fill-current pl-0.5" aria-hidden />
                  </span>
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug md:text-base">
                  {video.title}
                </p>
                {video.summary ? (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {video.summary}
                  </p>
                ) : null}
                {video.published_at ? (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {new Date(video.published_at).toLocaleDateString("en-KE", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">No videos match your search.</p>
      )}
    </div>
  );
}
