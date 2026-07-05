"use client";

import { useState } from "react";
import {
  MessageSquare, ThumbsUp, MessageCircle, TrendingUp, Search,
  Plus, User, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const THREADS = [
  { id: 1, title: "How does the Equalization Fund work?", category: "Budget Basics", upvotes: 24, comments: 12, author: "Sarah K.", badge: "Expert", time: "2h ago" },
  { id: 2, title: "Why is debt service such a large portion of the budget?", category: "Fiscal Policy", upvotes: 89, comments: 45, author: "James W.", badge: "Scholar", time: "5h ago" },
  { id: 3, title: "My county only received KES 8B — is that fair?", category: "County Governance", upvotes: 56, comments: 28, author: "Grace M.", badge: "Contributor", time: "1d ago" },
  { id: 4, title: "Tips for attending a public participation forum", category: "Civic Engagement", upvotes: 42, comments: 18, author: "Peter K.", badge: "Expert", time: "2d ago" },
  { id: 5, title: "What happens in a Supplementary Budget?", category: "Budget Basics", upvotes: 31, comments: 9, author: "Amina H.", badge: "Learner", time: "3d ago" },
];

const CATEGORIES = ["All Discussions", "Budget Basics", "Fiscal Policy", "County Governance", "Civic Engagement"];

export default function BudgetForumPage() {
  const [category, setCategory] = useState("All Discussions");
  const [search, setSearch] = useState("");

  const filtered = THREADS.filter((t) =>
    (category === "All Discussions" || t.category === category) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#020304]">Community</h1>
          <p className="mt-0.5 text-sm text-[#5f6368]">Discuss, ask, and learn together</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#006d37] px-3.5 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]">
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">New Thread</span>
        </button>
      </div>

      {/* Categories */}
      <div className="mb-4 flex gap-1 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              category === c ? "bg-[#006d37] text-white" : "bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e1e4e8]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5f6368]" />
        <input
          placeholder="Search discussions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#e1e4e8] bg-white py-2.5 pl-9 pr-4 text-sm text-[#020304] outline-none placeholder:text-[#5f6368] focus:border-[#006d37]/40"
        />
      </div>

      {/* Thread List */}
      <div className="space-y-2">
        {filtered.map((thread) => (
          <div key={thread.id}
            className="group rounded-xl border border-[#e1e4e8] bg-white p-4 transition-all hover:border-[#006d37]/20 hover:shadow-sm cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-0.5 min-w-[32px]">
                <ThumbsUp className="size-3.5 text-[#5f6368] group-hover:text-[#006d37]" />
                <span className="text-xs font-medium text-[#5f6368]">{thread.upvotes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] font-medium text-[#5f6368]">{thread.category}</span>
                  <Badge label={thread.badge} />
                </div>
                <p className="text-sm font-semibold text-[#020304] group-hover:text-[#006d37] transition-colors">{thread.title}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#5f6368]">
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {thread.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" />
                    {thread.comments}
                  </span>
                  <span>{thread.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Expert: "bg-[#fef7e0] text-[#735c00]",
    Scholar: "bg-[#e8f5e9] text-[#006d37]",
    Contributor: "bg-[#eff6ff] text-[#3b82f6]",
    Learner: "bg-[#f1f3f4] text-[#5f6368]",
  };
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium", colors[label] ?? colors.Learner)}>
      <Award className="size-2.5" />
      {label}
    </span>
  );
}
