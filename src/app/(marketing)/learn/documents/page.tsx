"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ExternalLink, FileText, Loader2, Calendar, Filter, X, Building2, FileType,
  Search, ArrowUpDown, LayoutGrid, List, ChevronLeft, ChevronRight,
  BookOpen, BarChart3, Download
} from "lucide-react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { learnHubApi } from "@/lib/learn-hub";
import { LearnSidebar } from "@/components/learn/learn-sidebar";
import { useLearnSummary } from "@/components/learn/learn-tab-page";
import { trackAnalytics } from "@/lib/gamification";
import { cn } from "@/utils";
import { COUNTIES } from "@/constants/counties";
import { fetchDocumentsFromAPI, type DocumentType, extractPrefixFromFolderName } from "@/constants/documents";

const DOC_TYPES = [
  { value: "", label: "All Types" },
  { value: "PBB", label: "Programme-Based Budgeting" },
  { value: "ADP", label: "Annual Development Plan" },
  { value: "CBR", label: "County Budget Reviews" },
  { value: "BPS", label: "Budget Policy Statement" },
  { value: "BROP", label: "Budget Review & Outlook Papers" },
  { value: "CFA", label: "Controller & Auditor General" },
  { value: "CFSP", label: "County Fiscal Strategy Papers" },
  { value: "APP ACT", label: "Appropriation Act" },
  { value: "FB", label: "Fiscal Budget" },
  { value: "AGR", label: "Agriculture" },
  { value: "ERE", label: "Economic Recovery Expenditure" },
  { value: "CIDP", label: "County Integrated Development Plans" },
];

type SortKey = "title-asc" | "title-desc" | "year-desc" | "year-asc" | "size-desc" | "size-asc";
type ViewMode = "card" | "table";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "year-desc", label: "Year (Newest)" },
  { value: "year-asc", label: "Year (Oldest)" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "size-desc", label: "Size (Largest)" },
  { value: "size-asc", label: "Size (Smallest)" },
];

const ITEMS_PER_PAGE = 20;

