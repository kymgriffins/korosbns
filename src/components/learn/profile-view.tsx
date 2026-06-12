"use client";

import React, { useMemo } from "react";
import { Flame, Sparkles, Award, Globe, Activity, TrendingUp } from "lucide-react";
import { Switch } from "@/ui/switch";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import type { CivicModule } from "@/types/learn";

interface ProfileViewProps {
  profile: any;
  stages: CivicModule[];
  onResetProgress: () => void;
  onUpdateProfile: (updated: any) => void;
}

export function ProfileView({ profile, stages, onResetProgress, onUpdateProfile }: ProfileViewProps) {
  const chartData = useMemo(() => [
    { day: "Mon", xp: 120 },
    { day: "Tue", xp: 80 },
    { day: "Wed", xp: 300 },
    { day: "Thu", xp: 50 },
    { day: "Fri", xp: 200 },
    { day: "Sat", xp: profile.sovereigns > 0 ? 150 : 0 },
    { day: "Sun", xp: 0 },
  ], [profile.sovereigns]);

  const chartConfig = { xp: { label: "XP Earned", color: "var(--primary)" } };

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-primary/60 p-5 md:p-8 text-primary-foreground shadow-lg">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-end pr-4 md:pr-8">
          <Award className="size-24 md:size-36" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 md:gap-6 relative">
          <div className="relative shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-16 md:size-20 rounded-full border-2 border-white/30 shadow-md md:shadow-xl object-cover" />
            ) : (
              <BitmojiAvatar gender={profile.gender} size="xl" className="rounded-full border-2 border-white/30 shadow-md md:shadow-xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] md:text-[10px] font-black uppercase tracking-widest text-white/70 mb-0.5 md:mb-1">Citizen Champion</p>
            <h2 className="text-base md:text-2xl font-black text-white leading-tight truncate">{profile.breakName}</h2>
            <p className="text-[10px] md:text-sm text-white/80 font-semibold mt-0.5 md:mt-1 truncate">{profile.county}{profile.ward ? ` · ${profile.ward}` : ""}</p>
            <div className="mt-2 md:mt-3">
              <div className="flex justify-between text-[10px] text-white/70 font-bold mb-1">
                <span>{profile.sovereigns || 0} XP earned</span>
                <span>Level {Math.floor((profile.sovereigns || 0) / 100) + 1}</span>
              </div>
              <div className="h-1.5 md:h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/90 transition-all duration-700 w-[var(--progress)]"
                  style={{ "--progress": `${((profile.sovereigns || 0) % 100)}%` } as React.CSSProperties}
                  role="progressbar"
                  aria-valuenow={(profile.sovereigns || 0) % 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`XP progress: ${(profile.sovereigns || 0) % 100}%`}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur border border-white/30 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 text-center shrink-0">
            <p className="text-lg md:text-2xl font-black text-white leading-none">{Math.floor((profile.sovereigns || 0) / 100) + 1}</p>
            <p className="text-[10px] md:text-[10px] font-black text-white/80 uppercase tracking-wider">Level</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        <div className="p-3 md:p-4 rounded-2xl border border-orange-500/20 bg-orange-500/8 text-center space-y-1">
          <Flame className="size-4 md:size-5 fill-orange-500 text-orange-500 mx-auto" />
          <p className="text-sm md:text-xl font-black text-orange-600">{profile.streakDays || 0}</p>
          <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-wider">Day Streak</p>
        </div>
        <div className="p-3 md:p-4 rounded-2xl border border-primary/20 bg-primary/8 text-center space-y-1">
          <Sparkles className="size-4 md:size-5 fill-primary text-primary mx-auto" />
          <p className="text-sm md:text-xl font-black text-primary">{profile.sovereigns || 0}</p>
          <p className="text-[10px] font-black text-primary/80 uppercase tracking-wider">Sovereigns</p>
        </div>
        <div className="p-3 md:p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 text-center space-y-1">
          <Award className="size-4 md:size-5 text-emerald-600 mx-auto" />
          <p className="text-sm md:text-xl font-black text-emerald-600">{profile.badges?.length || 0}</p>
          <p className="text-[10px] font-black text-emerald-600/80 uppercase tracking-wider">Badges</p>
        </div>
        <div className="hidden md:block p-4 rounded-2xl border border-sky-500/20 bg-sky-500/8 text-center space-y-1.5">
          <div className="size-5 text-sky-600 mx-auto" />
          <p className="text-xl font-black text-sky-600">{profile.stageProgress?.length || 0}</p>
          <p className="text-[10px] font-black text-sky-600/80 uppercase tracking-wider">Stages Active</p>
        </div>
      </div>

      <div className="p-4 md:p-5 border border-border bg-card rounded-2xl space-y-3 shadow-xs md:shadow-sm">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Badge Collection ({profile.badges?.length || 0}/{stages.length})</h3>
        <div className="grid grid-cols-4 gap-1.5 md:gap-2">
          {stages.map((stage) => {
            const unlocked = profile.badges?.includes(stage.badge);
            return (
              <div key={stage.slug} className={`p-1.5 md:p-2 rounded-xl text-center space-y-0.5 transition-all ${
                unlocked
                  ? "bg-primary/5 ring-1 ring-primary/20 shadow-xs"
                  : "bg-muted/20 ring-1 ring-border/30 opacity-35 grayscale"
              }`}>
                <div className="text-lg md:text-xl flex justify-center">{stage.badge}</div>
                <p className="text-[10px] font-bold truncate leading-tight">{stage.badgeName}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity chart */}
      <div className="p-4 md:p-5 border border-border bg-card rounded-2xl space-y-3 shadow-xs md:shadow-sm">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="size-3.5" /> Weekly Activity
        </h3>
        <div className="h-[120px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" tickLine={false} tickMargin={4} axisLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
              <ChartTooltip
                content={<ChartTooltipContent hideIndicator className="bg-card shadow-md text-xs border-0 rounded-lg" />}
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
              />
              <Bar dataKey="xp" fill="var(--color-xp)" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="p-4 md:p-5 border border-border bg-card rounded-2xl space-y-3 shadow-xs md:shadow-sm">
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Globe className="size-3.5" /> Language
        </h3>
        <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl text-xs">
          {(["EN", "SW", "SH"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onUpdateProfile({ ...profile, language: lang })}
              className={`py-1.5 font-bold rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-ring ${
                profile.language === lang
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "EN" ? "English" : lang === "SW" ? "Kiswahili" : "Sheng"}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block p-5 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">App Settings</h3>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="flex items-center justify-between text-xs">
            <div><h4 className="font-bold">Push Notifications</h4><p className="text-[10px] text-muted-foreground">Open comment alerts.</p></div>
            <Switch checked={profile.notifications} onCheckedChange={(checked) => onUpdateProfile({ ...profile, notifications: checked })} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div><h4 className="font-bold">WhatsApp Fallback</h4><p className="text-[10px] text-muted-foreground">SMS fallback if push fails.</p></div>
            <Switch checked={profile.whatsappFallback} onCheckedChange={(checked) => onUpdateProfile({ ...profile, whatsappFallback: checked })} />
          </div>
        </div>
      </div>

      <button
        onClick={onResetProgress}
        className="w-full py-2.5 rounded-xl text-xs font-bold border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
      >
        Reset All Progress
      </button>
    </div>
  );
}
