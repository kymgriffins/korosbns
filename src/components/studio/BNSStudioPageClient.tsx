"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  Volume2,
  ChevronDown,
} from "lucide-react";
import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { EditorialPill, PillButtonGroup, PillButton } from "@/components/ui/editorial";
import { EditorialCtaBand } from "@/components/ui/editorial/editorial-cta-band";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const featuredProjects = studiosEvidenceData.getFeaturedProjects();
  const flagshipFilm = featuredProjects[0] || studiosEvidenceData.getAllProjects()[0];
  const audioFlagship = featuredProjects[1] || studiosEvidenceData.getAllProjects()[1];

  return (
    <article className="w-full bg-background text-foreground selection:bg-primary/30">
      {/* 01 — THE ICONIC SWIPEABLE STUDIO REEL HERO (Restored) */}
      <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
        <StudioReelHero />
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-mono font-medium text-white/90 backdrop-blur-md animate-bounce">
            <span>Swipe formats · Scroll for master theatre</span>
            <ChevronDown className="size-3.5" />
          </div>
        </div>
      </div>

      {/* 02 — THE DOUBLE IMPACT STORYLINE ARC (Full Section Utilization, Zero Boxy Cards) */}
      <section className="py-24 md:py-36 border-t border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <EditorialPill dot pulse>
                  Chapter 01 · The Double Impact Covenant
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.05]">
                  Commercial creative craft that bankrolls citizen budget audits.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Most civic tech initiatives depend entirely on unpredictable donor grants that expire after 12 months. BNS Studios was engineered to provide sovereign financial resilience: we operate as an elite creative agency for institutional clients, but with an uncompromising mission covenant.
                </p>
                <p>
                  Every Kenyan shilling of operating surplus generated from commissioned films, podcast seasons, and public campaigns is channelled directly into funding free grassroots scorecards, youth tracker stipends, and newsroom investigative training across all 47 counties.
                </p>
              </div>

              {/* Seamless Narrative Ledger (Zero Boxy Cards) */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                <div>
                  <p className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tighter">08</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Production Formats</p>
                </div>
                <div>
                  <p className="font-heading text-4xl sm:text-5xl font-black text-primary tracking-tighter">47</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Counties Subsidized</p>
                </div>
                <div>
                  <p className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tighter">100%</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Surplus Reinvested</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <PillButton
                  onClick={() => setBookingOpen(true)}
                  size="lg"
                >
                  Commission BNS Studio
                </PillButton>
                <PillButtonGroup
                  href="/work"
                  label="Inspect Evidence Archive"
                  variant="outline"
                  size="lg"
                />
              </div>
            </div>

            {/* Right Column: High-Craft Documentary Photographic Proof */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted">
                <Image
                  src={BNS_MEDIA_IMAGES.productionA}
                  alt="BNS Studio production crew filming behind the scenes"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                    Behind The Lens · BNS Studios
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    Field videographers capturing citizen testimonials during the Western Kenya budget hearings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — 21:9 CINEMATIC SCREENING THEATRE (Atmospheric Ambient Backglow) */}
      <section className="w-full bg-zinc-950 text-white py-24 md:py-36 border-y border-zinc-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[350px] bg-primary/20 blur-[130px] rounded-full pointer-events-none select-none" />

        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-4xl space-y-4 mb-12">
            <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
              Chapter 02 · The Screening Room
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

      {/* 04 — PRODUCTION CAPABILITIES (Continuous Broadstream Ledger, Zero Repetitive Cards) */}
      <section className="py-24 md:py-36 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Chapter 03 · Production Spectrum
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Eight production formats engineered for civic impact.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We do not produce 200-page donor PDFs that nobody reads. We craft media formats people argue about in matatus and share on social feeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {STUDIO_CONTENT_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="border-t border-border/50 pt-6 space-y-3"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-primary font-bold">FORMAT 0{idx + 1}</span>
                    <Link
                      href={`/bns-studio/work?format=${encodeURIComponent(type.id)}`}
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Explore cases</span>
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {type.label}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {type.shortDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 — WIDESCREEN EVIDENCE DOSSIER (Audio Deep-Dive Showcase) */}
      {audioFlagship && (
        <section className="py-24 md:py-36 border-b border-border/40 bg-muted/10">
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <EditorialPill variant="muted" size="xs">
                    Chapter 04 · Audio Scrutiny
                  </EditorialPill>
                  <span className="font-mono text-xs text-muted-foreground">{audioFlagship.year}</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  {audioFlagship.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {audioFlagship.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/bns-studio/${audioFlagship.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    <span>Read production whitepaper</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-muted group">
                  <Image
                    src={audioFlagship.media.posterUrl}
                    alt={audioFlagship.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-2xl backdrop-blur-sm">
                      <Volume2 className="size-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 06 — PUNCHY MOTION COMMISSION CTA BAND */}
      <section className="py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="Commission the Studio"
            title="Commission forensic civic media that moves policy."
            description="Bilingual podcasts, multi-camera town halls, 2D animations, or nationwide street takeovers — verified scope and production crew within 24 hours."
            ctaHref="#"
            ctaLabel="Open Commission Enquiry"
            secondaryHref="/work"
            secondaryLabel="Explore All Evidence"
            motionBackground={true}
          />
        </div>
      </section>

      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </article>
  );
}
