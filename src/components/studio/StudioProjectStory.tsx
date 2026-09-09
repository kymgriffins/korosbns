"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

/** Extract YouTube video ID from a full YT watch URL */
function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/);
  return m?.[1] ?? null;
}

/** Build the best available YT thumbnail URL */
function ytThumb(videoId: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

interface StoryCardProps {
  title: string;
  subtitle?: string;
  thumb: string;
  fallbackThumb?: string;
  href: string;
  contentType: string;
  index: number;
}

function StoryCard({ title, subtitle, thumb, fallbackThumb, href, contentType, index }: StoryCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px] snap-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={href}
        className="group block relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`View project: ${title}`}
      >
        {/* Thumbnail */}
        <Image
          src={imgError && fallbackThumb ? fallbackThumb : thumb}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, 260px"
          onError={() => setImgError(true)}
          unoptimized
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none" />

        {/* Content type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block rounded-full bg-black/70 backdrop-blur-sm border border-white/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 font-bold">
            {contentType}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className="font-heading font-bold text-sm text-white leading-snug line-clamp-3 mb-1">
            {title}
          </p>
          {subtitle && (
            <p className="font-mono text-[10px] text-white/50 leading-snug line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Hover overlay: "View Project" */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="hover-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[2px]"
            >
              <div className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-primary-foreground shadow-lg">
                <Play className="size-4 fill-current" />
                <span className="font-heading font-bold text-sm tracking-wide">View Project</span>
                <ArrowUpRight className="size-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

export function StudioProjectStory() {
  const allProjects = studiosEvidenceData.getAllProjects();

  const storyItems = allProjects
    .filter((p) => {
      const ytId = extractYouTubeId(p.media.videoUrl);
      return ytId !== null || p.media.posterUrl;
    })
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
    <section className="w-full bg-background py-16 md:py-20 border-b border-border/40">
      <div className={SECTION_SHELL_INNER}>
        {/* Section header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
              · BNS Studios Portfolio
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
              Projects in story
            </h2>
          </div>
          <Link
            href="/bns-studio#portfolio"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            All projects <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {/* Horizontal story strip */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-16 md:px-16 scrollbar-none"
          role="list"
          aria-label="Studio projects"
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
                index={i}
              />
            </div>
          ))}
        </div>

        {/* Mobile "see all" */}
        <div className="mt-6 flex sm:hidden justify-center">
          <Link
            href="/bns-studio#portfolio"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            See all projects <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
