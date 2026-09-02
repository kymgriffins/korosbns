"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { hoverScale } from "@/motion/variants";
import { cn } from "@/utils";

const ASPECT_CLASS = {
  "16/9": "aspect-video",
  "9/16": "aspect-[9/16]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
} as const;

type Props = {
  project: StudioProjectEvidence;
  priority?: boolean;
  className?: string;
};

export function StudioTheatreCard({ project, priority = false, className }: Props) {
  const theme = getFormatTheme(project.contentType);

  return (
    <motion.div
      variants={hoverScale}
      whileHover="hover"
      className={cn("shrink-0", theme.accentClass, className)}
      style={{ width: theme.railCardWidth }}
    >
      <Link
        href={`/bns-studio/${project.slug}`}
        className={cn(
          "studio-theatre-card group flex flex-col overflow-hidden rounded-xl",
          "bg-[var(--studio-theatre-elevated)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-format-accent)]",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-[var(--studio-theatre-surface)]",
            ASPECT_CLASS[theme.cardAspect],
          )}
        >
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              project.media.posterPosition || "object-center",
            )}
            sizes="(max-width: 768px) 40vw, 22rem"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {theme.rowEyebrow}
            </p>
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--studio-theatre-fg)] group-hover:text-[var(--studio-format-accent)]">
            {project.title}
          </h3>
          <p className="line-clamp-1 text-xs text-[var(--studio-theatre-muted)]">
            {project.organization.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
