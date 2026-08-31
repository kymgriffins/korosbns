"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

type Props = {
  onSelectProject?: (project: StudioProjectEvidence) => void;
};

export function StudioFeaturedWork({ onSelectProject }: Props) {
  const featured = studiosEvidenceData.getFeaturedProjects();
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = featured[currentIndex] || featured[0];

  const prev = () =>
    setCurrentIndex((c) => (c === 0 ? featured.length - 1 : c - 1));
  const next = () =>
    setCurrentIndex((c) => (c + 1) % featured.length);

  if (!current) return null;

  return (
    <LandingSection id="featured-work" className="border-t-0 bg-background">
      <LandingSectionHeader
        eyebrow="Flagship Commissions"
        title={
          <>
            Evidence in action: <span className={T.highlight}>Featured Case Studies</span>
          </>
        }
        description="A closer look at how BNS Studios partners with public bodies, INGOs, and grassroots coalitions to convert heavy policy data into tangible civic outcomes."
      />

      <LandingContent>
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            {/* Visual Media Column */}
            <div className="relative min-h-[320px] bg-muted sm:min-h-[400px] lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.media.posterUrl}
                    alt={current.title}
                    fill
                    className={cn(
                      "object-cover",
                      current.media.posterPosition || "object-center",
                    )}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-card" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      <Sparkles className="size-3" />
                      {current.contentType}
                    </span>
                    <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {current.organization.sector}
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  {current.media.caption && (
                    <div className="absolute bottom-4 left-4 right-4 text-[11px] text-white/80 backdrop-blur-md bg-black/50 p-2.5 rounded-xl">
                      {current.media.caption}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Narrative & Impact Column */}
            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      <Building2 className="size-3.5" />
                      <span>{current.organization.name}</span>
                    </div>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {current.title}
                    </h3>
                    {current.subtitle && (
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        {current.subtitle}
                      </p>
                    )}
                  </div>

                  {/* The Challenge & What We Produced */}
                  <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-4 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-foreground">The Challenge: </span>
                      <span className="text-muted-foreground">{current.briefChallenge}</span>
                    </div>
                    <div className="border-t border-border/50 pt-2">
                      <span className="font-bold text-foreground">What BNS Produced: </span>
                      <span className="text-muted-foreground">{current.whatWeProduced}</span>
                    </div>
                  </div>

                  {/* Key Impact Metric */}
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          Verified Outcome & Evidence
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {current.impactEvidence.primaryMetric}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {current.impactEvidence.context}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Outputs Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Key Deliverables Delivered
                    </p>
                    <ul className="grid gap-1.5 text-xs text-foreground/80">
                      {current.outputs.slice(0, 3).map((output, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                          <span className="line-clamp-1">{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation & Case Brief Trigger */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                    aria-label="Previous featured case"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {currentIndex + 1} / {featured.length}
                  </span>
                  <button
                    type="button"
                    onClick={next}
                    className="flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                    aria-label="Next featured case"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject?.(current)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Open Full Case Dossier</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
