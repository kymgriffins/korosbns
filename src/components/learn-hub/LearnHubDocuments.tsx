"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, Search, X } from "lucide-react";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { contentData } from "@/data/content";
import type { DocumentType } from "@/constants/documents";

type DirectoryDoc = {
  id: string;
  title: string;
  description?: string;
  document_type?: DocumentType | string;
  file_url?: string;
  source_url?: string;
  fiscal_year?: number | string | null;
};

export function LearnHubDocuments() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [docs, setDocs] = useState<DirectoryDoc[]>([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await contentData.documents.fetchFromDirectory();
        if (!cancelled) {
          setDocs((result.documents ?? []) as DirectoryDoc[]);
          setOffline(Boolean(result.error));
        }
      } catch {
        if (!cancelled) setOffline(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const types = useMemo(
    () =>
      [...new Set(docs.map((d) => String(d.document_type ?? "Other")))].sort(),
    [docs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      if (typeFilter && String(d.document_type ?? "Other") !== typeFilter) return false;
      if (!q) return true;
      return (
        d.title?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
      );
    });
  }, [docs, query, typeFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageBreadcrumbs
        items={[{ label: "Learn", href: Routes.Learn }, { label: "Documents" }]}
      />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Learn · Documents
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Budget documents, tracked
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {filtered.length} documents · commentaries and public finance files
            from the official repository.
          </p>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to Learn
        </Link>
      </div>

      <div className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="h-11 w-full rounded-full border border-border/60 bg-card pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <label className="shrink-0">
          <span className="sr-only">Filter by document type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by document type"
            className="h-11 rounded-full border border-border/60 bg-card px-4 text-sm font-semibold outline-none focus:border-primary/60"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((doc) => {
            const href = doc.file_url ?? doc.source_url ?? "/learn/documents";
            const external = href.startsWith("http");
            return (
              <li
                key={doc.id}
                className="group flex gap-4 rounded-2xl border border-border/40 bg-card p-5 transition-colors hover:border-primary/50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {String(doc.document_type ?? "Document")}
                    {doc.fiscal_year ? ` · FY ${doc.fiscal_year}` : ""}
                  </p>
                  <h2 className="mt-1 line-clamp-2 font-bold leading-snug">
                    {doc.title}
                  </h2>
                  {doc.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {doc.description}
                    </p>
                  ) : null}
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline"
                  >
                    Open document <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-border/40 bg-card p-8 text-center">
          <p className="font-bold">
            {offline
              ? "The document repository is unreachable"
              : "No documents match your search"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {offline
              ? "You're offline or the repository is down. The reports library is the best next stop."
              : "Try a different search — or browse the full reports library."}
          </p>
          <Link
            href="/reports"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Open reports library <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
