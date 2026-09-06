"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { registerGsap, gsap, useGSAP, ScrollTrigger } from "@/motion/gsap/register";
import { usePrefersReducedMotion } from "@/motion/gsap/use-prefers-reduced-motion";
import { cn } from "@/utils";

export interface NarrativeBeat {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  quote?: {
    text: string;
    author: string;
    role?: string;
  };
  metric?: {
    value: string;
    label: string;
  };
  image: string;
  imageAlt: string;
  imageCaption?: string;
  imageBadge?: string;
}

export interface NarrativeScrollytellingCanvasProps {
  beats: NarrativeBeat[];
  className?: string;
  mediaPosition?: "left" | "right";
  accentColor?: string; // e.g. "primary", "amber-500", "rose-500"
}

export function NarrativeScrollytellingCanvas({
  beats,
  className,
  mediaPosition = "right",
  accentColor = "primary",
}: NarrativeScrollytellingCanvasProps) {
  registerGsap();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !containerRef.current || beats.length <= 1) return;

      const beatElements = containerRef.current.querySelectorAll<HTMLElement>(
        "[data-narrative-beat]",
      );

      beatElements.forEach((beatEl, idx) => {
        ScrollTrigger.create({
          trigger: beatEl,
          start: "top center+=100",
          end: "bottom center",
          onEnter: () => setActiveBeatIndex(idx),
          onEnterBack: () => setActiveBeatIndex(idx),
        });

        // Progressive text scrub illumination
        const textElements = beatEl.querySelectorAll<HTMLElement>("[data-scrub-text]");
        if (textElements.length > 0) {
          gsap.fromTo(
            textElements,
            { opacity: 0.25, y: 10 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: beatEl,
                start: "top 75%",
                end: "top 35%",
                scrub: 0.5,
              },
            },
          );
        }
      });
    },
    { scope: containerRef, dependencies: [beats, prefersReduced] },
  );

  const activeBeat = beats[activeBeatIndex] || beats[0];

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full py-12 md:py-24", className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Sticky Visual Stage (Desktop pinned, Mobile responsive) */}
        <div
          className={cn(
            "lg:col-span-5 lg:sticky lg:top-24 order-1",
            mediaPosition === "left" ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/50 bg-muted shadow-2xl">
            {beats.map((beat, idx) => (
              <div
                key={beat.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  activeBeatIndex === idx
                    ? "opacity-100 z-10 scale-100"
                    : "opacity-0 z-0 scale-105 pointer-events-none",
                )}
              >
                <Image
                  src={beat.image}
                  alt={beat.imageAlt}
                  fill
                  priority={idx === 0}
                  className="object-cover transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

                {/* Top Badge */}
                {beat.imageBadge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      {beat.imageBadge}
                    </span>
                  </div>
                )}

                {/* Bottom Caption & Live Telemetry */}
                <div className="absolute bottom-5 left-5 right-5 text-white z-20 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/70">
                    <span>
                      Chapter {idx + 1} of {beats.length}
                    </span>
                    {beat.metric && (
                      <span className="font-bold text-primary">
                        {beat.metric.value} · {beat.metric.label}
                      </span>
                    )}
                  </div>
                  {beat.imageCaption && (
                    <p className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
                      {beat.imageCaption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stepper Dots (Desktop only) */}
          <div className="hidden lg:flex items-center justify-center gap-2 pt-4">
            {beats.map((beat, idx) => (
              <button
                key={beat.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(`narrative-beat-${beat.id}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeBeatIndex === idx
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
                aria-label={`Jump to ${beat.title}`}
              />
            ))}
          </div>
        </div>

        {/* Narrative Scrolling Column */}
        <div
          className={cn(
            "lg:col-span-7 space-y-24 sm:space-y-36 order-2",
            mediaPosition === "left" ? "lg:order-2" : "lg:order-1",
          )}
        >
          {beats.map((beat, idx) => {
            const isActive = activeBeatIndex === idx;

            return (
              <article
                key={beat.id}
                id={`narrative-beat-${beat.id}`}
                data-narrative-beat
                className={cn(
                  "space-y-6 scroll-mt-28 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-70",
                )}
              >
                {/* Eyebrow & Chapter Index */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                    Chapter 0{idx + 1}
                    {beat.eyebrow ? ` · ${beat.eyebrow}` : ""}
                  </span>
                  <span className="h-px w-10 bg-primary/40" />
                </div>

                {/* Beat Headline */}
                <h3
                  data-scrub-text
                  className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.08]"
                >
                  {beat.title}
                </h3>

                {/* Paragraphs with Scrubbed Illumination */}
                <div className="space-y-5 text-base sm:text-lg text-foreground/85 leading-relaxed">
                  {beat.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      data-scrub-text
                      className={cn(
                        pIdx === 0 &&
                          "first-letter:float-left first-letter:mr-3 first-letter:font-black first-letter:text-5xl first-letter:text-primary first-letter:leading-none",
                      )}
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* Pullquote if available */}
                {beat.quote && (
                  <blockquote className="border-l-2 border-primary pl-5 py-2 my-6 bg-muted/20 rounded-r-2xl pr-5 space-y-1.5">
                    <p className="text-base sm:text-lg font-medium italic text-foreground leading-snug">
                      &ldquo;{beat.quote.text}&rdquo;
                    </p>
                    <footer className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground not-italic">
                      — {beat.quote.author}
                      {beat.quote.role ? `, ${beat.quote.role}` : ""}
                    </footer>
                  </blockquote>
                )}

                {/* Highlight Metric Callout */}
                {beat.metric && (
                  <div className="inline-flex items-center gap-3 pt-2">
                    <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-2 backdrop-blur-xs">
                      <p className="text-xl sm:text-2xl font-black text-primary tracking-tight font-mono">
                        {beat.metric.value}
                      </p>
                      <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                        {beat.metric.label}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
