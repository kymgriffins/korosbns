"use client";

import TeamSection from "@/components/marketing/team-section";
import {
  NarrativeScrollytellingCanvas,
  StickyStackedCycle,
  type NarrativeBeat,
} from "@/components/motion";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { aboutContent } from "@/content";
import {
  HERO_SECTION_PADDING,
  SECTION_SHELL_INNER,
} from "@/layouts/section-shell";
import { GsapHeroChoreography } from "@/motion/gsap";
import { cn } from "@/utils";
import { HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    imageAlt:
      "Town hall community forum of young Kenyans interrogating budget figures",
    imageCaption:
      "Community budget hearing in Nairobi interrogating the Medium-Term Debt Strategy.",
    imageBadge: "THE JUNE AWAKENING",
  },
];

export default function About() {
  const { hero, mission } = aboutContent;

  return (
    <div className="w-full bg-background min-h-screen text-foreground">
      {/* 01 — Hero & Institutional Credo */}
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={SECTION_SHELL_INNER}>
          <GsapHeroChoreography className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div
              data-gsap-hero-content
              className="flex flex-col items-start gap-4 lg:col-span-7"
            >
              <EditorialPill dot pulse variant="default">
                Kenya&apos;s Sovereign Youth Budget Watchdog
              </EditorialPill>
              <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
                We follow Kenya&apos;s public money so it cannot move in the
                dark.
              </h1>
              <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>
                Budget Ndio Story was founded by young Kenyans to dismantle the
                culture of budget secrecy. We track KSh 4.82 Trillion in
                national and county spending, transforming opaque fiscal policy
                into forensic investigations, viral media, and citizen
                accountability.
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
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    100%
                  </p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>
                    Youth-Led & Managed
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
                    47
                  </p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>
                    Counties Tracked
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                    20k+
                  </p>
                  <p className={cn(T.caption, "mt-1 text-muted-foreground")}>
                    Citizens in Ground Forums
                  </p>
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
      <section
        id="origin-story"
        className="border-b border-border/40 bg-muted/10"
      >
        <div className={SECTION_SHELL_INNER}>
          <NarrativeScrollytellingCanvas
            beats={ABOUT_NARRATIVE_BEATS}
            mediaPosition="right"
          />
        </div>
      </section>

      {/* 03 — Theory of Change: Why We Have The 4 Programmes */}
      <section
        id="theory-of-change"
        className="border-b border-border/40 py-16 md:py-24 lg:py-28 bg-muted/20"
      >
        <div className={SECTION_SHELL_INNER}>
          <StickyStackedCycle
            eyebrow="Theory of Change · The 4-Programme Architecture"
            title="Why We Built 4 Programmes. How Civic Impact Actually Works."
            description="An isolated viral video does not rewrite a county budget, and an 800-page unread audit report does not fix a village dispensary. Budget Ndio Story built four dedicated desks to complete an unbroken civic loop from primary exchequer investigation to legal public enforcement."
            items={[
              {
                id: "theory-01",
                step: "01",
                title: "01 · Mine & Investigate (Wanahabari Lab)",
                description:
                  "Forensic scrutiny of Controller of Budget (OCOB) tables, National Treasury estimates, Auditor-General findings, and county CBROPs before public money disappears. Wanahabari Lab trains investigative journalists and young creators side-by-side to read fiscal data like forensic auditors.",
                badge: "03 Wanahabari Lab",
                stat: {
                  value: "KSh 4.82T",
                  label:
                    "Audited line-by-line across exchequer tables and OCOB quarterly reports",
                },
                cta: {
                  label: "Enter Wanahabari Lab",
                  href: "/programmes/wanahabari-lab",
                },
              },
              {
                id: "theory-02",
                step: "02",
                title: "02 · Translate & Package (BNS Studios)",
                description:
                  "Transforming 800-page fiscal bills and audit findings into high-retention 2D animation, podcasts, vertical reels, and kinetic graphics that Kenyans share in matatus, social feeds, and living rooms.",
                badge: "04 Studios",
                image: BNS_COMMUNITY_IMAGES.cohortA,
                imageAlt: "BNS Studios creative desk packaging fiscal explainers",
                cta: {
                  label: "Explore BNS Studios",
                  href: "/bns-studio",
                },
              },
              {
                id: "theory-03",
                step: "03",
                title: "03 · Mobilize on the Ground (BNS Mashinani)",
                description:
                  "Decentralizing fiscal oversight across 47 counties. Hosting town halls, county civic forums, and grassroots budget barazas across Kakamega, Kilifi, Nakuru, and Wajir so citizens track dispensary allocations and pending bills directly.",
                badge: "02 Mashinani",
                image: BNS_COMMUNITY_IMAGES.forumA,
                imageAlt: "BNS Mashinani county budget baraza in session",
                cta: {
                  label: "Explore BNS Mashinani",
                  href: "/programmes/mashinani",
                },
              },
              {
                id: "theory-04",
                step: "04",
                title: "04 · Enforce & Hold Accountable (BNS Connect)",
                description:
                  "Closing the loop with formal public participation memos to Parliament, petitions to county assemblies, and live national town halls. Every submission is legally anchored in Article 201 to turn citizen voice into binding fiscal accountability.",
                badge: "01 Connect",
                stat: {
                  value: "100%",
                  label:
                    "Public submissions legally grounded in Article 201 of Kenya's Constitution",
                },
                cta: {
                  label: "Explore BNS Connect",
                  href: "/programmes/connect",
                },
              },
            ]}
            cta={{
              label: "Explore All 4 Programmes",
              href: "/programmes",
            }}
          />
        </div>
      </section>

      {/* 05 — Team Roster Showcase */}
      <div id="team">
        <TeamSection />
      </div>

      {/* 06 — Civic Action & Partnership Portal */}
      <section className="py-20 md:py-28 bg-muted/30 border-t border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="rounded-3xl border border-border/60 bg-card p-8 md:p-14 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span
                  className={cn(T.eyebrow, "inline-flex items-center gap-2")}
                >
                  <HeartHandshake className="size-3.5 text-primary" />
                  Civic Collaboration
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Partner with Kenya&apos;s leading budget watchdog.
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Whether you are a development partner seeking to fund county
                  accountability, a newsroom looking to co-publish an
                  investigation, or a citizen wanting to bring BNS to your ward
                  — there is a place for you.
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
