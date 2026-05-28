"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  Shield, Scale, Building2, ArrowRight, BookOpen, Landmark, FileText, Gavel,
} from "lucide-react";
import { Button } from "@/ui/button";
import { useStages } from "@/hooks/use-stages";

const MODULE_ICONS = [Shield, Scale, Building2, BookOpen, Landmark, FileText, Gavel];
const MODULE_COLOR_CLASSES = [
  "from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-500",
  "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-500",
  "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-500",
  "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-500",
  "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-500",
  "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-500",
  "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-500",
];

export default function HorizontalCycleSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { stages, loading } = useStages();

  const modules = useMemo(
    () =>
      stages.map((mod, index) => ({
        id: mod.id,
        title: `${index + 1}. ${mod.title}`,
        badge: mod.badge,
        badgeName: mod.badgeName,
        description: mod.description,
        icon: MODULE_ICONS[index % MODULE_ICONS.length],
        colorClass: MODULE_COLOR_CLASSES[index % MODULE_COLOR_CLASSES.length],
      })),
    [stages],
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-75%"]);
  const trackWidth = modules.length > 0 ? `${Math.max(modules.length * 100, 400)}%` : "400%";

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background border-b border-border overflow-visible md:h-[300vh]"
    >
      <div className="md:sticky md:top-0 md:h-screen w-full flex flex-col justify-center overflow-hidden py-16 md:py-0">
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
                Civic Learning Modules
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

        {loading && modules.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="md:hidden flex w-full overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-6 scrollbar-none">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className="snap-center shrink-0 w-[280px] rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between h-[300px]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{mod.badge}</span>
                        <div className={`p-2 rounded-lg bg-card border ${mod.colorClass.split(" ").slice(2).join(" ")}`}>
                          <Icon className="size-5" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-foreground leading-tight">{mod.title}</h3>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Badge: {mod.badgeName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold pt-4 border-t border-border/60">
                      <span>Explore module</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block w-full overflow-visible relative">
              <motion.div
                ref={trackRef}
                style={{
                  ...(shouldReduceMotion ? {} : { x }),
                  width: trackWidth,
                }}
                className="flex gap-8 px-12 md:px-24"
              >
                {modules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.id}
                      className="w-[380px] shrink-0 rounded-3xl border border-border/80 bg-card/20 p-8 flex flex-col justify-between h-[360px] backdrop-blur-xs hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{mod.badge}</span>
                          <div className={`p-3 rounded-xl bg-card border ${mod.colorClass.split(" ").slice(2).join(" ")}`}>
                            <Icon className="size-6" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">
                            {mod.title}
                          </h3>
                          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest bg-card px-2 py-0.5 rounded border border-border">
                            {mod.badgeName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-border/40">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          Module {String(mod.id).padStart(2, "0")}
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
          </>
        )}
      </div>
    </section>
  );
}
