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
import {
  PARTNER_HERO_NARRATIVE,
  PARTNER_HERO_PROGRAMME_LINES,
  PARTNER_LANDING_CTA,
  PARTNER_LANDING_STILLS,
  resolvePartnerHeroNarrative,
  type PartnerLandingStill,
} from "@/content/partner-landing";
import { fadeIn } from "@/motion/variants";
import { motionEnabled } from "@/lib/design-dials";
import styles from "./partner-landing-hero.module.css";

const AUTO_MS = 6500;
const SWIPE_PX = 48;

export interface PartnerLandingHeroProps {
  heroNarrative?: {
    eyebrow?: string;
    title?: string;
    lede?: string;
  };
  stills?: PartnerLandingStill[];
  programmeLines?: Array<{ slug: string; label: string; href: string }>;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/**
 * Partner homepage hero - project reel under the marketing nav.
 * One viewport: fixed narrative, CTA above the fold, rotating evidence.
 */
export default function PartnerLandingHero({
  heroNarrative,
  stills,
  programmeLines,
  primaryCta,
  secondaryCta,
}: PartnerLandingHeroProps = {}) {
  const activeProgrammeLines =
    programmeLines && programmeLines.length > 0
      ? programmeLines
      : Array.isArray((heroNarrative as { programmeLines?: unknown })?.programmeLines) &&
          ((heroNarrative as { programmeLines: Array<{ slug: string; label: string; href: string }> }).programmeLines
            .length > 0)
        ? (heroNarrative as { programmeLines: Array<{ slug: string; label: string; href: string }> }).programmeLines
        : PARTNER_HERO_PROGRAMME_LINES;
  const candidateSlides = stills && stills.length > 0 ? stills : PARTNER_LANDING_STILLS;
  const visibleSlides = candidateSlides.filter((s) => s.visible !== false);
  const slides = visibleSlides.length > 0 ? visibleSlides : candidateSlides;
  const reduceMotion = useReducedMotion();
  const canAnimate = motionEnabled(reduceMotion);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const current = slides[index];

  const primary = {
    label: primaryCta?.label ?? PARTNER_LANDING_CTA.ctaLabel,
    href: primaryCta?.href ?? PARTNER_LANDING_CTA.ctaHref,
  };
  const secondary = {
    label: secondaryCta?.label ?? PARTNER_LANDING_CTA.secondaryLabel,
    href: secondaryCta?.href ?? PARTNER_LANDING_CTA.secondaryHref,
  };

  const goTo = useCallback(
    (next: number) => {
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
    if (!canAnimate || paused) return;
    const id = window.setTimeout(() => next(), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [index, next, paused, canAnimate]);

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

  const { eyebrow, title, lede } = resolvePartnerHeroNarrative(heroNarrative);

  return (
    <section
      className={styles["partner-reel-hero"]}
      aria-roledescription="carousel"
      aria-label="Project evidence from Budget Ndio Story programmes"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className={styles["partner-reel-slide"]}
          variants={fadeIn}
          initial={canAnimate ? "hidden" : false}
          animate="visible"
          exit={canAnimate ? "hidden" : undefined}
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
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles["partner-reel-scrim"]} aria-hidden />

      <div
        className={styles["partner-reel-stage"]}
        onClick={onZoneClick}
        role="presentation"
      >
        <div className={styles["partner-reel-narrative"]}>
          <p className={styles["partner-reel-eyebrow"]}>{eyebrow}</p>
          <h1 className={styles["partner-reel-title"]}>{title}</h1>
          <p className={styles["partner-reel-lede"]}>{lede}</p>
          <div className={styles["partner-reel-cta"]}>
            <Link
              href={primary.href}
              className={styles["partner-reel-cta-primary"]}
              onClick={(e) => e.stopPropagation()}
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className={styles["partner-reel-cta-secondary"]}
              onClick={(e) => e.stopPropagation()}
            >
              {secondary.label}
            </Link>
          </div>
        </div>

        {canAnimate ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              className={styles["partner-reel-caption"]}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {current.storyTitle}
            </motion.p>
          </AnimatePresence>
        ) : (
          <p className={styles["partner-reel-caption"]}>{current.storyTitle}</p>
        )}
      </div>

      <nav className={styles["partner-reel-programmes"]} aria-label="Three programmes">
        {activeProgrammeLines.map((item) => {
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
    </section>
  );
}
