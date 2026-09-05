"use client";

import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  MapPin,
  FileText,
  Clapperboard,
  Quote,
} from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  ParallaxWrapper,
  MetricCounter,
} from "@/components/motion";

export function ProgrammesLanding() {
  return (
    <article className="prog-page min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 00 — PERSISTENT LOCOMOTIVE HUD */}
      <TelemetryHUD
        activeDesk="FOUR OPERATIONAL DESKS"
        focusArea="NATIONAL TO DEVOLVED GRASSROOTS"
        badgeLabel="SOVEREIGN STANDARD"
      />

      {/* 01 — MASTER SOVEREIGN HERO */}
      <header className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/10 to-background pt-4 pb-10 md:pt-6 md:pb-14">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-4 max-w-4xl">
            <div>
              <EditorialPill dot pulse>
                Four Operational Desks · One Sovereign Standard
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              <MaskedReveal delay={0.05}>Follow the public shilling</MaskedReveal>{" "}
              <MaskedReveal delay={0.15}>from Treasury to the</MaskedReveal>{" "}
              <MaskedReveal delay={0.25} innerClassName="text-primary">
                grassroots.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenya’s public budget crosses KSh 4.82 Trillion. Budget Ndio Story deploys 4 specialized operational desks to audit allocations, mobilize communities, train newsrooms, and produce cinematic media.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <PillButtonGroup
                href="/work"
                label="Explore Evidence Archive"
                variant="primary"
                size="lg"
              />
              <PillButtonGroup
                href="#desk-01"
                label="Scroll Through 4 Desks"
                variant="outline"
                size="lg"
              />
            </div>
          </div>

          {/* Macro Impact Ledger Strip with Animated Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-border/50 mt-8">
            <div className="space-y-1">
              <p className="font-heading text-4xl sm:text-5xl font-black text-primary tracking-tighter">
                <MetricCounter value={4.82} prefix="KSh " suffix="T" decimals={2} />
              </p>
              <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                National Budget Tracked FY26/27
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Treasury to Ministry verification
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tighter flex items-center">
                <span>04</span>
                <span className="text-primary ml-1">Focus</span>
              </p>
              <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                Embedded County Hubs
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Kakamega, Kilifi, Nakuru, Wajir
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-4xl sm:text-5xl font-black text-primary tracking-tighter">
                <MetricCounter value={120} suffix="+" />
              </p>
              <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                Journalists & Creators Trained
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Annual Wanahabari cohorts
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tighter">
                <MetricCounter value={100} suffix="%" />
              </p>
              <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                Surplus Reinvested in Audits
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                BNS Studios Double Impact
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 01: DESK 01 — BNS CONNECT (The Digital Hub)                      */}
      {/* ========================================================================= */}
      <section id="desk-01" className="min-h-screen flex items-center py-16 md:py-24 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-primary">01</span>
                <EditorialPill dot pulse size="xs">
                  BNS Connect · The Digital Hub
                </EditorialPill>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-[1.05]">
                <MaskedReveal delay={0.05}>Translating 400-page</MaskedReveal>{" "}
                <MaskedReveal delay={0.15}>accounting sheets into</MaskedReveal>{" "}
                <MaskedReveal delay={0.25} innerClassName="text-primary">
                  60-second mobile power.
                </MaskedReveal>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                When Treasury drops the Budget Policy Statement, scrutiny dies in bureaucratic silence. BNS Connect turns complex budget lines into viral explainer feeds, interactive debt meters, and citizen memorandums submitted to Parliament.
              </p>

              {/* Bold Impact Proof with MetricCounter */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/40">
                <div>
                  <p className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                    <MetricCounter value={1.4} suffix="M+" decimals={1} />
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">Video Impressions</p>
                </div>
                <div>
                  <p className="font-heading text-3xl sm:text-4xl font-black text-primary">
                    <MetricCounter value={480} suffix="K+" />
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">Explainer Views</p>
                </div>
                <div>
                  <p className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                    <MetricCounter value={80} suffix="-Page" />
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">Citizen Memorandum</p>
                </div>
              </div>

              <div className="pt-2">
                <PillButtonGroup
                  href="/programmes/connect"
                  label="Open BNS Connect Dossier"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <ParallaxWrapper speed={0.25}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.cohortA}
                    alt="Young Kenyans interrogating national debt amortization tables"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      Desk 01 Anchor
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Nairobi Youth Baraza cross-referencing national debt tables with ministry disbursements.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02: DESK 02 — BNS MASHINANI (The Grassroots Engine)             */}
      {/* ========================================================================= */}
      <section id="desk-02" className="min-h-screen flex items-center py-16 md:py-24 border-b border-border/40 bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <ParallaxWrapper speed={0.25}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumD}
                    alt="Community members conducting outdoor ward budget audit baraza"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      Desk 02 Anchor
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Kilifi artisanal fisherfolk verifying devolved blue economy allocations against shore landings.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-amber-600 dark:text-amber-400">02</span>
                <EditorialPill dot pulse size="xs">
                  BNS Mashinani · The Grassroots Engine
                </EditorialPill>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-[1.05]">
                <MaskedReveal delay={0.05}>Taking budget tracking from</MaskedReveal>{" "}
                <MaskedReveal delay={0.15}>Nairobi boardrooms to the</MaskedReveal>{" "}
                <MaskedReveal delay={0.25} innerClassName="text-amber-600 dark:text-amber-400">
                  village baraza.
                </MaskedReveal>
              </h2>

              <blockquote className="border-l-2 border-amber-500/80 pl-4 py-1 italic font-heading text-lg text-foreground/90 leading-snug">
                &ldquo;In the village, the budget isn&rsquo;t numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.&rdquo;
              </blockquote>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We equip resident monitors in Kakamega, Kilifi, Nakuru, and Wajir with waterproof scorecards, contractor signboard audit tools, and vernacular radio broadcasts reaching 800,000 rural citizens.
              </p>

              <div className="pt-2">
                <PillButtonGroup
                  href="/programmes/mashinani"
                  label="Open BNS Mashinani Dossier"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 03: DESK 03 — WANAHABARI LAB (The Investigative Media Arm)      */}
      {/* ========================================================================= */}
      <section id="desk-03" className="min-h-screen flex items-center py-16 md:py-24 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-red-500">03</span>
                <EditorialPill dot pulse size="xs">
                  Wanahabari Lab · The Investigative Media Arm
                </EditorialPill>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-[1.05]">
                <MaskedReveal delay={0.05}>The budget speech is theatre.</MaskedReveal>{" "}
                <MaskedReveal delay={0.15}>The real story begins</MaskedReveal>{" "}
                <MaskedReveal delay={0.25} innerClassName="text-red-500">
                  the morning after.
                </MaskedReveal>
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Kenyan newsrooms allocate 90% of their fiscal coverage to Budget Day in June. Wanahabari Lab trains 120+ reporters annually to scrape Controller of Budget PDFs, verify off-balance-sheet debt, and investigate public spending for the other 364 days.
              </p>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                <p className="font-mono text-xs font-bold text-red-500 uppercase tracking-wider">
                  Verified Investigative Scoops
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  Uncovered KSh 1.84B county health fund diversion in Daily Nation and KSh 1,203B debt interest consumption in Business Daily.
                </p>
              </div>

              <div className="pt-2">
                <PillButtonGroup
                  href="/programmes/wanahabari-lab"
                  label="Open Wanahabari Lab Dossier"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <ParallaxWrapper speed={0.25}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_MEDIA_IMAGES.productionA}
                    alt="Wanahabari investigative fellowship journalists examining fiscal leak documents"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-red-400 font-bold">
                      Desk 03 Anchor
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Newsroom editors cross-referencing exchequer tables with Auditor-General records.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: DESK 04 — BNS STUDIOS (The Creative Agency Theatre)         */}
      {/* ========================================================================= */}
      <section id="desk-04" className="min-h-screen flex items-center py-16 md:py-24 border-b border-border/40 bg-zinc-950 text-white">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <ParallaxWrapper speed={0.25}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl bg-black group">
                  <Image
                    src="/images/treasury/budget sasa ni delivery.jpg"
                    alt="BNS Studios flagship 21:9 screening film"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      Desk 04 Anchor · 21:9 Cinema
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      &ldquo;Budget Sasa Ni Delivery&rdquo; Master Explainer Reel · 480K+ Views.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-primary">04</span>
                <EditorialPill variant="invert" size="xs">
                  BNS Studios · Commercial Creative Craft
                </EditorialPill>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white leading-[1.05]">
                <MaskedReveal delay={0.05}>Commercial creative craft that</MaskedReveal>{" "}
                <MaskedReveal delay={0.15} innerClassName="text-primary">
                  bankrolls citizen budget audits.
                </MaskedReveal>
              </h2>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                We produce podcasts, 2D animations, short documentaries, and street takeovers for institutions and development partners. 100% of operating surplus is reinvested directly into grassroots budget scorecards across Kenya.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-black text-white">
                    <MetricCounter value={8} prefix="0" />
                  </p>
                  <p className="mt-0.5">Formats</p>
                </div>
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-black text-primary">
                    <MetricCounter value={47} />
                  </p>
                  <p className="mt-0.5">Counties Subsidized</p>
                </div>
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-black text-white">
                    <MetricCounter value={100} suffix="%" />
                  </p>
                  <p className="mt-0.5">Surplus Covenant</p>
                </div>
              </div>

              <div className="pt-2">
                <PillButtonGroup
                  href="/bns-studio"
                  label="Open BNS Studios Theatre"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — PUNCHY MOTION CTA BAND */}
      <section className="py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="The Sovereign Standard"
            title="Follow the public shilling. Reclaim civic power."
            description="Join over 1.4 million Kenyans auditing national debt, tracking county disbursements, and enforcing Article 201."
            ctaHref="/work"
            ctaLabel="Explore All Evidence"
            secondaryHref="/contact"
            secondaryLabel="Direct Partnership"
            motionBackground={true}
          />
        </div>
      </section>
    </article>
  );
}
