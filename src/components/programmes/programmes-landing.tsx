"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Film,
  Users,
  CheckCircle2,
} from "lucide-react";
import { ProgrammesPartners } from "@/components/programmes/programmes-partners";
import { ProgrammesFaq } from "@/components/programmes/programmes-faq";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  programmeHref,
} from "@/content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

const MACRO_IMPACT_METRICS = [
  { value: "KSh 4.82T", label: "National Budget Tracked FY26/27", sub: "Treasury to Ministry verification" },
  { value: "04 Focus", label: "Embedded County Hubs", sub: "Kakamega, Kilifi, Nakuru, Wajir" },
  { value: "120+ Reporters", label: "Journalists & Creators Trained", sub: "Annual Wanahabari cohorts" },
  { value: "100% Surplus", label: "Reinvested in Grassroots Auditing", sub: "BNS Studios Double Impact" },
];

export function ProgrammesLanding() {
  const [activeTab, setActiveTab] = useState<string>("connect");
  const allProjects = studiosEvidenceData.getAllProjects();

  return (
    <article className="prog-page min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 01 — MASTER SOVEREIGN HERO (Extreme Macro-White Space: 24vh–30vh) */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-muted/10 to-background pt-24 pb-20 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6 max-w-4xl">
            <div>
              <EditorialPill dot pulse>
                Four Operational Desks · One Sovereign Standard
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              Follow the public shilling from Treasury to the grassroots.
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenya’s public finance is too large and too complex for generic reporting. Budget Ndio Story deploys 4 specialized desks to audit national allocations, empower ward monitors, train newsrooms, and produce high-craft cinematic media.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <PillButtonGroup
                href="/work"
                label="Explore Unified Evidence Across 4 Desks"
                variant="primary"
                size="lg"
              />
              <PillButtonGroup
                href="#desks-breakdown"
                label="Compare Operational Mandates"
                variant="outline"
                size="lg"
              />
            </div>
          </div>

          {/* Macro Impact Ledger Strip (Prose Margins, Zero Cards) */}
          <GsapStaggerReveal itemSelector="[data-gsap-metric]" className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-border/50">
            {MACRO_IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                data-gsap-metric
                className="space-y-1"
              >
                <p className="font-heading text-4xl sm:text-5xl font-black text-primary tracking-tighter">
                  {metric.value}
                </p>
                <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                  {metric.label}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {metric.sub}
                </p>
              </div>
            ))}
          </GsapStaggerReveal>
        </div>
      </header>

      {/* 02 — THE 4 OPERATIONAL DESKS: FLUID ASYMMETRICAL PORTFOLIO (Zero Monotonous Cards) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <GsapReveal className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8">
          <div className="max-w-2xl space-y-3">
            <EditorialPill>The Operational Portfolio</EditorialPill>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Four specialized desks, zero shallow promises.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-muted-foreground md:text-right leading-relaxed">
            Select an operational desk below to inspect its focus area, forensic methodology, and scrollytelling dossier.
          </p>
        </GsapReveal>

        {/* Desk Selector Bar */}
        <div className="flex items-center justify-start gap-2 p-1.5 rounded-full bg-muted/60 border border-border/60 overflow-x-auto mb-16 scrollbar-hide">
          {PROGRAMMES.map((p) => {
            const isActive = activeTab === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setActiveTab(p.slug)}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Active Desk Showcase: Widescreen Editorial Spread (Zero Monotonous Cards) */}
        {PROGRAMMES.map((prog) => {
          if (prog.slug !== activeTab) return null;
          const deskProjects = allProjects.filter((pj) => pj.programmeSlug === prog.slug);
          const flagship = deskProjects[0];

          return (
            <div
              key={prog.slug}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Left Column: Bold Editorial Narrative */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <EditorialPill variant="primary" size="xs">
                      {prog.eyebrow}
                    </EditorialPill>
                    <EditorialPill variant="muted" size="xs">
                      {deskProjects.length} Verified Evidence Dossiers
                    </EditorialPill>
                  </div>

                  <h3 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-[1.08]">
                    {prog.headline}
                  </h3>

                  <div className="prose prose-lg dark:prose-invert text-base sm:text-lg text-muted-foreground leading-relaxed">
                    <p>{prog.body}</p>
                  </div>

                  {/* Operational Ledger Points */}
                  <div className="pt-4 border-t border-border/40 space-y-3 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Target Audience: <strong className="text-foreground">{prog.audience}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Sovereign Standard: <strong className="text-foreground">Article 201 Constitution of Kenya</strong></span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <PillButtonGroup
                      href={programmeHref(prog.slug)}
                      label={`Open Scrollytelling Case Study: ${prog.name}`}
                      variant="primary"
                      size="lg"
                    />
                    <PillButtonGroup
                      href={`/work?programme=${prog.slug}`}
                      label="View Evidence Archive"
                      variant="outline"
                      size="lg"
                    />
                  </div>
                </div>

                {/* Right Column: Panoramic Media Canvas */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-border/60 shadow-2xl bg-muted">
                    <Image
                      src={prog.visual.hero}
                      alt={prog.visual.heroAlt}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                      <span className="font-mono text-[10px] uppercase text-primary font-bold">
                        Operational Visual Anchor
                      </span>
                      <p className="text-sm font-semibold leading-snug">
                        {prog.visual.heroAlt}
                      </p>
                    </div>
                  </div>

                  {/* Flagship Initiative Highlight in Fluid Editorial Prose (Zero Boxy Cards) */}
                  {flagship && (
                    <div className="p-6 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                        <span>FLAGSHIP EVIDENCE CASE</span>
                        <span className="text-primary font-bold">{flagship.contentType}</span>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-foreground">
                        {flagship.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {flagship.briefChallenge}
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/bns-studio/${flagship.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          <span>Read Full Production Whitepaper</span>
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 03 — INSIDE EACH OPERATIONAL DESK (Full-Width Narrative Timeline, Zero Monotonous Cards) */}
      <section id="desks-breakdown" className="border-t border-border/40 bg-muted/10 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Comprehensive Desk Registry
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Inside each operational desk.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              How our teams operate on the sovereign level, in county assemblies, across media newsrooms, and inside the creative studio.
            </p>
          </div>

          <div className="space-y-32">
            {PROGRAMMES.map((p, idx) => (
              <div
                key={p.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start border-t border-border/40 pt-16"
              >
                {/* Desk Header & Mandate */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-4xl font-black text-primary">
                      0{idx + 1}
                    </span>
                    <EditorialPill variant="muted" size="xs">
                      {p.eyebrow}
                    </EditorialPill>
                  </div>

                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-foreground leading-tight">
                    {p.name}
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={programmeHref(p.slug)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                    >
                      <span>Explore complete {p.name} narrative</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>

                {/* Desk Visual & Flow Timeline (Fluid Prose, Zero Monotonous Cards) */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="relative aspect-[16/8] rounded-3xl overflow-hidden border border-border/60 shadow-lg bg-muted">
                    <Image
                      src={p.visual.hero}
                      alt={p.visual.heroAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-md bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <span>{p.visual.heroAlt}</span>
                      <span className="font-mono text-[10px] text-primary font-bold">Desk 0{idx + 1}</span>
                    </div>
                  </div>

                  {/* Three Operational Milestones Flow */}
                  {p.pillars && p.pillars.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {p.pillars.map((pil, pIdx) => (
                        <div
                          key={pil.title}
                          className="border-l-2 border-primary/50 pl-5 py-1 space-y-1"
                        >
                          <div className="flex items-center gap-2 font-mono text-xs text-primary font-bold">
                            <span>PHASE 0{pIdx + 1}</span>
                            <span>·</span>
                            <span className="text-foreground">{pil.title}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {pil.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — COALITION PARTNERS */}
      <ProgrammesPartners />

      {/* 05 — FREQUENTLY ASKED QUESTIONS */}
      <ProgrammesFaq />

      {/* 06 — PARTNERSHIP CTA */}
      <LandingSection>
        <GsapReveal>
          <EditorialCtaBand
            eyebrow="Join the Civic Movement"
            title={PROGRAMMES_CLOSING.headline}
            description={PROGRAMMES_CLOSING.body}
            ctaHref={PROGRAMMES_CLOSING.cta.href}
            ctaLabel={PROGRAMMES_CLOSING.cta.label}
            secondaryHref="/contact"
            secondaryLabel="Direct Desk Enquiry"
            images={[
              { src: BNS_COMMUNITY_IMAGES.forumA, alt: "Citizen Town Hall Assembly" },
              { src: BNS_COMMUNITY_IMAGES.cohortA, alt: "Youth Budget Trackers" },
            ]}
          />
        </GsapReveal>
      </LandingSection>
    </article>
  );
}
