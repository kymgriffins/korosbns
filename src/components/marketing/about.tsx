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
  type StickyCycleItem,
  NarrativeScrollytellingCanvas,
  type NarrativeBeat,
} from "@/components/motion";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { aboutContent } from "@/content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

const CHARTER_PRINCIPLES = [
  {
    title: "Zero Partisan Bias",
    desc: "We follow the public money, not political factions. Our loyalty is strictly to Article 201 of the Constitution of Kenya and the Kenyan taxpayer.",
  },
  {
    title: "Primary Source Verification",
    desc: "Every data point is cross-verified against official documents from the National Treasury, OCOB, CRA, Auditor General, and parliamentary Hansards.",
  },
  {
    title: "Open-Source Civic Intelligence",
    desc: "All simplified data models, scorecards, and learning modules are published free of charge. No paywalls between citizens and public information.",
  },
  {
    title: "Double-Impact Commercial Ethics",
    desc: "BNS Studios charges fair market rates to external institutions for creative productions, reinvesting 100% of proceeds into grassroots watchdog operations.",
  },
];

const ABOUT_NARRATIVE_BEATS: NarrativeBeat[] = [
  {
    id: "awakening",
    eyebrow: "The Awakening",
    title: "From street protests to 365-day institutional oversight.",
    paragraphs: [
      "In June 2024, millions of young Kenyans took to the streets to reject punitive tax proposals in the Finance Bill. It was an unprecedented turning point in East African civic history.",
      "As the teargas cleared, a deeper realization took hold among our founders: protesting after an appropriation bill is gazetted is 12 months too late. Once a budget line is passed by Parliament, the public money is already committed to contractor accounts.",
      "Budget Ndio Story was founded to dismantle the culture of budget secrecy: intervening upstream from the first drafting sprint in August to final disbursement in June.",
    ],
    quote: {
      text: "Protesting after a bill is gazetted is too late. Citizens must master the budget cycle 12 months in advance — before the money is stolen or misallocated.",
      author: "BNS Founding Assembly",
      role: "Nairobi",
    },
    metric: {
      value: "KSh 4.82T",
      label: "National Budget Tracked Upstream",
    },
    image: BNS_COMMUNITY_IMAGES.forumA,
    imageAlt: "Town hall community forum of young Kenyans interrogating budget figures",
    imageCaption: "Community budget hearing in Nairobi interrogating the Medium-Term Debt Strategy.",
    imageBadge: "THE JUNE AWAKENING",
  },
  {
    id: "article-201",
    eyebrow: "The Sovereign Charter",
    title: "Article 201 of Kenya's Constitution is our editorial director.",
    paragraphs: [
      "Chapter 12, Article 201 commands that there shall be openness, accountability, and public participation in all financial matters. It explicitly dictates that public money shall be used prudently and responsibly.",
      "We do not align with political coalitions or partisan factions. Our loyalty is exclusively to Article 201 and the Kenyan taxpayer who pays VAT on fuel, food, and mobile airtime.",
      "Every metric we publish is traced to official exchequer releases, Controller of Budget reports, and Auditor-General audit queries — never anonymous hearsay or invented claims.",
    ],
    quote: {
      text: "Article 201 is not a suggestion in a textbook. It is a binding constitutional contract between the state and 54 million citizens.",
      author: "Legal & Forensic Desk",
      role: "Constitutional Compliance",
    },
    metric: {
      value: "100%",
      label: "Article 201 Primary Source Verification",
    },
    image: BNS_COMMUNITY_IMAGES.cohortA,
    imageAlt: "Youth cohort training on budget analysis and forensic spreadsheets",
    imageCaption: "Fellows auditing quarterly exchequer releases against audited county outcomes.",
    imageBadge: "CONSTITUTIONAL CHARTER",
  },
  {
    id: "devolved-engine",
    eyebrow: "The Devolved Footprint",
    title: "Budget tracking belongs under the village tree, not in Nairobi towers.",
    paragraphs: [
      "Fiscal devolution was meant to transfer resources to ordinary citizens. Yet without ground-level scrutiny, ward development funds frequently disappear into ghost dispensaries and unfinished roads.",
      "BNS deploys embedded field monitors and youth trackers across Kakamega, Kilifi, Nakuru, and Wajir, arming communities with waterproof scorecards to cross-check county gazette budgets against actual physical contractor work.",
      "Through weekly vernacular radio broadcasts and open-air barazas under village trees, we make sure public finance scrutiny happens in Swahili, Giriama, Somali, and Luhya.",
    ],
    metric: {
      value: "47",
      label: "Counties Audited by Citizen Hubs",
    },
    image: BNS_COMMUNITY_IMAGES.forumD,
    imageAlt: "Artisanal fisherfolk and community members conducting field baraza",
    imageCaption: "Kilifi County field baraza auditing devolved blue economy disbursements.",
    imageBadge: "DEVOLVED GRASSROOTS ENGINE",
  },
];

