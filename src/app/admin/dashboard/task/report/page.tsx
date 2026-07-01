"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Loader2,
  AlertCircle,
  FileBarChart,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ListTodo,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { usePageView } from "@/hooks/use-page-view";
import { taskData } from "@/data/tasks";
import { useAuth } from "@/contexts/auth-context";
import type { WeeklyReportData } from "@/types/tasks";

import { useRouteBase, getFullUrl } from "@/lib/route-base";
import { AdminTaskBreadcrumbs } from "@/components/admin/admin-task-breadcrumb";

const KPI_ICONS: Record<string, { icon: typeof ListTodo; bg: string; color: string }> = {
  total: { icon: ListTodo, bg: "bg-blue-500/10", color: "text-blue-600" },
  draft: { icon: Clock, bg: "bg-amber-500/10", color: "text-amber-600" },
  audited: { icon: TrendingUp, bg: "bg-purple-500/10", color: "text-purple-600" },
  published: { icon: CheckCircle2, bg: "bg-emerald-500/10", color: "text-emerald-600" },
};

export default function TaskReportPage() {
  usePageView();
  const { isLoggedIn } = useAuth();
  const routeBase = useRouteBase();
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    (async () => {
      try {
        const data = await taskData.report.fetch();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-6">
        <Card className="w-full text-center">
          <CardContent className="py-12">
            <h2 className="mb-2 text-lg font-semibold">Authentication Required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Sign in to view reports.</p>
            <Button asChild>
              <a href={`/budgethub/auth/login?next=/dashboard/task/report`}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <AdminTaskBreadcrumbs segments={["report"]} />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="mb-2 h-8 w-16" /><Skeleton className="h-3 w-24" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <AdminTaskBreadcrumbs segments={["report"]} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <AdminTaskBreadcrumbs segments={["report"]} />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <FileBarChart className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No report data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    draft: "Draft", audited: "In Progress", published: "Published",
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <AdminTaskBreadcrumbs segments={["report"]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Weekly Task Report</h1>
          <p className="text-sm text-muted-foreground">
            Overview of task progress across all teams
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={getFullUrl(routeBase, "/dashboard/task")}>
            <ListTodo className="mr-1.5 size-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {[
          { key: "total", label: "Total Tasks", value: report.total, period: report.period },
          { key: "draft", label: "Draft", value: report.by_status.draft ?? 0, period: report.period },
          { key: "audited", label: "In Progress", value: report.by_status.audited ?? 0, period: report.period },
          { key: "published", label: "Published", value: report.by_status.published ?? 0, period: report.period },
        ].map((stat) => {
          const kpi = KPI_ICONS[stat.key] ?? { icon: ListTodo, bg: "bg-gray-500/10", color: "text-gray-600" };
          const Icon = kpi.icon;
          return (
            <motion.div
              key={stat.key}
              variants={{ hidden: { opacity: 0, y: 24, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } } }}
            >
              <Card className="shadow-xs">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  </div>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${kpi.bg}`}>
                    <Icon className={`size-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums leading-none tracking-tight">{stat.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.period === "all_time" ? "All time" : stat.period}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">By Team</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(report.by_team).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Users className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No team data available.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(report.by_team).map(([slug, data]) => {
                  const pct = report.total > 0 ? Math.round((data.count / report.total) * 100) : 0;
                  return (
                    <div key={slug} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          <span>{data.name}</span>
                        </div>
                        <span className="text-muted-foreground">{data.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: data.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">By Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(report.by_assignee).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Users className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No assigned tasks.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(report.by_assignee)
                  .sort(([, a], [, b]) => b - a)
                  .map(([email, count]) => (
                    <div key={email} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm">
                      <span className="truncate">{email}</span>
                      <Badge variant="secondary" className="shrink-0">{count} tasks</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Progress</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">{report.avg_progress}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published Rate</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {report.total > 0 ? Math.round(((report.by_status.published ?? 0) / report.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress Rate</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {report.total > 0 ? Math.round(((report.by_status.audited ?? 0) / report.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
