"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { defaultStudioPanel } from "@/lib/studio-presentation";
import { StudioSiteFooter, StudioSiteNav } from "@/components/studio/theatre/studio-site-nav";
import { cn } from "@/utils";

function projectHref(slug: string) {
  return `/bns-studio/${slug}`;
}

export function StudioFeaturedWorkPage() {
  const projects = studiosEvidenceData.getAllProjects();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState("");
  const [types, setTypes] = useState<string[]>([]);

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
      if (types.length > 0 && !types.includes(project.contentType)) return false;
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
  }, [projects, query, types, client, year]);

  const clearFilters = () => {
    setQuery("");
    setClient("");
    setYear("");
    setTypes([]);
  };

  const hasFilters = Boolean(query || client || year || types.length);

  const focusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="studio-work-page">
      <StudioSiteNav active="work" onSearchOpen={focusSearch} />

      <div className="studio-work-toolbar">
        <div className="studio-work-search-wrap">
          <Search className="studio-work-search-icon" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="studio-work-search"
            aria-label="Search productions"
          />
        </div>
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="studio-work-select"
          aria-label="Filter by client"
        >
          <option value="">Client</option>
          {clients.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="studio-work-select"
          aria-label="Filter by year"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="studio-work-clear"
            aria-label="Clear filters"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="studio-work-filters">
        {STUDIO_CONTENT_TYPES.map((type) => {
          const active = types.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                setTypes((prev) =>
                  prev.includes(type.id)
                    ? prev.filter((t) => t !== type.id)
                    : [...prev, type.id],
                )
              }
              className={cn("studio-work-chip", active && "studio-work-chip-active")}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <ul className="studio-work-list">
        {filtered.map((project) => (
          <li key={project.id}>
            <Link
              href={`${projectHref(project.slug)}?panel=${defaultStudioPanel(project)}`}
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
