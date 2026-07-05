"use client";

import { useState } from "react";
import {
  User, Award, Flame, BookOpen, Star, Settings,
  LogOut, TrendingUp, Zap, Target, CheckCircle2, Sparkles, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACHIEVEMENTS = [
  { label: "7-Day Streak", icon: Flame, earned: true, desc: "Maintain a 7-day learning streak", color: "bg-[#fef7e0] text-[#735c00]" },
  { label: "Course Finisher", icon: Award, earned: true, desc: "Complete your first course", color: "bg-[#e8f5e9] text-[#006d37]" },
  { label: "Budget Scholar", icon: Sparkles, earned: false, desc: "Score 100% on budget trivia", color: "bg-[#f1f3f4] text-[#5f6368]" },
  { label: "Knowledge Sharer", icon: BookOpen, earned: false, desc: "Post 5 forum answers", color: "bg-[#f1f3f4] text-[#5f6368]" },
  { label: "County Expert", icon: Target, earned: false, desc: "Explore all 47 counties", color: "bg-[#f1f3f4] text-[#5f6368]" },
  { label: "Trivia Master", icon: Zap, earned: false, desc: "Win 10 trivia challenges", color: "bg-[#f1f3f4] text-[#5f6368]" },
];

const RECENT = [
  { title: "Understanding the National Budget", type: "Module", progress: "72%", time: "2h ago" },
  { title: "How County Governments Work", type: "Module", progress: "34%", time: "1d ago" },
  { title: "Budget Trivia Challenge", type: "Trivia", progress: "4/5", time: "3d ago" },
];

const SAVED = [
  { title: "Budget Glossary - Equalization Fund", type: "Glossary" },
  { title: "FY 2026/27 Budget Highlights", type: "Report" },
  { title: "Public Participation Guidelines", type: "Document" },
];

export default function BudgetProfilePage() {
  const [tab, setTab] = useState<"overview" | "achievements" | "saved" | "settings">("overview");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#e8f5e9]">
          <span className="text-2xl font-bold text-[#006d37]">A</span>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold tracking-tight text-[#020304]">Alex Rivera</h1>
          <p className="text-sm text-[#5f6368]">Civic Learner · Level 12 Scholar</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-[#5f6368] justify-center sm:justify-start">
            <span className="flex items-center gap-1"><Flame className="size-3 text-[#cea700]" /> 14-day streak</span>
            <span className="flex items-center gap-1"><Award className="size-3 text-[#cea700]" /> 7 achievements</span>
            <span className="flex items-center gap-1"><Star className="size-3 text-[#cea700]" /> 3,980 XP</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-6 rounded-xl border border-[#e1e4e8] bg-white p-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#5f6368]">Level 12 · Scholar</span>
          <span className="font-medium text-[#020304]">2,450 / 3,000 XP</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e1e4e8]">
          <div className="h-full rounded-full bg-[#cea700] transition-all" style={{ width: "82%" }} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex items-center gap-1 border-b border-[#e1e4e8]">
        {(["overview", "achievements", "saved", "settings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-xs font-medium border-b-2 transition-all capitalize",
              tab === t ? "border-[#006d37] text-[#006d37]" : "border-transparent text-[#5f6368] hover:text-[#020304]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Learning Velocity</h2>
            <div className="flex items-end gap-1.5 h-28">
              {[40, 65, 45, 80, 90, 55, 70].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm bg-[#006d37] transition-all" style={{ height: `${v}%` }} />
                  <span className="text-[9px] text-[#5f6368]">{"M T W T F S S"[i]}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#5f6368] text-center">+12% vs last week</p>
          </div>

          <div className="rounded-xl border border-[#e1e4e8] bg-white p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f6368]">Recent Activity</h2>
            <div className="space-y-2.5">
              {RECENT.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("flex size-6 shrink-0 items-center justify-center rounded",
                      item.type === "Module" ? "bg-[#e8f5e9]" : "bg-[#fef7e0]")}>
                      {item.type === "Module" ? <BookOpen className="size-3 text-[#006d37]" /> : <Zap className="size-3 text-[#735c00]" />}
                    </div>
                    <span className="truncate text-[#020304]">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium text-[#006d37]">{item.progress}</span>
                    <span className="text-[#5f6368]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "achievements" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENTS.map((ach) => {
            const Icon = ach.icon;
            return (
              <div key={ach.label}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                  ach.earned ? "bg-white border-[#e1e4e8]" : "bg-white border-dashed border-[#e1e4e8] opacity-50",
                )}
              >
                <div className={cn("flex size-10 items-center justify-center rounded-xl", ach.color)}>
                  <Icon className="size-5" />
                </div>
                <p className="text-xs font-semibold text-[#020304]">{ach.label}</p>
                <p className="text-[10px] text-[#5f6368]">{ach.desc}</p>
                {ach.earned && <CheckCircle2 className="size-3.5 text-[#006d37]" />}
              </div>
            );
          })}
        </div>
      )}

      {tab === "saved" && (
        <div className="space-y-2">
          {SAVED.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-[#e1e4e8] bg-white p-3.5 transition-all hover:shadow-sm cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className={cn("flex size-8 items-center justify-center rounded-lg",
                  item.type === "Glossary" ? "bg-[#e8f5e9]" : item.type === "Report" ? "bg-[#eff6ff]" : "bg-[#fef7e0]")}>
                  <BookOpen className={cn("size-4", item.type === "Glossary" ? "text-[#006d37]" : item.type === "Report" ? "text-[#3b82f6]" : "text-[#735c00]")} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#020304]">{item.title}</p>
                  <p className="text-[10px] text-[#5f6368]">{item.type}</p>
                </div>
              </div>
              <Star className="size-3.5 fill-[#cea700] text-[#cea700]" />
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-3 max-w-md">
          {[
            { label: "Edit Profile", icon: User },
            { label: "Notification Preferences", icon: Settings },
            { label: "Change Password", icon: Settings },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i}
                className="flex w-full items-center gap-2.5 rounded-xl border border-[#e1e4e8] bg-white p-3.5 text-xs font-medium text-[#020304] transition-all hover:bg-[#f1f3f4] active:scale-[0.98]"
              >
                <Icon className="size-4 text-[#5f6368]" />
                {item.label}
              </button>
            );
          })}
          <button className="flex w-full items-center gap-2.5 rounded-xl border border-[#c5221f]/20 bg-white p-3.5 text-xs font-medium text-[#c5221f] transition-all hover:bg-[#fce8e6] active:scale-[0.98]">
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
