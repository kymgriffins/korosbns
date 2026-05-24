"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/utils";
import { TrendingDown, FileText, Calendar, ArrowRight, ShieldAlert, BadgeAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/button";

interface DisconnectItem {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  visual: React.ReactNode;
}

export default function FramerStickyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for the vertical sticky-scroll container
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
        <div className="relative w-full h-full rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Neon Glow Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-rose-500/10 rounded-full blur-[80px]" />
          
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-rose-500 font-bold px-2 py-1 bg-rose-500/10 rounded-md border border-rose-500/20">
              Nairobi FY 2026/27
            </span>
            <ShieldAlert className="size-5 text-rose-500 animate-pulse" />
          </div>

          <div className="my-auto space-y-6 z-10">
            {/* Top Bar: Renovations */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="text-zinc-400 font-medium">Governor's Office Renovations</span>
                <span className="text-rose-500 font-bold text-lg">KES 450M</span>
              </div>
              <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>

            {/* Bottom Bar: Medicine */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="text-zinc-400 font-medium">Dispensary Medical Supplies</span>
                <span className="text-emerald-500 font-bold text-lg">KES 45M</span>
              </div>
              <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "10%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 text-center border-t border-zinc-900 pt-3 z-10">
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
        <div className="relative w-full h-full rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
              Technical Documents
            </span>
            <FileText className="size-5 text-blue-400" />
          </div>

          <div className="my-auto relative flex justify-center items-center z-10 h-32">
            {/* Stack of complex PDF sheets falling behind */}
            <motion.div
              style={{ rotate: -8, y: 10, x: -15 }}
              className="absolute w-28 h-36 bg-zinc-900 border border-zinc-800 rounded-lg p-2 opacity-40 shadow-md flex flex-col gap-1.5"
            >
              <div className="h-2 w-1/2 bg-zinc-800 rounded" />
              <div className="h-1.5 w-full bg-zinc-800/60 rounded" />
              <div className="h-1.5 w-5/6 bg-zinc-800/60 rounded" />
              <div className="h-1.5 w-full bg-zinc-800/60 rounded" />
            </motion.div>

            <motion.div
              style={{ rotate: 4, y: -5, x: 15 }}
              className="absolute w-28 h-36 bg-zinc-900 border border-zinc-700 rounded-lg p-2 opacity-70 shadow-md flex flex-col gap-1.5"
            >
              <div className="h-2 w-2/3 bg-zinc-700 rounded" />
              <div className="h-1.5 w-full bg-zinc-800 rounded" />
              <div className="h-1.5 w-4/5 bg-zinc-800 rounded" />
              <div className="h-1.5 w-full bg-zinc-800 rounded" />
            </motion.div>

            {/* Premium SmartPhone Frame Overlay in front */}
            <motion.div
              style={{ y: 0 }}
              className="absolute w-32 h-44 bg-zinc-950 border-2 border-primary rounded-xl p-2.5 shadow-2xl flex flex-col justify-between"
            >
              <div className="h-1 w-8 bg-zinc-800 rounded-full mx-auto mb-1.5" />
              <div className="flex-1 rounded bg-primary/10 border border-primary/20 p-1 flex flex-col justify-between overflow-hidden">
                <div className="h-1.5 w-3/4 bg-primary/40 rounded" />
                <div className="h-1.5 w-full bg-zinc-800 rounded" />
                <div className="h-1.5 w-5/6 bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-primary/30 rounded flex items-center justify-center">
                  <span className="text-[5px] text-primary font-bold">Watch Explainer Video</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-[11px] text-zinc-500 text-center border-t border-zinc-900 pt-3 z-10">
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
        <div className="relative w-full h-full rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-amber-500/10 rounded-full blur-[80px]" />

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/20">
              Statutory Barriers
            </span>
            <Calendar className="size-5 text-amber-500" />
          </div>

          <div className="my-auto space-y-3 z-10">
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex gap-3 items-center">
              <div className="size-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                10 AM
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-300">County Budget Hearing</h4>
                <p className="text-[10px] text-zinc-500">Held inside assembly chamber boards</p>
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

          <div className="text-[11px] text-zinc-500 text-center border-t border-zinc-900 pt-3 z-10">
            Making participation inclusive, decentralized, and continuous.
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black border-y border-zinc-900"
    >
      {/* MOBILE LIST (Under md: viewport sizes, displays as a standard column layout to avoid touch jank) */}
      <div className="md:hidden w-full px-6 py-20 space-y-16">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <span className="inline-block text-xs uppercase tracking-widest text-primary font-black">
            The Civic Challenge
          </span>
          <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
            Bridging the core policy disconnect
          </h2>
          <p className="text-sm text-zinc-400">
            Kenya's public finance system is structured for transparency, but inaccessible to the public. Here's how we close the gap.
          </p>
        </div>

        <div className="space-y-12">
          {items.map((item, index) => (
            <div key={index} className="space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-widest font-black text-primary">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-zinc-400">{item.subtitle}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="aspect-square max-w-sm mx-auto w-full bg-zinc-950 rounded-2xl border border-zinc-900 p-4">
                {item.visual}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP STICKY SCROLL (>= 768px Viewport) */}
      <div className="hidden md:block w-full max-w-7xl mx-auto px-12 relative min-h-[300vh]">
        <div className="sticky top-0 h-screen w-full flex items-center gap-12 py-20">
          
          {/* Left Text Panel */}
          <div className="w-1/2 space-y-16">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-black">
                The Civic Challenge
              </span>
              <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight mt-3">
                Bridging the core <br />
                policy disconnect.
              </h2>
            </div>

            <div className="relative h-64">
              {items.map((item, idx) => {
                const start = idx / items.length;
                const end = (idx + 1) / items.length;
                
                // Opacity changes linked to vertical scroll progress
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const opacity = useTransform(
                  scrollYProgress,
                  [start * 0.9, start * 0.9 + 0.1, end * 0.9 - 0.05, end * 0.9],
                  [0.05, 1, 1, 0.05]
                );

                // Compositor-friendly transform link
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const y = useTransform(
                  scrollYProgress,
                  [start * 0.9, start * 0.9 + 0.1, end * 0.9],
                  [15, 0, -15]
                );

                return (
                  <motion.div
                    key={idx}
                    style={shouldReduceMotion ? {} : { opacity, y }}
                    className="absolute inset-0 flex flex-col justify-start space-y-4"
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      {item.badge}
                    </span>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-400">{item.subtitle}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Panel */}
          <div className="w-1/2 h-[450px] relative rounded-3xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden flex items-center justify-center p-8 backdrop-blur-xs">
            {items.map((item, idx) => {
              const start = idx / items.length;
              const end = (idx + 1) / items.length;

              // Scale & Opacity transitions for cards
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const opacity = useTransform(
                scrollYProgress,
                [start * 0.9, start * 0.9 + 0.08, end * 0.9 - 0.05, end * 0.9],
                [0, 1, 1, 0]
              );

              // eslint-disable-next-line react-hooks/rules-of-hooks
              const scale = useTransform(
                scrollYProgress,
                [start * 0.9, start * 0.9 + 0.1, end * 0.9 - 0.05, end * 0.9],
                [0.92, 1, 1, 0.95]
              );

              return (
                <motion.div
                  key={idx}
                  style={shouldReduceMotion ? {} : { opacity, scale }}
                  className="absolute inset-0 p-8 flex items-center justify-center"
                >
                  <div className="w-full h-full max-w-sm">
                    {item.visual}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
