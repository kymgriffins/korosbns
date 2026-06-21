"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Award, BookOpen, ChevronRight, Flame, Loader2, RefreshCw, Target, Trophy, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import type { LearnProfileResponse } from "@/types/learn";

const pieConfig = { completed: { label: "Completed", color: "var(--chart-2)" }, inProgress: { label: "In Progress", color: "var(--chart-4)" }, notStarted: { label: "Not Started", color: "var(--chart-5)" } } satisfies ChartConfig;
const PIE_COLORS = ["var(--chart-2)", "var(--chart-4)", "var(--chart-5)"];

export default function ProgressPage() {
  const [profile, setProfile] = useState<LearnProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const res = await learnHubApi.profile(); setProfile(res); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const gamification = profile?.gamification;
  const progressPieData = useMemo(() => {
    const total = profile?.progress?.length ?? 0;
    const completed = profile?.progress?.filter((p) => (p.progress_percent ?? 0) >= 100).length ?? 0;
    const inProgress = profile?.progress?.filter((p) => (p.progress_percent ?? 0) > 0 && (p.progress_percent ?? 0) < 100).length ?? 0;
    const notStarted = Math.max(0, total - completed - inProgress);
    return [{ name: "Completed", value: completed }, { name: "In Progress", value: inProgress }, { name: "Not Started", value: notStarted }];
  }, [profile]);

  const certificates = gamification?.certificates ?? [];
  const badges = gamification?.badges ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
          <p className="text-sm text-muted-foreground">Your learning progress, achievements, and gamification stats</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-12 w-20" /><Skeleton className="mt-2 h-3 w-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10"><Trophy className="size-4 text-amber-500" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{gamification?.points?.toLocaleString() ?? 0}</div>
                <p className="text-xs text-muted-foreground">earned across all modules</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10"><Award className="size-4 text-purple-500" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{gamification?.level ?? 1}</div>
                <p className="text-xs text-muted-foreground">current learning level</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10"><Flame className="size-4 text-orange-500" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{gamification?.streak_days ?? 0}</div>
                <p className="text-xs text-muted-foreground">consecutive days</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10"><TrendingUp className="size-4 text-emerald-500" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums">{gamification?.total_progress ? `${Math.round(gamification.total_progress)}%` : "0%"}</div>
                <p className="text-xs text-muted-foreground">overall completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="shadow-xs lg:col-span-1">
              <CardHeader><CardTitle className="text-sm">Progress Distribution</CardTitle><CardDescription>Course completion status</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={pieConfig} className="mx-auto aspect-square h-48">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent className="w-32" />} />
                    <Pie data={progressPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={44} outerRadius={68} strokeWidth={2}>
                      {progressPieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx]} />)}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-3 flex flex-wrap justify-center gap-4">
                  {progressPieData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-xs lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Overall Progress</CardTitle><CardDescription>Your journey through the learning content</CardDescription></CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Completion</span>
                    <span className="font-medium tabular-nums">{gamification?.total_progress ? `${Math.round(gamification.total_progress)}%` : "0%"}</span>
                  </div>
                  <Progress value={gamification?.total_progress ?? 0} className="h-3" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Recent Activity</h3>
                  {!profile?.progress?.length ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">No progress recorded yet. Start learning!</p>
                  ) : (
                    <div className="space-y-2">
                      {profile.progress.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()).slice(0, 5).map((p, idx) => (
                        <div key={`${p.content_id}-${idx}`} className="flex items-center gap-3 rounded-lg border p-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted"><BookOpen className="size-4 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium capitalize">{p.content_type.replace(/_/g, " ")}</p>
                            <p className="text-xs text-muted-foreground">{(p.progress_percent ?? 0) >= 100 ? "Completed" : `${Math.round(p.progress_percent ?? 0)}% complete`} · {format(new Date(p.completed_at), "MMM d, yyyy")}</p>
                          </div>
                           <Badge variant={(p.progress_percent ?? 0) >= 100 ? "default" : "secondary"} className="shrink-0 text-[10px]">{(p.progress_percent ?? 0) >= 100 ? "Done" : `${Math.round(p.progress_percent ?? 0)}%`}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xs">
            <CardHeader><CardTitle className="text-sm">Certificates</CardTitle><CardDescription>{certificates.length ? `${certificates.length} certificate${certificates.length > 1 ? "s" : ""} earned` : "Complete modules to earn certificates"}</CardDescription></CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Award className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No certificates yet. Complete a module to earn your first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <a key={cert.id} href={cert.certificate_url ?? "#"} target={cert.certificate_url ? "_blank" : undefined} rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/40 hover:shadow-sm">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5"><Award className="size-5 text-amber-600" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{cert.module_title}</p>
                        <p className="text-xs text-muted-foreground">Issued {format(new Date(cert.issued_at), "MMM d, yyyy")}</p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader><CardTitle className="text-sm">Badges</CardTitle><CardDescription>{badges.length ? `${badges.length} badge${badges.length > 1 ? "s" : ""} earned` : "Complete activities to earn badges"}</CardDescription></CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Target className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No badges yet. Keep learning to unlock achievements!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {badges.map((badge) => (
                    <div key={badge.slug} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted/50">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5"><Award className="size-6 text-amber-600" /></div>
                      <p className="text-xs font-medium leading-tight">{badge.name}</p>
                      {badge.awarded_at && <p className="text-[10px] text-muted-foreground">{format(new Date(badge.awarded_at), "MMM yyyy")}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
