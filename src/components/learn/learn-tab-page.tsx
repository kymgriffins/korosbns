"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LearnContentGrid } from "@/components/learn/learn-content-grid";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import type { LearnContentType } from "@/types/learn";
import type { LearnHubItem, LearnHubSummary } from "@/lib/learn-hub";
import { learnHubApi } from "@/lib/learn-hub";
import { trackAnalytics } from "@/lib/gamification";

const LIST_FETCHERS = {
  videos: learnHubApi.videos,
  articles: learnHubApi.articles,
  stories: learnHubApi.stories,
  documents: learnHubApi.documents,
  paths: learnHubApi.paths,
  quests: learnHubApi.quests,
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

  const load = useCallback(() => {
    setLoading(true);
    return LIST_FETCHERS[listKey]({ search: q || undefined })
      .then((data) => setItems(data.results))
      .catch(() => setError("Could not load content."))
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
      <LearnSidebar trending={summary?.trending ?? []} dailyQuest={dailyQuest} />
    </div>
  );
}

export function useLearnSummary() {
  const [summary, setSummary] = useState<LearnHubSummary | null>(null);
  useEffect(() => {
    void learnHubApi.summary().then(setSummary).catch(() => setSummary(null));
  }, []);
  return summary;
}

export type { LearnContentType };
