"use client";

import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Search, Folder, FileText, Database, ArrowLeft, Download, ExternalLink, Loader2,
  Filter, X, Calendar, Building2, LayoutGrid, List, ChevronLeft, ChevronRight,
  RefreshCw, BarChart3, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BitmojiAvatar } from "@/components/learn/bitmoji-avatar";
import { StudioPageHeader } from "../components/studio-page-header";
import { DocumentsStack } from "../illustrations/documents-stack";
import { type DocumentType, type DocumentFile, extractPrefixFromFolderName } from "@/constants/documents";
import { useLearnDocuments } from "@/hooks/use-documents";
import { COUNTIES } from "@/constants/counties";

type TabFilter = "all" | "tracked" | "commentaries";
type SortKey = "name-asc" | "name-desc" | "size-desc" | "size-asc" | "date-desc" | "date-asc";
type ViewMode = "card" | "table";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "size-desc", label: "Size (Largest)" },
  { value: "size-asc", label: "Size (Smallest)" },
  { value: "date-desc", label: "Date (Newest)" },
  { value: "date-asc", label: "Date (Oldest)" },
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "\u2014";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  if (!timestamp) return "\u2014";
  return new Date(timestamp * 1000).toLocaleDateString();
}

type FlatFile = {
  id: string;
  name: string;
  size: number;
  url: string;
  downloadUrl: string;
  modified: number;
  folderName: string;
  docType: string | null;
  year: number | null;
  county: string | null;
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

export function LearnDocumentsView({ profile }: { profile: any }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useLearnDocuments();
  const [refreshing, setRefreshing] = useState(false);
  const documents = data?.documents ?? [];
  const loading = isLoading;
  const error = data?.error ?? (isError ? "The document repository is temporarily unavailable. Please try again later." : null);
  const [selectedFolder, setSelectedFolder] = useState<DocumentType | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // These only apply inside a folder view
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [selectedYear, selectedCounty, searchQuery, sortKey]);

  const trackedFiles: DocumentFile[] = useMemo(() => {
    return (profile?.trackedDocs || []).map((doc: any, i: number) => ({
      name: typeof doc === "string" ? doc : doc.name,
      size: 0,
      url: "#",
      downloadUrl: "#",
      modified: Date.now() / 1000,
    }));
  }, [profile?.trackedDocs]);

  const commentaryFiles: DocumentFile[] = useMemo(() => {
    return (profile?.participationLogs || []).map((log: any) => ({
      name: log.documentName || "Draft Memorandum",
      size: 0,
      url: "#",
      downloadUrl: "#",
      modified: new Date(log.dateSubmitted).getTime() / 1000,
    }));
  }, [profile?.participationLogs]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.fullName.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  const folderFiles = useMemo(() => {
    if (!selectedFolder) return [];
    let files = selectedFolder.files;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      files = files.filter((f) => f.name.toLowerCase().includes(q));
    }
    files.sort((a, b) => {
      switch (sortKey) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "size-desc": return b.size - a.size;
        case "size-asc": return a.size - b.size;
        case "date-desc": return b.modified - a.modified;
        case "date-asc": return a.modified - b.modified;
        default: return 0;
      }
    });
    return files;
  }, [selectedFolder, searchQuery, sortKey]);

  // Flat file list for the current folder, used for filtering/pagination
  const currentFolderFlatFiles = useMemo(() => {
    if (!selectedFolder) return [];
    const typeLabel = extractPrefixFromFolderName(selectedFolder.folderName);
    const files: FlatFile[] = selectedFolder.files.map((f) => ({
      id: `${selectedFolder.id}-${f.name}`,
      name: f.name,
      size: f.size,
      url: f.url,
      downloadUrl: f.downloadUrl,
      modified: f.modified,
      folderName: selectedFolder.fullName,
      docType: typeLabel || selectedFolder.title,
      year: extractYearFromName(f.name),
      county: extractCountyFromName(f.name, selectedFolder.folderName),
    }));
    return files;
  }, [selectedFolder]);

  const folderYears = useMemo(() => {
    const years = new Set<number>();
    for (const f of currentFolderFlatFiles) {
      if (f.year) years.add(f.year);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [currentFolderFlatFiles]);

  const folderCounties = useMemo(() => {
    const counties = new Set<string>();
    for (const f of currentFolderFlatFiles) {
      if (f.county) counties.add(f.county);
    }
    return Array.from(counties).sort();
  }, [currentFolderFlatFiles]);

  const folderStats = useMemo(() => {
    const byCounty = new Map<string, number>();
    const byYear = new Map<number, number>();
    for (const f of currentFolderFlatFiles) {
      if (f.county) byCounty.set(f.county, (byCounty.get(f.county) ?? 0) + 1);
      if (f.year) byYear.set(f.year, (byYear.get(f.year) ?? 0) + 1);
    }
    return { total: currentFolderFlatFiles.length, byCounty, byYear };
  }, [currentFolderFlatFiles]);

  const filteredFiles = useMemo(() => {
    let files = currentFolderFlatFiles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      files = files.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        (f.docType && f.docType.toLowerCase().includes(q)) ||
        (f.county && f.county.toLowerCase().includes(q))
      );
    }

    if (selectedYear) {
      files = files.filter((f) => f.year === selectedYear);
    }
    if (selectedCounty) {
      files = files.filter((f) => f.county?.toLowerCase() === selectedCounty.toLowerCase());
    }

    files.sort((a, b) => {
      switch (sortKey) {
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "size-desc": return b.size - a.size;
        case "size-asc": return a.size - b.size;
        case "date-desc": return b.modified - a.modified;
        case "date-asc": return a.modified - b.modified;
        default: return 0;
      }
    });

    return files;
  }, [currentFolderFlatFiles, searchQuery, selectedYear, selectedCounty, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedFiles = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFiles, safePage]);

  const hasActiveFilters = selectedYear !== null || selectedCounty || searchQuery.trim();

  const clearAllFilters = () => {
    setSelectedYear(null);
    setSelectedCounty("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-3">
        <Loader2 className="size-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Loading document repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-3 p-6 text-center">
        <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto ring-1 ring-border/30">
          <Database className="size-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-bold text-foreground">Repository unavailable</p>
        <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {!selectedFolder ? (
        <div className="shrink-0 border-b border-border/40 px-4 py-4 md:px-6">
          <StudioPageHeader
            eyebrow="Repository"
            title="Documents"
            description="National and county budget documents, commentaries, and tracked files."
            illustration={<DocumentsStack className="hidden h-20 w-28 opacity-90 sm:block" />}
            actions={
              <button
                onClick={async () => {
                  setRefreshing(true);
                  try {
                    await queryClient.invalidateQueries({ queryKey: ["learn", "documents"] });
                  } finally {
                    setRefreshing(false);
                  }
                }}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/50"
              >
                <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            }
          />
        </div>
      ) : null}
      {selectedFolder ? (
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-4 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {selectedFolder ? (
            <button onClick={() => { setSelectedFolder(null); clearAllFilters(); }} className="-ml-1 shrink-0 rounded-lg p-1 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="size-4" />
            </button>
          ) : null}
          {selectedFolder ? (
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold leading-tight">
                {selectedFolder.fullName}
              </h1>
              <p className="text-[10px] font-medium text-muted-foreground">
                {folderFiles.length} file{folderFiles.length !== 1 ? "s" : ""}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedFolder && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-muted/40 border-0 rounded-lg text-xs w-28 md:w-44 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
          )}
          <div className="flex items-center gap-2 ml-1 md:ml-3 md:pl-3 md:border-l border-border/50">
            <button
              onClick={async () => { setRefreshing(true); try { await queryClient.invalidateQueries({ queryKey: ["learn-documents"] }); } finally { setRefreshing(false); } }}
              disabled={refreshing}
              className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              title="Refresh documents"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-7 rounded-full object-cover ring-1 ring-border/40" />
            ) : (
              <BitmojiAvatar gender={profile?.gender} size="sm" className="shrink-0" />
            )}
          </div>
        </div>
      </header>
      ) : null}

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-5">
        {!selectedFolder ? (
          <>
            <div className="flex items-center gap-0.5 bg-muted/30 p-0.5 rounded-lg w-fit ring-1 ring-border/30">
              {([
                { id: "all" as const, label: "Repository" },
                { id: "tracked" as const, label: "Tracked" },
                { id: "commentaries" as const, label: "My Drafts" },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all focus-visible:ring-2 focus-visible:ring-ring",
                    activeTab === tab.id ? "bg-card shadow-xs text-foreground ring-1 ring-border/30" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "all" && (
              <section className="space-y-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {filteredDocs.map((doc) => {
                    const yearRange = doc.years.length
                      ? `${doc.years[0]}–${doc.years[doc.years.length - 1]}`
                      : null;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedFolder(doc)}
                        className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-3.5 text-left ring-1 ring-border/40 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                            <Folder className="size-5 text-primary" />
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h3 className="truncate text-[13px] font-bold leading-tight">{doc.title}</h3>
                          <p className="truncate text-[10px] font-medium text-muted-foreground">{doc.fullName}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-bold text-muted-foreground ring-1 ring-border/30">
                            <FileText className="size-2.5" />
                            {doc.files.length} file{doc.files.length !== 1 ? "s" : ""}
                          </span>
                          {yearRange && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/5 px-2 py-0.5 text-[9px] font-bold text-blue-600 ring-1 ring-blue-500/20">
                              <Calendar className="size-2.5" />
                              {yearRange}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {filteredDocs.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <div className="size-10 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-2 ring-1 ring-border/30">
                        <Folder className="size-4 text-muted-foreground/40" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">No collections found.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "tracked" && (
              <section className="space-y-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tracked Documents</h2>
                {trackedFiles.length > 0 ? (
                  <FileList files={trackedFiles} />
                ) : (
                  <EmptyState message="No tracked documents yet. Complete a learning stage to start tracking." />
                )}
              </section>
            )}

            {activeTab === "commentaries" && (
              <section className="space-y-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">My Drafts</h2>
                {commentaryFiles.length > 0 ? (
                  <FileList files={commentaryFiles} />
                ) : (
                  <EmptyState message="No drafts submitted yet. Complete a learning stage to draft a memorandum." />
                )}
              </section>
            )}
          </>
        ) : (
          /* === INSIDE FOLDER — full document hub with filters, sort, view toggle, pagination, stats === */
          <section className="space-y-3">
            {/* Description */}
            <p className="text-[11px] text-muted-foreground">{selectedFolder.description}</p>

            {/* Stats */}
            {folderStats.total > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 ring-1 ring-border/30">
                  <FileText className="size-3.5 text-primary" />
                  <span className="text-xs font-semibold">{folderStats.total} files</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 ring-1 ring-border/30">
                  <Building2 className="size-3.5 text-blue-500" />
                  <span className="text-xs font-semibold">{folderStats.byCounty.size} counties</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 ring-1 ring-border/30">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold">{folderStats.byYear.size} fiscal years</span>
                </div>
              </div>
            )}

            {/* Filters + Sort + View toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Filter className="size-4 text-muted-foreground shrink-0" />
                {folderYears.length > 0 && (
                  <select
                    value={selectedYear ?? ""}
                    onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">All Years</option>
                    {folderYears.map((y) => (
                      <option key={y} value={y}>FY {y - 1}/{String(y).slice(-2)} ({folderStats.byYear.get(y) ?? 0})</option>
                    ))}
                  </select>
                )}
                {folderCounties.length > 0 && (
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">All Counties</option>
                    {folderCounties.map((c) => (
                      <option key={c} value={c}>{c} ({folderStats.byCounty.get(c) ?? 0})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex items-center border border-border rounded-lg overflow-hidden ring-1 ring-border/30">
                  <button
                    onClick={() => setViewMode("card")}
                    className={cn("p-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring", viewMode === "card" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                    title="Card view"
                  >
                    <LayoutGrid className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={cn("p-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring", viewMode === "table" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                    title="Table view"
                  >
                    <List className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
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

            {/* Result count + page info */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
                {filteredFiles.length !== folderStats.total && (
                  <span className="text-muted-foreground/60"> (filtered from {folderStats.total})</span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-xs text-muted-foreground">Page {safePage} of {totalPages}</p>
              )}
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto ring-1 ring-border/30">
                  <BookOpen className="size-5 text-muted-foreground/40" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">No files found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search query.</p>
                <button onClick={clearAllFilters} className="mt-4 text-xs font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring">Clear all filters</button>
              </div>
            ) : viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {paginatedFiles.map((file) => (
                  <div key={file.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 ring-1 ring-border/30">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold truncate max-w-[250px]">{file.name}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {file.url && file.url !== "#" && (
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Open">
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          {file.downloadUrl && file.downloadUrl !== "#" && (
                            <a href={file.downloadUrl} className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Download">
                              <Download className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {file.year && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground ring-1 ring-border/30">
                            <Calendar className="size-2.5" />
                            FY {file.year - 1}/{String(file.year).slice(-2)}
                          </span>
                        )}
                        {file.county && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/5 px-2 py-0.5 text-[9px] font-semibold text-blue-600 ring-1 ring-blue-500/20">
                            <Building2 className="size-2.5" />
                            {file.county}
                          </span>
                        )}
                        {file.size > 0 && (
                          <span className="text-[9px] font-medium text-muted-foreground">{formatBytes(file.size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card shadow-xs rounded-xl overflow-hidden ring-1 ring-border/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/30">
                      <th className="px-3 py-2.5">Name</th>
                      <th className="px-3 py-2.5 hidden md:table-cell">County</th>
                      <th className="px-3 py-2.5 hidden md:table-cell">Year</th>
                      <th className="px-3 py-2.5 hidden lg:table-cell">Size</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-xs">
                    {paginatedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-3.5 shrink-0 text-primary" />
                            <p className="font-semibold text-[11px] truncate max-w-[180px] lg:max-w-[280px]">{file.name}</p>
                          </div>
                        </td>
                        <td className="px-3 py-2 hidden md:table-cell text-muted-foreground text-[10px]">{file.county}</td>
                        <td className="px-3 py-2 hidden md:table-cell text-muted-foreground text-[10px]">
                          {file.year ? `FY ${file.year - 1}/${String(file.year).slice(-2)}` : ""}
                        </td>
                        <td className="px-3 py-2 hidden lg:table-cell text-muted-foreground text-[10px]">{formatBytes(file.size)}</td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {file.url && file.url !== "#" && (
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Open">
                                <ExternalLink className="size-3.5" />
                              </a>
                            )}
                            {file.downloadUrl && file.downloadUrl !== "#" && (
                              <a href={file.downloadUrl} className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Download">
                                <Download className="size-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className={cn("inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring", safePage <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-muted")}
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
                        className={cn("size-7 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring", safePage === pageNum ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className={cn("inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring", safePage >= totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-muted")}
                >
                  Next
                  <ChevronRight className="size-3" />
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function FileList({ files }: { files: DocumentFile[] }) {
  return (
    <>
      <div className="hidden md:block bg-card shadow-xs rounded-xl overflow-hidden ring-1 ring-border/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/30">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Modified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 text-xs">
            {files.map((file, idx) => (
              <tr key={idx} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-muted/30 p-1.5 rounded-lg shrink-0 ring-1 ring-border/30">
                      <FileText className="size-3.5 text-primary" />
                    </div>
                    <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{formatBytes(file.size)}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{formatDate(file.modified)}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {file.url && file.url !== "#" && (
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Open">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    {file.downloadUrl && file.downloadUrl !== "#" && (
                      <a href={file.downloadUrl} className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring" title="Download">
                        <Download className="size-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {files.map((file, idx) => (
          <div key={idx} className="bg-card shadow-xs rounded-xl p-3 flex items-center gap-3 ring-1 ring-border/30">
            <div className="bg-muted/30 p-1.5 rounded-lg shrink-0 ring-1 ring-border/30">
              <FileText className="size-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-[11px] truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {file.url && file.url !== "#" && (
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring">
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              {file.downloadUrl && file.downloadUrl !== "#" && (
                <a href={file.downloadUrl} className="p-1.5 hover:bg-muted/50 rounded-lg text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring">
                  <Download className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-2xl">
      <div className="size-10 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-2 ring-1 ring-border/30">
        <FileText className="size-4 text-muted-foreground/40" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}
