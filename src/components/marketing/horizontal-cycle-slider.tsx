"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  Shield, Scale, Building2, ArrowRight
} from "lucide-react";
import { Button } from "@/ui/button";
import { ease } from "@/motion/variants";

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
    title: "3. Infrastructure Fund",
    badge: "🏗️",
    badgeName: "InfraFund",
    description: "Explore Kenya's National Infrastructure Fund for long-term investments in transport, energy, water, and digital infrastructure.",
    icon: Building2,
    colorClass: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-500",
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
      className="relative w-full bg-background border-b border-border overflow-visible md:h-[300vh]"
    >
      {/* Sticky Frame for Desktop */}
      <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col justify-center overflow-hidden py-16 md:py-0">

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-3"
            >
              <span className="text-xs uppercase tracking-widest text-primary font-black">
                The Learning Path
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
                The 8-Stage Budget Cycle
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                Step-by-step interactive courses covering statutory policies from constitutionality to hyper-local memorandum submission.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="shrink-0"
            >
              <a href="/learn">
                <Button className="rounded-full px-6 gap-2 bg-foreground text-background hover:bg-foreground/90">
                  Start Learning Now <ArrowRight className="size-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* MOBILE HORIZONTAL LIST */}
        <div className="md:hidden flex w-full overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-6 scrollbar-none">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className="snap-center shrink-0 w-[280px] rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between h-[300px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{stage.badge}</span>
                    <div className={`p-2 rounded-lg bg-card border ${stage.colorClass.split(" ").slice(2).join(" ")}`}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-foreground leading-tight">
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Badge: {stage.badgeName}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold pt-4 border-t border-border/60">
                  <span>Explore Stage {stage.id}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP HORIZONTAL SLIDER */}
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
                  className="w-[380px] shrink-0 rounded-3xl border border-border/80 bg-card/20 p-8 flex flex-col justify-between h-[360px] backdrop-blur-xs hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{stage.badge}</span>
                      <div className={`p-3 rounded-xl bg-card border ${stage.colorClass.split(" ").slice(2).join(" ")}`}>
                        <Icon className="size-6" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">
                        {stage.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest bg-card px-2 py-0.5 rounded border border-border">
                          {stage.badgeName}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-border/40">
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      Course Stage 0{stage.id}
                    </span>
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
