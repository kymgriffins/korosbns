"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid2X2, List, Plus, Search, X } from "lucide-react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import {
  defaultStudioPanel,
  projectHasAudio,
  projectHasGallery,
  projectHasVideo,
} from "@/lib/studio-presentation";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { cn } from "@/utils";

type ViewMode = "list" | "grid";

function projectHref(slug: string) {
  return `/bns-studio/${slug}`;
}

function formatBadge(project: ReturnType<typeof studiosEvidenceData.getAllProjects>[0]) {
  if (projectHasVideo(project)) return "Video";
  if (projectHasAudio(project)) return "Audio";
  if (projectHasGallery(project)) return "Gallery";
  return project.contentType;
}

type Props = {
  onCommissionClick?: () => void;
};

export function StudioIndexView({ onCommissionClick }: Props) {
  const projects = studiosEvidenceData.getAllProjects();
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<string[]>([]);
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
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, types, client, year]);

  const toggleType = (id: string) => {
    setTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const clearFilters = () => {
    setQuery("");
    setTypes([]);
    setClient("");
    setYear("");
  };

  const hasFilters = Boolean(query || types.length || client || year);

  return (
    <div id="theatre" className="pb-16">
      <section className="border-b border-[var(--studio-theatre-border)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-[90rem]">
          <h2 className="text-xl font-bold tracking-tight text-[var(--studio-theatre-fg)] md:text-2xl">
            All productions
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--studio-theatre-muted)]">
            Filter by format, client, or year — or open any case from the reel above.
          </p>
          {onCommissionClick ? (
            <button
              type="button"
              onClick={onCommissionClick}
              className="mt-6 inline-flex rounded-full bg-[var(--studio-theatre-accent)] px-5 py-2.5 text-sm font-bold text-black"
            >
              Commission a production
            </button>
          ) : null}
        </div>
      </section>

      <section className="sticky top-14 z-40 border-b border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-bg)]/95 px-4 py-3 backdrop-blur-md md:top-16 md:px-8">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--studio-theatre-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search productions…"
              className="h-10 w-full rounded-lg border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] pl-9 pr-3 text-sm text-[var(--studio-theatre-fg)] placeholder:text-[var(--studio-theatre-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="h-10 rounded-lg border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] px-3 text-xs font-semibold text-[var(--studio-theatre-fg)]"
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
              className="h-10 rounded-lg border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] px-3 text-xs font-semibold text-[var(--studio-theatre-fg)]"
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
                className="inline-flex size-10 items-center justify-center rounded-lg bg-[var(--studio-theatre-accent)] text-black"
                aria-label="Clear filters"
              >
                <X className="size-4" />
              </button>
            ) : null}

            <div className="ml-auto flex rounded-lg border border-[var(--studio-theatre-border)] p-0.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md",
                  view === "list"
                    ? "bg-[var(--studio-theatre-elevated)] text-[var(--studio-theatre-fg)]"
                    : "text-[var(--studio-theatre-muted)]",
                )}
                aria-label="List view"
                aria-pressed={view === "list"}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-md",
                  view === "grid"
                    ? "bg-[var(--studio-theatre-elevated)] text-[var(--studio-theatre-fg)]"
                    : "text-[var(--studio-theatre-muted)]",
                )}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
              >
                <Grid2X2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-[90rem] flex-wrap gap-2">
          {STUDIO_CONTENT_TYPES.map((type) => {
            const active = types.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => toggleType(type.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                  active
                    ? "border-[var(--studio-theatre-accent)] bg-[var(--studio-theatre-accent)] text-black"
                    : "border-[var(--studio-theatre-border)] text-[var(--studio-theatre-muted)] hover:text-[var(--studio-theatre-fg)]",
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </section>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[90rem] px-4 py-8 md:px-8"
      >
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-[var(--studio-theatre-muted)]">
            No productions match your filters.
          </p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {filtered.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Link
                  href={`${projectHref(project.slug)}?panel=${defaultStudioPanel(project)}`}
                  className="group relative block aspect-[16/10] overflow-hidden bg-[var(--studio-theatre-surface)]"
                >
                  <Image
                    src={project.media.posterUrl}
                    alt={project.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                      project.media.posterPosition || "object-center",
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {formatBadge(project)}
                    </p>
                    <h2 className="text-lg font-bold text-white md:text-xl">{project.title}</h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-[var(--studio-theatre-border)]">
            {filtered.map((project) => (
              <motion.li key={project.id} variants={fadeInUp}>
                <Link
                  href={`${projectHref(project.slug)}?panel=${defaultStudioPanel(project)}`}
                  className="group flex items-center gap-4 py-4 md:gap-6"
                >
                  <div className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-md bg-[var(--studio-theatre-surface)] sm:w-44 md:w-56">
                    <Image
                      src={project.media.posterUrl}
                      alt=""
                      fill
                      className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        project.media.posterPosition || "object-center",
                      )}
                      sizes="14rem"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--studio-theatre-muted)]">
                      {formatBadge(project)} · {project.year}
                    </p>
                    <h2 className="truncate text-base font-bold text-[var(--studio-theatre-fg)] md:text-xl">
                      {project.title}
                    </h2>
                    <p className="truncate text-sm text-[var(--studio-theatre-muted)]">
                      {project.organization.name}
                    </p>
                  </div>
                  <Plus className="size-5 shrink-0 text-[var(--studio-theatre-muted)] group-hover:text-[var(--studio-theatre-accent)]" />
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
