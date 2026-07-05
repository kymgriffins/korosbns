"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { learningData } from "@/data/learning";
import { contentData } from "@/data/content";
import { videoData } from "@/data/videos";
import { trackAnalytics } from "@/lib/gamification";
import { usePageView } from "@/hooks/use-page-view";
import type { LearnHubSummary } from "@/types/learn";
import type { LearnHubItem as HubItem } from "@/lib/learn-hub";
import { StudioPage } from "../components/studio-page";
import { StudioPageHeader } from "../components/studio-page-header";
import { ContentSpark } from "../illustrations/content-spark";
import { LearnContentGrid } from "./learn-content-grid";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { learnItemHref } from "@/lib/learn-hub";

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
    learningData.modules.fetch().then((items) => ({ results: items as unknown as HubItem[] })),
  quests: (opts?: { search?: string }) =>
    contentData.quests.fetch(opts).then((items) => ({ results: items })),
} as const;

export function LearnContentLibraryView({
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
  const [items, setItems] = useState<HubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageView();

  const load = useCallback(() => {
    setLoading(true);
    return LIST_FETCHERS[listKey]({ search: q || undefined })
      .then((data) => setItems((data.results ?? []) as HubItem[]))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Could not load content.";
        setError(msg);
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

  const trending = (summary?.trending ?? []).slice(0, 4) as HubItem[];

  return (
    <StudioPage width="wide">
      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          <StudioPageHeader
            eyebrow="Library"
            title={title}
            description={description}
            illustration={<ContentSpark className="hidden h-24 w-32 opacity-90 sm:block" />}
          />
          {error ? (
            <p className="mb-4 text-sm text-destructive">{error}</p>
          ) : null}
          <LearnContentGrid items={items} loading={loading} />
        </div>

        <aside className="space-y-4">
          {dailyQuest ? (
            <Card className="border-primary/20 bg-primary/5 shadow-none">
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">Daily quest</p>
                <p className="mt-1 font-semibold tracking-tight">{dailyQuest.title}</p>
                {dailyQuest.summary ? (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{dailyQuest.summary}</p>
                ) : null}
                <Link
                  href={learnItemHref(dailyQuest as HubItem)}
                  className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Start quest →
                </Link>
              </CardContent>
            </Card>
          ) : null}

          {trending.length > 0 ? (
            <Card className="border-border/50 shadow-none">
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trending</p>
                <ul className="mt-3 space-y-2">
                  {trending.map((item) => (
                    <li key={`${item.content_type}-${item.id}`}>
                      <Link
                        href={learnItemHref(item)}
                        className="block text-sm font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </StudioPage>
  );
}

export function useLearnSummary() {
  const [summary, setSummary] = useState<LearnHubSummary | null>(null);
  useEffect(() => {
    void learningData.summary.fetch().then(setSummary).catch(() => setSummary(null));
  }, []);
  return summary;
}