export default function About() {
  const { hero, mission, photoStrip } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* 01 — Hero & Institutional Credo */}
      <section className={cn(HERO_SECTION_PADDING, "border-b border-border/30 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div data-gsap-hero-content className="flex flex-col items-start gap-4 lg:col-span-7">
              <EditorialPill dot pulse variant="default">
                Kenya&apos;s Sovereign Youth Budget Watchdog
              </EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                We follow Kenya&apos;s public money so it cannot move in the dark.
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                Budget Ndio Story was founded by young Kenyans to dismantle the culture of budget secrecy. We track KSh 4.82 Trillion in national and county spending, transforming opaque fiscal policy into forensic investigations, viral media, and citizen accountability.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <PillButtonGroup
                  href="/programmes"
                  label="Explore the 4 Desks"
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                />
                <PillButtonGroup
                  href="#origin-story"
                  label="Our Origin Story"
                  variant="outline"
                  className="w-full sm:w-auto justify-center"
                />
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-border/40 pt-6">
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">100%</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Youth-Led & Managed</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-primary md:text-3xl">47</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Counties Tracked</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">20k+</p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>Citizens in Ground Forums</p>
                </div>
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
                <span>Youth Budget Assembly</span>
                <span className="font-medium text-primary">Nairobi, Kenya</span>
              </div>
            </div>
          </GsapHeroChoreography>
        </div>
      </section>

      {/* 02 — The Origin Story: Narrative Scrollytelling Documentary */}
      <section id="origin-story" className="border-b border-border/40 bg-muted/10">
        <div className={SECTION_SHELL_INNER}>
          <NarrativeScrollytellingCanvas beats={ABOUT_NARRATIVE_BEATS} mediaPosition="right" />
        </div>
      </section>


      {/* 03 — Theory of Change: The 4-Stage Impact Engine */}
      <section id="theory-of-change" className="border-b border-border/40 py-20 md:py-28 lg:py-36 bg-muted/20 overflow-hidden">
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
                  label: "Explore The 4 Desks",
                  href: "/programmes",
                },
              },
            ]}
            cta={{
              label: "Explore The 4 Desks",
              href: "/programmes",
            }}
          />
        </div>
      </section>

      {/* 04 — Data Integrity & Editorial Independence Charter */}
      <section id="methodology" className="border-b border-border/40 py-20 md:py-28 bg-background">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className={T.eyebrow}>Governance & Ethics</span>
              <h2 className={T.sectionTitle}>
                Our Charter of Integrity.
              </h2>
              <p className={cn(T.lead, "text-muted-foreground")}>
                When challenging power and tracking public billions, accuracy is our armor. We hold ourselves to forensic journalistic standards.
              </p>
              <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <ShieldCheck className="size-4" />
                  <span>Constitutional Anchor</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rooted in Article 201 (Principles of Public Finance) and Article 35 (Access to Information) of the Constitution of Kenya, 2010.
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
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Photo Strip: Documenting the Movement in the Field */}
      <section className={cn(SECTION_SHELL_PADDING, "border-b border-border/40 bg-background")}>
        <div className={SECTION_SHELL_INNER}>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className={T.eyebrow}>In The Field</span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Documenting the Movement</h3>
            <p className="text-xs text-muted-foreground">Moments from citizen town halls, county assemblies, and youth cohorts nationwide.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {photoStrip.images.map((src, index) => (
              <div
                key={src + index}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-muted/20 md:rounded-3xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
              >
                <Image
                  src={src}
                  alt={photoStrip.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Consortium Founding Partners */}
      <div id="consortium-founders">
        <ConsortiumFoundersSection />
      </div>

      {/* 07 — Team Roster Showcase */}
      <div id="team">
        <TeamSection />
      </div>

      {/* 08 — High-Conversion Civic Action & Partnership Portal */}
      <section className="py-20 md:py-28 bg-muted/30 border-t border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-14 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className={cn(T.eyebrow, "inline-flex items-center gap-2")}>
                  <HeartHandshake className="size-3.5 text-primary" />
                  Civic Collaboration
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Partner with Kenya&apos;s leading budget watchdog.
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Whether you are a development partner seeking to fund county accountability, a newsroom looking to co-publish an investigation, or a citizen wanting to bring BNS to your ward — there is a place for you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Partner With Us
                </Link>
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Join Creative Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
