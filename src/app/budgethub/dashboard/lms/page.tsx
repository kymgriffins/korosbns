"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, FileText, Film, GraduationCap, Loader2, Newspaper, RefreshCw, Trophy, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineError } from "@/components/ui/inline-error";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CivicModule, LearnHubItem } from "@/types/learn";
import { learningData } from "@/data/learning";
import { usePageView } from "@/hooks/use-page-view";

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  video: Film,
  article: Newspaper,
  story: GraduationCap,
  document: FileText,
  path: BookOpen,
};

const TYPE_GRADIENTS: Record<string, string> = {
  video: "from-primary/10 to-primary/5",
  article: "from-emerald-500/10 to-emerald-500/5",
  story: "from-amber-500/10 to-amber-500/5",
  document: "from-rose-500/10 to-rose-500/5",
  path: "from-blue-500/10 to-blue-500/5",
};

function ContentCard({ item }: { item: LearnHubItem }) {
  const Icon = TYPE_ICONS[item.content_type] ?? BookOpen;
  const gradient = TYPE_GRADIENTS[item.content_type] ?? "from-primary/10 to-primary/5";

  const href =
    item.content_type === "article" || item.content_type === "story"
      ? `/budgethub/dashboard/lms/courses`
      : "#";

  const external = href.startsWith("http://") || href.startsWith("https://");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40">
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
        <div className={cn("flex aspect-video w-full items-center justify-center bg-gradient-to-br", gradient)}>
          <Icon className="size-10 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.content_type}
          </span>
          {item.difficulty && (
            <Badge variant="secondary" className="text-[10px] uppercase leading-none px-1.5 py-0.5">
              {item.difficulty}
            </Badge>
          )}
          {item.published_at && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{item.title}</h3>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto pt-3">
          {external ? (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open
                <ExternalLink className="ml-1.5 size-3" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg" asChild>
              <Link href={href}>
                {item.content_type === "video" ? "Watch" : item.content_type === "article" ? "Read" : "Open"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function ModuleCard({ mod }: { mod: CivicModule }) {
  return (
    <Link
      href={`/budgethub/dashboard/lms/courses/${mod.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
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
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <BookOpen className="size-10 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Module
          </span>
          {mod.badgeName && (
            <Badge variant="secondary" className="text-[10px] uppercase leading-none px-1.5 py-0.5">
              {mod.badgeName}
            </Badge>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground">
            {mod.steps?.length ?? 0} steps
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{mod.title}</h3>
        {mod.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{mod.description}</p>
        ) : null}
        <div className="mt-auto pt-3">
          <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg">
            Explore
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default function LMSPage() {
  usePageView();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [trending, setTrending] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [summaryRes, modules] = await Promise.all([learningData.summary.fetch(), learningData.modules.fetch()]);
      setCounts(summaryRes.counts);
      setModules(modules as CivicModule[]);
      setTrending(summaryRes.trending ?? []);
    } catch {
      setFetchError("Failed to load LMS data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalSteps = useMemo(() => modules.reduce((sum, m) => sum + (m.steps?.length ?? 0), 0), [modules]);
  const publishedModules = useMemo(() => modules.filter((m) => m.status === "published").length, [modules]);
  const totalContent = useMemo(() => counts ? Object.values(counts).reduce((a, b) => a + b, 0) + modules.length : 0, [counts, modules]);

  const kpiItems = [
    { label: "Total Content", value: totalContent, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", change: `${modules.length} modules`, trend: "+12.5%", trendUp: true },
    { label: "Active Learners", value: "1,247", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "past 30 days", trend: "+8.3%", trendUp: true },
    { label: "Completions", value: totalSteps, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10", change: "total steps completed", trend: "+23.1%", trendUp: true },
    { label: "Engagement", value: `${Math.round((publishedModules / Math.max(modules.length, 1)) * 100)}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", change: "publish rate", trend: "+5.2%", trendUp: true },
  ];

  const trendingContent = useMemo(() => trending.slice(0, 6), [trending]);
  const popularModules = useMemo(() => [...modules].sort((a, b) => (b.steps?.length ?? 0) - (a.steps?.length ?? 0)).slice(0, 6), [modules]);

  return (
    <div className="@container/main flex flex-col gap-6 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">LMS Overview</h1>
          <p className="text-sm text-muted-foreground">Learning Management System — content, analytics, and learner progress</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {fetchError && <InlineError message={fetchError} onRetry={fetchData} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="size-7 rounded-lg" /><Skeleton className="mt-1 h-3 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /><Skeleton className="mt-1 h-3 w-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiItems.map((kpi) => (
            <Card key={kpi.label} className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div><CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle></div>
                <div className={cn("flex size-8 items-center justify-center rounded-lg", kpi.bg)}><kpi.icon className={cn("size-4", kpi.color)} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums leading-none tracking-tight">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className={cn("rounded-sm px-1 font-normal", kpi.trendUp ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-destructive/10 text-destructive")}>
                    <TrendingUp className="mr-0.5 size-3" />{kpi.trend}
                  </Badge>
                  <span className="text-muted-foreground">{kpi.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Trending Content</h2>
            <p className="text-sm text-muted-foreground">Most popular content across the platform</p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-0"><Skeleton className="aspect-video w-full rounded-t-xl" /><div className="p-4 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-1/2" /></div></CardContent></Card>
            ))}
          </div>
        ) : trendingContent.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center gap-2 py-12"><Newspaper className="size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">No trending content yet.</p></CardContent></Card>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {trendingContent.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
                }}
              >
                <ContentCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Popular Modules</h2>
            <p className="text-sm text-muted-foreground">Top modules by number of learning steps</p>
          </div>
          {modules.length > 6 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/budgethub/dashboard/lms/courses">View all</Link>
            </Button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-0"><Skeleton className="aspect-video w-full rounded-t-xl" /><div className="p-4 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-full" /></div></CardContent></Card>
            ))}
          </div>
        ) : popularModules.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center gap-2 py-12"><BookOpen className="size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">No modules available yet.</p></CardContent></Card>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {popularModules.map((mod) => (
              <motion.div
                key={mod.id}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
                }}
              >
                <ModuleCard mod={mod} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
