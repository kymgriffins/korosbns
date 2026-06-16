"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Sprout,
  Store,
  HeartPulse,
  Home,
  Wifi,
  Route,
  BookOpen,
  Droplets,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/ui/button";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { Routes } from "@/constants/routes";
import {
  programmeAllocations,
  formatKesBillions,
  BUDGET_SOURCE,
  type ProgrammeAllocation,
} from "@/constants/budget-data";

const PROGRAMME_ICONS: Record<string, LucideIcon> = {
  education: BookOpen,
  health: HeartPulse,
  roads: Route,
  agriculture: Sprout,
  housing: Home,
  water: Droplets,
  msmes: Store,
  digital: Wifi,
};

const PROGRAMME_GRADIENTS: Record<string, string> = {
  education: "from-indigo-800 via-indigo-600 to-blue-400",
  health: "from-rose-700 via-red-600 to-pink-400",
  roads: "from-orange-800 via-orange-600 to-yellow-400",
  agriculture: "from-emerald-700 via-green-600 to-lime-500",
  housing: "from-blue-800 via-blue-600 to-sky-400",
  water: "from-cyan-800 via-teal-600 to-emerald-400",
  msmes: "from-amber-700 via-yellow-600 to-orange-400",
  digital: "from-violet-800 via-purple-600 to-fuchsia-400",
};

interface Slide {
  title: string;
  value: string;
  body: string;
  accent: string;
}

function buildSlides(programme: ProgrammeAllocation): Slide[] {
  return [
    {
      title: "Budget Allocation",
      value: formatKesBillions(programme.allocationBillions),
      body: programme.sourceNote,
      accent: "FY2026/27",
    },
    {
      title: "The Gap",
      value: programme.gap,
      body: programme.gapBody,
      accent: programme.gapLabel,
    },
    {
      title: "Your Action",
      value: programme.action,
      body: programme.actionBody,
      accent: programme.actionAccent,
    },
  ];
}

const SLIDE_INTERVAL = 4500;

export default function AlertsSimulator() {
  const [sectorKey, setSectorKey] = useState(programmeAllocations[0].key);
  const [slideIdx, setSlideIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const programme =
    programmeAllocations.find((p) => p.key === sectorKey) ?? programmeAllocations[0];
  const slides = buildSlides(programme);
  const Icon = PROGRAMME_ICONS[programme.key] ?? BookOpen;
  const gradient = PROGRAMME_GRADIENTS[programme.key] ?? PROGRAMME_GRADIENTS.education;

  const resetCarousel = useCallback((key: string) => {
    setSectorKey(key);
    setSlideIdx(0);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sectorKey, slides.length]);

  const slide = slides[slideIdx];

  return (
    <section className="relative w-full overflow-hidden border-t border-border/40 bg-background py-20 md:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-5 blur-[120px]">
        <div className="absolute top-1/4 left-1/4 h-[35vw] w-[35vw] rounded-full bg-primary" />
        <div className="absolute bottom-1/4 right-1/4 h-[40vw] w-[40vw] rounded-full bg-teal-500" />
      </div>

      <div className={`${SECTION_SHELL_INNER} max-w-7xl`}>
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-6 lg:col-span-5"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-primary">
              Where the Money Goes
            </span>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-3xl sm:leading-none md:text-5xl">
              From allocations to <br className="hidden sm:block" />
              accountability — <br className="hidden sm:block" />
              sector by sector.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              We translate the FY2026/27 budget into sharp, sector-by-sector narratives that show
              you exactly where public money is committed — and what to demand so it delivers.
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                Select a sector to explore:
              </span>
              <div className="flex flex-wrap gap-2">
                {programmeAllocations.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => resetCarousel(p.key)}
                    aria-pressed={sectorKey === p.key}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      sectorKey === p.key
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {p.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/70">
              Base allocations: {BUDGET_SOURCE.shortLabel}. Gap framing is illustrative civic
              analysis, not Treasury figures.
            </p>

            <div className="pt-2">
              <a href={Routes.Learn} className="block w-full sm:inline-block sm:w-auto">
                <Button size="lg" className="w-full gap-2 rounded-full px-6 sm:w-auto">
                  Learn to track the budget <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            className="flex items-center justify-center lg:col-span-7"
          >
            <div className="relative h-[480px] w-full max-w-[270px] overflow-hidden rounded-[36px] border-4 border-border bg-black p-2.5 shadow-2xl sm:h-[580px] sm:max-w-[340px] sm:rounded-[40px] sm:border-[6px] sm:p-3">
              <div className="absolute top-0 left-1/2 z-30 flex h-5 w-28 -translate-x-1/2 items-center justify-center rounded-b-xl bg-black">
                <div className="mr-2 size-2 rounded-full bg-card" />
                <div className="h-1 w-8 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-black">
                <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                  {slides.map((_, i) => (
                    <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        initial={{ scaleX: i < slideIdx ? 1 : 0, transformOrigin: "left" }}
                        animate={
                          i === slideIdx ? { scaleX: 1 } : i < slideIdx ? { scaleX: 1 } : { scaleX: 0 }
                        }
                        transition={
                          i === slideIdx
                            ? { duration: SLIDE_INTERVAL / 1000, ease: "linear" }
                            : { duration: 0 }
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`} />

                <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sectorKey}-${slideIdx}`}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="relative z-10 flex h-full flex-col justify-end p-6 pb-12"
                  >
                    <div className="absolute top-12 left-6 flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                      <Icon className="size-3" />
                      {programme.shortLabel}
                    </div>

                    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            {slide.title}
                          </p>
                          <p className="mt-0.5 text-2xl font-black leading-none text-white">
                            {slide.value}
                          </p>
                        </div>
                        <span className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/70">
                          {slide.accent}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-white/70">{slide.body}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
