"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Landmark,
  ListTodo,
  MessageSquare,
  Notebook,
  PenSquare,
  TriangleAlert,
  Users,
  Video,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminAnalyticsApi, type AdminDashboardStats } from "@/lib/admin-api";
import { getFullUrl, useRouteBase } from "@/lib/route-base";
import { PageInfo } from "@/components/admin/page-info";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  href,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  loading?: boolean;
}) {
  const body = (
    <Card className={href ? "transition-colors hover:bg-muted/50" : undefined}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold tabular-nums">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}

const quickLinks = [
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: Activity,
    description: "Vercel traffic, growth, and module performance",
  },
  { title: "Task Board", href: "/dashboard/task", icon: ListTodo, description: "Kanban board for task management" },
  { title: "Users", href: "/dashboard/users/crud", icon: Users, description: "Manage users and permissions" },
  { title: "Content", href: "/dashboard/content", icon: FileText, description: "Manage articles, videos, stories" },
  { title: "Modules", href: "/dashboard/modules", icon: GraduationCap, description: "Manage civic modules" },
  { title: "Authors", href: "/dashboard/authors", icon: PenSquare, description: "Manage content authors" },
  { title: "Budget Data", href: "/dashboard/budget-data", icon: Landmark, description: "Upload and manage budget records" },
  { title: "Forum", href: "/dashboard/forum", icon: MessageSquare, description: "Moderate forum threads" },
];

export default function AdminDashboardPage() {
  const routeBase = useRouteBase();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAnalyticsApi.dashboard();
      setStats(data);
    } catch {
      setStats(null);
      setError("Unable to load dashboard stats from the API. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const content = stats?.content;
  const engagement = stats?.engagement;
  const gamification = stats?.gamification;
  const contentTotal =
    (content?.articles ?? 0) +
    (content?.stories ?? 0) +
    (content?.youtube_videos ?? 0) +
    (content?.knowledge_entries ?? 0);

  const contentBreakdown = [
    { id: "articles", label: "Articles", icon: FileText, value: content?.articles ?? 0 },
    { id: "stories", label: "Stories", icon: BookOpen, value: content?.stories ?? 0 },
    { id: "videos", label: "YouTube videos", icon: Video, value: content?.youtube_videos ?? 0 },
    { id: "knowledge", label: "Knowledge base", icon: BookOpen, value: content?.knowledge_entries ?? 0 },
    { id: "modules", label: "Civic modules", icon: GraduationCap, value: content?.civic_modules ?? 0 },
    { id: "courses", label: "Learning courses", icon: GraduationCap, value: content?.learning_courses ?? 0 },
  ];

  const analyticsHref = getFullUrl(routeBase, "/dashboard/analytics");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live platform stats from Django analytics — including Vercel web traffic snapshots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PageInfo>
            Counts and engagement come from GET /api/v1/analytics/dashboard/. Open Analytics for
            full Vercel-synced traffic charts.
          </PageInfo>
          <Button variant="outline" size="sm" onClick={() => void fetchStats()} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" />
          <AlertTitle>Dashboard unavailable</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void fetchStats()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Link
        href={analyticsHref}
        className="block overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10 transition-colors hover:bg-muted/30"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-5" />
            </div>
            <div>
              <div className="text-lg font-medium tracking-tight">Analytics</div>
              <p className="text-sm text-muted-foreground">
                Visitors, pageviews, devices, and module completions
                {stats?.snapshot.date
                  ? ` · last snapshot ${stats.snapshot.date}`
                  : " · waiting for first snapshot"}
              </p>
            </div>
          </div>
          <div className="flex items-end gap-6">
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">
                {loading ? "—" : (stats?.snapshot.unique_visitors ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Unique visitors</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">
                {loading ? "—" : (stats?.snapshot.total_pageviews ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Pageviews</div>
            </div>
            <ChevronRight className="mb-1 size-4 text-muted-foreground" />
          </div>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team members"
          value={stats?.users.total ?? 0}
          subtitle={
            stats ? `${stats.users.recent_signups_30d.toLocaleString()} new in 30d` : undefined
          }
          icon={Users}
          href={getFullUrl(routeBase, "/dashboard/users/crud")}
          loading={loading}
        />
        <StatCard
          title="Content items"
          value={contentTotal}
          subtitle="Articles, stories, videos, knowledge"
          icon={FileText}
          href={getFullUrl(routeBase, "/dashboard/content")}
          loading={loading}
        />
        <StatCard
          title="Civic modules"
          value={content?.civic_modules ?? 0}
          subtitle={content ? `${content.civic_chapters.toLocaleString()} chapters` : undefined}
          icon={GraduationCap}
          href={getFullUrl(routeBase, "/dashboard/modules")}
          loading={loading}
        />
        <StatCard
          title="Forum threads"
          value={engagement?.forum_threads ?? 0}
          subtitle={engagement ? `${engagement.forum_posts.toLocaleString()} posts` : undefined}
          icon={MessageSquare}
          href={getFullUrl(routeBase, "/dashboard/forum")}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="YouTube videos"
          value={content?.youtube_videos ?? 0}
          subtitle="Ingested / synced"
          icon={Video}
          loading={loading}
        />
        <StatCard
          title="Knowledge base"
          value={content?.knowledge_entries ?? 0}
          subtitle="FAQ articles and guides"
          icon={BookOpen}
          loading={loading}
        />
        <StatCard
          title="Trivia / surveys"
          value={engagement ? `${engagement.trivia_sets} / ${engagement.surveys}` : "0 / 0"}
          subtitle="Interactive components"
          icon={HelpCircle}
          loading={loading}
        />
        <StatCard
          title="Weekly notes"
          value={stats?.weekly_notes.total ?? 0}
          subtitle={
            stats
              ? `${stats.weekly_notes.published.toLocaleString()} published · ${stats.weekly_notes.avg_progress_pct}% avg progress`
              : undefined
          }
          icon={Notebook}
          href={getFullUrl(routeBase, "/dashboard/task")}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Badges issued"
          value={gamification?.badges_issued ?? 0}
          subtitle="Across all learners"
          icon={Award}
          loading={loading}
        />
        <StatCard
          title="Total points"
          value={gamification?.total_points_earned ?? 0}
          subtitle={
            gamification
              ? `${gamification.learner_profiles.toLocaleString()} learner profiles`
              : undefined
          }
          icon={Award}
          loading={loading}
        />
        <StatCard
          title="Survey responses"
          value={engagement?.survey_responses ?? 0}
          subtitle={
            engagement
              ? `${engagement.newsletter_subscribers.toLocaleString()} newsletter subscribers`
              : undefined
          }
          icon={ClipboardList}
          loading={loading}
        />
        <StatCard
          title="Uptime"
          value={stats?.snapshot.uptime_percentage != null ? `${stats.snapshot.uptime_percentage}%` : "—"}
          subtitle="From latest analytics snapshot"
          icon={Activity}
          href={analyticsHref}
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content breakdown</CardTitle>
            <CardDescription>Counts from the dashboard API</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : error || !stats ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No content stats available.</p>
            ) : (
              <div className="space-y-3">
                {contentBreakdown.map((ct) => (
                  <div key={ct.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ct.icon className="size-4 text-muted-foreground" />
                      <span className="text-sm">{ct.label}</span>
                    </div>
                    <Badge variant="outline" className="font-mono tabular-nums">
                      {ct.value.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick links</CardTitle>
            <CardDescription>Jump into management sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getFullUrl(routeBase, link.href)}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <link.icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{link.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{link.description}</div>
                  </div>
                  <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
