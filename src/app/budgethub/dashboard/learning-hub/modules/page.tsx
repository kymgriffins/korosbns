"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { BookOpen, GraduationCap, Info, RefreshCw, Search, Trophy, Users, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineError } from "@/components/ui/inline-error";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CivicModule } from "@/types/learn";
import { learningData } from "@/data/learning";
import { usePageView } from "@/hooks/use-page-view";

export default function ModulesPage() {
  usePageView();
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBadge, setFilterBadge] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await learningData.modules.fetch();
      setModules(res as CivicModule[]);
    } catch {
      setFetchError("Failed to load modules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSteps = modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0);
  const authors = new Set(modules.map((m) => m.author?.slug).filter(Boolean));
  const badges = new Set(modules.map((m) => m.badgeName).filter((b): b is string => !!b));

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!mod.title.toLowerCase().includes(q) && !mod.description?.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterBadge && mod.badgeName !== filterBadge) return false;
      if (filterAuthor && mod.author?.slug !== filterAuthor) return false;
      return true;
    });
  }, [modules, searchQuery, filterBadge, filterAuthor]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Modules</h1>
          <p className="text-sm text-muted-foreground">Civic learning modules with step-by-step content</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {fetchError && <InlineError message={fetchError} onRetry={fetchData} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <section className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Modules</CardTitle>
                <CardAction>
                  <Info className="size-3 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-foreground leading-none tracking-tight">{modules.length}</span>
                  <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                    <BookOpen className="size-3" />
                    published
                  </Badge>
                </div>
                <div className="text-right text-muted-foreground text-xs">across {totalSteps} steps</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Steps</CardTitle>
                <CardAction>
                  <Info className="size-3 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-foreground leading-none tracking-tight">{totalSteps}</span>
                  <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                    <GraduationCap className="size-3" />
                    lessons
                  </Badge>
                </div>
                <div className="text-right text-muted-foreground text-xs">avg {(totalSteps / Math.max(modules.length, 1)).toFixed(1)} per module</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Authors</CardTitle>
                <CardAction>
                  <Info className="size-3 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-foreground leading-none tracking-tight">{authors.size}</span>
                  <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                    <Users className="size-3" />
                    contributors
                  </Badge>
                </div>
                <div className="text-right text-muted-foreground text-xs">creating budget literacy content</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
                <CardAction>
                  <Info className="size-3 text-muted-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl text-foreground leading-none tracking-tight">
                    {new Set(modules.map((m) => m.badge).filter(Boolean)).size}
                  </span>
                  <Badge className="rounded-sm border-green-600/50 bg-green-500/10 px-1 font-normal text-green-700 text-xs dark:border-green-800/50 dark:bg-green-500/15 dark:text-green-300">
                    <Trophy className="size-3" />
                    badges
                  </Badge>
                </div>
                <div className="text-right text-muted-foreground text-xs">unique module categories</div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border bg-background pl-9 pr-8 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["All", ...badges].map((badge) => (
            <button
              key={badge}
              onClick={() => setFilterBadge(badge === "All" ? null : badge)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all",
                filterBadge === badge || (badge === "All" && !filterBadge)
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {badge === "All" ? "All" : badge}
            </button>
          ))}
        </div>
        {authors.size > 1 && (
          <select
            value={filterAuthor ?? ""}
            onChange={(e) => setFilterAuthor(e.target.value || null)}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All authors</option>
            {[...authors].map((slug) => (
              <option key={slug} value={slug}>
                {modules.find((m) => m.author?.slug === slug)?.author?.name ?? slug}
              </option>
            ))}
          </select>
        )}
      </div>

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
      ) : filteredModules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12">
            <Search className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No modules match your filters.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setFilterBadge(null); setFilterAuthor(null); }}>
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((mod) => (
            <a
              key={mod.id}
              href={`/dashboard/learning-hub/modules/${mod.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
            >
              {mod.image_url ? (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={mod.image_url}
                    alt={mod.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <BookOpen className="size-10 text-primary/40" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  {mod.badgeName && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase leading-none text-secondary-foreground">
                      {mod.badgeName}
                    </span>
                  )}
                  {mod.author?.name && (
                    <span className="text-[10px] text-muted-foreground">{mod.author.name}</span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{mod.title}</h3>
                {mod.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{mod.description}</p>
                )}
                <div className="mt-auto flex items-center gap-3 pt-3 text-[11px] text-muted-foreground">
                  <span>{mod.steps?.length ?? 0} steps</span>
                  {mod.is_financial_year_analysis && <span>Budget Analysis</span>}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
