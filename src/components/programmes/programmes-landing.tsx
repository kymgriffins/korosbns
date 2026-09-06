"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  FileSearch,
  Radio,
  Smartphone,
  Users2,
  Film,
} from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { ProgrammesSovereignTicker } from "@/components/programmes/programmes-sovereign-ticker";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
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

      {/* 01 — MASTER SOVEREIGN HERO: MACRO-WHITESPACE & EDITORIAL TYPOGRAPHY */}
      <header className="relative overflow-hidden pt-8 pb-12 md:pt-16 md:pb-20">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-4 max-w-4xl w-full min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full min-w-0">
              <EditorialPill dot pulse className="hidden sm:inline-flex shrink-0">
                Four Operational Desks
              </EditorialPill>
              <ProgrammesSovereignTicker className="min-w-0 flex-1 w-full" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              <MaskedReveal delay={0.05}>Follow the public shilling</MaskedReveal>{" "}
              <MaskedReveal delay={0.15}>from Treasury to the</MaskedReveal>{" "}
              <MaskedReveal delay={0.25} innerClassName="text-primary">
                grassroots.
              </MaskedReveal>
            </h1>

            <p className="text-lg sm:text-xl font-normal text-foreground/80 leading-relaxed max-w-3xl">
              Kenya’s national budget crosses KSh 4.82 Trillion. Budget Ndio Story deploys 4 specialized, non-replicated operational desks to audit allocations, mobilize digital youth, ground rural barazas, and produce cinematic media.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <PillButtonGroup
                href="/work"
                label="Explore Evidence Archive"
                variant="primary"
                size="default"
                className="w-full sm:w-auto justify-center"
              />
              <PillButtonGroup
                href="#desk-01"
                label="Explore The 4 Desks"
                variant="outline"
                size="default"
                className="hidden sm:inline-flex w-full sm:w-auto justify-center"
              />
            </div>
          </div>

          {/* Clean Editorial Impact Row — No Harsh Box Borders */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 mt-8 border-t border-border/30">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-primary tracking-tighter">
                <MetricCounter value={4.82} prefix="KSh " suffix="T" decimals={2} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">
                National Budget Tracked
              </p>
              <p className="text-xs text-muted-foreground">
                Treasury to ministry line-item verification
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter flex items-center">
                <span>04</span>
                <span className="text-primary ml-1.5 text-2xl font-bold">Counties</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">
                Embedded Grassroots Hubs
              </p>
              <p className="text-xs text-muted-foreground">
                Kakamega, Kilifi, Nakuru, and Wajir
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-primary tracking-tighter">
                <MetricCounter value={120} suffix="+" />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">
                Reporters & Fellows Trained
              </p>
              <p className="text-xs text-muted-foreground">
                Year-round forensic newsroom cohorts
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter">
                <MetricCounter value={100} suffix="%" />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">
                Commercial Surplus Covenant
              </p>
              <p className="text-xs text-muted-foreground">
                Reinvested in citizen budget audits
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* DESK 01: BNS CONNECT — TYPOGRAPHIC MANIFESTO & DIGITAL YOUTH SPREAD        */}
      {/* ========================================================================= */}
      <section id="desk-01" className="py-14 sm:py-18 md:py-20 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          {/* Section Identifier Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Desk 01 · BNS Connect
            </span>
            <span className="h-px w-12 bg-primary/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Youth Digital Mobilization
            </span>
          </div>

          <div className="space-y-4 max-w-4xl mb-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.06] tracking-tight">
              Translating 400-page accounting sheets into 60-second mobile power.
            </h2>
          </div>

          {/* Expansive Borderless Photographic Canvas */}
          <ParallaxWrapper speed={0.15}>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg mb-8 sm:mb-10">
              <Image
                src={BNS_COMMUNITY_IMAGES.cohortA}
                alt="Young Kenyans interrogating national debt amortization tables"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 text-white max-w-2xl space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold text-primary">
                  Nairobi Youth Baraza
                </p>
                <p className="text-sm sm:text-base font-medium leading-snug">
                  Auditing national debt amortization tables against real-time Ministry disbursements.
                </p>
              </div>
            </div>
          </ParallaxWrapper>

          {/* Two-Column Asymmetrical Narrative Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-foreground/85 leading-relaxed">
              <p>
                When Treasury drops the annual Budget Policy Statement, accountability historically vanished inside 400-page PDF tables written in impenetrable bureaucratic jargon. Parliamentary committees debated behind closed doors while millions of young taxpayers were locked out of the conversation.
              </p>
              <p>
                BNS Connect flips this dynamic. We ingest raw exchequer tables, debt amortization schedules, and tax bills, distilling them into rapid-fire 60-second video explainers, swipeable TikTok carousels, and verified WhatsApp infographics.
              </p>
              <p className="text-foreground font-medium">
                Over 1.4 million digital citizens now track national budget allocations directly on their screens, turning passive reading into targeted public participation submissions to the National Assembly.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-6">
              {/* Editorial Pullquote in Neue Montreal Italic */}
              <div className="pl-5 border-l-2 border-primary space-y-1.5">
                <blockquote className="text-lg sm:text-xl font-normal italic text-foreground leading-snug">
                  &ldquo;We don&rsquo;t summarize the budget for archives. We translate the data into immediate leverage for citizen action.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">
                  — BNS Digital Desk, Nairobi
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <Smartphone className="size-4 text-primary shrink-0" />
                  <span>Direct integration with our TikTok &amp; Reels format</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <FileSearch className="size-4 text-primary shrink-0" />
                  <span>80-page citizen memorandum submitted to Finance Committee</span>
                </div>

                <div className="pt-2">
                  <PillButtonGroup
                    href="/programmes/connect"
                    label="Open BNS Connect Dossier"
                    variant="outline"
                    size="default"
                    className="w-full sm:w-auto justify-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DESK 02: BNS MASHINANI — GROUNDED FIELD PHOTO-ESSAY & RURAL BARAZA SPREAD */}
      {/* ========================================================================= */}
      <section id="desk-02" className="py-14 sm:py-18 md:py-20 bg-muted/20 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          {/* Section Identifier */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Desk 02 · BNS Mashinani
            </span>
            <span className="h-px w-12 bg-amber-500/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              The Devolved Grassroots Engine
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black text-foreground leading-[1.06] tracking-tight">
                Taking budget tracking from Nairobi boardrooms to the village baraza.
              </h2>

              <div className="pl-5 border-l-2 border-amber-500/80 space-y-1.5">
                <blockquote className="text-base sm:text-lg font-normal italic text-foreground leading-snug">
                  &ldquo;In the village, the budget isn&rsquo;t numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">
                  — Subukia Ward Community Baraza, Nakuru County
                </p>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-foreground/85 leading-relaxed">
                <p>
                  Fiscal devolution was designed to place resources into the hands of local communities. Yet 78% of rural Kenyans report never seeing a ward development breakdown before projects are approved.
                </p>
                <p>
                  BNS Mashinani deploys embedded civic field leads across Kakamega, Kilifi, Nakuru, and Wajir. We train residents with waterproof audit scorecards to cross-check county gazette budgets against actual physical contractor work.
                </p>
                <p>
                  Through weekly vernacular radio broadcasts and open-air barazas under village trees, we empower farmers, youth groups, and artisanal fisherfolk to challenge ghost allocations before completion certificates are rubber-stamped.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <PillButtonGroup
                  href="/programmes/mashinani"
                  label="Open BNS Mashinani Dossier"
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto justify-center"
                />
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Radio className="size-4 shrink-0" />
                  <span>800K+ Vernacular Listeners</span>
                </div>
              </div>
            </div>

            {/* Right Photo-Essay Canvas — Mobile compact 16:10, desktop 4:5 */}
            <div className="lg:col-span-6">
              <ParallaxWrapper speed={0.2}>
                <div className="relative aspect-[16/10] sm:aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumD}
                    alt="Community members conducting outdoor ward budget audit baraza"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      Kilifi County Field Baraza
                    </span>
                    <p className="text-xs sm:text-sm font-medium leading-snug">
                      Artisanal fisherfolk cross-referencing blue economy devolved funds with actual landing site infrastructure.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DESK 03: WANAHABARI LAB — AUTHORITATIVE INVESTIGATIVE NEWSROOM SPREAD      */}
      {/* ========================================================================= */}
      <section id="desk-03" className="py-14 sm:py-18 md:py-20 bg-background border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          {/* Section Identifier */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">
              Desk 03 · Wanahabari Lab
            </span>
            <span className="h-px w-12 bg-red-500/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              The 364-Day Investigative Newsroom
            </span>
          </div>

          <div className="max-w-4xl space-y-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.06] tracking-tight">
              The budget speech is theatre. The real story begins the morning after.
            </h2>
            <p className="text-base sm:text-lg text-foreground/80 font-normal leading-relaxed max-w-3xl">
              Kenyan commercial media concentrates 90% of fiscal reportage on Budget Day in June. Wanahabari Lab equips investigative reporters to track exchequer requisitions and forensic procurement for the other 364 days.
            </p>
          </div>

          {/* Investigative Case Studies Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                Case Inquiry 01 · County Health Diversions
              </span>
              <h3 className="text-xl font-bold text-foreground leading-snug">
                Uncovering KSh 1.84 Billion in locked maternity wings.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When county health allocations were diverted to pay recurrent supplier debts, Wanahabari fellows scraped Controller of Budget quarterly releases, matched them to local contractor records, and co-published the findings in national print dailies.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                Case Inquiry 02 · Consolidated Fund Services
              </span>
              <h3 className="text-xl font-bold text-foreground leading-snug">
                Exposing KSh 1,203 Billion public debt interest appetite.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our fellowship analyzed sovereign amortization tables to demonstrate that out of every KSh 100 collected by KRA, KSh 64 was swallowed by debt servicing before a single development grant left the exchequer account.
              </p>
            </div>
          </div>

          {/* Newsroom Photography Canvas */}
          <ParallaxWrapper speed={0.15}>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted shadow-lg mb-6 sm:mb-8">
              <Image
                src={BNS_MEDIA_IMAGES.productionA}
                alt="Wanahabari investigative fellowship journalists examining fiscal leak documents"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 text-white space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold text-red-400">
                  Newsroom Fellowship Cohort
                </p>
                <p className="text-xs sm:text-sm font-medium leading-snug">
                  Fellows cross-referencing exchequer requisition tables with Auditor-General audit queries.
                </p>
              </div>
            </div>
          </ParallaxWrapper>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <PillButtonGroup
              href="/programmes/wanahabari-lab"
              label="Open Wanahabari Lab Dossier"
              variant="outline"
              size="default"
              className="w-full sm:w-auto justify-center"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              120+ Reporters Trained Annually Across Kenya
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DESK 04: BNS STUDIOS — MIDNIGHT 21:9 WIDESCREEN CINEMA THEATRE             */}
      {/* ========================================================================= */}
      <section id="desk-04" className="py-14 sm:py-18 md:py-20 bg-black text-white border-b border-zinc-800">
        <div className={SECTION_SHELL_INNER}>
          {/* Section Identifier */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Desk 04 · BNS Studios
            </span>
            <span className="h-px w-12 bg-primary/40" />
            <span className="text-xs text-zinc-400 uppercase tracking-wider">
              Commercial Creative Craft
            </span>
          </div>

          <div className="max-w-4xl space-y-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.06] tracking-tight">
              Commercial creative craft that bankrolls citizen budget audits.
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-3xl">
              We operate an independent, top-tier creative production studio producing podcasts, documentaries, 2D animations, and street campaigns for leading civic institutions.
            </p>
          </div>

          {/* Cinema Impact Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 my-6 border-y border-zinc-800/80">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">480K+</span>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Reel &amp; Doc Views</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">100%</span>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Surplus Reinvested</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">47</span>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Counties Supported</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">21:9</span>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Cinematic Master Reels</p>
            </div>
          </div>

          {/* The Double Impact Covenant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                The Double Impact Covenant
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Rather than relying solely on donor cycles, BNS Studios sells premium storytelling, motion design, and video production to commercial and development partners. 100% of operating surplus is channeled directly into printing grassroots scorecards and funding investigative fellowships in all 47 counties.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:items-start lg:items-end justify-center pt-2">
              <PillButtonGroup
                href="/programmes/studios"
                label="Open BNS Studios Dossier"
                variant="outline"
                size="default"
                className="w-full sm:w-auto justify-center border-white/30 text-white hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — FLAGSHIP EVIDENCE STREAM: ENDLESS REEL OF CROSS-DESK PRODUCTIONS       */}
      {/* ========================================================================= */}
      <ProgrammesProjectsLoop />

      {/* 06 — AIRY EDITORIAL CTA BAND */}
      <section className="py-12 sm:py-16 md:py-20">
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

