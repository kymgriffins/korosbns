"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, FileText, Loader2, Calendar } from "lucide-react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { learnHubApi } from "@/lib/learn-hub";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { useLearnSummary } from "@/components/learn/learn-tab-page";
import { trackAnalytics } from "@/lib/gamification";
import { cn } from "@/utils";

function DocumentsContent() {
  const summary = useLearnSummary();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return learnHubApi.documents({ search: q || undefined })
      .then((data) => setItems(data.results))
      .catch(() => setError("Could not load documents."))
      .finally(() => setLoading(false));
  }, [q]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { void trackAnalytics("learn_list_view", { tab: "documents" }); }, []);

  const years = useMemo(() => {
    const y = new Set<number>();
    items.forEach((i) => { if (i.fiscal_year) y.add(i.fiscal_year); });
    return Array.from(y).sort((a, b) => b - a);
  }, [items]);

  const filtered = useMemo(() => {
    if (!yearFilter) return items;
    return items.filter((i) => i.fiscal_year === yearFilter);
  }, [items, yearFilter]);

  const dailyQuest = useMemo(() => {
    const fromSummary = summary?.trending?.find((t) => t.content_type === "quest");
    return fromSummary ?? items.find((i) => i.content_type === "quest") ?? null;
  }, [summary, items]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Official statutory publications and government source links.
        </p>

        {error ? <p className="mt-4 text-destructive">{error}</p> : null}

        {!loading && !error && years.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <button
              onClick={() => setYearFilter(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                !yearFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              All
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

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
              {q ? "No documents matching search." : "No documents published yet."}
            </p>
          ) : (
            filtered.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))
          )}
        </div>
      </div>

      <LearnSidebar trending={summary?.trending ?? []} dailyQuest={dailyQuest} />
    </div>
  );
}

function DocumentCard({ doc }: { doc: LearnHubItem }) {
  const open = () => {
    if (doc.url) window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <FileText className="size-6 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{doc.title}</h3>
            {doc.summary && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{doc.summary}</p>
            )}
          </div>
          {doc.url && (
            <button
              onClick={open}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
            >
              Open PDF
              <ExternalLink className="size-3" />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {doc.fiscal_year && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              <Calendar className="size-3" />
              FY {doc.fiscal_year - 1}/{String(doc.fiscal_year).slice(-2)}
            </span>
          )}
          {doc.tags?.slice(0, 3).map((t) => (
            <span
              key={t.slug ?? t.name}
              className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary"
            >
              {t.name ?? t.slug}
            </span>
          ))}
          {doc.difficulty && (
            <span className="text-[10px] font-medium text-muted-foreground">{doc.difficulty}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearnDocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <DocumentsContent />
    </Suspense>
  );
}
