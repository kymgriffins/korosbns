"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import { EditorialPill } from "@/components/ui/editorial";
import { ParallaxWrapper } from "./parallax-wrapper";

export interface StickyCycleItem {
  id: string;
  step: string;
  title: string;
  description: string;
  date?: string;
  badge?: string;
  image?: string;
  imageAlt?: string;
  highlight?: string;
  stat?: { value: string; label: string };
  cta?: { label: string; href: string };
}

export interface StickyStackedCycleProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  items: StickyCycleItem[];
  className?: string;
  cta?: { label: string; href: string };
}

export function StickyStackedCycle({
  eyebrow = "Cycle & Delivery",
  title,
  description,
  items,
  className,
  cta,
}: StickyStackedCycleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const stepFraction = 1 / items.length;
      const idx = Math.min(
        Math.floor(latest / stepFraction),
        items.length - 1
      );
      if (idx >= 0 && idx !== activeIndex) {
        setActiveIndex(idx);
      }
    });
  }, [scrollYProgress, items.length, activeIndex]);

  const scrollToItem = (index: number) => {
    const el = document.getElementById(`cycle-stage-${items[index]?.id || index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sticky Left Control Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
          <div className="space-y-4">
            {eyebrow && (
              <EditorialPill dot pulse variant="default">
                {eyebrow}
              </EditorialPill>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.05]">
              {title}
            </h2>
            {description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Interactive Stepper Navigation (Clickable to jump) */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Stages · Live Progression ({activeIndex + 1} of {items.length})
            </p>
            <div className="space-y-1.5">
              {items.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => scrollToItem(idx)}
                    className={cn(
                      "group w-full flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all duration-200",
                      isActive
                        ? "bg-foreground text-background font-bold shadow-md scale-[1.02]"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-xs font-black",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {item.step}
                      </span>
                      <span className="truncate max-w-[200px] sm:max-w-[260px]">
                        {item.title}
                      </span>
                    </div>
                    {item.date ? (
                      <span
                        className={cn(
                          "text-[10px] font-semibold shrink-0 hidden sm:inline",
                          isActive ? "text-background/80" : "text-muted-foreground/70"
                        )}
                      >
                        {item.date}
                      </span>
                    ) : (
                      <ChevronRight
                        className={cn(
                          "size-4 shrink-0 transition-transform",
                          isActive ? "rotate-90 text-primary" : "text-muted-foreground group-hover:translate-x-0.5"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {cta && (
            <div className="pt-2">
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                <span>{cta.label}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Stacked Cards with Depth & Parallax */}
        <div className="lg:col-span-7 space-y-8 lg:space-y-12 pb-16">
          {items.map((item, idx) => {
            const isDelivery =
              item.title.toLowerCase().includes("delivery") ||
              item.title.toLowerCase().includes("implementation");

            return (
              <div
                key={item.id || idx}
                id={`cycle-stage-${item.id || idx}`}
                className={cn(
                  "lg:sticky lg:top-28 transition-all duration-300 rounded-3xl border border-border/60 bg-card p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden backdrop-blur-md",
                  isDelivery ? "border-primary/50 ring-1 ring-primary/20" : ""
                )}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-primary">
                      {item.step}
                    </span>
                    {item.badge && (
                      <span className="rounded-full border border-border/40 bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.date && (
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {item.date}
                    </span>
                  )}
                </div>

                {/* Stage Body */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Special Delivery Engine Cockpit for Delivery / Implementation */}
                {isDelivery && item.stat && (
                  <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Delivery Metric
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-foreground">
                        {item.stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.stat.label}
                      </p>
                    </div>
                    {item.cta && (
                      <Link
                        href={item.cta.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 shrink-0"
                      >
                        <span>{item.cta.label}</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                )}

                {/* Image Media with subtle parallax */}
                {item.image && (
                  <div className="mt-6">
                    <ParallaxWrapper speed={0.15}>
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-md group">
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      </div>
                    </ParallaxWrapper>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
