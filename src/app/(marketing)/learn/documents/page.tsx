"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, FileText, Loader2, Calendar, Filter, X, Building2, FileType } from "lucide-react";
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

function formatSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "\u2014";
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

function filterBar({
  docTypes,
  years,
  selectedType,
  selectedYear,
  selectedCounty,
  onTypeChange,
  onYearChange,
  onCountyChange,
  onClear,
}: {
  docTypes: string[];
  years: number[];
  selectedType: string;
  selectedYear: number | null;
  selectedCounty: string;
  onTypeChange: (v: string) => void;
  onYearChange: (v: number | null) => void;
  onCountyChange: (v: string) => void;
  onClear: () => void;
}) {
  const hasFilters = selectedType || selectedYear !== null || selectedCounty;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Filter className="size-4 text-muted-foreground" />
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">All Types</option>
        {docTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={selectedYear ?? ""}
        onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value, 10) : null)}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>FY {y - 1}/{String(y).slice(-2)}</option>
        ))}
      </select>
      <select
        value={selectedCounty}
        onChange={(e) => onCountyChange(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">All Counties</option>
        {COUNTIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3" />
          Clear
        </button>
      )}
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
            <span className="text-[10px] font-medium text-muted-foreground">{formatSize(doc.size)}</span>
          )}
        </div>
      </div>
    </div>
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
    if (selectedType) {
      result = result.filter((d) => d.docType?.toLowerCase().includes(selectedType.toLowerCase()));
    }
    if (selectedYear) {
      result = result.filter((d) => d.year === selectedYear);
    }
    if (selectedCounty) {
      result = result.filter((d) => d.county?.toLowerCase() === selectedCounty.toLowerCase());
    }
    return result;
  }, [flatDocs, selectedType, selectedYear, selectedCounty]);

  const dailyQuest = useMemo(() => {
    const fromSummary = summary?.trending?.find((t) => t.content_type === "quest");
    return fromSummary ?? items.find((i) => i.content_type === "quest") ?? null;
  }, [summary, items]);

  const busy = loading || repoLoading;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Official statutory publications and government source links.
        </p>

        {error ? <p className="mt-4 text-destructive">{error}</p> : null}

        {!busy && (
          filterBar({
            docTypes: availableDocTypes,
            years: availableYears,
            selectedType,
            selectedYear,
            selectedCounty,
            onTypeChange: setSelectedType,
            onYearChange: setSelectedYear,
            onCountyChange: setSelectedCounty,
            onClear: () => {
              setSelectedType("");
              setSelectedYear(null);
              setSelectedCounty("");
            },
          })
        )}

        <div className="mt-6 space-y-4">
          {busy ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
              {selectedType || selectedYear || selectedCounty
                ? "No documents match your filters."
                : q
                  ? "No documents matching search."
                  : "No documents published yet."}
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">{filtered.length} document{filtered.length !== 1 ? "s" : ""}</p>
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </>
          )}
        </div>
      </div>

      <LearnSidebar trending={summary?.trending ?? []} dailyQuest={dailyQuest} />
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
