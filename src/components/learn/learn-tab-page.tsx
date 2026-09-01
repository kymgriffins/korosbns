"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LearnContentGrid } from "@/components/learn/learn-content-grid";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { LearnPageFrame, LearnPageHeader } from "@/components/learn/learn-page-frame";
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
    contentData.articles.fetch(opts).then((items) => ({ results: items })),
  stories: (opts?: { search?: string }) =>
    contentData.stories.fetch(opts).then((items) => ({ results: items })),
  documents: (opts?: { search?: string }) =>
    contentData.documents.fetch(opts).then((items) => ({ results: items })),
  paths: (opts?: { search?: string }) =>
    contentData.paths.fetch(opts).then((items) => ({ results: items })),
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
    setError("");
    return LIST_FETCHERS[listKey]({ search: q || undefined })
      .then((data) => {
        const results = (data.results ?? []) as LearnHubItem[];
        setItems(results);
        if (results.length === 0) {
          setError("Nothing in this list yet. Retry when the catalogue is available.");
        }
      })
      .catch((err) => {
        const msg =
          err instanceof Error
            ? err.message
            : "This list is temporarily unavailable.";
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
    <LearnPageFrame>
      <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
        <div>
          <LearnPageHeader title={title} description={description} />
        {error ? (
          <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
            <p className="font-medium">Catalogue note</p>
            <p className="mt-0.5 text-xs opacity-90">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-2 text-xs font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : null}
        <div className="mt-6">
          <LearnContentGrid items={items} loading={loading} />
        </div>
      </div>
      <LearnSidebar trending={(summary?.trending ?? []) as LearnHubItem[]} dailyQuest={dailyQuest as LearnHubItem | null | undefined} />
      </div>
    </LearnPageFrame>
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
