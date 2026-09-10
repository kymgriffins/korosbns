"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Play,
  ChevronDown,
} from "lucide-react";
import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioProductionSpectrum } from "@/components/studio/StudioProductionSpectrum";
import { EditorialPill, PillButtonGroup, PillButton } from "@/components/ui/editorial";
import { EditorialCtaBand } from "@/components/ui/editorial/editorial-cta-band";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const featuredProjects = studiosEvidenceData.getFeaturedProjects();
  const flagshipFilm = featuredProjects[0] || studiosEvidenceData.getAllProjects()[0];

  return (
    <article className="w-full bg-background text-foreground selection:bg-primary/30">
      {/* 01 — THE ICONIC SWIPEABLE STUDIO REEL HERO (Cleared from fixed navbar) */}
      <div className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] mt-14 md:mt-16 w-full overflow-hidden bg-black text-white">
        <StudioReelHero />
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-mono font-medium text-white/90 backdrop-blur-md animate-bounce">
            <span>Swipe formats · Scroll for master theatre</span>
            <ChevronDown className="size-3.5" />
          </div>
        </div>
      </div>

      {/* 02 — THE DOUBLE IMPACT STORYLINE ARC (Full Section Utilization, Zero Boxy Cards) */}


      {/* 03 — 21:9 CINEMATIC SCREENING THEATRE (Atmospheric Ambient Backglow) */}
      <section className="w-full bg-zinc-950 text-white py-24 md:py-36 border-y border-zinc-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[350px] bg-primary/20 blur-[130px] rounded-full pointer-events-none select-none" />

        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-4xl space-y-4 mb-12">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
              · The Screening Room
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
              Screening the flagship Treasury explainer reel.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              Presenter-led broadcast intercutting town hall recordings with forensic motion graphics built directly from National Treasury published tables.
            </p>
          </div>

          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-2xl">
            {isPlayingVideo ? (
              <iframe
                src="https://www.youtube.com/embed/Ed9lP0-komE?autoplay=1&rel=0&modestbranding=1"
                title="Budget Sasa Ni Delivery"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="relative h-full w-full group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <Image
                  src={flagshipFilm?.media.posterUrl || BNS_MEDIA_IMAGES.productionA}
                  alt="Budget Sasa Ni Delivery Master Screening Reel"
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
                      Screen Master Film (12 min)
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      National Treasury Explainer Series · 480K+ Views
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold">
                      {flagshipFilm?.title || "Budget Sasa Ni Delivery"}
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-zinc-400">
                    BNS Studios Production · Co-Produced with National Treasury
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 04 — GROUPED PRODUCTION SPECTRUM (4 Disciplines, 3D Skeuomorphic Assets, Horizontal Carousel) */}
      <StudioProductionSpectrum />


      {/* 06 — Full-bleed commission CTA */}
      <EditorialCtaBand
        eyebrow="Commission the Studio"
        title="Commission forensic civic media that moves policy."
        description="Bilingual podcasts, multi-camera town halls, 2D animations, or nationwide street takeovers — verified scope and production crew within 24 hours."
        onCtaClick={() => setBookingOpen(true)}
        ctaLabel="Commission BNS Studio"
      />

      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </article>
  );
}