function extractYearFromName(name: string): number | null {
  const match = name.match(/\b(20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  const fyMatch = name.match(/(?:^|\s)FY\s*(\d{4})[-/](\d{2,4})/i);
  if (fyMatch) return parseInt(fyMatch[2].length === 2 ? `20${fyMatch[2]}` : fyMatch[2], 10);
  return null;
}

function extractCountyFromName(name: string, folderName: string): string | null {
  const combined = `${name} ${folderName}`;
  for (const county of COUNTIES) {
    if (combined.toLowerCase().includes(county.toLowerCase())) {
      return county;
    }
  }
  return null;
}

function getDocTypeFromFolder(folderName: string): string | null {
  const prefix = extractPrefixFromFolderName(folderName);
  return prefix || folderName.trim();
}

function formatSize(bytes: number | null | undefined): string {
  if (bytes == null) return "\u2014";
  if (bytes > 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes > 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

type FlatDoc = {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  year: number | null;
  county: string | null;
  docType: string | null;
  size?: number | null;
  source: "learn" | "repository";
};

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors">
        <X className="size-2.5" />
      </button>
    </span>
  );
}

function DocumentsContent() {
  const summary = useLearnSummary();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState<LearnHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [repoDocs, setRepoDocs] = useState<DocumentType[]>([]);
  const [repoLoading, setRepoLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("year-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(q);

  const load = useCallback(() => {
    setLoading(true);
    return learnHubApi.documents({ search: q || undefined })
      .then((data) => setItems(data.results))
      .catch(() => setError("Could not load documents."))
      .finally(() => setLoading(false));
  }, [q]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { void trackAnalytics("learn_list_view", { tab: "documents" }); }, []);

  useEffect(() => {
    fetchDocumentsFromAPI().then((result) => {
      if (result.documents) {
        setRepoDocs(result.documents);
      }
      setRepoLoading(false);
    });
  }, []);

  const flatDocs = useMemo(() => {
    const docs: FlatDoc[] = [];

    for (const item of items) {
      const year = item.fiscal_year ?? null;
      let county: string | null = null;
      let docType: string | null = null;
      for (const tag of item.tags ?? []) {
        const name = tag.name ?? tag.slug ?? "";
        if (COUNTIES.some((c) => c.toLowerCase() === name.toLowerCase())) {
          county = name;
        }
      }
      docs.push({
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: item.url,
        year,
        county,
        docType,
        source: "learn",
      });
    }

    for (const doc of repoDocs) {
      const typeLabel = getDocTypeFromFolder(doc.folderName);
      for (const f of doc.files) {
        const year = extractYearFromName(f.name);
        const county = extractCountyFromName(f.name, doc.folderName);
        const title = f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        docs.push({
          id: `${doc.id}-${f.name}`,
          title,
          url: f.url,
          year,
          county,
          docType: typeLabel || doc.title,
          size: f.size,
          source: "repository",
        });
      }
    }

    return docs;
  }, [items, repoDocs]);

  const availableDocTypes = useMemo(() => {
    const types = new Set<string>();
    for (const item of items) {
      for (const tag of item.tags ?? []) {
        const name = tag.name ?? tag.slug ?? "";
        if (DOC_TYPES.some((dt) => dt.value.toLowerCase() === name.toLowerCase())) {
          types.add(name);
        }
      }
    }
    for (const doc of repoDocs) {
      const t = getDocTypeFromFolder(doc.folderName);
      if (t) types.add(t);
    }
    return Array.from(types).sort();
  }, [items, repoDocs]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const item of items) {
      if (item.fiscal_year) years.add(item.fiscal_year);
    }
    for (const doc of repoDocs) {
      for (const f of doc.files) {
        const y = extractYearFromName(f.name);
        if (y) years.add(y);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [items, repoDocs]);

  const filtered = useMemo(() => {
    let result = flatDocs;

    if (searchQuery.trim()) {
      const sq = searchQuery.toLowerCase();
      result = result.filter((d) =>
        d.title.toLowerCase().includes(sq) ||
        (d.summary && d.summary.toLowerCase().includes(sq)) ||
        (d.docType && d.docType.toLowerCase().includes(sq)) ||
        (d.county && d.county.toLowerCase().includes(sq))
      );
    }

    if (selectedType) {
      result = result.filter((d) => d.docType?.toLowerCase().includes(selectedType.toLowerCase()));
    }
    if (selectedYear) {
      result = result.filter((d) => d.year === selectedYear);
    }
    if (selectedCounty) {
      result = result.filter((d) => d.county?.toLowerCase() === selectedCounty.toLowerCase());
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "year-asc": return (a.year ?? 0) - (b.year ?? 0);
        case "year-desc": return (b.year ?? 0) - (a.year ?? 0);
        case "size-asc": return (a.size ?? 0) - (b.size ?? 0);
        case "size-desc": return (b.size ?? 0) - (a.size ?? 0);
        default: return 0;
      }
    });

    return result;
  }, [flatDocs, selectedType, selectedYear, selectedCounty, sortKey, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => { setPage(1); }, [selectedType, selectedYear, selectedCounty, searchQuery, sortKey]);

  const hasActiveFilters = selectedType || selectedYear !== null || selectedCounty || searchQuery.trim();

  const clearAllFilters = () => {
    setSelectedType("");
    setSelectedYear(null);
    setSelectedCounty("");
    setSearchQuery("");
  };

  const stats = useMemo(() => {
    const byType = new Map<string, number>();
    const byCounty = new Map<string, number>();
    const byYear = new Map<number, number>();
    let withYears = 0;
    let withCounty = 0;

    for (const doc of flatDocs) {
      if (doc.docType) byType.set(doc.docType, (byType.get(doc.docType) ?? 0) + 1);
      if (doc.county) {
        byCounty.set(doc.county, (byCounty.get(doc.county) ?? 0) + 1);
        withCounty++;
      }
      if (doc.year) {
        byYear.set(doc.year, (byYear.get(doc.year) ?? 0) + 1);
        withYears++;
      }
    }

    return { total: flatDocs.length, byType, byCounty, byYear, withYears, withCounty };
  }, [flatDocs]);

  const dailyQuest = useMemo(() => {
    const fromSummary = summary?.trending?.find((t) => t.content_type === "quest");
    return fromSummary ?? items.find((i) => i.content_type === "quest") ?? null;
  }, [summary, items]);

  const busy = loading || repoLoading;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Document Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Official statutory publications, budget documents, and government source links.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        {!busy && stats.total > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
              <FileText className="size-3.5 text-primary" />
              <span className="text-xs font-semibold">{stats.total} documents</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
              <BarChart3 className="size-3.5 text-primary" />
              <span className="text-xs font-semibold">{stats.byType.size} types</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
              <Building2 className="size-3.5 text-blue-500" />
              <span className="text-xs font-semibold">{stats.byCounty.size} counties</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold">{stats.byYear.size} fiscal years</span>
            </div>
          </div>
        )}

        {error ? <p className="mt-4 text-destructive">{error}</p> : null}

        {!busy && (
          <>
            {/* Search + Sort + View controls */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="size-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">All Types</option>
                  {availableDocTypes.map((t) => (
                    <option key={t} value={t}>{t} ({stats.byType.get(t) ?? 0})</option>
                  ))}
                </select>
                <select
                  value={selectedYear ?? ""}
                  onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">All Years</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>FY {y - 1}/{String(y).slice(-2)} ({stats.byYear.get(y) ?? 0})</option>
                  ))}
                </select>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">All Counties</option>
                  {COUNTIES.map((c) => (
                    <option key={c} value={c}>{c} ({stats.byCounty.get(c) ?? 0})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center border border-border rounded-lg overflow-hidden ml-1">
                  <button
                    onClick={() => setViewMode("card")}
                    className={cn("p-1.5 transition-colors", viewMode === "card" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                    title="Card view"
                  >
                    <LayoutGrid className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={cn("p-1.5 transition-colors", viewMode === "table" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                    title="Table view"
                  >
                    <List className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 min-h-[28px]">
              {selectedType && (
                <FilterChip label={`Type: ${selectedType}`} onRemove={() => setSelectedType("")} />
              )}
              {selectedYear && (
                <FilterChip label={`FY ${selectedYear - 1}/${String(selectedYear).slice(-2)}`} onRemove={() => setSelectedYear(null)} />
              )}
              {selectedCounty && (
                <FilterChip label={`County: ${selectedCounty}`} onRemove={() => setSelectedCounty("")} />
              )}
              {searchQuery.trim() && (
                <FilterChip label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery("")} />
              )}
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  <X className="size-2.5" />
                  Clear all
                </button>
              )}
            </div>
          </>
        )}

        {/* Results */}
        <div className="mt-4">
          {busy ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-12 text-center">
              <BookOpen className="size-10 mx-auto text-muted-foreground/30" />
              <p className="mt-3 text-sm font-semibold text-foreground">No documents found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query."
                  : q
                    ? "No documents matching search."
                    : "No documents published yet."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="mt-4 text-xs font-semibold text-primary hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  {filtered.length} document{filtered.length !== 1 ? "s" : ""}
                  {filtered.length !== stats.total && (
                    <span className="text-muted-foreground/60"> (filtered from {stats.total})</span>
                  )}
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Page {safePage} of {totalPages}
                  </p>
                )}
              </div>

              {viewMode === "card" ? (
                <div className="space-y-3">
                  {paginated.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Type</th>
                        <th className="px-4 py-3 hidden md:table-cell">County</th>
                        <th className="px-4 py-3 hidden md:table-cell">Year</th>
                        <th className="px-4 py-3 hidden lg:table-cell">Size</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs">
                      {paginated.map((doc) => (
                        <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="size-4 shrink-0 text-primary" />
                              <div className="min-w-0">
                                <p className="font-semibold truncate max-w-[200px] lg:max-w-[300px]">{doc.title}</p>
                                {doc.summary && (
                                  <p className="text-[10px] text-muted-foreground truncate max-w-[200px] lg:max-w-[300px]">{doc.summary}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {doc.docType && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                {doc.docType}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {doc.county && (
                              <span className="text-muted-foreground">{doc.county}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {doc.year && (
                              <span className="text-muted-foreground">FY {doc.year - 1}/{String(doc.year).slice(-2)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-[10px]">
                            {formatSize(doc.size)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {doc.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[10px] font-semibold transition-colors hover:bg-muted"
                                title="Open document"
                              >
                                Open
                                <ExternalLink className="size-3" />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                      safePage <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-muted"
                    )}
                  >
                    <ChevronLeft className="size-3" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (safePage <= 4) {
                        pageNum = i + 1;
                      } else if (safePage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = safePage - 3 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={cn(
                            "size-7 rounded-lg text-xs font-semibold transition-colors",
                            safePage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                      safePage >= totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-muted"
                    )}
                  >
                    Next
                    <ChevronRight className="size-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <LearnSidebar trending={summary?.trending ?? []} dailyQuest={dailyQuest} />
    </div>
  );
}

function DocumentCard({ doc }: { doc: FlatDoc }) {
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
              Open
              <ExternalLink className="size-3" />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {doc.docType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <FileType className="size-3" />
              {doc.docType}
            </span>
          )}
          {doc.year && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              <Calendar className="size-3" />
              FY {doc.year - 1}/{String(doc.year).slice(-2)}
            </span>
          )}
          {doc.county && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/5 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
              <Building2 className="size-3" />
              {doc.county}
            </span>
          )}
          {doc.source === "repository" && doc.size != null && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Download className="size-3" />
              {formatSize(doc.size)}
            </span>
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
