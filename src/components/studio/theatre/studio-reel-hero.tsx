"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { getStudioReelSlides } from "@/lib/studio-reel-slides";
import { cn } from "@/utils";

const AUTO_MS = 7000;
const SWIPE_PX = 48;

export function StudioReelHero() {
  const slides = getStudioReelSlides();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const current = slides[index];

  const goTo = useCallback(
    (next: number) => {
      setSegmentProgress(0);
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (reduceMotion || paused) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / AUTO_MS);
      setSegmentProgress(p);
      if (p >= 1) {
        next();
      } else {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, next, paused, reduceMotion]);

  const onPointerDown = (e: ReactPointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    setPaused(true);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPaused(false);

    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  const onZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;
    if (x < third) prev();
    else if (x > third * 2) next();
  };

  if (!current) return null;

  const theme = getFormatTheme(current.contentType);

  return (
    <section
      className="studio-reel-hero studio-reel-hero-fixed"
      aria-roledescription="carousel"
      aria-label="BNS Studios format reel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.contentType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="studio-reel-hero-slide"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
            setPaused(false);
          }}
        >
          <div
            className={cn(
              "studio-reel-hero-media",
              current.layout === "vertical" && "studio-reel-hero-media-vertical",
            )}
          >
            <Image
              src={current.image}
              alt=""
              fill
              priority
              className={cn(
                "object-cover",
                current.imagePosition || "object-center",
              )}
              sizes="100vw"
            />
          </div>
          <div className="studio-reel-hero-scrim" aria-hidden />

          <div
            className="studio-reel-hero-stage"
            onClick={onZoneClick}
            role="presentation"
          >
            <p className="studio-reel-hero-side studio-reel-hero-side-left">
              {theme.rowEyebrow}
            </p>

            <div className="studio-reel-hero-center-block">
              <h1 className="studio-reel-hero-title">{current.label}</h1>
              {current.projectSlug ? (
                <Link
                  href={`/bns-studio/${current.projectSlug}`}
                  className="studio-reel-hero-case-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open case
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </div>

            <p className="studio-reel-hero-side studio-reel-hero-side-right">
              {current.year}
            </p>
          </div>

          <div className="studio-reel-hero-segments" role="tablist" aria-label="Format slides">
            {slides.map((slide, i) => (
              <button
                key={slide.contentType}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={slide.label}
                onClick={() => goTo(i)}
                className="studio-reel-hero-segment"
              >
                <span
                  className="studio-reel-hero-segment-fill"
                  style={{
                    transform: `scaleX(${
                      i < index ? 1 : i === index ? segmentProgress : 0
                    })`,
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
