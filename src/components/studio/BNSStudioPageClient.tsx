"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Send,
  ShieldCheck,
  Play,
  Volume2,
  Clapperboard,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { EditorialPill, PillButtonGroup, PillButton } from "@/components/ui/editorial";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_MEDIA_IMAGES, BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const featuredProjects = studiosEvidenceData.getFeaturedProjects();
  const flagshipFilm = featuredProjects[0] || studiosEvidenceData.getAllProjects()[0];
  const audioFlagship = featuredProjects[1] || studiosEvidenceData.getAllProjects()[1];

  return (
    <article className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
      {/* 01 — 21:9 ANAMORPHIC WIDESCREEN CINEMATIC VIDEO THEATRE */}
      <section className="relative w-full bg-zinc-950 text-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-zinc-800/80 overflow-hidden">
        {/* Atmospheric Ambient Projection Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[400px] bg-primary/20 blur-[140px] rounded-full pointer-events-none select-none" />

        <div className={SECTION_SHELL_INNER}>
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 font-mono text-xs">
            <div className="flex items-center gap-2">
              <EditorialPill variant="invert" size="xs">
                Desk 04 · The Creative Agency Studio
              </EditorialPill>
              <span className="text-zinc-400">21:9 ANAMORPHIC MASTER THEATRE</span>
            </div>
            <span className="text-zinc-400">COMMERCIAL PRODUCTION WITH A CIVIC HEART</span>
          </div>

          <div className="max-w-4xl space-y-6 mb-12">
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02]">
              Civic storytelling crafted with cinematic scale.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-3xl">
              We produce award-winning explainers, documentaries, podcasts, and out-of-home campaigns for institutions and development partners. 100% of studio surplus directly subsidizes grassroots civic auditing in Kenya&rsquo;s 47 counties.
            </p>
          </div>

          {/* Master 21:9 Screening Room Canvas */}
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
                  src={flagshipFilm?.media.posterUrl || "/images/treasury/budget sasa ni delivery.jpg"}
                  alt="Budget Sasa Ni Delivery Master Screening Reel"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Central Play Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
                    <Play className="size-5 fill-current" />
                    <span className="font-heading font-bold text-sm tracking-wide">
                      Screen Master Film (12 min)
                    </span>
                  </div>
                </div>

                {/* Director's Ledger Lower Third */}
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

          {/* Director's Technical Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-800/80 mt-8 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500 uppercase">Director & Craft:</span>
              <p className="text-white font-bold mt-0.5">BNS Studios Creative Desk</p>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">Aspect Ratio:</span>
              <p className="text-white font-bold mt-0.5">21:9 Anamorphic Cinema</p>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">Verification Rigour:</span>
              <p className="text-primary font-bold mt-0.5">100% Primary Source Data</p>
            </div>
            <div>
              <span className="text-zinc-500 uppercase">Impact Model:</span>
              <p className="text-white font-bold mt-0.5">100% Surplus Reinvested</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — THE DOUBLE IMPACT NARRATIVE ARC (Fluid Editorial Flow, Zero Boxy Cards) */}
      <section className="py-24 md:py-36 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Bold Asymmetric Story */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <EditorialPill dot pulse>
                  The Double Impact Model
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  Commercial creative craft that directly bankrolls citizen budget audits.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Most civic tech initiatives depend entirely on unpredictable donor grants that run out after 12 months. BNS Studios was founded to create sovereign financial resilience: we operate as an elite creative agency for institutional clients, but with an uncompromising mission covenant.
                </p>
                <p>
                  Every Kenyan shilling of operating surplus generated from commissioned films, podcast seasons, and public campaigns is channelled directly into funding free grassroots scorecards, youth tracker stipends, and newsroom investigative training across all 47 counties.
                </p>
              </div>

              {/* Impact Ledger Figures in Prose Margins */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                <div>
                  <p className="font-heading text-4xl font-black text-foreground tracking-tighter">08</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Production Formats</p>
                </div>
                <div>
                  <p className="font-heading text-4xl font-black text-primary tracking-tighter">47</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Counties Subsidized</p>
                </div>
                <div>
                  <p className="font-heading text-4xl font-black text-foreground tracking-tighter">100%</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Surplus Reinvested</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <PillButton
                  onClick={() => setBookingOpen(true)}
                  icon={<Send className="size-4" />}
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
                    Field videographers capturing civic testimonials during the Western Kenya budget hearings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — PRODUCTION CAPABILITIES SPECTRUM (Continuous Broadstream Ledger, Zero Repetitive Cards) */}
      <section className="py-24 md:py-36 border-b border-border/40 bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Production Capabilities
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Eight production formats engineered for public impact.
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

      {/* 04 — FEATURED PRODUCTION COMMISSIONS (Widescreen Showcases, Zero Monotonous Cards) */}
      <section className="py-24 md:py-36 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                Verified Production Portfolio
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
                Cinematic commissions that shifted policy.
              </h2>
            </div>
            <PillButtonGroup
              href="/bns-studio/work"
              label={`Browse all ${studiosEvidenceData.getAllProjects().length} productions`}
              variant="outline"
              size="sm"
            />
          </div>

          <div className="space-y-24">
            {/* Master Showcase 01: Budget Sasa Ni Delivery */}
            {flagshipFilm && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-t border-border/40 pt-16">
                <div className="lg:col-span-7">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-muted group">
                    <Image
                      src={flagshipFilm.media.posterUrl}
                      alt={flagshipFilm.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <EditorialPill variant="invert" size="xs">
                        {flagshipFilm.contentType}
                      </EditorialPill>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between text-xs font-mono">
                      <span>{flagshipFilm.organization.name} · {flagshipFilm.year}</span>
                      <span className="text-primary font-bold">480K+ Views</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                    {flagshipFilm.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {flagshipFilm.description}
                  </p>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1 text-xs">
                    <p className="font-mono text-primary font-bold uppercase tracking-wider">
                      Verified Policy Outcome
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {flagshipFilm.impactEvidence.primaryMetric || "National distribution across youth channels"}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/bns-studio/${flagshipFilm.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      <span>Read comprehensive case study</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Master Showcase 02: Budget Ndio Story Podcast */}
            {audioFlagship && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-t border-border/40 pt-16">
                <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
                  <div className="flex items-center gap-2">
                    <EditorialPill variant="muted" size="xs">
                      {audioFlagship.contentType}
                    </EditorialPill>
                    <span className="font-mono text-xs text-muted-foreground">{audioFlagship.year}</span>
                  </div>
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                    {audioFlagship.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {audioFlagship.description}
                  </p>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-1 text-xs">
                    <p className="font-mono text-primary font-bold uppercase tracking-wider">
                      Verified Audio Reach
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {audioFlagship.impactEvidence.primaryMetric || "12K downloads in launch quarter"}
                    </p>
                  </div>
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

                <div className="lg:col-span-7 order-1 lg:order-2">
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
            )}
          </div>
        </div>
      </section>

      {/* 05 — CONVERSION COMMISSION CTA BAND */}
      <footer className="border-t border-border/40 bg-muted/20 py-24 md:py-36">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <EditorialPill dot pulse>
                  Commission the Studio
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Tell us what public policy you need to move.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Podcasts, explainers, multi-camera town halls, or countrywide street takeovers — our team provides verified scoping, production timeline, and impact projections within 24 hours.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <PillButton
                    onClick={() => setBookingOpen(true)}
                    size="lg"
                    icon={<Send className="size-4" />}
                  >
                    Open Commission Enquiry
                  </PillButton>
                  <PillButtonGroup
                    href="/programmes"
                    label="Explore All 4 Programmes"
                    variant="outline"
                    size="lg"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-muted-foreground">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 w-full space-y-2">
                  <p className="text-foreground font-bold text-sm">BNS Studios Booking Desk</p>
                  <p>Inquiries: studio@budgetndiostory.org</p>
                  <p>Turnaround: 24-hour scope review</p>
                  <p className="text-primary font-semibold">100% Civic Reinvestment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Commission Booking Drawer Modal */}
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </article>
  );
}
