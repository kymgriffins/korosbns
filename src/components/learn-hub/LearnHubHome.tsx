"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Film, Layers, Play, Search, X } from "lucide-react";
import type { CivicModule, LearnHubItem } from "@/types/learn";
import { contentData } from "@/data/content";
import { learningData } from "@/data/learning";
import { embedUrl, videoData } from "@/data/videos";
import { learnItemHref, type LearnHubItem as HubNavItem } from "@/lib/learn-hub";
import { cn } from "@/utils";

function matchesQuery(item: LearnHubItem, q: string): boolean {
  if (!q.trim()) return true;
  const query = q.trim().toLowerCase();
  return (
    item.title?.toLowerCase().includes(query) ||
    item.summary?.toLowerCase().includes(query) ||
    false
  );
}

function itemHref(item: LearnHubItem): string {
  return learnItemHref(item as unknown as HubNavItem);
}

function VideoCard({
  video,
  active,
  onPlay,
}: {
  video: LearnHubItem;
  active: boolean;
  onPlay: (id: string) => void;
}) {
  const videoId = video.id;
  if (active) {
    return (
      <div className="w-[85vw] max-w-xl shrink-0 snap-start overflow-hidden rounded-2xl border border-border/40 bg-black sm:w-[28rem]">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl(videoId)}
            title={video.title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="p-4 text-sm font-semibold text-white">{video.title}</p>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onPlay(videoId)}
      className="group w-[70vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl border border-border/40 bg-card text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-80"
      aria-label={`Play ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 70vw, 320px"
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/95 text-black">
            <Play className="size-5 fill-current pl-0.5" aria-hidden />
          </span>
        </span>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm font-bold leading-snug">{video.title}</p>
        {video.published_at ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(video.published_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "short",
            })}
          </p>
        ) : null}
      </div>
    </button>
  );
}

export function LearnHubHome() {
  const [query, setQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<LearnHubItem[]>([]);
  const [articles, setArticles] = useState<LearnHubItem[]>([]);
  const [stories, setStories] = useState<LearnHubItem[]>([]);
  const [modules, setModules] = useState<CivicModule[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [v, a, s, m] = await Promise.all([
          videoData.fetch(),
          contentData.articles.fetch(),
          contentData.stories.fetch(),
          learningData.modules.fetch(),
        ]);
        if (!cancelled) {
          setVideos(v);
          setArticles(a);
          setStories(s);
          setModules(m);
        }
      } catch {
        /* stores fall back to seed JSON — UI stays functional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredVideos = useMemo(() => videos.filter((v) => matchesQuery(v, query)), [videos, query]);
  const filteredArticles = useMemo(
    () => articles.filter((a) => matchesQuery(a, query)),
    [articles, query],
  );
  const filteredStories = useMemo(() => stories.filter((s) => matchesQuery(s, query)), [stories, query]);
  const filteredModules = useMemo(() => {
    if (!query.trim()) return modules;
    const q = query.trim().toLowerCase();
    return modules.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q),
    );
  }, [modules, query]);

  const featured = filteredVideos[0] ?? videos[0];

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="border-b border-border/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center md:px-8 md:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Learn · Blog
            </p>
            <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              Understand the budget. Keep the story.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Short reads, field stories, and watch-first explainers on
              Kenya&apos;s national and county budgets — free, no paywall.
            </p>
            <div className="relative mt-6 max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reads, stories, videos…"
                aria-label="Search learning content"
                className="h-11 w-full rounded-full border border-border/60 bg-card pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
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
          </div>
          {featured ? (
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-black">
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl(featured.id)}
                  title={featured.title}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="p-4 text-sm font-semibold text-white">{featured.title}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* 01 Watch */}
      <section className="border-b border-border/30" aria-labelledby="hub-watch">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                01 / Watch
              </p>
              <h2 id="hub-watch" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                Explainers, on video
              </h2>
            </div>
            <Link
              href="/learn/videos"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              All videos <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {filteredVideos.length > 0 ? (
            <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  active={activeVideo === video.id}
                  onPlay={setActiveVideo}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No videos match your search.</p>
          )}
        </div>
      </section>

      {/* 02 Read */}
      <section className="border-b border-border/30 bg-muted/20" aria-labelledby="hub-read">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            02 / Read
          </p>
          <h2 id="hub-read" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            Guides that respect your time
          </h2>
          {filteredArticles.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={itemHref(article)}
                  className="group overflow-hidden rounded-2xl border border-border/40 bg-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {article.thumbnail_url ? (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={article.thumbnail_url}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <BookOpen className="size-3.5" aria-hidden />
                      {article.difficulty ?? "Guide"}
                    </p>
                    <h3 className="mt-2 line-clamp-2 font-bold leading-snug">
                      {article.title}
                    </h3>
                    {article.summary ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {article.summary}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No reads match your search.</p>
          )}
        </div>
      </section>

      {/* 03 Stories */}
      <section className="border-b border-border/30" aria-labelledby="hub-stories">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            03 / Stories
          </p>
          <h2 id="hub-stories" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            Short scrolls, real stakes
          </h2>
          {filteredStories.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {filteredStories.map((story) => (
                <Link
                  key={story.id}
                  href={itemHref(story)}
                  className="group rounded-2xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {(story.difficulty ?? "Story").toString()}
                  </p>
                  <h3 className="mt-2 font-bold leading-snug">{story.title}</h3>
                  {story.summary ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {story.summary}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    Open story <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No stories match your search.</p>
          )}
        </div>
      </section>

      {/* 04 Study */}
      <section aria-labelledby="hub-study">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                04 / Study
              </p>
              <h2 id="hub-study" className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                Go deeper with modules
              </h2>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Layers className="size-3.5" aria-hidden />
              {filteredModules.length} modules
            </span>
          </div>
          {filteredModules.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredModules.slice(0, 6).map((mod) => (
                <Link
                  key={mod.slug}
                  href={`/learn/modules/${mod.slug}`}
                  className={cn(
                    "group grid gap-4 rounded-2xl border border-border/40 bg-card p-4",
                    "transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:grid-cols-[10rem_1fr]",
                  )}
                >
                  {mod.image_url ? (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-[4/3]">
                      <Image
                        src={mod.image_url}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 160px"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <Film className="size-3.5" aria-hidden />
                      {mod.steps?.length ?? 0} steps
                      {mod.author?.name ? ` · ${mod.author.name}` : ""}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-bold leading-snug">
                      {mod.title}
                    </h3>
                    {mod.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {mod.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No modules match your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
