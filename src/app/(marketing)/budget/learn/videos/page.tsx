"use client";

import { Play, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

const VIDEOS = [
  { title: "Understanding the National Budget", duration: "8:30", module: "Budget Basics", id: "budget-basics" },
  { title: "The Budget Cycle Explained", duration: "14:15", module: "Budget Cycle", id: "budget-cycle" },
  { title: "How County Governments Work", duration: "10:00", module: "County Governance", id: "county-governance" },
  { title: "Public Participation in Budget Making", duration: "8:15", module: "Public Participation", id: "public-participation" },
  { title: "Kenya's Revenue Streams", duration: "9:00", module: "Revenue", id: "revenue" },
];

export default function BudgetVideosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-1 text-xl font-bold tracking-tight text-[#020304]">Video Library</h1>
      <p className="mb-5 text-sm text-[#5f6368]">Budget explainers and tutorials</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {VIDEOS.map((v) => (
          <Link key={v.id} href={`/budget/learn/${v.id}`}
            className="group rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all hover:border-[#006d37]/30 active:scale-[0.98]"
          >
            <div className="relative mb-3 flex aspect-video items-center justify-center rounded-lg bg-[#f1f3f4]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#006d37]/90 transition-transform group-hover:scale-110">
                <Play className="size-4 text-white ml-0.5" />
              </div>
            </div>
            <p className="text-sm font-semibold text-[#020304]">{v.title}</p>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-[#5f6368]">
              <Clock className="size-3" />{v.duration}
              <span>·</span>
              <BookOpen className="size-3" />{v.module}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
