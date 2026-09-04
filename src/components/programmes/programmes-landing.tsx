"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  FileText,
} from "lucide-react";
import { ProgrammesPartners } from "@/components/programmes/programmes-partners";
import { ProgrammesFaq } from "@/components/programmes/programmes-faq";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import {
  PROGRAMMES,
  PROGRAMMES_CLOSING,
  PROGRAMMES_LANDING,
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
    <div className="prog-page bg-background text-foreground selection:bg-primary/20">
      {/* 01 — MASTER SOVEREIGN HERO */}
      <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-primary/5 via-muted/20 to-background pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4 max-w-4xl">
            <div>
              <EditorialPill dot pulse>
                Four Operational Desks · One Sovereign Standard
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.02]">
              Follow the public shilling from Treasury to the grassroots.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Kenya’s public finance is too large and too complex for generic reporting. Budget Ndio Story deploys 4 specialized desks to audit allocations, empower community monitors, train newsrooms, and produce high-craft civic media.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <PillButtonGroup
                href="/work"
                label="Explore Unified Evidence Across 4 Desks"
                variant="primary"
              />
              <PillButtonGroup
                href="#desks-breakdown"
                label="Compare Operational Mandates"
                variant="outline"
              />
            </div>
          </div>

          {/* Macro Impact Ledger Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-border/50">
            {MACRO_IMPACT_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm shadow-xs"
              >
                <p className="font-heading text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  {metric.value}
                </p>
                <p className="font-mono text-xs font-bold text-foreground mt-1 leading-tight">
                  {metric.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  {metric.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — INTERACTIVE DESK SELECTOR & ARCHITECTURAL PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <EditorialPill>The Operational Matrix</EditorialPill>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Four desks, zero shallow promises.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground md:text-right leading-relaxed">
            Select an operational desk below to inspect its focus area, methodology, target audience, and active project roster.
          </p>
        </div>

        {/* Desk Selector Pills */}
        <div className="flex items-center justify-start gap-2 p-1.5 rounded-full bg-muted/60 border border-border/60 overflow-x-auto mb-12 scrollbar-hide">
          {PROGRAMMES.map((p) => {
            const isActive = activeTab === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setActiveTab(p.slug)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
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

        {/* Active Desk Showcase Card */}
        {PROGRAMMES.map((prog) => {
          if (prog.slug !== activeTab) return null;
          const deskProjects = allProjects.filter((pj) => pj.programmeSlug === prog.slug);

          return (
            <div
              key={prog.slug}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-xl space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <EditorialPill variant="primary" size="xs">
                      Operational Desk
                    </EditorialPill>
                    <EditorialPill variant="muted" size="xs">
                      {prog.eyebrow}
                    </EditorialPill>
                  </div>

                  <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                    {prog.name}: {prog.headline}
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {prog.body}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                    <EditorialPill variant="default" size="xs">
                      For: {prog.audience}
                    </EditorialPill>
                    <EditorialPill variant="outline" size="xs">
                      {deskProjects.length} Active Verified Projects
                    </EditorialPill>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <PillButtonGroup
                      href={programmeHref(prog.slug)}
                      label={`Open Full ${prog.name} Dossier`}
                      size="sm"
                    />
                    <PillButtonGroup
                      href={`/work?programme=${prog.slug}`}
                      label="Filter evidence"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 shadow-lg">
                    <Image
                      src={prog.visual.hero}
                      alt={prog.visual.heroAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-medium backdrop-blur-md bg-black/40 p-2.5 rounded-lg border border-white/10">
                      {prog.visual.heroAlt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Projects Row */}
              {deskProjects.length > 0 && (
                <div className="pt-8 border-t border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Flagship Projects Under {prog.name}
                    </p>
                    <Link
                      href={`/work?programme=${prog.slug}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      View all ({deskProjects.length})
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deskProjects.slice(0, 3).map((pj) => (
                      <Link
                        key={pj.id}
                        href={`/bns-studio/${pj.slug}`}
                        className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 transition-all hover:border-primary/40 hover:bg-muted/60"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <EditorialPill variant="primary" size="xs">{pj.contentType}</EditorialPill>
                            <span className="font-mono text-muted-foreground">{pj.year}</span>
                          </div>
                          <h4 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {pj.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {pj.briefChallenge}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                          <span className="font-mono text-muted-foreground truncate max-w-[180px]">
                            {pj.organization.name}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-foreground group-hover:text-primary">
                            Details <ArrowUpRight className="size-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 03 — DETAILED EDITORIAL DESK BREAKDOWN (All 4 Desks) */}
      <section id="desks-breakdown" className="border-t border-border/50 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              Comprehensive Registry
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
              Inside each operational desk.
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl">
              How our teams operate on the sovereign level, in county assemblies, across media newsrooms, and inside the creative studio.
            </p>
          </div>

          <div className="space-y-16">
            {PROGRAMMES.map((p, idx) => {
              const deskProjects = allProjects.filter((pj) => pj.programmeSlug === p.slug);

              return (
                <div
                  key={p.slug}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start border-b border-border/50 pb-16 last:border-b-0"
                >
                  <div className="lg:col-span-4 space-y-4">
                    <span className="font-mono text-3xl font-black text-primary">
                      0{idx + 1}
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                      {p.name}
                    </h3>
                    <div>
                      <EditorialPill variant="muted" size="xs">
                        {p.eyebrow}
                      </EditorialPill>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={programmeHref(p.slug)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                      >
                        <span>Explore full {p.name} case study</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    {/* Visual Media Banner */}
                    <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-border/60 shadow-md">
                      <Image
                        src={p.visual.hero}
                        alt={p.visual.heroAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium backdrop-blur-md bg-black/40 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
                        <span>{p.visual.heroAlt}</span>
                        <span className="font-mono text-[10px] text-primary font-bold">Desk 0{idx + 1}</span>
                      </div>
                    </div>

                    {/* Operational Pillars Strip */}
                    {p.pillars && p.pillars.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {p.pillars.map((pil) => (
                          <div
                            key={pil.title}
                            className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5"
                          >
                            <p className="font-heading text-xs font-bold text-foreground">
                              {pil.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {pil.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — PARTNERS & COALITION */}
      <ProgrammesPartners />

      {/* 05 — FREQUENTLY ASKED QUESTIONS */}
      <ProgrammesFaq />

      {/* 06 — PARTNERSHIP / COMMISSION CTA */}
      <LandingSection>
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
      </LandingSection>
    </div>
  );
}
