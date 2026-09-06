"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Smartphone,
  Share2,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup } from "@/components/ui/editorial/pill-button-group";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  TelemetryHUD,
  MaskedReveal,
  ParallaxWrapper,
  MetricCounter,
} from "@/components/motion";

export function ConnectScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 00 — LOCOMOTIVE-GRADE TECHNICAL TELEMETRY HUD */}
      <TelemetryHUD
        activeDesk="DESK 01: BNS CONNECT"
        focusArea="NATIONAL TREASURY & PARLIAMENT"
        badgeLabel="SOVEREIGN LEDGER"
      />

      {/* 01 — ASYMMETRICAL EDITORIAL HERO */}
      <header className="relative border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/10 to-background pt-4 pb-10 md:pt-6 md:pb-14 overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          {/* Breadcrumb back to programmes */}
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Operational Desks</span>
            </Link>
          </nav>

          <div className="space-y-4 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse>
                Desk 01 · The Digital Hub
              </EditorialPill>
              <EditorialPill variant="outline">
                Macro Sovereign Policy & Youth Distribution
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              <MaskedReveal delay={0.05}>Translating 400-page</MaskedReveal>{" "}
              <MaskedReveal delay={0.15}>accounting sheets into 60-second</MaskedReveal>{" "}
              <MaskedReveal delay={0.25} innerClassName="text-primary">
                digital civic power.
              </MaskedReveal>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              When the National Treasury drops a dense Budget Policy Statement, public scrutiny usually dies in bureaucratic silence. BNS Connect turns complex budget lines into viral explainer feeds, interactive debt meters, and youth memorandums.
            </p>

            {/* Strategic Ledger Strip with Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Operational Altitude
                </p>
                <p className="text-base font-bold text-foreground">
                  Macro Sovereign Policy
                </p>
                <p className="text-xs text-muted-foreground">National Treasury & Parliament</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Demographic
                </p>
                <p className="text-base font-bold text-foreground">
                  18–35 Digital Citizens
                </p>
                <p className="text-xs text-muted-foreground">47 County Hub Networks</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Flagship Vehicle
                </p>
                <p className="text-base font-bold text-primary">
                  Sheng & Swahili Explainers
                </p>
                <p className="text-xs text-muted-foreground">Vertical Video & Infographics</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Sovereign Standard
                </p>
                <p className="text-base font-bold text-foreground">
                  Article 201 Constitution
                </p>
                <p className="text-xs text-muted-foreground">Public Finance Openness</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — THE NARRATIVE ARC: CHAPTER 01 — THE 400-PAGE CHASM */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Bold Asymmetric Typography & Story */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                  Chapter 01 · The Strategic Friction
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  Budget secrecy is no longer hidden in locked vaults. It is hidden in 400-page accounting PDFs.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-primary">
                  Every June, Parliament debates a national budget crossing KSh 4.82 Trillion. Yet the documents detailing where this wealth flows—the Budget Estimates, the Medium-Term Debt Management Strategy, and the Finance Bill—are deliberately formatted in dense fiscal terminology designed to exhaust public attention.
                </p>
                <p>
                  While older generations accepted fiscal opacity as inevitable government bureaucracy, 70% of Kenya’s population is under 35. This generation lives on mobile feeds, communicates in bilingual shorthand, and demands immediate accountability for every shilling deducted from their payrolls.
                </p>
              </div>

              {/* Frontline Voice Pull */}
              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 space-y-3 bg-muted/20 rounded-r-2xl pr-6">
                <p className="font-heading text-xl font-medium italic text-foreground md:text-2xl leading-relaxed">
                  &ldquo;When you understand the debt repayment schedule, you stop looking at broken roads as bad luck and start seeing them as fiscal diversion.&rdquo;
                </p>
                <footer className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  — Grace Muthoni, Youth Tracker Lead, Nairobi Hub
                </footer>
              </blockquote>
            </div>

            {/* Right Column: Parallax Photojournalism Proof */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <ParallaxWrapper speed={-0.3}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted group">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.cohortA}
                    alt="Kenyan youth tracker examining national budget lines on mobile"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                      Nairobi Data Assembly
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      Fellows cross-referencing national debt amortization tables with Ministry disbursements.
                    </p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CHAPTER 02: THE STICKY SCROLLYTELLING ENGINE (Dynamic Counter Stream) */}
      <section className="py-24 md:py-40 relative overflow-hidden bg-muted/10 border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="mb-16 space-y-3 max-w-2xl">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Chapter 02 · The Digital Engine
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Mobile speed meeting forensic fiscal truth.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              How BNS Connect intercepts raw Treasury releases and translates them into massive civic reach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Vertical Explainer Video (No Outer Nested Card) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 flex justify-center">
              <div className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-2xl">
                <Image
                  src={BNS_MEDIA_IMAGES.productionB}
                  alt="Youth presenter recording vertical budget explainer for social feeds"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                {/* On-screen Live Digital Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-mono font-bold tracking-wider backdrop-blur-xs">
                    <span className="size-1.5 rounded-full bg-white animate-ping" />
                    LIVE FEED
                  </div>
                  <span className="font-mono text-[11px] text-white/90 font-bold drop-shadow">
                    #BudgetNdioStory
                  </span>
                </div>

                {/* Bottom Explainer Overlay */}
                <div className="absolute bottom-5 left-4 right-4 text-white space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-primary" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">Vertical Explainer Hub</span>
                  </div>
                  <p className="text-xs text-white/90 leading-tight font-medium">
                    Bilingual Sheng/Swahili breakdowns streaming to over 1.4M first-time voters.
                  </p>
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-mono text-white/80">
                    <span>Sovereign Mobile Engine</span>
                    <span className="text-primary font-bold">TikTok · Reels · X</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Fluid Scrolling Narrative & Asymmetric Large Stats */}
            <div className="lg:col-span-7 space-y-24">
              {/* Step 1: Reach & Impressions */}
              <div className="space-y-4 pt-4 border-b border-border/40 pb-16">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
                  <TrendingUp className="size-4" />
                  <span>Metric 01 · Viral Citizen Scrutiny</span>
                </div>

                <div className="space-y-2">
                  <p className="font-heading text-6xl sm:text-7xl font-black text-foreground tracking-tighter">
                    <MetricCounter value={1.4} suffix="M+" decimals={1} />
                  </p>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Verified Video Impressions
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  During the Finance Bill debates, BNS Connect produced and syndicated 20 short-form video explainers dissecting VAT proposals and eco-levy clauses. The content generated over 1.4 million impressions with an average watch time of 82%, shattering the myth that youth do not care about tax policy.
                </p>
              </div>

              {/* Step 2: Sheng and Swahili Localization */}
              <div className="space-y-4 border-b border-border/40 pb-16">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
                  <Share2 className="size-4" />
                  <span>Metric 02 · Vernacular Demystification</span>
                </div>

                <div className="space-y-2">
                  <p className="font-heading text-6xl sm:text-7xl font-black text-primary tracking-tighter">
                    <MetricCounter value={480} suffix="K+" />
                  </p>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    &ldquo;Budget Sasa Ni Delivery&rdquo; Views
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Co-produced alongside national civic researchers, our flagship YouTube explainer translated KSh 4.82 Trillion of allocation tables into practical consumer goods, fuel prices, and county health dispensary medicine stocks.
                </p>
              </div>

              {/* Step 3: Direct Institutional Memorandum */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-primary uppercase tracking-wider">
                  <FileCheck className="size-4" />
                  <span>Metric 03 · Direct Legislative Intervention</span>
                </div>

                <div className="space-y-2">
                  <p className="font-heading text-6xl sm:text-7xl font-black text-foreground tracking-tighter">
                    <MetricCounter value={80} suffix="-Page" />
                  </p>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Citizen Debt Memorandum Delivered
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Digital mobilization did not stay on the screen. Over 3,200 individual youth inputs were consolidated into an 80-page forensic citizen submission presented directly to the National Assembly Budget and Appropriations Committee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — CHAPTER 03: FULL-BLEED DOCUMENTARY PHOTOJOURNALISM */}
      <section className="py-20 md:py-28">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-4 mb-10 max-w-3xl">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Chapter 03 · Ground Verification
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              From TikTok screens to the parliamentary floor.
            </h2>
          </div>

          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
            <Image
              src={BNS_COMMUNITY_IMAGES.forumA}
              alt="National budget scrutiny assembly with young citizens and civil society"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="max-w-2xl space-y-2">
                <EditorialPill variant="invert" size="xs">
                  National Civic Assembly
                </EditorialPill>
                <p className="text-lg sm:text-2xl font-bold leading-snug">
                  Nairobi Youth Baraza interrogating National Treasury Budget Estimates prior to parliamentary adoption.
                </p>
              </div>
              <p className="font-mono text-xs text-white/70">
                Verified BNS Connect Field Operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — DESK CALL TO ACTION & ALLIED ENGAGEMENT */}
      <footer className="border-t border-border/40 bg-muted/20 py-20 md:py-32">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-14 lg:p-20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <EditorialPill dot pulse>
                  Participate & Mobilize
                </EditorialPill>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Join the youth network tracking the national budget.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Whether you are a university student organizing a regional budget circle or a digital creator producing fiscal explainers, BNS Connect provides vetted data sets, visual toolkits, and direct parliamentary briefing channels.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <PillButtonGroup
                    href="/surveys"
                    label="Take the Civic Budget Pulse Survey"
                    variant="primary"
                    size="default"
                    className="w-full sm:w-auto justify-center"
                  />
                  <PillButtonGroup
                    href="/work?programme=connect"
                    label="View Connect Evidence & Dossiers"
                    variant="outline"
                    size="default"
                    className="hidden sm:inline-flex w-full sm:w-auto justify-center"
                  />
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 text-xs font-mono text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 w-full space-y-2">
                  <p className="text-foreground font-bold text-sm">BNS Connect Direct Desk</p>
                  <p>Inquiries: connect@budgetndiostory.org</p>
                  <p>Weekly dispatch: Thursday 16:00 EAT</p>
                  <p className="text-primary font-semibold">100% Open Civic Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
