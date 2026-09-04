"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Search, X } from "lucide-react";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { contentData } from "@/data/content";
import { learnItemHref, type LearnHubItem as HubNavItem } from "@/lib/learn-hub";
import type { LearnHubItem } from "@/types/learn";

type StoryItem = LearnHubItem & { slides?: Array<unknown> };

export function LearnHubStories() {
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState<StoryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await contentData.stories.fetch();
        if (!cancelled) setStories(s as StoryItem[]);
      } catch {
        /* seed fallback keeps UI functional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return stories;
    const q = query.trim().toLowerCase();
    return stories.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) || s.summary?.toLowerCase().includes(q),
    );
  }, [stories, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageBreadcrumbs
        items={[{ label: "Learn", href: Routes.Learn }, { label: "Stories" }]}
      />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Learn · Stories
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Short scrolls, real stakes
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {filtered.length} stories · swipeable civic explainers for quick
            understanding.
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
          placeholder="Search stories…"
          aria-label="Search stories"
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

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {filtered.map((story) => (
            <Link
              key={story.id}
              href={learnItemHref(story as unknown as HubNavItem)}
              className="group flex flex-col rounded-2xl border border-border/40 bg-card p-6 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {(story.difficulty ?? "Story") as string}
                {story.slides ? ` · ${story.slides.length} parts` : ""}
              </p>
              <h2 className="mt-2 font-bold leading-snug">{story.title}</h2>
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
        <p className="mt-8 text-sm text-muted-foreground">
          No stories match your search.
        </p>
      )}
    </div>
  );
}
