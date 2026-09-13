"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";
import { motionEnabled } from "@/lib/design-dials";
import {
  Play,
  Film,
  Clapperboard,
  Headphones,
  Megaphone,
  Shield,
  TrendingUp,
  Handshake,
  Globe,
  Users,
  ArrowUpRight,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Play,
  Film,
  Clapperboard,
  Headphones,
  Megaphone,
  Shield,
  TrendingUp,
  Handshake,
  Globe,
  Users,
};

type SectionData = {
  id: string;
  type: string;
  [key: string]: unknown;
};

function str(val: unknown): string {
  return typeof val === "string" ? val : "";
}

function obj<T extends Record<string, unknown>>(val: unknown): T {
  return (typeof val === "object" && val !== null ? val : {}) as T;
}

type HeroImageSectionProps = {
  section: SectionData;
  isPlaying?: boolean;
  onPlay?: () => void;
  posterImage?: string;
};

function HeroImageSection({ section, isPlaying, onPlay, posterImage }: HeroImageSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const description = str(s.description);
  const videoUrl = str(s.videoUrl);
  const videoTitle = str(s.videoTitle);
  const playButtonLabel = str(s.playButtonLabel);
  const credit = str(s.credit);
  const badge = str(s.badge);
  const image = str(s.image);
  const imageAlt = str(s.imageAlt);

  return (
    <section
      id={section.id}
      className="w-full bg-zinc-950 text-white py-24 md:py-36 border-y border-zinc-800/80 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[350px] bg-primary/20 blur-[130px] rounded-full pointer-events-none select-none" />
      <div className={SECTION_SHELL_INNER}>
        <div className="max-w-4xl space-y-4 mb-12">
          <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
            · {eyebrow}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
          {isPlaying ? (
            <iframe
              src={videoUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="relative h-full w-full group cursor-pointer" onClick={onPlay}>
              <Image
                src={posterImage || image || "/images/media/129A3905.jpg"}
                alt={imageAlt || videoTitle || ""}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
                  <Play className="size-5 fill-current" />
                  <span className="font-heading font-bold text-sm tracking-wide">
                    {playButtonLabel}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                    {badge}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold">
                    {videoTitle}
                  </h3>
                </div>
                <p className="font-mono text-xs text-zinc-400">
                  {credit}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type FeatureGridSectionProps = {
  section: SectionData;
};

function FeatureGridSection({ section }: FeatureGridSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const description = str(s.description);
  const items = (s.items as Array<Record<string, unknown>>) || [];

  return (
    <section
      id={section.id}
      className="w-full bg-background text-foreground py-16 md:py-24 border-y border-border/50"
    >
      <div className={SECTION_SHELL_INNER}>
        <div className="max-w-4xl space-y-4 mb-16">
          <EditorialPill>{eyebrow}</EditorialPill>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const Icon = ICON_MAP[str(item.icon)] || Film;
            return (
              <motion.div
                key={str(item.title) || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 p-6 rounded-2xl border border-border/50 bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="font-mono text-xs text-primary uppercase tracking-wider font-bold">
                    {str(item.badge)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{str(item.title)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{str(item.subtitle)}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {str(item.description)}
                </p>
                {Array.isArray(item.capabilities) && item.capabilities.length > 0 && (
                  <ul className="space-y-2">
                    {(item.capabilities as string[]).map((cap) => (
                      <li key={cap} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="size-1 rounded-full bg-primary" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ImageMarqueeSectionProps = {
  section: SectionData;
};

function ImageMarqueeSection({ section }: ImageMarqueeSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const description = str(s.description);
  const images = (s.images as Array<{ src: string; alt: string; caption?: string }>) || [];
  const speedVal = str(s.speed);
  const speed = speedVal === "fast" ? 20 : speedVal === "slow" ? 40 : 30;

  return (
    <section
      id={section.id}
      className="w-full bg-muted/30 text-foreground py-16 md:py-24 border-y border-border/50 overflow-hidden"
    >
      <div className={SECTION_SHELL_INNER}>
        <div className="max-w-4xl space-y-4 mb-12">
          <EditorialPill>{eyebrow}</EditorialPill>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 w-max"
        >
          {[...images, ...images].map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="relative aspect-[4/3] w-64 sm:w-80 shrink-0 overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="320px"
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

type TextWithStatsSectionProps = {
  section: SectionData;
};

function TextWithStatsSection({ section }: TextWithStatsSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const subtitle = str(s.subtitle);
  const description = str(s.description);
  const tagline = str(s.tagline);
  const image = str(s.image);
  const imageAlt = str(s.imageAlt);
  const stats = (s.stats as Array<{ value: string; label: string }>) || [];

  return (
    <section
      id={section.id}
      className="w-full bg-background text-foreground py-16 md:py-24 border-y border-border/50"
    >
      <div className={SECTION_SHELL_INNER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <EditorialPill>{eyebrow}</EditorialPill>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
            {tagline && (
              <p className="text-sm font-medium text-primary italic">
                {tagline}
              </p>
            )}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/50">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {image && (
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type PartnerWithUsSectionProps = {
  section: SectionData;
};

function PartnerWithUsSection({ section }: PartnerWithUsSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const description = str(s.description);
  const image = str(s.image);
  const imageAlt = str(s.imageAlt);
  const primaryCta = obj<{ label: string; href: string }>(s.primaryCta);
  const secondaryCta = obj<{ label: string; href: string }>(s.secondaryCta);
  const features = (s.features as Array<{ icon: string; title: string; description: string }>) || [];
  const partnerLogos = (s.partnerLogos as Array<{ src: string; alt: string }>) || [];

  return (
    <section
      id={section.id}
      className="w-full bg-muted/30 text-foreground py-16 md:py-24 border-y border-border/50"
    >
      <div className={SECTION_SHELL_INNER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <EditorialPill>{eyebrow}</EditorialPill>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground"
            >
              {title}
            </motion.h2>
            {description && (
              <motion.p
                variants={fadeInUp}
                className="text-lg text-muted-foreground leading-relaxed max-w-xl"
              >
                {description}
              </motion.p>
            )}
            {features.length > 0 && (
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature) => {
                  const Icon = ICON_MAP[feature.icon] || Megaphone;
                  return (
                    <div key={feature.title} className="space-y-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            )}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {primaryCta.href && (
                <PillButtonGroup
                  href={primaryCta.href}
                  label={primaryCta.label}
                  variant="primary"
                />
              )}
              {secondaryCta.href && (
                <PillButtonGroup
                  href={secondaryCta.href}
                  label={secondaryCta.label}
                  variant="outline"
                />
              )}
            </motion.div>
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden"
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          )}
        </div>

        {partnerLogos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-12 mt-16 pt-12 border-t border-border/50"
          >
            {partnerLogos.map((logo) => (
              <div key={logo.alt} className="relative h-12 w-32 opacity-60 hover:opacity-100 transition-opacity">
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="128px" />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

type HeroReelSlide = {
  id: string;
  label: string;
  shortDesc: string;
  image: string;
  imagePosition?: string;
  videoUrl?: string;
  projectSlug?: string;
  year: string;
  layout: "cinema" | "vertical" | "square";
};

type HeroReelSectionProps = {
  section: SectionData;
};

function HeroReelSection({ section }: HeroReelSectionProps) {
  const s = section as Record<string, unknown>;
  const badge = str(s.badge);
  const slides = (s.slides as HeroReelSlide[]) || [];
  const autoPlayMs = typeof s.autoPlayMs === "number" ? s.autoPlayMs : 7000;

  const [index, setIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const canAnimate = motionEnabled(reduceMotion);

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
    if (!canAnimate || paused || !current?.videoUrl) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / autoPlayMs);
      setSegmentProgress(p);
      if (p >= 1) {
        next();
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, next, paused, autoPlayMs, current?.videoUrl, canAnimate]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    setPaused(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    setPaused(false);
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
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

  if (!current || slides.length === 0) return null;

  return (
    <section
      id={section.id}
      className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] w-full overflow-hidden bg-black text-white"
      aria-roledescription="carousel"
      aria-label="BNS Studios format reel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
            setPaused(false);
          }}
        >
          <div className={cn(
            "absolute inset-0",
            current.layout === "vertical" && "flex items-center justify-center"
          )}>
            {current.videoUrl ? (
              <video
                key={current.videoUrl}
                ref={(el) => {
                  videoRef.current = el;
                  if (el) {
                    el.muted = isMuted;
                    el.play().catch(() => {});
                  }
                }}
                src={current.videoUrl}
                poster={current.image}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className={cn(
                  "absolute inset-0 size-full object-cover",
                  current.imagePosition || "object-center",
                  current.layout === "vertical" && "w-auto h-full max-w-none"
                )}
                aria-label={current.label}
              >
                <source src={current.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={current.image}
                alt=""
                fill
                priority
                className={cn(
                  "object-cover",
                  current.imagePosition || "object-center",
                  current.layout === "vertical" && "w-auto h-full max-w-none"
                )}
                sizes="100vw"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

          <div
            className="absolute inset-0 z-10"
            onClick={onZoneClick}
            role="presentation"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-4 line-clamp-2">
                {current.label}
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-6">
                {current.shortDesc}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {current.projectSlug && (
                  <Link
                    href={`/bns-studio/${current.projectSlug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open case
                    <ArrowUpRight className="size-4" />
                  </Link>
                )}

                {current.videoUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextMuted = !isMuted;
                      setIsMuted(nextMuted);
                      if (videoRef.current) {
                        videoRef.current.muted = nextMuted;
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-primary" />}
                    <span>{isMuted ? "Unmute" : "Sound On"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 inset-x-0 z-30 flex justify-center gap-1.5 pb-6" role="tablist" aria-label="Format slides">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={slide.label}
            onClick={() => goTo(i)}
            className="relative h-1 w-12 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors"
          >
            <span
              className="absolute inset-0 origin-left bg-white [transform:scaleX(var(--segment-progress,0))]"
              style={
                {
                  "--segment-progress":
                    i < index ? 1 : i === index ? segmentProgress : 0,
                } as React.CSSProperties
              }
            />
          </button>
        ))}
      </div>
    </section>
  );
}

type CtaBannerSectionProps = {
  section: SectionData;
};

function CtaBannerSection({ section }: CtaBannerSectionProps) {
  const s = section as Record<string, unknown>;
  const eyebrow = str(s.eyebrow);
  const title = str(s.title);
  const description = str(s.description);
  const ctaLabel = str(s.ctaLabel);
  const ctaHref = str(s.ctaHref);
  const theme = str(s.theme);

  return (
    <section
      id={section.id}
      className={cn(
        "w-full py-16 md:py-24 border-y border-border/50",
        theme === "contrast" ? "bg-neutral-900 text-white" : "bg-muted/30 text-foreground"
      )}
    >
      <div className={SECTION_SHELL_INNER}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <EditorialPill>{eyebrow}</EditorialPill>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p
              variants={fadeInUp}
              className={cn(
                "text-lg leading-relaxed",
                theme === "contrast" ? "text-white/80" : "text-muted-foreground"
              )}
            >
              {description}
            </motion.p>
          )}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            {ctaHref && ctaLabel && (
              <PillButtonGroup
                href={ctaHref}
                label={ctaLabel}
                variant="primary"
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

type InsightsItem = {
  category?: string;
  title?: string;
  summary?: string;
  image?: string;
  href?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  date?: string;
  overlayColor?: string;
};

function InsightsBentoSection({ section }: { section: SectionData }) {
  const s = section as Record<string, unknown>;
  const title = str(s.title);
  const viewAllLabel = str(s.viewAllLabel) || "View All";
  const viewAllHref = str(s.viewAllHref) || "/stories";
  const layout = str(s.layout) || "featured-side-list";
  const featured = obj<InsightsItem>(s.featured);
  const items = (Array.isArray(s.items) ? s.items : []) as InsightsItem[];
  const sideLimit = layout === "featured-side-duo" ? 2 : 4;
  const sideItems = items.slice(0, sideLimit);

  return (
    <section id={section.id} className="w-full bg-background py-16 md:py-24">
      <div className={SECTION_SHELL_INNER}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          {title ? (
            <h2 className="font-heading text-3xl font-black tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
          ) : null}
          <PillButtonGroup
            href={viewAllHref}
            label={viewAllLabel}
            variant="outline"
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <Link
            href={str(featured.href) || viewAllHref}
            className="group relative min-h-[22rem] overflow-hidden rounded-[var(--brand-radius-card,1.5rem)] lg:col-span-5 lg:min-h-[28rem]"
          >
            {str(featured.image) ? (
              <Image
                src={str(featured.image)}
                alt={str(featured.title) || "Featured insight"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 md:p-8">
              {str(featured.category) ? (
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                  {str(featured.category)}
                </p>
              ) : null}
              <h3 className="max-w-md text-2xl font-bold leading-tight text-white md:text-3xl">
                {str(featured.title)}
              </h3>
              {str(featured.summary) ? (
                <p className="max-w-md text-sm leading-relaxed text-white/80">
                  {str(featured.summary)}
                </p>
              ) : null}
              {(str(featured.authorName) || str(featured.date)) && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/75">
                  {str(featured.authorName) ? <span>{str(featured.authorName)}</span> : null}
                  {str(featured.authorName) && str(featured.date) ? <span aria-hidden>-</span> : null}
                  {str(featured.date) ? <span>{str(featured.date)}</span> : null}
                </div>
              )}
            </div>
          </Link>

          <div
            className={cn(
              "flex flex-col gap-4 lg:col-span-7",
              layout === "featured-side-duo" ? "justify-stretch" : "",
            )}
          >
            {sideItems.map((item, index) => (
              <Link
                key={`${str(item.title)}-${index}`}
                href={str(item.href) || viewAllHref}
                className={cn(
                  "group flex gap-4 overflow-hidden rounded-[var(--brand-radius-card,1.5rem)] border border-border/60 bg-card p-3 transition-colors hover:border-border md:p-4",
                  layout === "featured-side-duo" ? "flex-1 items-stretch" : "items-center",
                )}
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--brand-radius-image,1rem)] sm:size-24 md:size-28">
                  {str(item.image) ? (
                    <Image
                      src={str(item.image)}
                      alt={str(item.title) || "Insight"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="112px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5 py-1">
                  {str(item.category) ? (
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {str(item.category)}
                    </p>
                  ) : null}
                  <h3 className="text-base font-bold leading-snug text-foreground md:text-lg">
                    {str(item.title)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {[str(item.authorName), str(item.date), str(item.category)]
                      .filter(Boolean)
                      .join(" - ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const SECTION_RENDERERS: Record<string, React.ComponentType<{ section: SectionData }>> = {
  "hero-reel": HeroReelSection,
  "hero-image": HeroImageSection,
  "feature-grid": FeatureGridSection,
  "image-marquee": ImageMarqueeSection,
  "text-with-stats": TextWithStatsSection,
  "partner-with-us": PartnerWithUsSection,
  "cta-banner": CtaBannerSection,
  "insights-bento": InsightsBentoSection,
};

type DynamicSectionRendererProps = {
  sections: SectionData[];
  extraProps?: Record<string, Record<string, unknown>>;
};

export function DynamicSectionRenderer({ sections, extraProps }: DynamicSectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const Renderer = SECTION_RENDERERS[section.type];
        if (!Renderer) {
          console.warn(`Unknown section type: ${section.type}`);
          return null;
        }
        const extra = extraProps?.[section.id] || {};
        return <Renderer key={section.id} section={{ ...section, ...extra }} />;
      })}
    </>
  );
}
