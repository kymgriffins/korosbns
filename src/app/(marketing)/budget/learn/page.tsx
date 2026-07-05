"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Video, FileText, Search, BookMarked,
  ChevronRight, Lock, Star, Zap, BookA, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    slug: "budget-basics", title: "Understanding the National Budget",
    desc: "Learn what the national budget is, why it matters, and how it affects you.",
    category: "Budget Basics", duration: "45 min", lessons: 4, progress: 72, difficulty: 1,
  },
  {
    slug: "budget-cycle", title: "The Budget Cycle: From Formulation to Audit",
    desc: "Follow the journey of the budget through its four key phases.",
    category: "Budget Basics", duration: "30 min", lessons: 4, progress: 0, difficulty: 1,
  },
  {
    slug: "county-governance", title: "How County Governments Work",
    desc: "Understand the role of counties in Kenya's devolved system of governance.",
    category: "County Governance", duration: "40 min", lessons: 5, progress: 34, difficulty: 2,
  },
  {
    slug: "public-participation", title: "Your Role in Budget Making",
    desc: "Learn how citizens can participate in the budget process.",
    category: "Public Participation", duration: "35 min", lessons: 3, progress: 8, difficulty: 2,
  },
  {
    slug: "revenue", title: "Where Does the Money Come From?",
    desc: "Explore Kenya's revenue streams — taxes, grants, and borrowing.",
    category: "Budget Basics", duration: "25 min", lessons: 3, progress: 0, difficulty: 1,
  },
  {
    slug: "sector-deep-dive", title: "Sector Spending Deep Dive",
    desc: "A closer look at how each sector is allocated and utilises funds.",
    category: "Advanced", duration: "50 min", lessons: 6, progress: 0, difficulty: 3, locked: true,
  },
];

const QUICK_LINKS = [
  { href: "/budget/learn/glossary", label: "Budget Glossary", icon: BookA, desc: "Bilingual EN/SW terms" },
  { href: "/budget/learn/videos", label: "Video Library", icon: Video, desc: "Budget explainers" },
  { href: "/budget/learn/documents", label: "Documentation Hub", icon: FileText, desc: "PDFs, guides, reports" },
];

export default function BudgetLearnPage() {
  const [search, setSearch] = useState("");

  const filtered = MODULES.filter((m) =>
    !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-[#020304]">Learn</h1>
        <p className="mt-0.5 text-sm text-[#5f6368]">Master Kenya&apos;s budget — from basics to deep dives</p>
      </div>

      {/* Quick Links Row */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-[#e1e4e8] bg-white p-3.5 text-center transition-all hover:border-[#006d37]/30 hover:bg-[#f1f3f4] active:scale-[0.98] sm:flex-row sm:text-left"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
                <Icon className="size-4.5 text-[#006d37]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#020304]">{link.label}</p>
                <p className="text-[10px] text-[#5f6368] hidden sm:block">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5f6368]" />
        <input
          placeholder="Search modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e1e4e8] bg-white py-2.5 pl-10 pr-4 text-sm text-[#020304] outline-none placeholder:text-[#5f6368] focus:border-[#006d37]/40"
        />
      </div>

      {/* Module Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mod) => (
          <Link key={mod.slug} href={mod.locked ? "#" : `/budget/learn/${mod.slug}`}
            className={cn(
              "group relative rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all",
              mod.locked ? "opacity-50 cursor-not-allowed" : "hover:border-[#006d37]/30 hover:shadow-sm active:scale-[0.98]",
            )}
          >
            {mod.locked && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-1">
                  <Lock className="size-5 text-[#5f6368]" />
                  <span className="text-[10px] font-medium text-[#5f6368]">Complete prerequisites</span>
                </div>
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#e8f5e9]">
                <GraduationCap className="size-4.5 text-[#006d37]" />
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star key={i} className={cn("size-3", i < mod.difficulty ? "fill-[#cea700] text-[#cea700]" : "text-[#e1e4e8]")} />
                ))}
              </div>
            </div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] font-medium text-[#5f6368]">{mod.category}</span>
              <span className="text-[10px] text-[#5f6368]">{mod.duration}</span>
            </div>
            <p className="text-sm font-semibold text-[#020304] mb-1">{mod.title}</p>
            <p className="text-[10px] text-[#5f6368] leading-relaxed mb-3">{mod.desc}</p>
            {mod.progress > 0 ? (
              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-[#006d37] font-medium">{mod.progress}% complete</span>
                  <span className="text-[#5f6368]">{mod.lessons} lessons</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#e1e4e8]">
                  <div className="h-full rounded-full bg-[#006d37] transition-all" style={{ width: `${mod.progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#006d37] font-medium group-hover:underline">{mod.locked ? "Locked" : "Start learning"}</span>
                <span className="text-[#5f6368]">{mod.lessons} lessons</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
