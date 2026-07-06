"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LearnContentGrid } from "@/components/learn/learn-content-grid";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { LearnPageShell } from "@/components/learn/learn-page-shell";
import {
  LearnExploreLayout,
  LearnPageBody,
  LearnSearchField,
} from "@/components/learn/learn-ui-primitives";
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
  paths: () =>
    learningData.modules.fetch().then((items) => ({ results: items as unknown as LearnHubItem[] })),
  quests: (opts?: { search?: string }) =>
    contentData.quests.fetch(opts).then((items) => ({ results: items })),
} as const;

const LIST_NAV_IDS: Record<keyof typeof LIST_FETCHERS, string> = {
  videos: "videos",
  articles: "articles",
  stories: "stories",
  documents: "documents",
  paths: "modules",
  quests: "quests",
};

export function LearnTabPage({
  listKey,
  summary,
}: {
  title?: string;
  description?: string;
  listKey: keyof typeof LIST_FETCHERS;
  summary?: LearnHubSummary | null;
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localSearch, setLocalSearch] = useState(q);

  usePageView();

  const load = useCallback(() => {
    setLoading(true);
    return LIST_FETCHERS[listKey]({ search: q || localSearch || undefined })
      .then((data) => setItems((data.results ?? []) as LearnHubItem[]))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Could not load content.";
        setError(msg);
        console.error(`[LearnTabPage] Failed to load ${listKey}:`, err);
      })
      .finally(() => setLoading(false));
  }, [listKey, q, localSearch]);

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

  const filteredItems = useMemo(() => {
    if (!localSearch.trim()) return items;
    const needle = localSearch.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        (item.summary || "").toLowerCase().includes(needle),
    );
  }, [items, localSearch]);

  return (
    <LearnPageShell navId={LIST_NAV_IDS[listKey]}>
      <LearnPageBody>
        <LearnSearchField
          value={localSearch}
          onChange={setLocalSearch}
          placeholder={`Search ${listKey}…`}
          className="mb-6 max-w-md"
        />
        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
        <LearnExploreLayout
          main={
            <LearnContentGrid
              items={filteredItems}
              loading={loading}
              listKey={listKey}
            />
          }
          aside={
            <LearnSidebar
              trending={(summary?.trending ?? []) as LearnHubItem[]}
              dailyQuest={dailyQuest as LearnHubItem | null | undefined}
            />
          }
        />
      </LearnPageBody>
    </LearnPageShell>
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
