"use client";

import { useCallback, useEffect, useState } from "react";

import { Film, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InlineError } from "@/components/ui/inline-error";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LearnHubItem } from "@/lib/learn-hub";
import { videoData } from "@/data/videos";
import { usePageView } from "@/hooks/use-page-view";

export default function VideosPage() {
  usePageView();
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await videoData.fetch();
      setItems(res as LearnHubItem[]);
    } catch {
      setFetchError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
          <p className="text-sm text-muted-foreground">Video explainers and tutorials</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {fetchError && <InlineError message={fetchError} onRetry={fetchData} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-video w-full rounded-t-xl" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12">
            <Film className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url ?? "#"}
              target={item.url?.startsWith("http") ? "_blank" : undefined}
              rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
            >
              {item.thumbnail_url ? (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Film className="size-10 text-primary/30" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  {item.difficulty && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase leading-none text-secondary-foreground">
                      {item.difficulty}
                    </span>
                  )}
                  {item.published_at && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{item.title}</h3>
                {item.summary && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
                )}
                <div className="mt-auto pt-3">
                  <span className="text-[11px] font-medium text-primary hover:underline">
                    Watch video
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
