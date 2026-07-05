"use client";

import { useState } from "react";
import { Trophy, Award, Flame, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  { rank: 1, name: "Sarah K.", title: "Budget Expert", sp: 4820, badge: "Expert", achievements: 12 },
  { rank: 2, name: "James W.", title: "Fiscal Scholar", sp: 4150, badge: "Scholar", achievements: 9 },
  { rank: 3, name: "You", title: "Civic Learner", sp: 3980, badge: "Scholar", achievements: 7, isYou: true },
  { rank: 4, name: "Grace M.", title: "Policy Analyst", sp: 3720, badge: "Contributor", achievements: 6 },
  { rank: 5, name: "Peter K.", title: "Public Participation Advocate", sp: 3450, badge: "Expert", achievements: 8 },
  { rank: 6, name: "Amina H.", title: "Budget Basics Graduate", sp: 3100, badge: "Learner", achievements: 4 },
  { rank: 7, name: "David O.", title: "County Governance Fan", sp: 2890, badge: "Learner", achievements: 5 },
  { rank: 8, name: "Faith N.", title: "Trivia Champion", sp: 2540, badge: "Contributor", achievements: 6 },
];

export default function BudgetLeaderboardPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "all">("weekly");

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-[#020304]">Leaderboard</h1>
        <p className="mt-0.5 text-sm text-[#5f6368]">Top budget literacy champions</p>
      </div>

      {/* Period Toggle */}
      <div className="mb-5 inline-flex rounded-xl bg-[#f1f3f4] p-1">
        {(["weekly", "monthly", "all"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all capitalize",
              period === p ? "bg-white text-[#020304] shadow-sm" : "text-[#5f6368] hover:text-[#020304]",
            )}
          >
            {p === "all" ? "All Time" : p}
          </button>
        ))}
      </div>

      {/* Podium (Top 3) */}
      <div className="mb-6 grid grid-cols-3 gap-3 items-end">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((entry) => (
          <div key={entry.rank}
            className={cn(
              "flex flex-col items-center rounded-xl border p-4 text-center transition-all",
              entry.isYou ? "border-[#006d37] bg-[#e8f5e9]" : "border-[#e1e4e8] bg-white",
              entry.rank === 1 && "pb-6",
              entry.rank === 2 && "pb-4",
              entry.rank === 3 && "pb-4",
            )}
          >
            <div className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold mb-2",
              entry.rank === 1 ? "bg-[#fef7e0] text-[#735c00]" :
              entry.rank === 2 ? "bg-[#f1f3f4] text-[#5f6368]" :
              "bg-[#e8f5e9] text-[#006d37]",
            )}>
              {entry.rank}
            </div>
            <Trophy className={cn("size-5 mb-1", entry.rank === 1 ? "text-[#cea700]" : "text-[#5f6368]")} />
            <p className="text-sm font-semibold text-[#020304]">{entry.name}</p>
            <p className="text-[10px] text-[#5f6368]">{entry.sp.toLocaleString()} SP</p>
          </div>
        ))}
      </div>

      {/* Rank List */}
      <div className="space-y-1">
        {LEADERBOARD.map((entry) => (
          <div key={entry.rank}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all",
              entry.isYou && "bg-[#e8f5e9] border-l-2 border-l-[#006d37]",
            )}
          >
            <span className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-bold",
              entry.rank === 1 ? "bg-[#fef7e0] text-[#735c00]" :
              entry.rank === 2 ? "bg-[#f1f3f4] text-[#5f6368]" :
              entry.rank === 3 ? "bg-[#e8f5e9] text-[#006d37]" :
              "text-[#5f6368]",
            )}>
              {entry.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#020304]">{entry.name}</span>
                {entry.isYou && <span className="text-[10px] text-[#006d37] font-medium">(You)</span>}
              </div>
              <p className="text-[10px] text-[#5f6368]">{entry.title}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#5f6368]">
              <Award className="size-3" />
              <span>{entry.achievements}</span>
            </div>
            <span className="text-sm font-bold text-[#020304]">{entry.sp.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
