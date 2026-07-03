"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LearnContentGrid } from "@/components/learn/learn-content-grid";
import { LearnStage, LearnStageHeader } from "@/components/learn/learn-stage";
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
      .then((data) => setItems((data.results ?? []) as LearnHubItem[]))
      .catch((err) => {
        const msg =
          err instanceof Error ? err.message : "Could not load content.";
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

  return (
    <LearnStage>
      <LearnStageHeader title={title} subtitle={description} />
      {error ? (
        <p className="mt-4 text-sm text-destructive">
          Content didn&apos;t load. Check your connection and try again.
        </p>
      ) : null}
      <div className="mt-6">
        <LearnContentGrid items={items} loading={loading} />
      </div>
    </LearnStage>
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
