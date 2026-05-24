"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { 
  Shield, Scale, Landmark, Link, CalendarRange, 
  Gavel, FileClock, ShieldCheck, ArrowRight 
} from "lucide-react";
import { Button } from "@/ui/button";

interface StageCard {
  id: number;
  title: string;
  badge: string;
  badgeName: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string;
}

const STAGES: StageCard[] = [
  {
    id: 1,
    title: "1. Constitution",
    badge: "🛡️",
    badgeName: "DocNative",
    description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution.",
    icon: Shield,
    colorClass: "from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-500",
  },
  {
    id: 2,
    title: "2. Budget Policy Statement",
    badge: "⚖️",
    badgeName: "VertDecoder",
    description: "Audit macroeconomic forecasts, expenditure ceilings, and transfers to county governments.",
    icon: Scale,
    colorClass: "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-500",
  },
  {
    id: 3,
    title: "3. Division of Revenue",
    badge: "🏛️",
    badgeName: "CountyCart",
    description: "Inspect the Division of Revenue Bill (DoRB) dividing audited national taxes between levels.",
    icon: Landmark,
    colorClass: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-500",
  },
  {
    id: 4,
    title: "4. County Fiscal Strategy",
    badge: "🔗",
    badgeName: "ChainStrat",
    description: "Audit county expenditure ceilings and department allocations before appropriation.",
    icon: Link,
    colorClass: "from-teal-500/10 to-teal-600/5 border-teal-500/20 text-teal-500",
  },
  {
    id: 5,
    title: "5. CIDP + ADP",
    badge: "📅",
    badgeName: "AppropNative",
    description: "Track county 5-year master plans (CIDP) and inspect the yearly execution slices (ADP).",
    icon: CalendarRange,
    colorClass: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-500",
  },
  {
    id: 6,
    title: "6. Appropriation Bill",
    badge: "🔨",
    badgeName: "Watchdog",
    description: "Verify the legal authorization acts passed by assemblies that allow county spending.",
    icon: Gavel,
    colorClass: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-500",
  },
  {
    id: 7,
    title: "7. COB Reports",
    badge: "📊",
    badgeName: "PartReady",
    description: "Review implementation reports tracking county absorption rates and overhead spending.",
    icon: FileClock,
    colorClass: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-500",
  },
  {
    id: 8,
    title: "8. Participation Toolkit",
    badge: "🗺️",
    badgeName: "Cartographer",
    description: "Equip yourself with structured templates to submit written budget memoranda.",
    icon: ShieldCheck,
    colorClass: "from-fuchsia-500/10 to-fuchsia-600/5 border-fuchsia-500/20 text-fuchsia-500",
  },
];

export default function HorizontalCycleSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking for vertical section scroll mapping to horizontal x offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform mapping vertical scroll (0 to 1) to horizontal movement (0px to -trackWidth)
  // For safety, we map to translate percentages so it adapts without exact pixel widths
  const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-75%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-zinc-950 border-b border-zinc-900 overflow-visible md:h-[300vh]"
    >
      {/* Sticky Frame for Desktop */}
      <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col justify-center overflow-hidden py-16 md:py-0">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary font-black">
                The Learning Path
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                The 8-Stage Budget Cycle
              </h2>
              <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
                Step-by-step interactive courses covering statutory policies from constitutionality to hyper-local memorandum submission.
              </p>
            </div>
            <a href="/learn" className="shrink-0">
              <Button className="rounded-full px-6 gap-2 bg-white text-black hover:bg-zinc-200">
                Start Learning Now <ArrowRight className="size-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* MOBILE HORIZONTAL LIST (Simple Snap Scroll to avoid touch jank) */}
        <div className="md:hidden flex w-full overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-6 scrollbar-none">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className="snap-center shrink-0 w-[280px] rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between h-[300px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{stage.badge}</span>
                    <div className={`p-2 rounded-lg bg-zinc-900 border ${stage.colorClass.split(" ").slice(2).join(" ")}`}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white leading-tight">
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Badge: {stage.badgeName}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold pt-4 border-t border-zinc-800/60">
                  <span>Explore Stage {stage.id}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP HORIZONTAL SLIDER (Vertical Scroll Link) */}
        <div className="hidden md:block w-full overflow-visible relative">
          <motion.div
            ref={trackRef}
            style={shouldReduceMotion ? {} : { x }}
            className="flex gap-8 px-12 md:px-24 w-[400%]"
          >
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="w-[380px] shrink-0 rounded-3xl border border-zinc-800/80 bg-zinc-900/20 p-8 flex flex-col justify-between h-[360px] backdrop-blur-xs hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{stage.badge}</span>
                      <div className={`p-3 rounded-xl bg-zinc-950/80 border ${stage.colorClass.split(" ").slice(2).join(" ")}`}>
                        <Icon className="size-6" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                        {stage.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {stage.badgeName}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-zinc-800/40">
                    <span className="text-zinc-500 group-hover:text-primary transition-colors">Course Stage 0{stage.id}</span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Start <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
