"use client";

import { useMemo } from "react";
import { Flame, Sparkles, Award, Globe, Activity, TrendingUp, Layers } from "lucide-react";
import { Switch } from "@/ui/switch";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { LearnProgressBar } from "./learn-progress-bar";
import { LearnStatCard } from "./learn-stat-card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import { cn } from "@/utils";
import type { CivicModule } from "@/types/learn";

interface ProfileViewProps {
  profile: any;
  stages: CivicModule[];
  onResetProgress: () => void;
  onUpdateProfile: (updated: any) => void;
}

const LANG_LABELS: Record<"EN" | "SW" | "SH", string> = {
  EN: "English",
  SW: "Kiswahili",
  SH: "Sheng",
};

export function ProfileView({ profile, stages, onResetProgress, onUpdateProfile }: ProfileViewProps) {
  const xpPct = (profile.sovereigns || 0) % 100;
  const level = Math.floor((profile.sovereigns || 0) / 100) + 1;

  const chartData = useMemo(() => [
    { day: "Mon", xp: 120 },
    { day: "Tue", xp: 80  },
    { day: "Wed", xp: 300 },
    { day: "Thu", xp: 50  },
    { day: "Fri", xp: 200 },
    { day: "Sat", xp: profile.sovereigns > 0 ? 150 : 0 },
    { day: "Sun", xp: 0   },
  ], [profile.sovereigns]);

  const chartConfig = { xp: { label: "XP Earned", color: "var(--primary)" } };

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60 p-5 md:p-8 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-4 md:pr-8" aria-hidden>
          <Award className="size-24 md:size-36" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" aria-hidden />

        <div className="flex items-center gap-4 md:gap-6 relative">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="size-16 md:size-20 rounded-full border-2 border-white/30 shadow-md md:shadow-xl object-cover"
              />
            ) : (
              <BitmojiAvatar gender={profile.gender} size="xl" className="rounded-full border-2 border-white/30 shadow-md md:shadow-xl" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-0.5">Citizen Champion</p>
            <h2 className="text-base md:text-2xl font-bold text-white leading-tight truncate">{profile.breakName}</h2>
            <p className="text-xs md:text-sm text-white/80 font-medium mt-0.5 truncate">
              {profile.county}{profile.ward ? ` · ${profile.ward}` : ""}
            </p>
            <div className="mt-3">
              <LearnProgressBar
                value={xpPct}
                max={100}
                label={`XP progress: ${xpPct} of 100`}
                showLabel
                className="[&_p]:text-white/70 [&_.bg-primary]:bg-white/90 [&_.bg-muted\/60]:bg-white/20"
              />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur border border-white/30 rounded-xl px-3 md:px-4 py-2 md:py-3 text-center shrink-0">
            <p className="text-lg md:text-2xl font-black text-white leading-none">{level}</p>
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Level</p>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        <LearnStatCard label="Day Streak"     value={profile.streakDays || 0}        icon={Flame}    accent="orange" />
        <LearnStatCard label="Sovereigns"     value={profile.sovereigns || 0}        icon={Sparkles} accent="primary" />
        <LearnStatCard label="Badges"         value={profile.badges?.length || 0}    icon={Award}    accent="emerald" />
        <LearnStatCard label="Stages Active"  value={profile.stageProgress?.length || 0} icon={Layers} accent="sky" className="hidden md:flex" />
      </div>

      {/* ── Badge collection ── */}
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Award className="size-3.5 text-primary" aria-hidden />
            Badge Collection
          </CardTitle>
          <CardDescription>{profile.badges?.length || 0} / {stages.length} earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-1.5 md:gap-2">
            {stages.map((stage) => {
              const unlocked = profile.badges?.includes(stage.badge);
              return (
                <div
                  key={stage.slug}
                  className={cn(
                    "p-1.5 md:p-2 rounded-xl text-center space-y-0.5 transition-all",
                    unlocked
                      ? "bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                      : "bg-muted/20 ring-1 ring-border/30 opacity-35 grayscale"
                  )}
                >
                  <div className="text-lg md:text-xl flex justify-center">
                    <span role="img" aria-label={stage.badgeName ?? stage.title}>{stage.badge}</span>
                  </div>
                  <p className="text-xs font-semibold truncate leading-tight">{stage.badgeName}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Weekly activity chart ── */}
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" aria-hidden /> Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[120px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart data={chartData} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tickLine={false} tickMargin={4} axisLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                <ChartTooltip
                  content={<ChartTooltipContent hideIndicator className="bg-card shadow-md text-xs border-0 rounded-lg" />}
                  cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                />
                <Bar dataKey="xp" fill="var(--color-xp)" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Language ── */}
      <Card className="shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Globe className="size-3.5 text-primary" aria-hidden /> Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={profile.language ?? "EN"}
            onValueChange={(lang) => onUpdateProfile({ ...profile, language: lang })}
          >
            <TabsList className="w-full">
              {(["EN", "SW", "SH"] as const).map((lang) => (
                <TabsTrigger key={lang} value={lang} className="flex-1 text-xs">
                  {LANG_LABELS[lang]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── App Settings (desktop only) ── */}
      <Card className="hidden md:block shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">App Settings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="notifications" className="text-sm font-semibold cursor-pointer">Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Open comment alerts.</p>
            </div>
            <Switch
              id="notifications"
              checked={profile.notifications}
              onCheckedChange={(checked) => onUpdateProfile({ ...profile, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="whatsapp" className="text-sm font-semibold cursor-pointer">WhatsApp Fallback</Label>
              <p className="text-xs text-muted-foreground">SMS fallback if push fails.</p>
            </div>
            <Switch
              id="whatsapp"
              checked={profile.whatsappFallback}
              onCheckedChange={(checked) => onUpdateProfile({ ...profile, whatsappFallback: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Danger zone ── */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={onResetProgress}
      >
        Reset All Progress
      </Button>
    </div>
  );
}
