"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Loader2,
  Medal,
  RefreshCw,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { learnHubApi } from "@/lib/learn-hub";
import { fetchLeaderboard, fetchChallenges } from "@/lib/gamification";
import type { LearnProfileResponse } from "@/types/learn";
import type { LeaderboardEntry, ChallengeData, BadgeCatalogResponse } from "@/types/gamification";
import type { ApiListResponse } from "@/types/api";
import { apiFetch } from "@/lib/api-client";

const pieConfig = { completed: { label: "Completed", color: "var(--chart-2)" }, inProgress: { label: "In Progress", color: "var(--chart-4)" }, notStarted: { label: "Not Started", color: "var(--chart-5)" } } satisfies ChartConfig;
const PIE_COLORS = ["var(--chart-2)", "var(--chart-4)", "var(--chart-5)"];

export default function ProgressPage() {
  const [profile, setProfile] = useState<LearnProfileResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [badgeCatalog, setBadgeCatalog] = useState<BadgeCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, lb, ch, bc] = await Promise.all([
        learnHubApi.profile(),
        fetchLeaderboard(10),
        fetchChallenges(),
        apiFetch<BadgeCatalogResponse>("/gamification/badges/").catch(() => null),
      ]);
      setProfile(profileRes);
      setLeaderboard(lb);
      setChallenges(ch);
      setBadgeCatalog(bc);
    } catch {} finally { setLoading(false); }
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
  const activeChallenges = challenges.filter((c) => c.status !== "completed" && c.status !== "expired");
  const completedChallenges = challenges.filter((c) => c.status === "completed");

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-12 w-20" /><Skeleton className="mt-2 h-3 w-32" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
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

          {/* Progress + Leaderboard */}
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
              <CardContent className="flex flex-col gap-6 pt-6">
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

          {/* Leaderboard */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Medal className="size-4 text-amber-500" />Leaderboard</CardTitle>
              <CardDescription>Top learners ranked by total points</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Users className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No leaderboard data yet. Start learning to compete!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.rank ?? idx} className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50",
                      idx === 0 && "bg-amber-500/5"
                    )}>
                      <span className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                        idx === 0 && "bg-amber-500/15 text-amber-600",
                        idx === 1 && "bg-slate-400/15 text-slate-500",
                        idx === 2 && "bg-orange-400/15 text-orange-600",
                        idx > 2 && "bg-muted text-muted-foreground"
                      )}>
                        {entry.rank ?? idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{entry.name ?? "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">Level {entry.level} · {entry.badge_count} badges</p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="text-xs">
                          <p className="font-medium tabular-nums">{entry.points.toLocaleString()}</p>
                          <p className="text-muted-foreground">pts</p>
                        </div>
                        {entry.streak_days > 0 && (
                          <div className="hidden items-center gap-1 sm:flex">
                            <Flame className="size-3 text-orange-500" />
                            <span className="text-xs tabular-nums text-muted-foreground">{entry.streak_days}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Zap className="size-4 text-yellow-500" />Active Challenges</CardTitle>
                <CardDescription>Complete challenges to earn bonus points and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeChallenges.map((ch) => (
                    <div key={ch.id} className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight">{ch.title}</p>
                          {ch.description && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ch.description}</p>}
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">{ch.challenge_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Trophy className="size-3 text-amber-500" />{ch.points_reward} pts</span>
                        <span>{ch.ends_at ? `Ends ${format(new Date(ch.ends_at), "MMM d")}` : "Ongoing"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificates */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm">Certificates</CardTitle>
              <CardDescription>{certificates.length ? `${certificates.length} certificate${certificates.length > 1 ? "s" : ""} earned` : "Complete modules to earn certificates"}</CardDescription>
            </CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Award className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No certificates yet. Complete a module to earn your first one!</p>
                  <Button variant="outline" size="sm" asChild className="mt-2"><Link href="/budgethub/dashboard/lms/courses">Browse courses</Link></Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.slice(0, 6).map((cert) => (
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
              {certificates.length > 6 && (
                <Button variant="ghost" size="sm" asChild className="mt-3 w-full">
                  <Link href="/budgethub/dashboard/lms/certificates">View all certificates <ArrowRight className="size-3.5" /></Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Badge Catalog */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Target className="size-4 text-amber-500" />Badges</CardTitle>
              <CardDescription>
                {badgeCatalog
                  ? `${badgeCatalog.summary.earned} earned · ${badgeCatalog.summary.in_progress} in progress · ${badgeCatalog.summary.locked} locked`
                  : badges.length ? `${badges.length} badge${badges.length > 1 ? "s" : ""} earned` : "Complete activities to earn badges"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badgeCatalog ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {badgeCatalog.results.map((entry) => (
                    <div key={entry.slug} className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
                      entry.state === "earned" ? "hover:bg-muted/50" : "opacity-60 hover:opacity-80",
                      entry.state === "in_progress" && "border-amber-500/30 bg-amber-500/5"
                    )}>
                      <div className={cn(
                        "flex size-12 items-center justify-center rounded-full",
                        entry.state === "earned" && "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
                        entry.state === "in_progress" && "bg-gradient-to-br from-amber-500/10 to-amber-500/5",
                        entry.state === "locked" && "bg-muted"
                      )}>
                        {entry.state === "locked" ? (
                          <BookOpen className="size-6 text-muted-foreground/50" />
                        ) : (
                          <Award className={cn("size-6", entry.state === "earned" ? "text-amber-600" : "text-muted-foreground/60")} />
                        )}
                      </div>
                      <p className="text-xs font-medium leading-tight">{entry.name}</p>
                      {entry.description && <p className="text-[10px] text-muted-foreground line-clamp-2">{entry.description}</p>}
                      {entry.state === "in_progress" && entry.progress && (
                        <Progress value={entry.progress.percent ?? 0} className="h-1.5 w-full" />
                      )}
                      {entry.state === "earned" && entry.earned_at && (
                        <p className="text-[10px] text-muted-foreground">{format(new Date(entry.earned_at), "MMM yyyy")}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8">
                  <Target className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No badge data available. Keep learning to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" />Completed Challenges</CardTitle>
                <CardDescription>{completedChallenges.length} challenge{completedChallenges.length > 1 ? "s" : ""} completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {completedChallenges.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{ch.title}</p>
                        <p className="text-xs text-muted-foreground">+{ch.points_reward} pts · {ch.challenge_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
