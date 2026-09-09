"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import { EditorialPill } from "@/components/ui/editorial";

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

  // Accurate IntersectionObserver for scroll-spy active state tracking
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observers: IntersectionObserver[] = [];
    items.forEach((item, idx) => {
      const el = document.getElementById(`cycle-stage-${item.id || idx}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(idx);
            }
          });
        },
        {
          rootMargin: "-20% 0px -40% 0px",
          threshold: 0.1,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items]);

  const scrollToItem = useCallback(
    (index: number) => {
      setActiveIndex(index);
      const targetId = `cycle-stage-${items[index]?.id || index}`;
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [items]
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Sticky Left Control Rail (Full-height column stretches, inner div sticks at top-24) */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="space-y-3">
              {eyebrow && (
                <EditorialPill dot pulse variant="default">
                  {eyebrow}
                </EditorialPill>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-[1.08]">
                {title}
              </h2>
              {description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Interactive Stepper Navigation (Desktop) */}
            <div className="hidden lg:block space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Stage {activeIndex + 1} of {items.length}
                </p>
                <span className="text-[11px] font-mono font-bold text-primary">
                  {Math.round(((activeIndex + 1) / items.length) * 100)}% Complete
                </span>
              </div>

              {/* Progress track bar */}
              <div className="h-1 w-full bg-muted/60 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
                />
              </div>

              <div className="space-y-1.5">
                {items.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  const isPast = activeIndex > idx;

                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => scrollToItem(idx)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs sm:text-sm transition-all duration-200",
                        isActive
                          ? "bg-foreground text-background font-bold shadow-sm"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "text-xs font-mono font-bold shrink-0 flex items-center justify-center size-5 rounded",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : isPast
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isPast ? <Check className="size-3" /> : item.step}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.date ? (
                        <span
                          className={cn(
                            "text-[10px] font-mono shrink-0 ml-2 hidden sm:inline",
                            isActive ? "text-background/80 font-semibold" : "text-muted-foreground/60"
                          )}
                        >
                          {item.date}
                        </span>
                      ) : (
                        <ChevronRight
                          className={cn(
                            "size-3.5 shrink-0 transition-transform",
                            isActive ? "rotate-90 text-background" : "text-muted-foreground group-hover:translate-x-0.5"
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
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                >
                  <span>{cta.label}</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Compact, High-Craft Editorial Cards Scrolling Past Left Rail */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 pb-8">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            const isDelivery =
              item.title.toLowerCase().includes("delivery") ||
              item.title.toLowerCase().includes("implementation");

            return (
              <div
                key={item.id || idx}
                id={`cycle-stage-${item.id || idx}`}
                className={cn(
                  "group transition-all duration-300 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm hover:border-border hover:shadow-md overflow-hidden backdrop-blur-sm",
                  isActive ? "border-primary/60 ring-1 ring-primary/20 bg-card" : "",
                  isDelivery ? "border-primary/40 bg-gradient-to-br from-card to-primary/[0.03]" : ""
                )}
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start justify-between">
                  <div className="space-y-3 flex-1 min-w-0">
                    {/* Stage Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-mono font-black px-2 py-0.5 rounded",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        STAGE {item.step}
                      </span>
                      {item.badge && (
                        <span className="rounded-full border border-border/40 bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                      {item.date && (
                        <span className="text-xs font-mono font-medium text-muted-foreground sm:ml-auto">
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Stage Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {/* Special Delivery Engine Cockpit for Delivery / Implementation */}
                    {isDelivery && item.stat && (
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5">
                          <span className="text-xs font-bold font-mono text-primary">
                            {item.stat.value}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                            {item.stat.label}
                          </span>
                        </div>
                        {item.cta && (
                          <Link
                            href={item.cta.href}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>{item.cta.label}</span>
                            <ArrowUpRight className="size-3" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Compact Media Thumbnail Preview */}
                  {item.image && (
                    <div className="relative w-full sm:w-44 md:w-48 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-muted shrink-0 shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
