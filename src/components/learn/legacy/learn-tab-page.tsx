"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LearnContentGrid } from "./learn-content-grid";
import { LearnSidebar } from "./learn-sidebar";
import type { LearnContentType, LearnHubSummary } from "@/types/learn";
import type { LearnHubItem } from "@/lib/learn-hub";
import { videoData } from "@/data/videos";
import { contentData } from "@/data/content";
import { learningData } from "@/data/learning";
import { trackAnalytics } from "@/lib/gamification";
import { usePageView } from "@/hooks/use-page-view";

const LIST_FETCHERS = {
  videos: (opts?: { search?: string }) =>
    videoData.fetch(opts).then((items) => ({ results: items })),
  articles: (opts?: { search?: string }) =>
    contentData.articles
      .fetchFromApi(opts)
      .then((r) => ({ results: r.results ?? [] }))
      .catch(() => contentData.articles.fetch(opts).then((items) => ({ results: items }))),
  stories: (opts?: { search?: string }) =>
    contentData.stories
      .fetchFromApi()
      .then((r) => ({ results: (r.results ?? []).filter((item) => {
        const q = (opts?.search ?? "").trim().toLowerCase();
        if (!q) return true;
        const title = String(item.title ?? "").toLowerCase();
        const summary = String(item.summary ?? "").toLowerCase();
        return title.includes(q) || summary.includes(q);
      }) }))
      .catch(() => contentData.stories.fetch(opts).then((items) => ({ results: items }))),
  documents: (opts?: { search?: string }) =>
    contentData.documents.fetch(opts).then((items) => ({ results: items })),
  paths: () =>
    learningData.modules.fetch().then((items) => ({ results: items as unknown as LearnHubItem[] })),
  quests: (opts?: { search?: string }) =>
    contentData.quests.fetch(opts).then((items) => ({ results: items })),
} as const;

export function LearnTabPage({
  title,
  description,
  listKey,
  summary,
}: {
  title: string;
  description: string;
  listKey: keyof typeof LIST_FETCHERS;
  summary?: LearnHubSummary | null;
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageView();

  const load = useCallback(() => {
    setLoading(true);
    return LIST_FETCHERS[listKey]({ search: q || undefined })
      .then((data) => {
        setItems((data.results ?? []) as LearnHubItem[]);
        setError("");
      })
      .catch((err) => {
        const raw = err instanceof Error ? err.message : String(err);
        const msg = raw?.trim()
          ? `Could not load content from API: ${raw}`
          : "Could not load content from API.";
        setError(msg);
        console.error(`[LearnTabPage] Failed to load ${listKey}:`, err);
      })
      .finally(() => setLoading(false));
  }, [listKey, q]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void trackAnalytics("learn_list_view", { tab: listKey });
  }, [listKey]);

  const dailyQuest = useMemo(() => {
    const fromSummary = summary?.trending?.find((t) => t.content_type === "quest");
    return fromSummary ?? items.find((i) => i.content_type === "quest") ?? null;
  }, [summary, items]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {error ? <p className="mt-4 text-destructive">{error}</p> : null}
        <div className="mt-6">
          <LearnContentGrid items={items} loading={loading} />
        </div>
      </div>
      <LearnSidebar trending={(summary?.trending ?? []) as LearnHubItem[]} dailyQuest={dailyQuest as LearnHubItem | null | undefined} />
    </div>
  );
}

export function useLearnSummary() {
  const [summary, setSummary] = useState<LearnHubSummary | null>(null);
  useEffect(() => {
    void learningData.summary.fetch()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);
  return summary;
}

export type { LearnContentType };
