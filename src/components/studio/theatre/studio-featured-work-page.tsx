"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, X, Filter } from "lucide-react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { EditorialPill, PillButton } from "@/components/ui/editorial";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";
import { resolveProjectId } from "@/lib/programme-project-ids";

function projectHref(slug: string) {
  const canonical = resolveProjectId(slug);
  if (canonical === "project-terra") {
    return "/bns-project/terra";
  }
  return `/bns-studio/${canonical}`;
}

const PROGRAMME_FILTERS = [
  { id: "", label: "All programmes" },
  { id: "connect", label: "BNS Connect" },
  { id: "mashinani", label: "BNS Mashinani" },
  { id: "wanahabari-lab", label: "Wanahabari Lab" },
  { id: "studios", label: "BNS Studio" },
];

function getProgrammeName(slug: string): string {
  switch (slug) {
    case "connect":
      return "BNS Connect";
    case "mashinani":
      return "BNS Mashinani";
    case "wanahabari":
    case "wanahabari-lab":
      return "Wanahabari Lab";
    case "studios":
      return "BNS Studio";
    default:
      return "Programme";
  }
}

export function StudioFeaturedWorkPage() {
  const projects = studiosEvidenceData.getAllProjects();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState("");
  const [format, setFormat] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState("");

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const programmeCounts = useMemo(() => {
    const counts: Record<string, number> = { "": projects.length };
    for (const p of projects) {
      counts[p.programmeSlug] = (counts[p.programmeSlug] || 0) + 1;
    }
    return counts;
  }, [projects]);

  const clients = useMemo(
    () =>
      [...new Set(projects.map((p) => p.organization.name))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [projects],
  );

  const years = useMemo(
    () => [...new Set(projects.map((p) => p.year))].sort((a, b) => b.localeCompare(a)),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (programme && project.programmeSlug !== programme) {
        return false;
      }
      if (format && project.contentType !== format) return false;
      if (client && project.organization.name !== client) return false;
      if (year && project.year !== year) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.subtitle,
        project.organization.name,
        project.contentType,
        getProgrammeName(project.programmeSlug),
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, programme, format, client, year]);

  const clearFilters = () => {
    setQuery("");
    setProgramme("");
    setFormat("");
    setClient("");
    setYear("");
  };

  const activeFilters = [
    programme ? { key: "programme", label: `Programme: ${getProgrammeName(programme)}`, clear: () => setProgramme("") } : null,
    format ? { key: "format", label: `Format: ${format}`, clear: () => setFormat("") } : null,
    client ? { key: "partner", label: `Partner: ${client}`, clear: () => setClient("") } : null,
    year ? { key: "year", label: `Year: ${year}`, clear: () => setYear("") } : null,
    query ? { key: "search", label: `Query: "${query}"`, clear: () => setQuery("") } : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20">
      {/* 01 - Sovereign Hero Header */}
      <section className="border-b border-border/40 bg-linear-to-b from-primary/5 via-muted/20 to-background pt-16 pb-6 sm:pt-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <GsapReveal className="space-y-4">
            <div>
              <EditorialPill dot pulse>
                Three programmes · evidence via BNS Studio
              </EditorialPill>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              Civic Evidence & Production Archive
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
              Explore forensic investigations, commissioned civic media, county budget scorecards, and newsroom dispatches produced across our four operational programmes: <strong>BNS Connect</strong>, <strong>BNS Mashinani</strong>, <strong>Wanahabari Lab</strong>, and <strong>BNS Studios</strong>.
            </p>
          </GsapReveal>

          {/* 02 - Programme filters with live counts */}
          <GsapReveal delay={0.1} className="pt-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              {PROGRAMME_FILTERS.map((filter) => {
                const isSelected = programme === filter.id;
                const count = programmeCounts[filter.id] || 0;
                return (
                  <button
                    key={filter.id || "all"}
                    type="button"
                    onClick={() => setProgramme(filter.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap outline-none",
                      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                        : "border border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={cn(
                        "inline-flex size-4 items-center justify-center rounded-full text-[10px] font-mono",
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </GsapReveal>
        </div>
      </section>

      {/* 03 - Minimalist Search & Filter Strip */}
      <section ref={searchContainerRef} className="sticky top-14 md:top-16 z-30 border-b border-border/40 bg-background/90 backdrop-blur-md py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Minimal Inline Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onFocus={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    searchContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }
                }}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by topic, partner, keyword... (Press '/' to focus)"
                className="w-full rounded-full border border-border/60 bg-muted/30 pl-9 pr-9 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            {/* Touch-Friendly Year Pills & Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Year Pills for instant touch selection without OS modal picker */}
              <div className="inline-flex items-center rounded-full bg-muted/40 p-1 border border-border/60 text-xs shrink-0 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setYear("")}
                  className={cn(
                    "rounded-full px-3 py-1 font-semibold text-xs transition-all",
                    !year
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Years
                </button>
                {years.map((y) => {
                  const isSelected = year === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(isSelected ? "" : y)}
                      className={cn(
                        "rounded-full px-2.5 py-1 font-semibold text-xs transition-all",
                        isSelected
                          ? "bg-foreground text-background shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>

              {/* Minimalist Dropdowns */}
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                aria-label="Filter by content format"
                className="rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors shrink-0"
              >
                <option value="">All Formats</option>
                {STUDIO_CONTENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                aria-label="Filter by partner organization"
                className="rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors shrink-0"
              >
                <option value="">All Partners</option>
                {clients.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips & Result Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "investigation" : "investigations"} found
                {programme ? ` in ${getProgrammeName(programme)}` : ""}
              </span>

              {activeFilters.length > 0 && (
                <>
                  <span className="text-border">|</span>
                  {activeFilters.map((f) => (
                    <span
                      key={f.key}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      <span>{f.label}</span>
                      <button
                        type="button"
                        onClick={f.clear}
                        className="hover:text-primary transition-colors"
                        aria-label={`Remove ${f.label}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-semibold text-primary hover:underline ml-1"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verifiable Civic Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* 04 - Evidence Dossiers List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <GsapStaggerReveal itemSelector="[data-gsap-row]" className="space-y-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                data-gsap-row
                className="group relative rounded-3xl border border-border/60 bg-card p-4 sm:p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <Link
                  href={projectHref(project.slug)}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                >
                  {/* Media Poster Anchor */}
                  <div className="relative aspect-[16/10] w-full sm:w-64 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted">
                    <Image
                      src={project.media.posterUrl}
                      alt={project.title}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        project.media.posterPosition || "object-center"
                      )}
                      sizes="(max-width: 640px) 100vw, 256px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <EditorialPill variant="invert" size="xs">
                        {project.contentType}
                      </EditorialPill>
                    </div>
                  </div>

                  {/* Copy & Structured Impact Evidence */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <EditorialPill dot pulse size="xs">
                        {getProgrammeName(project.programmeSlug)}
                      </EditorialPill>
                      <span className="text-muted-foreground font-medium">·</span>
                      <span className="font-semibold text-foreground/80">{project.organization.name}</span>
                      <span className="text-muted-foreground font-medium">·</span>
                      <span className="font-mono text-muted-foreground">{project.year}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {project.subtitle || project.briefChallenge}
                    </p>

                    {project.impactEvidence?.primaryMetric && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span>{project.impactEvidence.primaryMetric}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Link Arrow */}
                  <div className="hidden sm:flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors shrink-0">
                    <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            ))}
          </GsapStaggerReveal>
        ) : (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mx-auto text-muted-foreground">
              <Filter className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No civic investigations found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No evidence matching your selected criteria. Try adjusting your query or resetting all filters.
            </p>
            <div className="pt-2">
              <PillButton onClick={clearFilters} variant="outline" size="sm">
                Reset All Filters
              </PillButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
