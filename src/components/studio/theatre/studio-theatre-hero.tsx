"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { fadeInUp } from "@/motion/variants";
import { cn } from "@/utils";

type Props = {
  projects: StudioProjectEvidence[];
  onCommissionClick?: () => void;
};

const ROTATE_MS = 8000;

export function StudioTheatreHero({ projects, onCommissionClick }: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const current = projects[index] ?? projects[0];

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? projects.length - 1 : i - 1));
  }, [projects.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (reduceMotion || projects.length <= 1) return;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [next, projects.length, reduceMotion]);

  if (!current) return null;

  const theme = getFormatTheme(current.contentType);

  return (
    <section className="relative min-h-[min(88vh,44rem)] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="absolute inset-0"
        >
          <div
            className="studio-theatre-hero-backdrop"
            style={{
              backgroundImage: `url(${current.media.posterUrl})`,
              backgroundPosition: current.media.posterPosition?.replace("object-", "") ?? "center",
            }}
            role="img"
            aria-label={current.title}
          />
          <div className="studio-theatre-hero-scrim absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[min(88vh,44rem)] flex-col justify-end px-[var(--studio-rail-pad)] pb-12 pt-28 md:pb-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className={cn("max-w-2xl space-y-4", theme.accentClass)}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--studio-format-accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
              BNS Studios
            </span>
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
              {current.contentType}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
            >
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                {current.title}
              </h1>
              {current.subtitle ? (
                <p className="mt-2 text-base text-white/75 md:text-lg">{current.subtitle}</p>
              ) : null}
              <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/65 md:text-base">
                {current.briefChallenge}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/bns-studio/${current.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Play className="size-4 fill-current" aria-hidden />
              {theme.ctaLabel}
            </Link>
            <button
              type="button"
              onClick={onCommissionClick}
              className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Commission a production
            </button>
          </div>

          {projects.length > 1 ? (
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={prev}
                className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous spotlight"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex gap-1.5">
                {projects.map((project, i) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1 rounded-full transition-all",
                      i === index ? "w-6 bg-white" : "w-2 bg-white/40",
                    )}
                    aria-label={`Show ${project.title}`}
                    aria-current={i === index ? "true" : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next spotlight"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--studio-theatre-bg)] to-transparent" />
    </section>
  );
}
