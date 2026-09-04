"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  FileSpreadsheet,
  Radio,
  Building,
  Quote,
} from "lucide-react";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { EditorialCtaBand } from "@/components/ui/editorial/editorial-cta-band";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

export function MashinaniScrollytelling() {
  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-amber-500/20">
      {/* 01 — EDITORIAL HERO WITH WARM EARTHY ACCENTS & MACRO-WHITE SPACE */}
      <header className="relative border-b border-border/40 bg-linear-to-b from-amber-500/5 via-muted/10 to-background pt-24 pb-20 md:pt-36 md:pb-32">
        <div className={SECTION_SHELL_INNER}>
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Operational Desks</span>
            </Link>
          </nav>

          <div className="space-y-8 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse>
                Desk 02 · The Grassroots Engine
              </EditorialPill>
              <EditorialPill variant="outline">
                County Devolution & Ward-Level Citizen Audit
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              Taking budget tracking from Nairobi boardrooms to the village baraza.
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenya devolved over KSh 502 Billion to 47 county governments. Yet when exchequer releases stall, maternal clinics run out of medicine and community boreholes dry up. BNS Mashinani equips resident monitors to audit ward expenditures on the ground.
            </p>

            {/* Strategic Overview Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-8 border-t border-border/50">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Operational Altitude
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  Grassroots Devolution
                </p>
                <p className="text-xs text-muted-foreground">Counties, Wards & Barazas</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Focus Geographies
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  4 Core County Hubs
                </p>
                <p className="text-xs text-muted-foreground">Nakuru · Kilifi · Kakamega · Wajir</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Primary Tool
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  Physical Scorecards
                </p>
                <p className="text-xs text-muted-foreground">Signboard Verification Kits</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Devolution Share
                </p>
                <p className="mt-1 text-base font-bold text-foreground">
                  KSh 502 Billion
                </p>
                <p className="text-xs text-muted-foreground">FY2026/27 Equitable + Grants</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — OPENING HOOK: GRAND MONUMENTAL COMMUNITY QUOTE */}
      <section className="py-24 md:py-36 border-b border-border/30 bg-muted/5">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-4xl mx-auto text-left space-y-8">
            <Quote className="size-16 text-amber-500/30" />
            <blockquote className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.15]">
              &ldquo;In the village, the budget isn&rsquo;t numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.&rdquo;
            </blockquote>
            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-foreground">Hassan Ali</p>
                <p className="font-mono text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Community Monitor · Wajir County Hub
                </p>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Documented at BNS Northern Frontier Citizen Hearing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — THE PHYSICAL TOOLKIT & COMMUNITY WORKSHOPS NARRATIVE */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Chapter 01 · The Offline Infrastructure
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                  Because digital tools are useless when the power is out.
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-6xl first-letter:font-black first-letter:text-amber-600 dark:first-letter:text-amber-400">
                  National budget transparency platforms routinely assume that all citizens have high-speed 5G smartphones and fluent English literacy. In reality, the communities most impacted by diverted county revenues live beyond reliable broadband connectivity.
                </p>
                <p>
                  BNS Mashinani operates an offline-first civic toolkit. We print physical waterproof ward scorecards, distribute Contractor Signboard Inspection Checklists, and produce weekly vernacular radio bulletins broadcast across community FM stations in Dholuo, Kikuyu, Giriama, Somali, and Luhya.
                </p>
              </div>

              {/* Editorial Toolkit Ledger */}
              <div className="space-y-6 pt-4">
                <div className="border-l-2 border-amber-500/60 pl-5 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <FileSpreadsheet className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>The Ward Project Signboard Checklist</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    By law, every public project must display a signboard stating the contractor name, allocated amount, and completion timeline. Our monitors photograph every missing or abandoned signboard.
                  </p>
                </div>

                <div className="border-l-2 border-amber-500/60 pl-5 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Radio className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>Vernacular Radio Syndication</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    15-minute weekly civic audio dispatches breaking down county exchequer releases, aired across 12 community radio stations reaching over 800,000 rural listeners.
                  </p>
                </div>

                <div className="border-l-2 border-amber-500/60 pl-5 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Building className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>Town Hall Baraza Facilitation Runbooks</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Step-by-step participatory agendas enabling grassroots residents to question County Executive Committee Members without political intimidation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Ground Documentary Photo Anchor */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl bg-muted">
                <Image
                  src={BNS_COMMUNITY_IMAGES.forumD}
                  alt="Rural community members reviewing budget allocations at an outdoor village baraza"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Kilifi County Baraza
                  </span>
                  <p className="text-sm font-semibold leading-snug">
                    Artisanal fisherfolk cooperative verifying devolved fisheries allocation against shore landings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — GALLERY OF LOCALIZED VICTORIES (18vh–22vh Macro Pacing Transitions, Pure Journalistic Voice) */}
      <section className="py-24 md:py-36 border-b border-border/30">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-3xl space-y-4 mb-20">
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Chapter 02 · Localized Victories
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              What happens when communities follow the shilling to the end.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real victories achieved by resident monitor cohorts across four devolved counties. Each story is given room to breathe.
            </p>
          </div>

          {/* CASE STUDY 01: NAKURU (Macro Paced: 16vh spacing) */}
          <div className="py-16 md:py-24 border-t border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <EditorialPill variant="muted" size="xs">
                    <MapPin className="size-3 text-amber-500 inline mr-1" />
                    Nakuru County · Subukia Ward
                  </EditorialPill>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    KSh 14,000,000 Unfrozen
                  </span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                  Reopening the Subukia Maternity Wing After 18 Months of Pending Bills.
                </h3>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Subukia&rsquo;s newly built maternity unit sat locked for over a year due to an unverified KSh 14 Million pending bill dispute between the county health department and electrical contractors. BNS Mashinani monitors audited the physical procurement ledger and organized a tri-camera citizen baraza attended by 340 residents.
                </p>

                {/* Journalistic Outcome Flow (No AI Callout Box) */}
                <div className="pt-2 space-y-2 border-l-2 border-amber-500/80 pl-4">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    The Ground Impact
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                    Nakuru County Assembly cited the BNS citizen scorecard directly in official Hansard records. With 340 residents packing the municipal chamber, the county executive authorized contractor settlement, unlocking the maternity doors within 60 days.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-muted">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumA}
                    alt="Nakuru Citizen Budget Baraza convening inside municipal hall"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
                    Nakuru Town Hall: 340 in-room residents and County Assembly Finance Committee delegates.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CASE STUDY 02: KILIFI (Macro Paced: 16vh spacing) */}
          <div className="py-16 md:py-24 border-t border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-muted">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumE}
                    alt="Dispensary site audit inspection in Kilifi"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
                    Kilifi Field Inspection: Verifying tender bills against on-site foundation works.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <div className="flex items-center gap-2">
                  <EditorialPill variant="muted" size="xs">
                    <MapPin className="size-3 text-amber-500 inline mr-1" />
                    Kilifi County · Malindi Ward
                  </EditorialPill>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    4 Stalled Facilities Exposed
                  </span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                  Stopping Ghost Completion Certificates in Coastal Healthcare.
                </h3>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Official county executive progress reports listed four rural dispensaries in Kilifi as &ldquo;100% structurally complete and operational.&rdquo; Resident youth monitors visited all four coordinates, documenting roofless brick shells overgrown with brush. The photographic dossier forced an immediate county audit committee review.
                </p>

                {/* Journalistic Outcome Flow (No AI Callout Box) */}
                <div className="pt-2 space-y-2 border-l-2 border-amber-500/80 pl-4">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    The Ground Impact
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                    County Executive cancelled fraudulent completion certificates and re-allocated KSh 22M in the supplementary budget to complete roofing under resident monitor oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CASE STUDY 03: KAKAMEGA (Macro Paced: 16vh spacing) */}
          <div className="py-16 md:py-24 border-t border-border/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <EditorialPill variant="muted" size="xs">
                    <MapPin className="size-3 text-amber-500 inline mr-1" />
                    Kakamega County · Shinyalu Ward
                  </EditorialPill>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    KSh 4.2M Solar Borehole
                  </span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                  From Dry Pipes to 12,000 Litres of Daily Clean Flow.
                </h3>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  A solar-powered community borehole had remained inactive for eight months because solar pump inverters were never supplied, despite full contract sign-off. Women&rsquo;s cooperative leaders used BNS Mashinani scorecards to petition the Ward Administrator directly during public participation sessions.
                </p>

                {/* Journalistic Outcome Flow (No AI Callout Box) */}
                <div className="pt-2 space-y-2 border-l-2 border-amber-500/80 pl-4">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    The Ground Impact
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                    Contractor recalled under performance bond guarantee; solar pumps installed and pumping clean water to over 1,800 households.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/60 shadow-xl bg-muted">
                  <Image
                    src={BNS_COMMUNITY_IMAGES.forumC}
                    alt="Participatory budget mapping session with women's cooperatives in Kakamega"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium">
                    Kakamega Participatory Mapping: Community leaders tracing water pipeline allocations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — PUNCHY MOTION CTA BAND (Zero Monotonous Contact Cards) */}
      <section className="py-20 md:py-28">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="Decentralized Citizen Power"
            title="Follow the shilling in your home county."
            description="Audit ward project signboards, access verified exchequer releases, and host community barazas with BNS Mashinani."
            ctaHref="/work?programme=mashinani"
            ctaLabel="Explore County Evidence"
            secondaryHref="/contact"
            secondaryLabel="Request Field Workshop"
            motionBackground={true}
          />
        </div>
      </section>
    </article>
  );
}
