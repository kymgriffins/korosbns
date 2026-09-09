"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";
import type { ProgrammeSlug } from "@/content";

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/);
  return m?.[1] ?? null;
}

function ytThumb(videoId: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

const DESK_ACCENT: Record<string, { accent: string; border: string; badge: string }> = {
  connect: {
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/60",
    badge: "bg-emerald-600/90 text-white",
  },
  mashinani: {
    accent: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/60",
    badge: "bg-amber-600/90 text-white",
  },
  "wanahabari-lab": {
    accent: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/60",
    badge: "bg-rose-600/90 text-white",
  },
  studios: {
    accent: "text-primary",
    border: "border-primary/60",
    badge: "bg-primary text-primary-foreground",
  },
};

interface StoryCardProps {
  title: string;
  subtitle?: string;
  thumb: string;
  fallbackThumb?: string;
  href: string;
  contentType: string;
  accentCls: string;
  badgeCls: string;
  index: number;
}

function StoryCard({
  title,
  subtitle,
  thumb,
  fallbackThumb,
  href,
  contentType,
  accentCls,
  badgeCls,
  index,
}: StoryCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] snap-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className="group block relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`View project: ${title}`}
      >
        <Image
          src={imgError && fallbackThumb ? fallbackThumb : thumb}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, 240px"
          onError={() => setImgError(true)}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/5 pointer-events-none" />

        <div className="absolute top-3 left-3">
          <span className={cn("inline-block rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest font-bold", badgeCls)}>
            {contentType}
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className="font-heading font-bold text-xs text-white leading-snug line-clamp-3 mb-1">
            {title}
          </p>
          {subtitle && (
            <p className={cn("font-mono text-[9px] leading-snug line-clamp-2", accentCls)}>
              {subtitle}
            </p>
          )}
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hover"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
            >
              <div className={cn("flex items-center gap-1.5 rounded-full px-4 py-2 shadow-lg", badgeCls)}>
                <Play className="size-3.5 fill-current" />
                <span className="font-heading font-bold text-xs tracking-wide">View Project</span>
                <ArrowUpRight className="size-3.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

interface ProgrammeProjectStoryStripProps {
  programmeSlug: ProgrammeSlug;
  eyebrow?: string;
  headline?: string;
  className?: string;
}

export function ProgrammeProjectStoryStrip({
  programmeSlug,
  eyebrow,
  headline,
  className,
}: ProgrammeProjectStoryStripProps) {
  const projects = studiosEvidenceData.getProjectsByProgramme(programmeSlug);
  const accent = DESK_ACCENT[programmeSlug] ?? DESK_ACCENT.studios;

  const storyItems = projects
    .filter((p) => p.media.posterUrl || extractYouTubeId(p.media.videoUrl))
    .slice(0, 8)
    .map((p) => {
      const ytId = extractYouTubeId(p.media.videoUrl);
      const thumb = ytId ? ytThumb(ytId, "maxresdefault") : p.media.posterUrl;
      const fallback = ytId ? ytThumb(ytId, "hqdefault") : undefined;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        thumb,
        fallback,
        contentType: p.contentType,
        href: `/bns-studio/${p.slug}`,
      };
    });

  if (storyItems.length === 0) return null;

  return (
    <section className={cn("w-full py-14 md:py-18 border-t border-border/40", className)}>
      <div className={SECTION_SHELL_INNER}>
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            {eyebrow && (
              <span className={cn("font-mono text-xs uppercase tracking-widest font-bold", accent.accent)}>
                · {eyebrow}
              </span>
            )}
            <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground leading-tight">
              {headline ?? "Projects in story"}
            </h2>
          </div>
          <Link
            href={`/bns-studio`}
            className="hidden sm:inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            All work <ArrowUpRight className="size-3" />
          </Link>
        </div>

        <div
          className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-16 md:px-16 scrollbar-none"
          role="list"
          aria-label={`${programmeSlug} projects`}
        >
          {storyItems.map((item, i) => (
            <div key={item.id} role="listitem" className="flex-shrink-0">
              <StoryCard
                title={item.title}
                subtitle={item.subtitle}
                thumb={item.thumb}
                fallbackThumb={item.fallback}
                href={item.href}
                contentType={item.contentType}
                accentCls={accent.accent}
                badgeCls={accent.badge}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
