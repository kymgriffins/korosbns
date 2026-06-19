"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";
import { TrendingDown, FileText, Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/button";
import { ease } from "@/motion/variants";

interface DisconnectItem {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  visual: React.ReactNode;
}

// ─── Isolated sub-components so hooks are called at the top level ─────────────

function TextPanel({
  item,
  scrollYProgress,
  index,
  total,
  shouldReduceMotion,
}: {
  item: DisconnectItem;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  shouldReduceMotion: boolean | null;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [start * 0.9, start * 0.9 + 0.1, end * 0.9 - 0.05, end * 0.9],
    [0.05, 1, 1, 0.05]
  );
  const y = useTransform(
    scrollYProgress,
    [start * 0.9, start * 0.9 + 0.1, end * 0.9],
    [18, 0, -18]
  );

  return (
    <motion.div
      style={shouldReduceMotion ? {} : { opacity, y }}
      className="absolute inset-0 flex flex-col justify-start space-y-4"
    >
      <span className="text-xs font-black uppercase tracking-wider text-primary">
        {item.badge}
      </span>
      <h3 className="text-2xl font-black text-foreground leading-tight">
        {item.title}
      </h3>
      <p className="text-sm font-semibold text-muted-foreground">{item.subtitle}</p>
      <p className="text-sm text-muted-foreground/70 leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

function VisualPanel({
  item,
  scrollYProgress,
  index,
  total,
  shouldReduceMotion,
}: {
  item: DisconnectItem;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  shouldReduceMotion: boolean | null;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [start * 0.9, start * 0.9 + 0.08, end * 0.9 - 0.05, end * 0.9],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [start * 0.9, start * 0.9 + 0.1, end * 0.9 - 0.05, end * 0.9],
    [0.92, 1, 1, 0.95]
  );

  return (
    <motion.div
      style={shouldReduceMotion ? {} : { opacity, scale }}
      className="absolute inset-0 p-8 flex items-center justify-center"
    >
      <div className="w-full h-full max-w-sm">{item.visual}</div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FramerStickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const items: DisconnectItem[] = [
    {
      badge: "The Funding Gap",
      title: "Where is the money going?",
      subtitle: "KES 450 Million vs KES 45 Million",
      description:
        "County assemblies frequently prioritize administrative comforts over primary healthcare. In Nairobi County, proposed office renovations received tenfold the funding allocated for sub-county clinic medicines.",
      visual: (
        <div className="relative w-full h-full rounded-2xl bg-card border border-border p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-rose-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-rose-500 font-bold px-2 py-1 bg-rose-500/10 rounded-md border border-rose-500/20">
              Nairobi FY 2026/27
            </span>
            <ShieldAlert className="size-5 text-rose-500 animate-pulse" />
          </div>

          <div className="my-auto space-y-6 z-10">
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="text-muted-foreground font-medium">Governor's Office Renovations</span>
                <span className="text-rose-500 font-bold text-lg">KES 450M</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: ease.out }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="text-muted-foreground font-medium">Dispensary Medical Supplies</span>
                <span className="text-emerald-500 font-bold text-lg">KES 45M</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "10%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: ease.out }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground/60 text-center border-t border-border pt-3 z-10">
            Source: Section 107 of PFM Act requires balanced allocation guidelines.
          </div>
        </div>
      ),
    },
    {
      badge: "The Complexity Wall",
      title: "PDF mazes vs Actionable summaries",
      subtitle: "3,000+ Pages of jargon",
      description:
        "County treasuries publish financial papers as thousands of pages of scanning-unfriendly, jargon-heavy PDF files. We translate this mountain of text into 60-second video bytes and local storyboards.",
      visual: (
        <div className="relative w-full h-full rounded-2xl bg-card border border-border p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
              Technical Documents
            </span>
            <FileText className="size-5 text-blue-400" />
          </div>

          <div className="my-auto relative flex justify-center items-center z-10 h-32">
            <motion.div
              initial={{ rotate: -8, y: 10, x: -15 }}
              className="absolute w-28 h-36 bg-muted border border-border rounded-lg p-2 opacity-40 shadow-md flex flex-col gap-1.5"
            >
              <div className="h-2 w-1/2 bg-border rounded" />
              <div className="h-1.5 w-full bg-border/60 rounded" />
              <div className="h-1.5 w-5/6 bg-border/60 rounded" />
              <div className="h-1.5 w-full bg-border/60 rounded" />
            </motion.div>
            <motion.div
              initial={{ rotate: 4, y: -5, x: 15 }}
              className="absolute w-28 h-36 bg-muted border border-border rounded-lg p-2 opacity-70 shadow-md flex flex-col gap-1.5"
            >
              <div className="h-2 w-2/3 bg-border rounded" />
              <div className="h-1.5 w-full bg-border/80 rounded" />
              <div className="h-1.5 w-4/5 bg-border/80 rounded" />
              <div className="h-1.5 w-full bg-border/80 rounded" />
            </motion.div>
            <motion.div
              initial={{ y: 0 }}
              className="absolute w-32 h-44 bg-card border-2 border-primary rounded-xl p-2.5 shadow-2xl flex flex-col justify-between"
            >
              <div className="h-1 w-8 bg-border rounded-full mx-auto mb-1.5" />
              <div className="flex-1 rounded bg-primary/10 border border-primary/20 p-1 flex flex-col justify-between overflow-hidden">
                <div className="h-1.5 w-3/4 bg-primary/40 rounded" />
                <div className="h-1.5 w-full bg-border rounded" />
                <div className="h-1.5 w-5/6 bg-border rounded" />
                <div className="h-3 w-full bg-primary/30 rounded flex items-center justify-center">
                  <span className="text-[5px] text-primary font-bold">Watch Explainer Video</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-[11px] text-muted-foreground/60 text-center border-t border-border pt-3 z-10">
            Translating complex budget policies into street slang.
          </div>
        </div>
      ),
    },
    {
      badge: "The Exclusion Window",
      title: "Townhalls at 10 AM on weekdays?",
      subtitle: "Unreachable Public Hearings",
      description:
        "County assemblies hold constitutional public hearings during working hours, excluding the youth demographic (18–34). Budget Ndio Story provides hyper-local alerts and digital templates to file submissions anytime.",
      visual: (
        <div className="relative w-full h-full rounded-2xl bg-card border border-border p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-amber-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20">
              Statutory Barriers
            </span>
            <Calendar className="size-5 text-amber-500" />
          </div>

          <div className="my-auto space-y-3 z-10">
            <div className="p-3 bg-muted/60 border border-border rounded-xl flex gap-3 items-center">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                10 AM
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground">County Budget Hearing</h4>
                <p className="text-[10px] text-muted-foreground">Held inside assembly chamber boards</p>
              </div>
              <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-500 font-black px-2 py-0.5 rounded">
                Empty Room
              </span>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 items-center">
              <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary animate-pulse">
                📲
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-primary">Budget Ndio Story Alert</h4>
                <p className="text-[10px] text-primary/70">Submit memorandum from your browser</p>
              </div>
              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground/60 text-center border-t border-border pt-3 z-10">
            Making participation inclusive, decentralized, and continuous.
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background border-y border-border"
    >
      {/* ── Mobile list ── */}
      <div className="md:hidden w-full px-6 py-20 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.expo }}
          className="text-center space-y-4 max-w-md mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-widest text-primary font-black">
            The Civic Challenge
          </span>
          <h2 className="text-3xl font-black text-foreground leading-tight tracking-tight">
            Bridging the core policy disconnect
          </h2>
          <p className="text-sm text-muted-foreground">
            Kenya's public finance system is structured for transparency, but
            inaccessible to the public. Here's how we close the gap.
          </p>
        </motion.div>

        <div className="space-y-12">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: ease.expo, delay: 0.05 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-widest font-black text-primary">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground">{item.subtitle}</p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="aspect-square max-w-sm mx-auto w-full bg-card rounded-2xl border border-border p-4">
                {item.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Desktop sticky scroll ── */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-12 relative min-h-[300vh]">
        <div className="sticky top-0 h-screen w-full flex items-center gap-12 py-20">

          {/* Left text panel */}
          <div className="w-1/2 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: ease.expo }}
            >
              <span className="text-xs uppercase tracking-widest text-primary font-black">
                The Civic Challenge
              </span>
              <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tight mt-3">
                Bridging the core <br />
                policy disconnect.
              </h2>
            </motion.div>

            <div className="relative h-64">
              {items.map((item, idx) => (
                <TextPanel
                  key={idx}
                  item={item}
                  scrollYProgress={scrollYProgress}
                  index={idx}
                  total={items.length}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>

          {/* Right visual panel */}
          <div className="w-1/2 h-[450px] relative rounded-3xl bg-card/30 border border-border/50 overflow-hidden flex items-center justify-center p-8 backdrop-blur-xs">
            {items.map((item, idx) => (
              <VisualPanel
                key={idx}
                item={item}
                scrollYProgress={scrollYProgress}
                index={idx}
                total={items.length}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
