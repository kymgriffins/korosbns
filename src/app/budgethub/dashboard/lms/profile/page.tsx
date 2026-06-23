"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Award, BookOpen, Flame, Mail, MapPin, Target, Trophy, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { citizenApi } from "@/lib/api-client";
import { learnHubApi } from "@/lib/learn-hub";
import type { UserProfileApi } from "@/lib/api-client";
import type { LearnProfileResponse } from "@/types/learn";

export default function ProfilePage() {
  const [profile, setProfile] = useState<LearnProfileResponse | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileApi | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, me] = await Promise.all([
        learnHubApi.profile(),
        citizenApi.getMe(),
      ]);
      setProfile(profileRes);
      setUserProfile(me);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const gamification = profile?.gamification;
  const badges = gamification?.badges ?? [];
  const recentProgress = (profile?.progress ?? []).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()).slice(0, 10);
  const displayName = userProfile?.display_name || userProfile?.first_name || "Learner";
  const avatarUrl = userProfile?.avatar_url || userProfile?.avatar;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">Your learning profile, achievements, and activity</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/budgethub/dashboard/lms/account"><User className="size-4" /> Edit Profile</Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1"><CardContent className="p-6"><Skeleton className="mx-auto size-24 rounded-full" /><Skeleton className="mx-auto mt-3 h-5 w-32" /><Skeleton className="mx-auto mt-1 h-4 w-24" /></CardContent></Card>
          <Card className="lg:col-span-2"><CardContent className="p-6"><Skeleton className="h-4 w-48" /><Skeleton className="mt-3 h-3 w-full" /><Skeleton className="mt-2 h-3 w-3/4" /></CardContent></Card>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <Avatar className="size-24 border-4 border-muted">
                  <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/5">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold">{displayName}</h2>
                  {userProfile?.headline && <p className="text-sm text-muted-foreground">{userProfile.headline}</p>}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                  {userProfile?.location && (
                    <span className="flex items-center gap-1"><MapPin className="size-3" />{userProfile.location}</span>
                  )}
                  {userProfile?.email && (
                    <span className="flex items-center gap-1"><Mail className="size-3" />{userProfile.email}</span>
                  )}
                </div>
                {userProfile?.bio && (
                  <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                )}
                <Separator />
                <div className="flex w-full justify-around">
                  <div className="text-center">
                    <div className="text-xl font-bold tabular-nums">{gamification?.points?.toLocaleString() ?? 0}</div>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold tabular-nums">{gamification?.level ?? 1}</div>
                    <p className="text-[10px] text-muted-foreground">Level</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold tabular-nums">{gamification?.streak_days ?? 0}</div>
                    <p className="text-[10px] text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats & Activity */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10"><Trophy className="size-4 text-amber-500" /></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">{gamification?.points?.toLocaleString() ?? 0}</div>
                    <p className="text-xs text-muted-foreground">earned across all modules</p>
                  </CardContent>
                </Card>
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                    <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10"><Award className="size-4 text-purple-500" /></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">{gamification?.level ?? 1}</div>
                    <p className="text-xs text-muted-foreground">keep learning to level up</p>
                  </CardContent>
                </Card>
                <Card className="shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
                    <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10"><Flame className="size-4 text-orange-500" /></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">{gamification?.streak_days ?? 0}</div>
                    <p className="text-xs text-muted-foreground">consecutive days learning</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-xs flex-1">
                <CardHeader><CardTitle className="text-sm">Recent Activity</CardTitle><CardDescription>Your latest learning progress</CardDescription></CardHeader>
                <CardContent>
                  {recentProgress.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No activity yet. Start learning to track your progress!</p>
                  ) : (
                    <div className="space-y-2">
                      {recentProgress.map((p, idx) => (
                        <div key={`${p.content_id}-${idx}`} className="flex items-center gap-3 rounded-lg border p-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-muted"><BookOpen className="size-4 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium capitalize">{p.content_type.replace(/_/g, " ")}</p>
                            <p className="text-xs text-muted-foreground">
                              {(p.progress_percent ?? 0) >= 100 ? "Completed" : `${Math.round(p.progress_percent ?? 0)}% complete`}
                              {" · "}{format(new Date(p.completed_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant={(p.progress_percent ?? 0) >= 100 ? "default" : "secondary"} className="shrink-0 text-[10px]">
                            {(p.progress_percent ?? 0) >= 100 ? "Done" : `${Math.round(p.progress_percent ?? 0)}%`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-xs">
            <CardHeader><CardTitle className="text-sm">Overall Progress</CardTitle><CardDescription>Your journey through the learning content</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Course Completion</span>
                <span className="font-medium tabular-nums">{gamification?.total_progress ? `${Math.round(gamification.total_progress)}%` : "0%"}</span>
              </div>
              <Progress value={gamification?.total_progress ?? 0} className="h-3" />
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
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5">
                        <Award className="size-6 text-amber-600" />
                      </div>
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
