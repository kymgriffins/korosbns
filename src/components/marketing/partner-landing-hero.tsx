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

/** Map font family strings to their Google Fonts CSS import names. */
const GOOGLE_FONT_MAP: Record<string, string> = {
  "Inter, sans-serif": "Inter:wght@400;500;600;700",
  "Roboto, sans-serif": "Roboto:wght@400;500;700",
  "Open Sans, sans-serif": "Open+Sans:wght@400;600;700",
  "Lato, sans-serif": "Lato:wght@400;700;900",
  "Poppins, sans-serif": "Poppins:wght@400;500;600;700",
  "Nunito, sans-serif": "Nunito:wght@400;600;700",
  "Work Sans, sans-serif": "Work+Sans:wght@400;500;600;700",
  "DM Sans, sans-serif": "DM+Sans:wght@400;500;700",
  "Plus Jakarta Sans, sans-serif": "Plus+Jakarta+Sans:wght@400;500;600;700",
  "Space Grotesk, sans-serif": "Space+Grotesk:wght@400;500;600;700",
  "Outfit, sans-serif": "Outfit:wght@400;500;600;700",
  "Manrope, sans-serif": "Manrope:wght@400;500;600;700",
  "Sora, sans-serif": "Sora:wght@400;500;600;700",
};
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
  /** Hero CTA button styling */
  heroCta?: {
    primaryVariant?: "white" | "outline" | "primary" | "secondary";
    primaryColor?: string;
    secondaryVariant?: "white" | "outline" | "primary" | "secondary";
    secondaryColor?: string;
  };
  /** Hero text colours (for dark backgrounds) */
  heroColors?: {
    title?: string;
    lede?: string;
    eyebrow?: string;
  };
  /** Google Font family override */
  fontFamily?: string;
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
  heroCta,
  heroColors,
  fontFamily,
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

  // Load Google Font if fontFamily is set
  useEffect(() => {
    if (!fontFamily || typeof document === "undefined") return;
    const fontSpec = GOOGLE_FONT_MAP[fontFamily];
    if (!fontSpec) return;
    const id = `google-font-${fontSpec.replace(/[^a-z0-9]/gi, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontSpec}&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);

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

  const primaryBtnStyle: React.CSSProperties = {};
  const secondaryBtnStyle: React.CSSProperties = {};
  const titleStyle: React.CSSProperties = {};
  const ledeStyle: React.CSSProperties = {};
  const eyebrowStyle: React.CSSProperties = {};

  if (fontFamily) {
    (primaryBtnStyle as any).fontFamily = fontFamily;
    (secondaryBtnStyle as any).fontFamily = fontFamily;
    (titleStyle as any).fontFamily = fontFamily;
    (ledeStyle as any).fontFamily = fontFamily;
    (eyebrowStyle as any).fontFamily = fontFamily;
  }

  if (heroColors?.title) (titleStyle as any).color = heroColors.title;
  if (heroColors?.lede) (ledeStyle as any).color = heroColors.lede;
  if (heroColors?.eyebrow) (eyebrowStyle as any).color = heroColors.eyebrow;

  const pVariant = heroCta?.primaryVariant ?? "white";
  const sVariant = heroCta?.secondaryVariant ?? "outline";
  const pColor = heroCta?.primaryColor;
  const sColor = heroCta?.secondaryColor;

  if (pVariant === "primary" && pColor) (primaryBtnStyle as any).backgroundColor = pColor;
  if (pVariant === "primary" && !pColor) (primaryBtnStyle as any).backgroundColor = "hsl(var(--primary))";
  if (pVariant === "primary") (primaryBtnStyle as any).color = "hsl(var(--primary-foreground))";
  if (pVariant === "secondary" && pColor) (primaryBtnStyle as any).backgroundColor = pColor;
  if (pVariant === "secondary" && !pColor) (primaryBtnStyle as any).backgroundColor = "hsl(var(--secondary))";
  if (pVariant === "secondary") (primaryBtnStyle as any).color = "hsl(var(--secondary-foreground))";

  if (sVariant === "primary" && sColor) (secondaryBtnStyle as any).backgroundColor = sColor;
  if (sVariant === "primary" && !sColor) (secondaryBtnStyle as any).backgroundColor = "hsl(var(--primary))";
  if (sVariant === "primary") (secondaryBtnStyle as any).color = "hsl(var(--primary-foreground))";
  if (sVariant === "secondary" && sColor) (secondaryBtnStyle as any).backgroundColor = sColor;
  if (sVariant === "secondary" && !sColor) (secondaryBtnStyle as any).backgroundColor = "hsl(var(--secondary))";
  if (sVariant === "secondary") (secondaryBtnStyle as any).color = "hsl(var(--secondary-foreground))";

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
              fetchPriority={index === 0 ? "high" : "auto"}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px"
              quality={80}
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
          <p className={styles["partner-reel-eyebrow"]} style={eyebrowStyle}>{eyebrow}</p>
          <h1 className={styles["partner-reel-title"]} style={titleStyle}>{title}</h1>
          <p className={styles["partner-reel-lede"]} style={ledeStyle}>{lede}</p>
          <div className={styles["partner-reel-cta"]}>
            <Link
              href={primary.href}
              className={styles["partner-reel-cta-primary"]}
              style={pVariant === "white" ? undefined : primaryBtnStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {primary.label}
            </Link>
            <Link
              href={secondary.href}
              className={styles["partner-reel-cta-secondary"]}
              style={sVariant === "outline" && !sColor ? undefined : secondaryBtnStyle}
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
