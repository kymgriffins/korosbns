"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Play, FileText, CheckCircle2,
  Clock, ChevronRight, MessageSquare, BookmarkPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MODULE_DATA: Record<string, { title: string; category: string; duration: string; lessons: { title: string; type: "video" | "text" | "quiz"; duration: string; completed?: boolean }[] }> = {
  "budget-basics": {
    title: "Understanding the National Budget",
    category: "Budget Basics",
    duration: "45 min",
    lessons: [
      { title: "What is a National Budget?", type: "video", duration: "8:30", completed: true },
      { title: "Why Budgets Matter to You", type: "text", duration: "10 min read", completed: true },
      { title: "Key Components of the Budget", type: "video", duration: "12:15", completed: true },
      { title: "Knowledge Check", type: "quiz", duration: "5 min", completed: false },
    ],
  },
  "budget-cycle": {
    title: "The Budget Cycle",
    category: "Budget Basics",
    duration: "30 min",
    lessons: [
      { title: "Formulation Phase", type: "video", duration: "6:45", completed: false },
      { title: "Approval Phase", type: "video", duration: "7:30", completed: false },
      { title: "Implementation Phase", type: "text", duration: "8 min read", completed: false },
      { title: "Audit & Oversight", type: "text", duration: "6 min read", completed: false },
    ],
  },
  "county-governance": {
    title: "How County Governments Work",
    category: "County Governance",
    duration: "40 min",
    lessons: [
      { title: "Devolution in Kenya", type: "video", duration: "10:00", completed: true },
      { title: "County Revenue Sources", type: "text", duration: "8 min read", completed: true },
      { title: "County Budget Process", type: "video", duration: "12:30", completed: false },
      { title: "Your Role as a Citizen", type: "text", duration: "6 min read", completed: false },
      { title: "County Governance Quiz", type: "quiz", duration: "5 min", completed: false },
    ],
  },
  "public-participation": {
    title: "Your Role in Budget Making",
    category: "Public Participation",
    duration: "35 min",
    lessons: [
      { title: "Why Public Participation Matters", type: "video", duration: "8:15", completed: true },
      { title: "How to Submit Your Views", type: "text", duration: "10 min read", completed: false },
      { title: "Making Your Voice Count", type: "quiz", duration: "5 min", completed: false },
    ],
  },
  "revenue": {
    title: "Where Does the Money Come From?",
    category: "Budget Basics",
    duration: "25 min",
    lessons: [
      { title: "Tax Revenue in Kenya", type: "video", duration: "9:00", completed: false },
      { title: "Grants and Borrowing", type: "text", duration: "8 min read", completed: false },
      { title: "Revenue Quiz", type: "quiz", duration: "5 min", completed: false },
    ],
  },
};

export default function BudgetModulePage() {
  const params = useParams();
  const slug = params.slug as string;
  const mod = MODULE_DATA[slug];

  if (!mod) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <BookOpen className="mx-auto mb-3 size-8 text-[#5f6368]/40" />
        <p className="text-sm text-[#5f6368]">Module not found</p>
        <Link href="/budget/learn" className="mt-3 inline-flex items-center gap-1 text-xs text-[#006d37] hover:underline">
          <ArrowLeft className="size-3" /> Back to Learn
        </Link>
      </div>
    );
  }

  const progress = Math.round(mod.lessons.filter((l) => l.completed).length / mod.lessons.length * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <Link href="/budget/learn"
        className="mb-4 inline-flex items-center gap-1 text-xs text-[#5f6368] hover:text-[#020304]"
      >
        <ArrowLeft className="size-3" /> Back to Learn
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded bg-[#f1f3f4] px-2 py-0.5 text-[10px] font-medium text-[#5f6368]">{mod.category}</span>
          <span className="flex items-center gap-1 text-[10px] text-[#5f6368]"><Clock className="size-3" />{mod.duration}</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-[#020304]">{mod.title}</h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e1e4e8]">
            <div className="h-full rounded-full bg-[#006d37]" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-[#006d37]">{progress}%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {mod.lessons.map((lesson, i) => (
          <div key={i}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3.5 transition-all cursor-pointer active:scale-[0.98]",
              lesson.completed ? "border-[#006d37]/20 bg-[#e8f5e9]" : "border-[#e1e4e8] bg-white hover:border-[#006d37]/30",
            )}
          >
            <div className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              lesson.type === "video" ? "bg-[#e8f5e9]" : lesson.type === "text" ? "bg-[#f1f3f4]" : "bg-[#fef7e0]",
            )}>
              {lesson.type === "video" ? <Play className="size-3.5 text-[#006d37]" /> :
               lesson.type === "text" ? <FileText className="size-3.5 text-[#5f6368]" /> :
               <CheckCircle2 className="size-3.5 text-[#735c00]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", lesson.completed ? "text-[#006d37]" : "text-[#020304]")}>
                {i + 1}. {lesson.title}
              </p>
              <p className="text-[10px] text-[#5f6368] capitalize">{lesson.type} · {lesson.duration}</p>
            </div>
            {lesson.completed ? (
              <CheckCircle2 className="size-4 text-[#006d37]" />
            ) : (
              <ChevronRight className="size-4 text-[#5f6368]" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#006d37] px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]">
          <BookmarkPlus className="size-3.5" /> Save for Later
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#e1e4e8] bg-white px-4 py-2 text-xs font-semibold text-[#020304] transition-all active:scale-[0.98]">
          <MessageSquare className="size-3.5" /> Discussion
        </button>
      </div>
    </div>
  );
}
