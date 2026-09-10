"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  PARTNER_HERO_PROGRAMME_LINES,
  PARTNER_LANDING_STILLS,
} from "@/content/partner-landing";
import { fadeIn } from "@/motion/variants";
import styles from "./partner-landing-hero.module.css";

const AUTO_MS = 6500;
const SWIPE_PX = 48;

/**
 * Partner homepage hero — project reel under the marketing nav.
 * Minimal progress + dots; programme names only (phrases live in sections).
 */
export default function PartnerLandingHero() {
  const slides = PARTNER_LANDING_STILLS;
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

  return (
    <section
      className={styles["partner-reel-hero"]}
      aria-roledescription="carousel"
      aria-label="Project evidence from Budget Ndio Story programmes"
    >
      <div
        className={styles["partner-reel-segments"]}
        role="tablist"
        aria-label="Story progress"
      >
        {slides.map((slide, i) => {
          const fill =
            i < index ? 1 : i === index ? (reduceMotion ? 1 : segmentProgress) : 0;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slide.storyTitle}
              onClick={() => goTo(i)}
              className={styles["partner-reel-segment"]}
            >
              <span
                className={styles["partner-reel-segment-fill"]}
                style={{ "--fill": String(fill) } as CSSProperties}
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className={styles["partner-reel-slide"]}
          variants={fadeIn}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit={reduceMotion ? undefined : "hidden"}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
            setPaused(false);
          }}
        >
          <div className={styles["partner-reel-media"]}>
            <Image
              src={current.src}
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className={styles["partner-reel-scrim"]} aria-hidden />

          <div
            className={styles["partner-reel-stage"]}
            onClick={onZoneClick}
            role="presentation"
          >
            <div className={styles["partner-reel-story"]}>
              <h1 className={styles["partner-reel-title"]}>{current.storyTitle}</h1>
              <p className={styles["partner-reel-desc"]}>{current.storyLine}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <nav className={styles["partner-reel-programmes"]} aria-label="Three programmes">
        {PARTNER_HERO_PROGRAMME_LINES.map((item) => {
          const active = current.programme === item.slug;
          return (
            <Link
              key={item.slug}
              href={item.href}
              className={styles["partner-reel-programme"]}
              data-active={active ? "true" : "false"}
              onClick={(e) => e.stopPropagation()}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className={styles["partner-reel-dots"]}
        role="group"
        aria-label="Select project still"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={styles["partner-reel-dot"]}
            data-active={i === index ? "true" : "false"}
            aria-label={slide.storyTitle}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
