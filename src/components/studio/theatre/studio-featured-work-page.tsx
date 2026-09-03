"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { StudioSiteFooter, StudioSiteNav } from "@/components/studio/theatre/studio-site-nav";
import { cn } from "@/utils";

function projectHref(slug: string) {
  return `/bns-studio/${slug}`;
}

export function StudioFeaturedWorkPage() {
  const projects = studiosEvidenceData.getAllProjects();
  const searchRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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
      if (format && project.contentType !== format) return false;
      if (client && project.organization.name !== client) return false;
      if (year && project.year !== year) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.subtitle,
        project.organization.name,
        project.contentType,
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, format, client, year]);

  const clearFilters = () => {
    setQuery("");
    setFormat("");
    setClient("");
    setYear("");
  };

  const activeCount = [query, format, client, year].filter(Boolean).length;

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

      {/* Minimalist search bar — collapsed to a single row until opened */}
      <div className="studio-work-mini">
        <button
          type="button"
          onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
          className="studio-work-mini-trigger"
          aria-expanded={searchOpen}
          aria-label={searchOpen ? "Close search and filters" : "Open search and filters"}
        >
          <Search className="size-4" aria-hidden />
          <span>Search</span>
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
                    <option value="">All clients</option>
                    {clients.map((name) => (
                      <option key={name} value={name}>
                        {name}
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
                    Clear
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
                <p className="studio-work-row-type">{project.contentType}</p>
                <h2 className="studio-work-row-title">{project.title}</h2>
                <p className="studio-work-row-client">{project.organization.name}</p>
                <p className="studio-work-row-year">{project.year}</p>
              </div>
              <Plus className="studio-work-row-plus" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="studio-work-empty">No productions match your filters.</p>
      ) : null}

      <StudioSiteFooter />
    </div>
  );
}
