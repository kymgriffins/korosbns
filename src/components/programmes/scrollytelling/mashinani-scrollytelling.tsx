"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Quote } from "lucide-react";
import { motion } from "motion/react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { EditorialCtaBand } from "@/components/ui/editorial/editorial-cta-band";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  ParallaxWrapper,
  FieldNotebookSpread,
} from "@/components/motion";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeChapterBridge } from "@/components/programmes/programme-chapter-bridge";

/**
 * Narrative arc: place essay — four counties as characters, embed → track → score.
 * Distinct from Connect's feed cadence and Wanahabari's newsroom masthead.
 */
export function MashinaniScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-amber-500/20">
      <TelemetryHUD
        activeDesk="BNS MASHINANI"
        focusArea="KAKAMEGA · KILIFI · NAKURU · WAJIR"
        badgeLabel="COUNTY DESK"
      />

      <header className="relative border-b border-border/40 bg-gradient-to-b from-amber-500/5 via-muted/10 to-background pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All programmes</span>
            </Link>
          </nav>

          <div className="space-y-4 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse>
                County desk · Full-cycle embed
              </EditorialPill>
              <EditorialPill variant="outline">
                Four places, not forty-seven flyovers
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              <MaskedReveal delay={0.05}>Kakamega. Kilifi. Nakuru. Wajir.</MaskedReveal>{" "}
              <MaskedReveal delay={0.2} innerClassName="text-amber-600 dark:text-amber-400">
                Stay long enough to matter.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Mashinani does not tour Kenya with a camera and a checklist. Teams settle into four counties for the budget cycle — fiscal strategy paper to execution report — and ask whether the promise on paper matches the borehole, the maternity wing, or the feeder road on the ground.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50 mt-6">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Focus counties
                </p>
                <p className="text-lg font-bold text-foreground">Four</p>
                <p className="text-xs text-muted-foreground">Kakamega · Kilifi · Nakuru · Wajir</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Method
                </p>
                <p className="text-lg font-bold text-foreground">Embed</p>
                <p className="text-xs text-muted-foreground">Full budget cycle presence</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Public products
                </p>
                <p className="text-lg font-bold text-foreground">Scorecards</p>
                <p className="text-xs text-muted-foreground">Trackers · Promise vs Delivery</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Posture
                </p>
                <p className="text-lg font-bold text-foreground">Partners</p>
                <p className="text-xs text-muted-foreground">Accountability without adversary theatre</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE OFFLINE-FIRST FIELD METHOD */}
      <section className="py-16 sm:py-24 md:py-32 border-b border-border/30 bg-muted/5 relative overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <EditorialPill dot pulse>
                  Method · Offline-First Grassroots Scrutiny
                </EditorialPill>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                A dashboard is useless when the power is out.
              </h2>

              <blockquote className="border-l-2 border-amber-500 pl-6 py-2 my-4 space-y-2 bg-muted/30 rounded-r-2xl pr-6">
                <p className="font-heading text-xl sm:text-2xl font-medium italic text-foreground leading-relaxed">
                  &ldquo;In the village, the budget is not a book. It is whether the dispensary has medicine and whether the borehole actually pumps.&rdquo;
                </p>
                <footer className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  — Citizen testimony · Coastal baraza hearing
                </footer>
              </blockquote>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                National platforms assume reliable broadband. Mashinani works offline-first across four focus counties: pairing contractor signboard inspections and waterproof ward scorecards with vernacular community radio briefings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <ParallaxWrapper speed={-0.2}>
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumD}
                    alt="Community member speaking at a county budget baraza"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      County baraza
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Residents and officials in the same room — with documentation that outlives the meeting.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </motion.div>
          </div>

          {/* Interactive Field Notebook (County Switcher) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <FieldNotebookSpread />
          </motion.div>
        </div>
      </section>

      {/* Mashinani Desk Flagship Projects Grid (Grouped by Content Type) */}
      <ProgrammeProjectGrid
        programmeSlug="mashinani"
        eyebrow="Mashinani Verified Outputs"
        headline="Devolved Scorecards, Barazas & Field Documentaries"
        description="Evidence-backed field productions, community listening circles, and county budget scorecards from Kakamega, Kilifi, Nakuru, and Wajir."
      />

      {/* Seamless flow to next chapter */}
      <ProgrammeChapterBridge currentSlug="mashinani" />

      <section className="py-20 md:py-28">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="County desk"
            title="Follow the shilling where you live."
            description="Audit ward project signboards, read verified scorecards, and host community barazas with BNS Mashinani."
            ctaHref="/work?programme=mashinani"
            ctaLabel="Explore county evidence"
            secondaryHref="/contact"
            secondaryLabel="Request a field workshop"
            motionBackground={true}
          />
        </div>
      </section>
    </article>
  );
}
