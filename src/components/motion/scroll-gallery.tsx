"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Volume2, VolumeX, Sparkles, Film, CheckCircle2 } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  src: string;
  alt?: string;
  videoSrc?: string;
  poster?: string;
  category?: string;
  badge?: string;
}

export interface ScrollGalleryProps {
  items: GalleryItem[];
  pinDistance?: number; // in vh, e.g. 250
  playThreshold?: number; // 0..1, e.g. 0.70
  stagger?: number; // stagger factor
  easing?: "Linear" | "Ease Out" | "Ease In-Out";
  gap?: number;
  padding?: number;
  radius?: number;
  enableSound?: boolean;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  backgroundColor?: string;
  className?: string;
}

export function ScrollGallery({
  items,
  pinDistance = 260,
  playThreshold = 0.65,
  stagger = 0.04,
  easing = "Ease Out",
  gap = 16,
  padding = 20,
  radius = 16,
  enableSound = false,
  eyebrow = "CINEMA ARCHITECTURE",
  headline = "The 3x3 Visual Production Desk",
  subheadline = "Scroll down to zoom into our flagship 4K cinematic case study.",
  backgroundColor = "transparent",
  className = "",
}: ScrollGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [gridMetrics, setGridMetrics] = useState({
    width: 960,
    height: 600,
    cellWidth: 300,
    cellHeight: 180,
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Take up to 9 items, ensure at least 9 by repeating if needed
  const renderItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length >= 9) return items.slice(0, 9);
    // Pad to 9 items
    const padded = [...items];
    while (padded.length < 9) {
      padded.push(items[padded.length % items.length]);
    }
    return padded.slice(0, 9);
  }, [items]);

  const centerIndex = useMemo(() => Math.floor(renderItems.length / 2), [renderItems.length]);
  const centerRow = useMemo(() => Math.floor(centerIndex / 3), [centerIndex]);
  const centerCol = useMemo(() => centerIndex % 3, [centerIndex]);
  const centerItem = renderItems[centerIndex];

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const transformedProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = transformedProgress.on("change", (latest) => {
      startTransition(() => setProgress(latest));
    });
    return () => unsubscribe();
  }, [transformedProgress]);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    startTransition(() => setPrefersReducedMotion(mq.matches));

    const handler = (e: MediaQueryListEvent) => {
      startTransition(() => setPrefersReducedMotion(e.matches));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure dynamic grid layout
  const measureGrid = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nextWidth = rect.width || el.clientWidth || 960;
    const nextHeight = rect.height || el.clientHeight || 600;
    const nextCellWidth = Math.max(0, (nextWidth - 2 * gap) / 3);
    const nextCellHeight = Math.max(0, (nextHeight - 2 * gap) / 3);

    startTransition(() => {
      setGridMetrics({
        width: nextWidth,
        height: nextHeight,
        cellWidth: nextCellWidth,
        cellHeight: nextCellHeight,
      });
      setProgress(transformedProgress.get());
    });
  }, [gap, transformedProgress]);

  useLayoutEffect(() => {
    measureGrid();
  }, [measureGrid]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        measureGrid();
      });
    };
    schedule();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => schedule());
      ro.observe(el);
    }
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [measureGrid]);

  const clampedProgress = Math.max(0, Math.min(1, progress));

  const animationProgress = useMemo(() => {
    if (prefersReducedMotion) return clampedProgress >= 0.5 ? 1 : 0;
    if (easing === "Ease Out") return 1 - Math.pow(1 - clampedProgress, 3);
    if (easing === "Ease In-Out") {
      if (clampedProgress < 0.5) return 4 * clampedProgress * clampedProgress * clampedProgress;
      return 1 - Math.pow(-2 * clampedProgress + 2, 3) / 2;
    }
    return clampedProgress;
  }, [clampedProgress, easing, prefersReducedMotion]);

  // Style for outer 8 cells
  const getOuterTileStyle = useCallback(
    (index: number) => {
      if (index === centerIndex) {
        return { opacity: 0, pointerEvents: "none" as const };
      }

      const row = Math.floor(index / 3);
      const col = index % 3;
      const deltaRow = row - centerRow;
      const deltaCol = col - centerCol;

      const distance = Math.abs(deltaRow) + Math.abs(deltaCol);
      const delay = Math.max(0, Math.min(stagger * Math.max(distance - 1, 0), 0.95));
      const localProgress = delay >= 1 ? 1 : Math.max(0, Math.min(1, (animationProgress - delay) / (1 - delay)));

      const startLeft = col * (gridMetrics.cellWidth + gap);
      const startTop = row * (gridMetrics.cellHeight + gap);
      const finalLeft = deltaCol * (gridMetrics.width + gap * 2);
      const finalTop = deltaRow * (gridMetrics.height + gap * 2);

      const moveX = (finalLeft - startLeft) * localProgress;
      const moveY = (finalTop - startTop) * localProgress;

      return {
        transformOrigin: "center center",
        transform: `translate3d(${moveX}px, ${moveY}px, 0px) scale(${1 + localProgress * 0.2})`,
        opacity: Math.max(0, 1 - localProgress * 1.2),
        willChange: "transform, opacity",
      };
    },
    [animationProgress, centerCol, centerIndex, centerRow, gap, gridMetrics, stagger]
  );

  // Center expanding tile geometry
  const centerOverlayStyle = useMemo(() => {
    if (renderItems.length === 0 || gridMetrics.cellWidth === 0) {
      return { display: "none" as const };
    }

    const startLeft = centerCol * (gridMetrics.cellWidth + gap);
    const startTop = centerRow * (gridMetrics.cellHeight + gap);
    const startWidth = gridMetrics.cellWidth;
    const startHeight = gridMetrics.cellHeight;

    const targetLeft = 0;
    const targetTop = 0;
    const targetWidth = gridMetrics.width;
    const targetHeight = gridMetrics.height;

    const currentLeft = startLeft + (targetLeft - startLeft) * animationProgress;
    const currentTop = startTop + (targetTop - startTop) * animationProgress;
    const currentWidth = startWidth + (targetWidth - startWidth) * animationProgress;
    const currentHeight = startHeight + (targetHeight - startHeight) * animationProgress;

    return {
      position: "absolute" as const,
      left: currentLeft,
      top: currentTop,
      width: currentWidth,
      height: currentHeight,
      borderRadius: Math.max(0, radius * (1 - animationProgress)),
      overflow: "hidden" as const,
      zIndex: 30,
      willChange: "left, top, width, height",
    };
  }, [animationProgress, centerCol, centerRow, gap, gridMetrics, radius, renderItems.length]);

  // Video playback control on threshold
  const hasVideo = Boolean(centerItem?.videoSrc);
  const isCenterExpanded = clampedProgress >= playThreshold;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    video.muted = isMuted;

    if (isCenterExpanded) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      video.pause();
    }
  }, [hasVideo, isCenterExpanded, isMuted]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${className}`}
      style={{ height: `${pinDistance}vh` }}
    >
      <section
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor }}
      >
        {/* Floating Top Header (Fades away as zoom progresses) */}
        <div
          className="absolute top-6 left-6 right-6 z-40 flex flex-wrap items-center justify-between gap-4 pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - clampedProgress * 2.5) }}
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
              <Film className="size-3.5" />
              <span>{eyebrow}</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-foreground">
              {headline}
            </h3>
          </div>
          <p className="font-mono text-xs text-muted-foreground hidden sm:block max-w-xs text-right">
            {subheadline}
          </p>
        </div>

        {/* 3x3 Stage Container */}
        <div
          ref={gridRef}
          className="relative w-full max-w-6xl aspect-[4/3] sm:aspect-[16/10] max-h-[82vh] mx-auto p-4 sm:p-6"
        >
          {/* Outer Grid (3x3) */}
          <div
            className="grid grid-cols-3 grid-rows-3 w-full h-full"
            style={{ gap }}
          >
            {renderItems.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: radius,
                  overflow: "hidden",
                  ...getOuterTileStyle(idx),
                }}
                className="bg-muted/40 border border-border/50 shadow-md group"
              >
                <Image
                  src={item.src}
                  alt={item.alt || item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <p className="font-mono text-[9px] uppercase font-bold text-primary truncate">
                    {item.category || `0${idx + 1}`}
                  </p>
                  <p className="text-[11px] font-bold truncate leading-tight">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Expanding Element */}
          {centerItem && (
            <motion.div
              style={centerOverlayStyle}
              className="border border-primary/40 bg-card shadow-2xl"
            >
              {/* Center Image/Video container */}
              <div className="relative w-full h-full">
                <Image
                  src={centerItem.src}
                  alt={centerItem.alt || centerItem.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1280px"
                />

                {hasVideo && (
                  <video
                    ref={videoRef}
                    src={centerItem.videoSrc}
                    poster={centerItem.poster || centerItem.src}
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Center Item Live Overlay */}
                <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between text-white pointer-events-none">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white font-mono text-xs font-bold shadow-lg">
                      <Sparkles className="size-3.5" />
                      <span>{centerItem.badge || "FEATURED CENTERPIECE"}</span>
                    </div>

                    <div className="font-mono text-xs text-white/80">
                      {isCenterExpanded ? "FULL-BLEED CINEMA DCI" : "SCROLL TO ZOOM"}
                    </div>
                  </div>

                  {/* Bottom Title & Details */}
                  <div className="space-y-3 max-w-2xl">
                    <span className="font-mono text-xs uppercase font-bold text-primary tracking-widest">
                      {centerItem.category || "INVESTIGATIVE FILM"}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                      {centerItem.title}
                    </h2>
                    {centerItem.subtitle && (
                      <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                        {centerItem.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sound Button */}
                {enableSound && hasVideo && isCenterExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-8 right-8 z-50 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-xl"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll Progress Bar at Bottom of Sticky Section */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span>Centerpiece Zoom: {Math.round(clampedProgress * 100)}%</span>
          </div>

          <div className="w-32 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-75"
              style={{ width: `${clampedProgress * 100}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
