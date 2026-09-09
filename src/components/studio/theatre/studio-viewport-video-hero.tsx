"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { BNS_R2_REELS } from "@/constants/bns-r2-reels";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

const HERO_REEL =
  BNS_R2_REELS.find((r) => r.id === "reel-05") ??
  BNS_R2_REELS.find((r) => r.id === "reel-04") ??
  BNS_R2_REELS[0]!;

export function StudioViewportVideoHero() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    el.muted = muted;
    el.play().catch(() => {});
  }, [muted, reduceMotion]);

  return (
    <section
      className="relative isolate min-h-dvh w-full overflow-hidden bg-black text-white"
      aria-label="BNS Studios cinematic hero"
    >
      {!reduceMotion ? (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={HERO_REEL.videoUrl}
          poster={HERO_REEL.posterUrl}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <Image
          src={HERO_REEL.posterUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/90"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.55)_70%)]"
        aria-hidden
      />

      <div
        className={cn(
          SECTION_SHELL_INNER,
          "relative z-10 flex min-h-dvh flex-col justify-end pb-16 pt-28 md:pb-20 md:pt-32",
        )}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl space-y-6"
        >
          <motion.p
            variants={fadeInUp}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary"
          >
            BNS Studios · Nairobi
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-heading text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Motion that makes
            <span className="block text-primary italic">public money visible.</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Full-bleed craft from the animation desk — explainers, reels, and
            broadcast pieces built so citizens actually watch the budget.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="#studio-formats"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Enter the reel
            </Link>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-pressed={!muted}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-primary" />}
              {muted ? "Unmute" : "Sound on"}
            </button>
          </motion.div>
        </motion.div>

        <div className="mt-12 flex justify-center md:mt-16">
          <a
            href="#studio-formats"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-mono text-white/85 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Scroll into formats
            <ChevronDown className="size-3.5 animate-bounce" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
