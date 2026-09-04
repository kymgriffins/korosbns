"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Plus, Search, X, Sparkles, Filter } from "lucide-react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { StudioSiteFooter, StudioSiteNav } from "@/components/studio/theatre/studio-site-nav";
import { cn } from "@/utils";

function projectHref(slug: string) {
  return `/bns-studio/${slug}`;
}

const PROGRAMME_PILLS = [
  { id: "", label: "All Programmes" },
  { id: "connect", label: "BNS Connect" },
  { id: "mashinani", label: "BNS Mashinani" },
  { id: "wanahabari-lab", label: "Wanahabari Lab" },
  { id: "studios", label: "BNS Studios" },
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
      return "BNS Studios";
    default:
      return "BNS Programme";
  }
}

export function StudioFeaturedWorkPage() {
  const projects = studiosEvidenceData.getAllProjects();
  const searchRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState("");
  const [format, setFormat] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState("");

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

  const activeCount = [query, programme, format, client, year].filter(Boolean).length;

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const focusSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => {
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <div className="studio-work-page">
      <StudioSiteNav active="work" onSearchOpen={focusSearch} />

      {/* Hero Header */}
      <div className="pt-24 pb-8 px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
          <Sparkles className="size-3" />
          The Unified Evidence Engine
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Featured Work & Civic Proof
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
          Explore investigations, commissioned media, county scorecards, and viral explainers produced across our 4 operational programmes.
        </p>
      </div>

      {/* Programme Segmented Filters */}
      <div className="flex items-center justify-center gap-2 px-4 pb-8 overflow-x-auto scrollbar-hide">
        {PROGRAMME_PILLS.map((p) => {
          const isSelected = programme === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setProgramme(p.id)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-bold transition-all whitespace-nowrap outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/10"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Minimalist search bar */}
      <div className="studio-work-mini">
        <button
          type="button"
          onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
          className="studio-work-mini-trigger"
          aria-expanded={searchOpen}
          aria-label={searchOpen ? "Close search and filters" : "Open search and filters"}
        >
          <Search className="size-4" aria-hidden />
          <span>Search & Filters</span>
          {activeCount > 0 ? (
            <span className="studio-work-mini-count">{activeCount}</span>
          ) : (
            <ChevronDown
              className={cn("size-4 studio-work-mini-chevron", searchOpen && "studio-work-mini-chevron-open")}
              aria-hidden
            />
          )}
        </button>
        <p className="studio-work-mini-result" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "work" : "works"}
        </p>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen ? (
          <motion.div
            key="studio-work-search-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            className="studio-work-search-panel-wrap"
          >
            <div className="studio-work-toolbar-minimal">
              <div className="studio-work-search-wrap-minimal">
                <Search className="studio-work-search-icon" aria-hidden />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search titles, clients, tags…"
                  className="studio-work-search-minimal"
                  aria-label="Search productions"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="studio-work-mini-clear-inline"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              <div className="studio-work-selects">
                <label className="studio-work-select-label">
                  <span className="sr-only">Filter by format</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="studio-work-select-minimal"
                    aria-label="Filter by format"
                  >
                    <option value="">All formats</option>
                    {STUDIO_CONTENT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="studio-work-select-label">
                  <span className="sr-only">Filter by client</span>
                  <select
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="studio-work-select-minimal"
                    aria-label="Filter by client"
                  >
                    <option value="">All partners</option>
                    {clients.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="studio-work-select-label">
                  <span className="sr-only">Filter by year</span>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="studio-work-select-minimal"
                    aria-label="Filter by year"
                  >
                    <option value="">All years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
                {activeCount > 0 ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="studio-work-mini-clear"
                  >
                    Clear All
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ul className="studio-work-list">
        {filtered.map((project) => (
          <li key={project.id}>
            <Link
              href={projectHref(project.slug)}
              className="studio-work-row group"
            >
              <div className="studio-work-row-media">
                <Image
                  src={project.media.posterUrl}
                  alt=""
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                    project.media.posterPosition || "object-center",
                  )}
                  sizes="(max-width: 768px) 100vw, 62vw"
                />
              </div>
              <div className="studio-work-row-copy">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    {getProgrammeName(project.programmeSlug)}
                  </span>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="studio-work-row-type">{project.contentType}</span>
                </div>
                <h2 className="studio-work-row-title">{project.title}</h2>
                <p className="studio-work-row-client">{project.organization.name}</p>
                <p className="studio-work-row-year">{project.year}</p>
                {project.impactEvidence?.primaryMetric && (
                  <p className="mt-2 text-xs font-semibold text-primary">
                    ● {project.impactEvidence.primaryMetric}
                  </p>
                )}
              </div>
              <Plus className="studio-work-row-plus" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="studio-work-empty">No productions match your selected filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      <StudioSiteFooter />
    </div>
  );
}
