"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  featuredProjectsData,
  type FeaturedProject,
} from "@/data/featured-projects";
import { PARTNER_FEATURED_INTRO } from "@/content/partner-landing";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

export type FeaturedProjectsLayout = "list" | "grid";

type FeaturedProjectsSectionProps = {
  eyebrow?: string;
  headline?: string;
  lede?: string;
  openProjectLabel?: string;
  className?: string;
  initialProjects?: FeaturedProject[];
  /** Stacked editorial list (default) or tile grid */
  layout?: FeaturedProjectsLayout;
  /** Grid columns on md+ (2–4). Ignored for list layout. */
  columns?: 2 | 3 | 4;
  /** When set, only show these featured project ids (order preserved). */
  projectIds?: string[];
};

function projectThumb(project: FeaturedProject): string {
  return (
    project.thumbnail ||
    (project as { thumbnailUrl?: string }).thumbnailUrl ||
    (project as { image?: string }).image ||
    (project as { image_url?: string }).image_url ||
    (project.videoId
      ? `https://i.ytimg.com/vi/${project.videoId}/hqdefault.jpg`
      : "/images/hall/129A4248.jpg")
  );
}

/**
 * Partner / programmes featured evidence.
 * CMS can switch list ↔ grid and pick which Featured Projects to show.
 */
