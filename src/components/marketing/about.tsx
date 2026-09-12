"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import {
  StickyStackedCycle,
  NarrativeScrollytellingCanvas,
  type NarrativeBeat,
} from "@/components/motion";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { aboutContent, landingSectionsContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { cn } from "@/utils";

const CHARTER_PRINCIPLES = landingSectionsContent.aboutCharter.principles as Array<{ title: string; description: string }>;

const ABOUT_NARRATIVE_BEATS = landingSectionsContent.aboutNarrative as NarrativeBeat[];

/** About section visibility: `src/content/partner-page-sections.json` → about.* */
const SHOW_ORIGIN_STORY = isSectionVisible("about", "originStory");
const SHOW_THEORY_OF_CHANGE = isSectionVisible("about", "theoryOfChange");
const SHOW_INTEGRITY_CHARTER = isSectionVisible("about", "integrityCharter");
const SHOW_TEAM = isSectionVisible("about", "team");
const SHOW_PARTNER_CTA = isSectionVisible("about", "partnerCta");

export default function About() {
  const { hero } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* 01 — Hero & Institutional Credo */}
      <section className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div data-gsap-hero-content className="flex flex-col items-start gap-4 lg:col-span-7">
              <EditorialPill dot pulse variant="default">
                {landingSectionsContent.aboutHero.pill}
              </EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                {landingSectionsContent.aboutHero.title}
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                {landingSectionsContent.aboutHero.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <PillButtonGroup
                  href="/programmes"
                  label="Explore Programmes"
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                />
                {SHOW_ORIGIN_STORY ? (
                  <PillButtonGroup
                    href="#origin-story"
                    label="Our Origin Story"
                    variant="outline"
                    className="w-full sm:w-auto justify-center"
                  />
                ) : (
                  <PillButtonGroup
                    href="#team"
                    label="Meet the team"
                    variant="outline"
                    className="w-full sm:w-auto justify-center"
                  />
                )}
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/40 pt-6">
                {(landingSectionsContent.aboutHero.stats as Array<{ value: string; label: string }>).map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                    <p className={cn(T.caption, "mt-1 text-muted-foreground")}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-gsap-hero-media className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/40 bg-muted md:aspect-[16/11] lg:aspect-[4/3] shadow-xl">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span>{landingSectionsContent.aboutHero.imageCaption}</span>
                <span className="font-medium text-primary">{landingSectionsContent.aboutHero.imageLocation}</span>
              </div>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* 02 — The Origin Story: Narrative Scrollytelling Documentary (muted: TMI) */}
      {SHOW_ORIGIN_STORY ? (
        <section id="origin-story" className="border-b border-border/40 bg-muted/10">
          <div className={SECTION_SHELL_INNER}>
            <NarrativeScrollytellingCanvas beats={ABOUT_NARRATIVE_BEATS} mediaPosition="right" />
          </div>
        </section>
      ) : null}

      {/* 03 — Theory of Change: The 4-Stage Impact Engine (muted: TMI / scroll-heavy) */}
      {SHOW_THEORY_OF_CHANGE ? (
        <section id="theory-of-change" className="border-b border-border/40 py-20 md:py-28 lg:py-36 bg-muted/20">
          <div className={SECTION_SHELL_INNER}>
            <StickyStackedCycle
              eyebrow="Theory of Change"
              title="How Forensic Data Becomes Citizen Power."
              description="We do not stop at generating infographics. We build the complete institutional pathway from initial investigation to binding legal and budget revisions."
              items={[
                {
                  id: "theory-01",
                  step: "01",
                  title: "Investigate & Mine",
                  description:
                    "Forensic scrutiny of Controller of Budget (OCOB) reports, National Treasury estimates, Auditor General findings, and county CBROPs before money disappears.",
                  badge: "Primary Data",
                  stat: {
                    value: "KSh 4.82T",
                    label: "Audited line-by-line across exchequer tables and OCOB quarterly reports",
                  },
                },
                {
                  id: "theory-02",
                  step: "02",
                  title: "Translate & Package",
                  description:
                    "Transforming 800-page fiscal bills into bilingual podcasts, viral short-form TikToks, visual explainers, and one-page citizen briefs.",
                  badge: "Creative Media",
                  image: BNS_COMMUNITY_IMAGES.cohortA,
                  imageAlt: "Youth editorial team packaging budget intelligence",
                },
                {
                  id: "theory-03",
                  step: "03",
                  title: "Mobilize on the Ground",
                  description:
                    "Hosting town halls, county civic forums, and youth assemblies across Kakamega, Kilifi, Nakuru, and Wajir to empower local taxpayers.",
                  badge: "Grassroots Action",
                  image: BNS_COMMUNITY_IMAGES.forumA,
                  imageAlt: "Community budget baraza in session",
                },
                {
                  id: "theory-04",
                  step: "04",
                  title: "Enforce & Hold Accountable",
                  description:
                    "Filing formal public participation submissions to the National Assembly, petitioning county assemblies, and partnering with investigative newsrooms.",
                  badge: "Civic Power & Delivery",
                  stat: {
                    value: "100%",
                    label: "Public submissions legally grounded in Article 201 of Kenya's Constitution",
                  },
                  cta: {
                    label: "Explore Programmes",
                    href: "/programmes",
                  },
                },
              ]}
              cta={{
                label: "Explore Programmes",
                href: "/programmes",
              }}
            />
          </div>
        </section>
      ) : null}

      {/* 04 — Data Integrity & Editorial Independence Charter (muted: TMI) */}
      {SHOW_INTEGRITY_CHARTER ? (
        <section id="methodology" className="border-b border-border/40 py-20 md:py-28 bg-background">
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className={T.eyebrow}>{landingSectionsContent.aboutCharter.eyebrow}</span>
                <h2 className={T.sectionTitle}>
                  {landingSectionsContent.aboutCharter.title}
                </h2>
                <p className={cn(T.lead, "text-muted-foreground")}>
                  {landingSectionsContent.aboutCharter.description}
                </p>
                <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ShieldCheck className="size-4" />
                    <span>{landingSectionsContent.aboutCharter.anchorLabel}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {landingSectionsContent.aboutCharter.anchorDescription}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CHARTER_PRINCIPLES.map((principle) => (
                  <div
                    key={principle.title}
                    className="rounded-2xl border border-border/50 bg-card p-6 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>{principle.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 05 — Team Roster Showcase */}
      {SHOW_TEAM ? (
        <div id="team">
          <TeamSection />
        </div>
      ) : null}

      {/* 06 — Civic Action & Partnership Portal */}
      {SHOW_PARTNER_CTA ? (
        <section className="py-20 md:py-28 bg-muted/30 border-t border-border/40">
          <div className={SECTION_SHELL_INNER}>
            <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-14 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <span className={cn(T.eyebrow, "inline-flex items-center gap-2")}>
                    <HeartHandshake className="size-3.5 text-primary" />
                    {landingSectionsContent.aboutPartnerCta.pill}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                    {landingSectionsContent.aboutPartnerCta.heading}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {landingSectionsContent.aboutPartnerCta.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {landingSectionsContent.aboutPartnerCta.primaryCta.label}
                  </Link>
                  <Link
                    href="/careers"
                    className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    {landingSectionsContent.aboutPartnerCta.secondaryCta.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
