"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame, TrendingUp, BookOpen, MapPin, Sparkles, ArrowRight,
  BarChart3, Building2, Users, Award, Target, Zap,
  ChevronRight, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchReportData } from "@/lib/reports-hub";
import type { BudgetSchema } from "@/lib/budget-schema";

interface ModuleProgress {
  slug: string;
  title: string;
  progress: number;
  category: string;
}

const MODULES: ModuleProgress[] = [
  { slug: "budget-basics", title: "Understanding the National Budget", progress: 72, category: "Budget Basics" },
  { slug: "county-governance", title: "How County Governments Work", progress: 34, category: "County Governance" },
  { slug: "public-participation", title: "Your Role in Budget Making", progress: 8, category: "Public Participation" },
];

const QUICK_ACTIONS = [
  { href: "/budget/insights", icon: TrendingUp, label: "Where does my tax go?", desc: "See how every shilling is allocated" },
  { href: "/budget/insights/counties/nairobi", icon: MapPin, label: "Explore your county", desc: "Discover local budget allocation" },
  { href: "/budget/trivia", icon: Zap, label: "Trivia challenge", desc: "Test your budget literacy skills" },
  { href: "/budget/learn", icon: BookOpen, label: "Continue learning", desc: "Pick up where you left off" },
];

export default function BudgetDashboardPage() {
  const [data, setData] = useState<BudgetSchema | null>(null);

  useEffect(() => {
    fetchReportData().then((result) => {
      const current = result.allYears[result.selectedYear];
      if (current) setData(current);
    });
  }, []);

  const kpis = data?.kpis ?? [];
  const totalBudget = kpis.find((k) => k.key === "total_budget");
  const countyAlloc = kpis.find((k) => k.key === "county_allocation");
  const developmentKpi = kpis.find((k) => k.key === "development");
  const sectors = data?.sector_chart?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#020304]">Welcome back</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef7e0] px-2.5 py-0.5 text-xs font-semibold text-[#735c00]">
              <Flame className="size-3" />
              14-day streak
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[#5f6368]">Ready to understand where Kenya&apos;s budget goes?</p>
        </div>
        <Link href="/budget/insights"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#006d37] hover:underline sm:mt-0"
        >
          View full budget report <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">

        {/* Continue Learning Card (spans 8 on desktop) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Continue Learning</h2>
              <Link href="/budget/learn" className="text-xs text-[#006d37] hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {MODULES.map((mod) => (
                <Link key={mod.slug} href={`/budget/learn/${mod.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-[#e1e4e8] p-3 transition-all hover:border-[#006d37]/30 hover:bg-[#f1f3f4] active:scale-[0.98]"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
                    <BookOpen className="size-4.5 text-[#006d37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] font-medium text-[#5f6368]">{mod.category}</span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#020304] truncate">{mod.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e1e4e8]">
                        <div className="h-full rounded-full bg-[#006d37] transition-all" style={{ width: `${mod.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-medium text-[#5f6368]">{mod.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[#5f6368] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Snapshot (spans 4 on desktop) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Budget Snapshot</h2>
              <span className="rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-semibold text-[#006d37]">FY 2026/27</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-[#f1f3f4] p-3">
                <div className="flex items-center gap-1 text-xs text-[#5f6368]">
                  <BarChart3 className="size-3" />
                  Total Budget
                </div>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-[#020304]">
                  KES {totalBudget?.value.toLocaleString() ?? "4,820"}B
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#006d37]">
                  <TrendingUp className="size-3" />
                  +10% vs prior year
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#e1e4e8] p-2.5">
                  <Building2 className="size-3 text-[#006d37]" />
                  <p className="mt-1 text-xs text-[#5f6368]">County Allocation</p>
                  <p className="text-sm font-bold text-[#020304]">KES {countyAlloc?.value.toLocaleString() ?? "405"}B</p>
                </div>
                <div className="rounded-lg border border-[#e1e4e8] p-2.5">
                  <Target className="size-3 text-[#cea700]" />
                  <p className="mt-1 text-xs text-[#5f6368]">Development</p>
                  <p className="text-sm font-bold text-[#020304]">KES {developmentKpi?.value.toLocaleString() ?? "1,870"}B</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Velocity / Quick Stats (spans 6 on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-[#cea700]" />
                  <span className="text-xs text-[#5f6368]">Level</span>
                </div>
                <span className="text-sm font-bold text-[#020304]">12 — Scholar</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-[#cea700]" />
                  <span className="text-xs text-[#5f6368]">XP to next level</span>
                </div>
                <span className="text-sm font-bold text-[#020304]">450 / 3,000</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e4e8]">
                <div className="h-full rounded-full bg-[#cea700] transition-all" style={{ width: "85%" }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-[#006d37]" />
                  <span className="text-xs text-[#5f6368]">Modules completed</span>
                </div>
                <span className="text-sm font-bold text-[#020304]">4 / 12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-[#006d37]" />
                  <span className="text-xs text-[#5f6368]">Trivia streak</span>
                </div>
                <span className="text-sm font-bold text-[#020304]">3 in a row</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (spans 6 on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Quick Actions</h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}
                    className="group flex items-center gap-3 rounded-lg p-2.5 transition-all hover:bg-[#f1f3f4] active:scale-[0.98]"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
                      <Icon className="size-4 text-[#006d37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#020304]">{action.label}</p>
                      <p className="text-[10px] text-[#5f6368]">{action.desc}</p>
                    </div>
                    <ArrowRight className="size-4 text-[#5f6368] opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Sectors (spans 6 on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Top Sectors</h2>
              <Link href="/budget/insights" className="text-xs text-[#006d37] hover:underline">Details</Link>
            </div>
            <div className="space-y-2.5">
              {sectors.length > 0 ? sectors.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.fill }} />
                  <span className="flex-1 text-xs text-[#5f6368]">{s.name}</span>
                  <span className="text-xs font-medium text-[#020304]">KES {s.value}B</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e1e4e8]">
                    <div className="h-full rounded-full" style={{
                      width: `${(s.value / Math.max(...sectors.map((x) => x.value))) * 100}%`,
                      backgroundColor: s.fill,
                    }} />
                  </div>
                </div>
              )) : (
                <div className="py-4 text-center text-xs text-[#5f6368]">
                  <BarChart3 className="mx-auto mb-1 size-5 text-[#5f6368]/40" />
                  Budget data loading...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements (spans 6 on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Achievements</h2>
              <Link href="/budget/profile" className="text-xs text-[#006d37] hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "7-Day Streak", icon: Flame, color: "bg-[#fef7e0] text-[#735c00]", earned: true },
                { label: "Course Finisher", icon: Award, color: "bg-[#e8f5e9] text-[#006d37]", earned: true },
                { label: "Budget Scholar", icon: Sparkles, color: "bg-[#f1f3f4] text-[#5f6368]", earned: false },
              ].map((ach) => {
                const Icon = ach.icon;
                return (
                  <div key={ach.label}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg p-3 text-center transition-all",
                      ach.earned ? ach.color : "border border-dashed border-[#e1e4e8] opacity-50",
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="text-[10px] font-medium leading-tight">{ach.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leaderboard Preview (spans 4 on desktop) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Leaderboard</h2>
              <Link href="/budget/leaderboard" className="text-xs text-[#006d37] hover:underline">Full board</Link>
            </div>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Sarah K.", sp: "4,820", badge: "Expert" },
                { rank: 2, name: "James W.", sp: "4,150", badge: "Scholar" },
                { rank: 3, name: "You", sp: "3,980", badge: "Scholar", isYou: true },
              ].map((entry) => (
                <div key={entry.rank}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                    entry.isYou && "bg-[#e8f5e9] border-l-2 border-l-[#006d37]",
                  )}
                >
                  <span className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                    entry.rank === 1 ? "bg-[#fef7e0] text-[#735c00]" :
                    entry.rank === 2 ? "bg-[#f1f3f4] text-[#5f6368]" :
                    entry.rank === 3 ? "bg-[#e8f5e9] text-[#006d37]" : "bg-[#f1f3f4] text-[#5f6368]",
                  )}>
                    {entry.rank}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#020304]">{entry.name}</span>
                  <span className="text-xs text-[#5f6368]">{entry.sp} SP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