export function FeaturedProjectsSection({
  eyebrow = PARTNER_FEATURED_INTRO.eyebrow,
  headline = PARTNER_FEATURED_INTRO.headline,
  lede = PARTNER_FEATURED_INTRO.lede,
  openProjectLabel = PARTNER_FEATURED_INTRO.openProjectLabel,
  className,
  initialProjects,
  layout = "grid",
  columns = 3,
  projectIds,
}: FeaturedProjectsSectionProps) {
  const [projects, setProjects] = useState<FeaturedProject[]>(() =>
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : featuredProjectsData.get(),
  );

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/cms/featured-projects");
        if (res.ok) {
          const json = await res.json();
          const results = json.data?.results || json.data?.projects;
          if (!cancelled && Array.isArray(results)) {
            setProjects(results);
            return;
          }
        }
      } catch {
        // keep fallback
      }
    };
    const useIdle = typeof window.requestIdleCallback === "function";
    const idle = useIdle
      ? window.requestIdleCallback(run, { timeout: 2500 })
      : window.setTimeout(run, 1);
    return () => {
      cancelled = true;
      if (useIdle) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, []);

  const visible = useMemo(() => {
    const activeProjects = projects.filter((p) => p.visible !== false);
    if (!projectIds || projectIds.length === 0) return activeProjects;
    const byId = new Map(activeProjects.map((p) => [p.id, p]));
    return projectIds
      .map((id) => byId.get(id))
      .filter((p): p is FeaturedProject => Boolean(p));
  }, [projects, projectIds]);

  if (visible.length === 0) return null;

  // Limit to top 6 curated evidence items for punchy scannability
  const curatedItems = visible.slice(0, 6);

  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <LandingSection
      id="featured-projects"
      aria-labelledby="featured-projects-heading"
      className={cn("border-t border-[#e5edf5] bg-white py-16 md:py-24", className)}
    >
      <div className="mb-12 max-w-2xl space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748d]">{eyebrow}</p>
        <h2
          id="featured-projects-heading"
          className="font-heading text-3xl font-light tracking-tight text-[#061b31] md:text-4xl"
        >
          {headline}
        </h2>
        <p className="text-base text-[#061b31]/75 leading-relaxed">{lede}</p>
      </div>

      {layout === "grid" ? (
        <ul className={cn("grid grid-cols-1 gap-8", gridCols)}>
        {curatedItems.map((project) => {
          const thumbnailSrc = projectThumb(project);
          const projectHref =
            project.href || `/bns-project/${project.slug || project.id}`;
          const programmeLabel =
            project.programmeLabel || project.programmeSlug || "Investigation";

          return (
            <li key={project.id} className="h-full">
              <Link
                href={projectHref}
                className="group flex flex-col h-full rounded-[4px] border border-[#e5edf5] bg-white p-5 transition-all duration-200 hover:border-[#533afd]/50 hover:shadow-xs focus-visible:ring-2 focus-visible:ring-[#533afd]"
              >
                {/* 1. Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-[4px] border border-[#e5edf5] bg-[#f8fafd]">
                  <Image
                    src={thumbnailSrc}
                    alt={project.title || "Evidence preview"}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* 2. Category */}
                <div className="mt-4">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#64748d]">
                    {programmeLabel}
                  </span>
                </div>

                {/* 3. Title (20px Weight 300) */}
                <h3 className="mt-1.5 font-heading text-[20px] font-light leading-snug text-[#061b31] tracking-tight transition-colors group-hover:text-[#533afd]">
                  {project.title}
                </h3>

                {/* 4. Evidence Brief (16px Weight 400) */}
                <p className="mt-2 text-[16px] text-[#061b31]/75 leading-relaxed font-normal line-clamp-3">
                  {project.prose}
                </p>

                {/* 5. Action Link */}
                <div className="mt-auto pt-5 border-t border-[#e5edf5]/60">
                  <span className="inline-flex items-center text-sm font-medium text-[#533afd] group-hover:text-[#7389ff] transition-colors">
                    <span>
                      {(project.ctaLabel || openProjectLabel || "Read story")
                        .replace(/[→\->]/g, "")
                        .trim()}
                    </span>
                    <span
                      aria-hidden
                      className="ml-1.5 transition-transform duration-150 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      ) : (
        <ul className="divide-y divide-border/50 border-y border-border/50">
          {visible.map((project, index) => {
            const reverse = index % 2 === 1;
            const thumbnailSrc = projectThumb(project);
            const showMobileSwap = Boolean(
              project.thumbnailMobile && (project.hideDesktopThumbOnMobile ?? true),
            );
            const projectHref =
              project.href || `/bns-project/${project.slug || project.id}`;
            const programmeLabel =
              project.programmeLabel || project.programmeSlug || "Investigation";

            return (
              <li
                key={project.id}
                className={cn(
                  "grid items-start gap-8 py-10 md:grid-cols-12 md:gap-12 md:py-14",
                  reverse && "md:[&>*:first-child]:order-2",
                )}
              >
                <figure className="space-y-2.5 md:col-span-6">
                  <Link
                    href={projectHref}
                    className="relative block aspect-video w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showMobileSwap ? (
                      <>
                        <Image
                          src={thumbnailSrc}
                          alt={project.title || "Project thumbnail"}
                          fill
                          className="hidden object-cover object-center sm:block"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <Image
                          src={project.thumbnailMobile || thumbnailSrc}
                          alt={project.title || "Project thumbnail"}
                          fill
                          className="object-cover object-center sm:hidden"
                          sizes="100vw"
                        />
                      </>
                    ) : (
                      <Image
                        src={thumbnailSrc}
                        alt={project.title || "Project thumbnail"}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    <span className="sr-only">Open {project.title}</span>
                  </Link>
                  <figcaption className={cn(T.caption, "text-muted-foreground")}>
                    {project.authorName || "Budget Ndio Story Team"}
                    <span aria-hidden className="mx-1.5 text-border">
                      ·
                    </span>
                    {project.mediaType === "reel" ? "Reel" :
                     project.mediaType === "audio" ? "Audio" :
                     project.mediaType === "image" ? "Gallery" :
                     project.mediaType === "animation" ? "Animation" :
                     project.mediaType === "none" ? "Project" :
                     "YouTube"}
                  </figcaption>
                </figure>

                <div className="space-y-4 md:col-span-6">
                  <p className={cn(T.caption, "text-muted-foreground")}>
                    {programmeLabel}
                  </p>
                  <h3 className="font-heading text-xl font-bold leading-snug text-balance text-foreground md:text-2xl">
                    <Link
                      href={projectHref}
                      className="outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  {project.subtitle ? (
                    <p className={cn(T.caption, "text-muted-foreground")}>
                      {project.subtitle}
                    </p>
                  ) : null}
                  <LandingContent>
                    <p className={cn(T.lead, "max-w-xl text-foreground/75 md:text-base")}>
                      {project.prose}
                    </p>
                  </LandingContent>
                  <Link
                    href={projectHref}
                    className="group inline-flex items-center pt-1 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {(project.ctaLabel || openProjectLabel || "Read story")
                      .replace(/[→\->]/g, "")
                      .trim()}
                    <span
                      aria-hidden
                      className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </LandingSection>
  );
}
