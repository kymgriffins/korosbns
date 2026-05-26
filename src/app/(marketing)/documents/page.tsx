"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Calendar, Loader2, Bookmark } from "lucide-react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { learnHubApi } from "@/lib/learn-hub";
import { cn } from "@/utils";

type DocCategory = {
  id: string;
  label: string;
  icon: string;
};

const CATEGORIES: DocCategory[] = [
  { id: "all", label: "All Documents", icon: "📄" },
  { id: "budget_policy_statement", label: "Budget Policy Statement", icon: "⚖️" },
  { id: "division_of_revenue_bill", label: "Division of Revenue Bill", icon: "💰" },
  { id: "finance_bill", label: "Finance Bill", icon: "🏛️" },
  { id: "county_allocation", label: "County Allocation", icon: "🏗️" },
  { id: "cfsp", label: "CFSP", icon: "📋" },
  { id: "cidp", label: "CIDP", icon: "🗺️" },
  { id: "adp", label: "ADP", icon: "📊" },
  { id: "cfa_crop", label: "CFA / CROP", icon: "📑" },
  { id: "cbr", label: "CBR", icon: "📈" },
  { id: "brop", label: "BROP", icon: "📉" },
  { id: "constitution", label: "Constitution", icon: "🛡️" },
];

function categorizeDoc(doc: LearnHubItem): string {
  const title = doc.title.toLowerCase();
  const tags = doc.tags?.map((t) => (t.name ?? t.slug ?? "").toLowerCase()) ?? [];

  if (tags.some((t) => t.includes("constitution")) || title.includes("constitution")) return "constitution";
  if (tags.some((t) => t.includes("budget_policy")) || title.includes("budget policy")) return "budget_policy_statement";
  if (tags.some((t) => t.includes("finance_bill")) || title.includes("finance bill")) return "finance_bill";
  if (tags.some((t) => t.includes("division_of_revenue")) || title.includes("division of revenue")) return "division_of_revenue_bill";
  if (tags.some((t) => t.includes("cfsp")) || title.includes("cfsp")) return "cfsp";
  if (tags.some((t) => t.includes("cidp")) || title.includes("cidp")) return "cidp";
  if (tags.some((t) => t.includes("adp")) || title.includes("adp")) return "adp";
  if (tags.some((t) => t.includes("cfa") || t.includes("crop")) || title.includes("cfa") || title.includes("crop")) return "cfa_crop";
  if (tags.some((t) => t.includes("cbr")) || title.includes("cbr")) return "cbr";
  if (tags.some((t) => t.includes("brop")) || title.includes("brop")) return "brop";
  return "county_allocation";
}

export default function DocumentsPage() {
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return learnHubApi.documents()
      .then((data) => setItems(data.results))
      .catch(() => setError("Could not load documents."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { void load(); }, [load]);

  const years = useMemo(() => {
    const y = new Set<number>();
    items.forEach((i) => { if (i.fiscal_year) y.add(i.fiscal_year); });
    return Array.from(y).sort((a, b) => b - a);
  }, [items]);

  const categorized = useMemo(() => {
    const map = new Map<string, LearnHubItem[]>();
    for (const doc of items) {
      const cat = categorizeDoc(doc);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(doc);
    }
    return map;
  }, [items]);

  const filteredDocs = useMemo(() => {
    let docs = activeCategory === "all" ? items : (categorized.get(activeCategory) ?? []);
    if (yearFilter) docs = docs.filter((d) => d.fiscal_year === yearFilter);
    return docs;
  }, [items, categorized, activeCategory, yearFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const [cat, docs] of categorized) counts[cat] = docs.length;
    return counts;
  }, [items, categorized]);

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">Document Repository</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Browse official Kenyan budget and statutory documents. Filter by category and year to find
            the publications you need — no account or course enrollment required.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Category Pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.id === "all" || (categorized.get(c.id)?.length ?? 0) > 0).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={cn(
                "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                activeCategory === cat.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {categoryCounts[cat.id] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Year Filter */}
        {years.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <button
              onClick={() => setYearFilter(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                !yearFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              All Years
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                  yearFilter === y ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                FY {y - 1}/{String(y).slice(-2)}
              </button>
            ))}
          </div>
        )}

        {/* Document Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center">
            <FileText className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">No documents found for this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ doc }: { doc: LearnHubItem }) {
  const cat = CATEGORIES.find((c) => c.id === categorizeDoc(doc));
  const yearLabel = doc.fiscal_year ? `FY ${doc.fiscal_year - 1}/${String(doc.fiscal_year).slice(-2)}` : null;

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg">
          {cat?.icon ?? "📄"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug">{doc.title}</h3>
          {doc.summary && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{doc.summary}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {yearLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            <Calendar className="size-3" />
            {yearLabel}
          </span>
        )}
        {cat && cat.id !== "all" && (
          <span className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {cat.label}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4">
        {doc.url ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-3.5" />
            Open Document
          </a>
        ) : (
          <span className="block rounded-lg border border-dashed border-border px-3 py-2 text-center text-[10px] text-muted-foreground">
            PDF not available
          </span>
        )}
      </div>
    </div>
  );
}
