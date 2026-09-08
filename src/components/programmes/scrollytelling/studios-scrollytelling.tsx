"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  MetricCounter,
  NarrativeScrollytellingCanvas,
  type NarrativeBeat,
  CinemaTimelineStage,
  TextRevealOnScroll,
} from "@/components/motion";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeChapterBridge } from "@/components/programmes/programme-chapter-bridge";

const STUDIOS_BEATS: NarrativeBeat[] = [
  {
    id: "donor-trap",
    eyebrow: "Why Studios exists",
    title: "Civic scrutiny should not vanish when a grant year ends.",
    paragraphs: [
      "Too many accountability projects live on twelve-month funding cycles. When priorities pivot, the cameras pack up and the scorecards stop printing.",
      "BNS Studios is the production house that sells podcasts, documentaries, motion graphics, and town-hall broadcasts to governments, partners, companies, and CSOs — so civic work is not wholly hostage to a single donor calendar.",
      "A portion of Studios operating surplus funds Budget Ndio Story programmes: national tracking, county embeds, and newsroom labs. That covenant is the point of the desk.",
    ],
    quote: {
      text: "If your budget scrutiny depends only on the next grant approval, your watchdog is on a leash.",
      author: "BNS Studios",
      role: "Nairobi",
    },
    metric: {
      value: "Surplus",
      label: "Portion reinvested in civic programmes",
    },
    image: BNS_MEDIA_IMAGES.productionA,
    imageAlt: "BNS Studio production crew filming field segments",
    imageCaption: "Studios field unit documenting community testimony.",
    imageBadge: "CRAFT + CIVIC SURPLUS",
  },
  {
    id: "high-craft",
    eyebrow: "The craft standard",
    title: "We do not ship shelfware PDFs. We produce media people finish.",
    paragraphs: [
      "Opacity thrives when truth is boring. Dry reports compete with WhatsApp rumours — and rumours usually win.",
      "Studios treats fiscal stories like cinema and radio: bilingual sound, motion that clarifies rather than decorates, and cuts short enough for a feed without stripping the source citation.",
      "Flagship explainers such as Budget Sasa ni Delivery are built from published Treasury tables. Reach is measured; figures are never invented for shareability.",
    ],
    quote: {
      text: "Nobody shares a procurement audit PDF on TikTok. Turn the same facts into a verified reel, and people stay.",
      author: "Nelly Maina",
      role: "Host, Budget Ndio Story Podcast",
    },
    metric: {
      value: "Provenance",
      label: "Every on-screen figure needs a public table",
    },
    image: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    imageAlt: "Podcast recording session with microphone and studio lighting",
    imageCaption: "Budget Ndio Story Podcast session in studio.",
    imageBadge: "PODCAST & AUDIO",
  },
  {
    id: "double-impact",
    eyebrow: "The commission letter",
    title: "Your film or forum also bankrolls the next scorecard.",
    paragraphs: [
      "When a development partner, county, or coalition commissions a documentary, podcast season, or multi-camera town hall, they receive broadcast-quality delivery — and help keep civic programmes running after the invoice clears.",
      "That is the double job of Studios: craft for the client's audience, surplus for Connect, Mashinani, and Wanahabari Lab.",
      "Editorial independence stays non-negotiable. We will not invent budget numbers to flatter a brief, and we label unavailable figures as unavailable.",
    ],
    metric: {
      value: "2×",
      label: "Client delivery + civic fuel",
    },
    image: "/images/hall/129A4248.jpg",
    imageAlt: "Multi-camera hall production at a stakeholder forum",
    imageCaption: "Multi-camera setup for a national stakeholder fiscal forum.",
    imageBadge: "TOWN HALL & BROADCAST",
  },
];

export function StudiosScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 00 — PERSISTENT LOCOMOTIVE-GRADE TECHNICAL HUD */}
      <TelemetryHUD
        activeDesk="BNS STUDIOS"
        focusArea="CRAFT COMMISSIONS & CIVIC SURPLUS"
        badgeLabel="PRODUCTION DESK"
      />

      <header className="relative border-b border-border/40 bg-gradient-to-b from-primary/10 via-muted/10 to-background pt-4 pb-6 md:pt-6 md:pb-8 overflow-hidden">
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
                Production desk · Commissioned craft
              </EditorialPill>
              <EditorialPill variant="outline">
                Client delivery with civic surplus
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              <MaskedReveal delay={0.05}>High-craft media.</MaskedReveal>{" "}
              <MaskedReveal delay={0.15} innerClassName="text-primary">
                A civic surplus attached.
              </MaskedReveal>
            </h1>

            <div className="max-w-3xl">
              <TextRevealOnScroll
                text="Commission podcasts, documentaries, motion graphics, and town halls from a studio that is fluent in public finance — and routes a portion of surplus into Budget Ndio Story's civic programmes."
                by="word"
                as="p"
                className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Model
                </p>
                <p className="text-base font-bold text-foreground">
                  Mission enterprise
                </p>
                <p className="text-xs text-muted-foreground">Craft that funds scrutiny</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Covenant
                </p>
                <p className="text-base font-bold text-primary">
                  Surplus reinvested
                </p>
                <p className="text-xs text-muted-foreground">Into BNS programmes</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Disciplines
                </p>
                <p className="text-base font-bold text-foreground">
                  <MetricCounter value={3} suffix=" core" />
                </p>
                <p className="text-xs text-muted-foreground">Audio · Docs · Motion</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Portal
                </p>
                <Link
                  href="/bns-studio"
                  className="text-base font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Studio</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <p className="text-xs text-muted-foreground">Intake and theatre</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE NARRATIVE SCROLLYTELLING CANVAS */}
      <section className="border-b border-border/40 pb-16">
        <div className={SECTION_SHELL_INNER}>
          <NarrativeScrollytellingCanvas beats={STUDIOS_BEATS} mediaPosition="right" />
        </div>
      </section>

      {/* 03 — INTERACTIVE CINEMA TIMELINE & FORMAT SPECTRUM */}
      <section className="border-b border-border/40 py-16 sm:py-24 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <CinemaTimelineStage />
        </div>
      </section>

      <ProgrammeProjectGrid
        programmeSlug="studios"
        eyebrow="BNS Studios Outputs"
        headline="Commissioned Storytelling, Documentaries & Broadcasts"
        description="Pan-African documentaries, podcast seasons, and broadcast event coverage supporting public-interest civic tracking."
      />

      {/* Seamless flow to next chapter */}
      <ProgrammeChapterBridge currentSlug="studios" />

      {/* 03 — COMMERCIAL INTAKE CALLOUT BAND */}
      <section className="py-16 md:py-24">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-12 md:p-16 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                Commission BNS Studios
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Commission the craft. Fuel the civic work.
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                Whether you need a podcast season, a nationwide town-hall broadcast, or motion graphics that explain a reform without inventing figures — Studios delivers verified broadcast quality.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <PillButtonGroup
                  href="/bns-studio"
                  label="Commission the Studio"
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                />
                <PillButtonGroup
                  href="/work"
                  label="Explore Production Archive"
                  variant="outline"
                  className="hidden sm:inline-flex w-full sm:w-auto justify-center border-zinc-700 text-white hover:bg-zinc-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
