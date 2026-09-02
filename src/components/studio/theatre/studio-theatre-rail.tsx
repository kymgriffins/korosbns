"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { StudioContentType } from "@/constants/bns-studio-content";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { StudioTheatreCard } from "@/components/studio/theatre/studio-theatre-card";
import { cn } from "@/utils";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  contentType?: StudioContentType;
  projects: StudioProjectEvidence[];
  className?: string;
};

export function StudioTheatreRail({
  id,
  title,
  subtitle,
  contentType,
  projects,
  className,
}: Props) {
  if (projects.length === 0) return null;

  const theme = contentType ? getFormatTheme(contentType) : null;

  return (
    <motion.section
      id={id}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
      className={cn("space-y-3 py-6 md:py-8", theme?.accentClass, className)}
    >
      <motion.div
        variants={fadeInUp}
        className="flex items-end justify-between gap-4 px-[var(--studio-rail-pad)]"
      >
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--studio-theatre-fg)] md:text-xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 max-w-xl text-sm text-[var(--studio-theatre-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {contentType ? (
          <Link
            href={`#format-${contentType.replace(/\s+/g, "-").toLowerCase()}`}
            className="hidden shrink-0 text-xs font-semibold text-[var(--studio-theatre-muted)] hover:text-[var(--studio-format-accent)] sm:inline"
          >
            Browse row
          </Link>
        ) : null}
      </motion.div>

      <motion.div variants={fadeInUp} className="studio-theatre-rail-track">
        {projects.map((project, index) => (
          <StudioTheatreCard
            key={project.id}
            project={project}
            priority={index === 0}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}
