"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  ExternalLink,
  Quote,
  CheckCircle2,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { ProgrammeOtherProgrammes } from "@/components/programmes/programme-other-programmes";
import {
  PROGRAMMES_CLOSING,
  type ProgrammeBlock,
} from "@/content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

type ProgrammeExtendedData = {
  quickFacts: {
    location: string;
    focus: string;
    timeline: string;
    altitude: string;
  };
  quotePull: {
    quote: string;
    author: string;
    role: string;
  };
  narrative: {
    challengeTitle: string;
    challengeBody: string;
    interventionTitle: string;
    interventionBody: string;
  };
  mosaic: {
    q1: { src: string; alt: string; caption: string };
    q2: { src: string; alt: string; caption: string };
    q3: { src: string; alt: string; caption: string };
    q4: { src: string; alt: string; caption: string };
  };
  pressMentions: Array<{
    outlet: string;
    headline: string;
    year: string;
  }>;
  collateral: {
    billboardText: string;
    billboardSub: string;
    posterTitle: string;
    posterBody: string;
    mobileTitle: string;
    mobileMetric: string;
  };
};

const EXTENDED_PROGRAMME_DATA: Record<string, ProgrammeExtendedData> = {
  connect: {
    quickFacts: {
      location: "Nationwide · 47 Counties, Kenya",
      focus: "National Debt, Treasury Allocations, Youth Scrutiny",
      timeline: "2024 – Present · Active Desk",
      altitude: "Macro Sovereign Policy",
    },
    quotePull: {
      quote:
        "When you understand the debt repayment schedule, you stop looking at broken roads as bad luck and start seeing them as fiscal diversion.",
      author: "Grace Muthoni",
      role: "Youth Tracker Lead, Nairobi Hub",
    },
    narrative: {
      challengeTitle: "The Structural Roadblock",
      challengeBody:
        "Kenya's national debt has crossed KSh 11 Trillion, consuming over 65% of tax revenue in debt servicing. Yet the official Budget Policy Statement is published in dense, 400-page accounting jargon designed to deter civic scrutiny.",
      interventionTitle: "The BNS Connect Intervention",
      interventionBody:
        "We mobilize thousands of youth across regional barazas and digital spaces, transforming Treasury line items into live tracking cards, visual leak digests, and citizen memorandums submitted directly to Parliament.",
    },
    mosaic: {
      q1: {
        src: BNS_COMMUNITY_IMAGES.cohortA,
        alt: "Youth tracker in Nairobi",
        caption: "Nairobi Hub Youth Fellow tracking debt amortization tables",
      },
      q2: {
        src: BNS_COMMUNITY_IMAGES.stakeholdersA,
        alt: "National budget hearing verification",
        caption: "Reviewing national allocation lines with parliamentary researchers",
      },
      q3: {
        src: BNS_COMMUNITY_IMAGES.forumA,
        alt: "Civic dialogue assembly",
        caption: "Youth Civic Baraza convening ahead of the FY2026/27 Budget Policy Statement",
      },
      q4: {
        src: BNS_COMMUNITY_IMAGES.cohortB,
        alt: "Data verification workshop",
        caption: "Cross-referencing Controller of Budget quarterly releases with ministry disbursements",
      },
    },
    pressMentions: [
      {
        outlet: "The Daily Nation",
        headline: "How Kenyan Gen-Z Turned the National Budget into an Unprecedented Civic Awakening",
        year: "2024",
      },
      {
        outlet: "The Standard",
        headline: "Youth Activists Submit Historic 80-Page Memorandum on National Debt Scrutiny",
        year: "2025",
      },
      {
        outlet: "BBC Africa",
        headline: "The Young Kenyans Tracking Every Shilling of Public Debt from Treasury to Wards",
        year: "2025",
      },
    ],
    collateral: {
      billboardText: "WHERE IS THE KSH 4.82 TRILLION?",
      billboardSub: "National Budget Scrutiny · Verified by BNS Connect",
      posterTitle: "DENI YA KENYA: WHO OWES WHAT?",
      posterBody: "65 cents of every 100 shillings collected goes to foreign debt servicing. Know your constitutional right to transparent debt audits under Article 201.",
      mobileTitle: "BNS Debt Breakdown #FY26",
      mobileMetric: "1.4M views · Trending #BudgetNdioStory",
    },
  },
  mashinani: {
    quickFacts: {
      location: "Kakamega, Kilifi, Nakuru, Wajir",
      focus: "County Devolution, Health Centers, CIDP Oversight",
      timeline: "Full Budget Cycle · Embedded Teams",
      altitude: "Grassroots County Scrutiny",
    },
    quotePull: {
      quote:
        "In the village, the budget isn't numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.",
      author: "Hassan Ali",
      role: "Community Monitor, Wajir County",
    },
    narrative: {
      challengeTitle: "The Grassroots Blindspot",
      challengeBody:
        "While devolution was designed to bring resources closer to the people, county budgets are plagued by ghost projects, delayed exchequer releases, and pending bills that cripple grassroots service delivery. Most citizens have never seen their county's CIDP.",
      interventionTitle: "Embedded Ward Oversight",
      interventionBody:
        "BNS Mashinani embeds resident tracker teams in 4 core counties, physically auditing project signboards, verifying hospital procurement, and scoring county executive delivery in open community forums.",
    },
    mosaic: {
      q1: {
        src: BNS_COMMUNITY_IMAGES.forumD,
        alt: "Community elder at rural baraza",
        caption: "Kilifi artisanal fisherfolk leader presenting evidence on blue economy allocations",
      },
      q2: {
        src: BNS_COMMUNITY_IMAGES.forumE,
        alt: "Dispensary inspection site visit",
        caption: "Verifying construction milestones of stalled health facilities against tender bills",
      },
      q3: {
        src: BNS_COMMUNITY_IMAGES.forumC,
        alt: "Community circle workshop",
        caption: "Participatory budget mapping session with women's cooperatives in Kakamega",
      },
      q4: {
        src: BNS_COMMUNITY_IMAGES.stakeholdersB,
        alt: "County budget scorecards review",
        caption: "Presenting findings directly to county assembly finance committee members",
      },
    },
    pressMentions: [
      {
        outlet: "Citizen Digital",
        headline: "Nakuru County Assembly Clerks Formally Cite BNS Mashinani Citizen Scorecards",
        year: "2025",
      },
      {
        outlet: "The Star",
        headline: "Kilifi Community Uses BNS Mashinani Audit to Challenge Devolution Allocations",
        year: "2025",
      },
      {
        outlet: "Capital FM",
        headline: "Grassroots Civic Audits Expose Stalled Dispensaries Across 4 Key Counties",
        year: "2026",
      },
    ],
    collateral: {
      billboardText: "COUNTY BUDGETS BELONG TO CITIZENS",
      billboardSub: "Kakamega · Kilifi · Nakuru · Wajir · Audited by BNS Mashinani",
      posterTitle: "FOLLOW YOUR WARD PROJECTS",
      posterBody: "Every public project signboard must list the contractor, allocated amount, and completion date. If it's stalled, document and report to BNS Mashinani.",
      mobileTitle: "Nakuru Ward Audit Story",
      mobileMetric: "340 in-room participants · 2.1K livestream peak",
    },
  },
  "wanahabari-lab": {
    quickFacts: {
      location: "East Africa & National Newsrooms",
      focus: "Investigative Journalism, Treasury Leaks, Media Toolkits",
      timeline: "Quarterly Cohorts · 4 Labs per Year",
      altitude: "Journalism & Whistleblower Intelligence",
    },
    quotePull: {
      quote:
        "The budget story doesn't end on Budget Day. That is just when the spending begins. Journalists must be in the room for the other 364 days.",
      author: "David Otieno",
      role: "Investigative Editor & Wanahabari Fellow",
    },
    narrative: {
      challengeTitle: "The Once-A-Year Media Trap",
      challengeBody:
        "Kenyan newsrooms allocate 90% of their fiscal coverage to a single day in June: the Minister's speech in Parliament. Once the budget speech ends, reporting on public funds drops to near zero, leaving county allocations unmonitored.",
      interventionTitle: "The Continuous Press Bench",
      interventionBody:
        "Wanahabari Lab trains cohorts of mainstream reporters and indie creators, equipping them with vetted OCOB datasets, investigative techniques, and forensic leak verification to sustain high-impact coverage year-round.",
    },
    mosaic: {
      q1: {
        src: BNS_MEDIA_IMAGES.productionA,
        alt: "Investigative journalist on camera",
        caption: "Wanahabari Lab fellow recording broadcast segment on county revenue leaks",
      },
      q2: {
        src: BNS_COMMUNITY_IMAGES.stakeholdersA,
        alt: "Data journalism training session",
        caption: "Newsroom editors cross-referencing Treasury exchequer tables with auditor reports",
      },
      q3: {
        src: BNS_MEDIA_IMAGES.productionB,
        alt: "Studio interview with economist",
        caption: "Recording podcast deep-dive on CRA Third Basis allocation formula",
      },
      q4: {
        src: BNS_COMMUNITY_IMAGES.cohortB,
        alt: "Fellowship newsroom workgroup",
        caption: "Cohort collaborative investigation uncovering ghost county payroll disbursements",
      },
    },
    pressMentions: [
      {
        outlet: "Media Council of Kenya",
        headline: "Wanahabari Lab Sets New Standard for Investigative Public Finance Reporting",
        year: "2025",
      },
      {
        outlet: "Business Daily",
        headline: "Kenyan Journalists Probe Unremitted County Revenue Using BNS Vault Evidence",
        year: "2025",
      },
      {
        outlet: "The EastAfrican",
        headline: "Cross-Border Fiscal Scrutiny: East African Newsrooms Collaborate on Debt Audits",
        year: "2026",
      },
    ],
    collateral: {
      billboardText: "JOURNALISM THAT FOLLOWS THE SHILLING",
      billboardSub: "120+ Journalists Trained · 4 Newsroom Cohorts Annually",
      posterTitle: "THE 364-DAY BUDGET REPORTERS",
      posterBody: "From exchequer releases to public debt maturities: the forensic toolkit empowering Kenyan reporters to hold public funds accountable.",
      mobileTitle: "Treasury Leak Investigation",
      mobileMetric: "48 filed news stories · 12 newsrooms",
    },
  },
  studios: {
    quickFacts: {
      location: "Nairobi & Pan-African Syndication",
      focus: "Commercial Storytelling, Double-Impact Production, OOH Takeovers",
      timeline: "Continuous Production Commissions",
      altitude: "Creative Impact Agency",
    },
    quotePull: {
      quote:
        "We don't make reports that sit on donor shelves. We make films, podcasts, and street art that people argue about in matatus and share on TikTok.",
      author: "Nelly Chebet",
      role: "Executive Producer, BNS Studios",
    },
    narrative: {
      challengeTitle: "The Impact Communication Deficit",
      challengeBody:
        "Crucial civic data and research studies from civil society, public institutions, and development partners are routinely published as 200-page PDFs that nobody reads, failing to shift public sentiment or influence policymakers.",
      interventionTitle: "The Double Impact Agency Model",
      interventionBody:
        "BNS Studios produces award-winning podcasts, short documentaries, 2D animations, and street campaigns for partners, while donating 100% of profit surplus back to fund free grassroots civic auditing across Kenya.",
    },
    mosaic: {
      q1: {
        src: BNS_MEDIA_IMAGES.main,
        alt: "Studio shoot with cinema lighting",
        caption: "Cinematic interview setup for National Treasury explainer documentary",
      },
      q2: {
        src: BNS_MEDIA_IMAGES.productionA,
        alt: "Field filming in the counties",
        caption: "Director of Photography capturing on-site testimony in Western Kenya",
      },
      q3: {
        src: BNS_MEDIA_IMAGES.hall,
        alt: "Town hall live broadcast",
        caption: "Tri-camera live broadcast and citizen recording in Nakuru County",
      },
      q4: {
        src: BNS_MEDIA_IMAGES.productionB,
        alt: "Audio podcast mastering",
        caption: "Recording Season 1 of the flagship Budget Ndio Story Podcast with economists",
      },
    },
    pressMentions: [
      {
        outlet: "Creative Review East Africa",
        headline: "Budget Ndio Story Studios: The Agency Where Creative Craft Funds Civic Justice",
        year: "2025",
      },
      {
        outlet: "Nairobi Law Monthly",
        headline: "Commercial Production with a Civic Heart: Inside BNS Studios' Double Impact",
        year: "2025",
      },
      {
        outlet: "Techweez",
        headline: "How High-End Motion Graphics and Sheng Explainers Demystified the Finance Bill",
        year: "2026",
      },
    ],
    collateral: {
      billboardText: "STORIES BEHIND THE NUMBERS",
      billboardSub: "Podcasts · Documentaries · Animations · OOH Campaigns",
      posterTitle: "HIGH CRAFT, DEEP IMPACT",
      posterBody: "Every BNS Studios commission directly funds grassroots civic scorecards and youth budget tracking in Kenya's most marginalized communities.",
      mobileTitle: "Budget Sasa Ni Delivery",
      mobileMetric: "480K+ views · 8-episode podcast series",
    },
  },
};

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  const ext = EXTENDED_PROGRAMME_DATA[programme.slug] || EXTENDED_PROGRAMME_DATA.connect;

  // Retrieve dedicated projects for this programme
  const projects = useMemo(() => {
    return studiosEvidenceData
      .getAllProjects()
      .filter((p) => p.programmeSlug === programme.slug);
  }, [programme.slug]);

  return (
    <div className="prog-page bg-background text-foreground selection:bg-primary/20">
      {/* 01 — ASYMMETRIC SPLIT HERO HEADER (Purpose Style) */}
      <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-primary/5 via-muted/20 to-background pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground transition-colors hover:text-foreground uppercase tracking-wider"
            >
              <ArrowLeft className="size-3.5" />
              All Operational Desks
            </Link>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Bold Typography & Brief */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <EditorialPill dot pulse>
                  {programme.eyebrow}
                </EditorialPill>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
                {programme.name}
              </h1>

              <p className="text-xl sm:text-2xl font-medium text-foreground/90 leading-snug">
                {programme.headline}
              </p>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {programme.body}
              </p>

              {/* Quick Facts Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
                <div>
                  <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Location
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground leading-tight">
                    {ext.quickFacts.location}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Focus Area
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground leading-tight">
                    {ext.quickFacts.focus}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Timeline / Status
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground leading-tight">
                    {ext.quickFacts.timeline}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Operational Altitude
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground leading-tight">
                    {ext.quickFacts.altitude}
                  </p>
                </div>
              </div>

              {/* Key Impact Metrics Ribbon */}
              {programme.stats && programme.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                  {programme.stats.map((st) => (
                    <div key={st.label}>
                      <p className="font-heading text-3xl sm:text-4xl font-black text-primary tracking-tight">
                        {st.value}
                      </p>
                      <p className="font-mono text-[11px] font-semibold text-muted-foreground leading-tight mt-1">
                        {st.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Hero Photographic Anchor */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
                <Image
                  src={programme.visual.hero}
                  alt={programme.visual.heroAlt}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-md bg-black/40 p-3 rounded-xl border border-white/10">
                  {programme.visual.heroAlt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — PANORAMIC ACTION PHOTOGRAPHY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full overflow-hidden rounded-3xl border border-border/60 shadow-xl">
          <Image
            src={ext.mosaic.q3.src}
            alt={ext.mosaic.q3.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <EditorialPill variant="invert" size="xs">
                Frontline Fieldwork
              </EditorialPill>
              <p className="mt-2 text-base sm:text-xl font-bold max-w-2xl leading-tight">
                {ext.mosaic.q3.caption}
              </p>
            </div>
            <p className="font-mono text-xs text-white/70">Budget Ndio Story Ground Operations</p>
          </div>
        </div>
      </section>

      {/* 03 — EDITORIAL NARRATIVE & FRONTLINE QUOTE PULL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start border-y border-border/50 py-12">
          {/* Quote Pull */}
          <div className="lg:col-span-5 space-y-4">
            <Quote className="size-10 text-primary/40" />
            <blockquote className="font-serif italic text-2xl sm:text-3xl text-foreground font-normal leading-snug">
              &ldquo;{ext.quotePull.quote}&rdquo;
            </blockquote>
            <div className="pt-2">
              <p className="text-sm font-bold text-foreground">{ext.quotePull.author}</p>
              <p className="font-mono text-xs text-muted-foreground">{ext.quotePull.role}</p>
            </div>
          </div>

          {/* Strategic Challenge vs Intervention Narrative */}
          <div className="lg:col-span-7 space-y-8 lg:border-l lg:border-border/50 lg:pl-12">
            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                01 / The Friction
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                {ext.narrative.challengeTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {ext.narrative.challengeBody}
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                02 / The Solution
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                {ext.narrative.interventionTitle}
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {ext.narrative.interventionBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — 2x2 DOCUMENTARY PHOTO MOSAIC */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            03 / Documentary Evidence
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            On the ground, in the rooms, behind the numbers.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={ext.mosaic.q1.src}
              alt={ext.mosaic.q1.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Field Evidence
              </p>
              <p className="text-sm font-semibold mt-1 leading-snug">{ext.mosaic.q1.caption}</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={ext.mosaic.q2.src}
              alt={ext.mosaic.q2.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Site Verification
              </p>
              <p className="text-sm font-semibold mt-1 leading-snug">{ext.mosaic.q2.caption}</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={ext.mosaic.q3.src}
              alt={ext.mosaic.q3.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Community Hearing
              </p>
              <p className="text-sm font-semibold mt-1 leading-snug">{ext.mosaic.q3.caption}</p>
            </div>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={ext.mosaic.q4.src}
              alt={ext.mosaic.q4.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Ledger Audit
              </p>
              <p className="text-sm font-semibold mt-1 leading-snug">{ext.mosaic.q4.caption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — 3-PILLAR OPERATIONAL FRAMEWORK */}
      {programme.pillars && programme.pillars.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 space-y-2">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              04 / Operational Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
              The Three Pillars of {programme.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programme.pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-3xl border border-border/60 bg-card p-8 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <span className="font-mono text-2xl font-black text-primary">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-mono text-primary font-bold">
                  <CheckCircle2 className="size-4" />
                  <span>Sovereign Standard</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 06 — PROJECTS UNDER THIS PROGRAMME (Dedicated Project Roster) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              05 / Flagship Projects & Evidence
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
              Direct Initiatives Executed Under This Desk
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Real commissions, investigative dossiers, and public assemblies produced by the {programme.name} team.
            </p>
          </div>

          <PillButtonGroup
            href={`/work?programme=${programme.slug}`}
            label="View all evidence"
            variant="outline"
            size="sm"
          />
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={`/bns-studio/${proj.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={proj.media.posterUrl}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <EditorialPill variant="invert" size="xs">
                      {proj.contentType}
                    </EditorialPill>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-mono text-[11px] text-white/80">{proj.organization.name}</p>
                    <h4 className="font-heading text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {proj.title}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {proj.briefChallenge}
                  </p>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    {proj.impactEvidence.primaryMetric ? (
                      <span className="font-mono font-bold text-primary truncate max-w-[220px]">
                        {proj.impactEvidence.primaryMetric}
                      </span>
                    ) : (
                      <span className="font-mono text-muted-foreground">{proj.year} Deliverable</span>
                    )}
                    <span className="inline-flex items-center gap-1 font-bold text-foreground group-hover:text-primary transition-colors">
                      Case Study <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Additional project evidence being audited for this desk.
            </p>
            <div className="mt-4 flex justify-center">
              <PillButtonGroup
                href="/work"
                label="Browse platform evidence"
                variant="outline"
                size="sm"
              />
            </div>
          </div>
        )}
      </section>

      {/* 07 — CREATIVE AGENCY CAMPAIGN COLLATERAL EXHIBITION (Purpose Agency Showcase) */}
      <section className="border-y border-border/50 bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              06 / Creative Collateral & Public Takeovers
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
              How this desk takes over the street, the feed, and the city.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Campaign collateral, out-of-home installations, and mobile storytelling designed to mobilize citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* OOH Billboard Mockup */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border/80 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-8xl pointer-events-none select-none">
                OOH
              </div>
              <div className="space-y-3 relative z-10">
                <div>
                  <EditorialPill variant="primary" size="xs">
                    Urban Billboard & Bus Shelter Installation
                  </EditorialPill>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  {ext.collateral.billboardText}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                  {ext.collateral.billboardSub}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Nairobi · Mombasa · Nakuru Arterials</span>
                <span>High-Impact Guerilla Printing</span>
              </div>
            </div>

            {/* Mobile / Social Activation Mockup */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg">
              <div className="space-y-3">
                <div>
                  <EditorialPill variant="primary" size="xs">
                    Mobile Social & Vertical Series
                  </EditorialPill>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {ext.collateral.posterTitle}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ext.collateral.posterBody}
                </p>
              </div>

              {/* Smartphone Preview Mockup */}
              <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>📱 TikTok & Reels Viral Cut</span>
                  <span className="text-primary font-bold">{ext.collateral.mobileMetric}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — ALLIED COALITION & PARTNER NETWORK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            07 / Coalition Allies & Trust
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Institutions and partners collaborating with this desk.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Civil Society</span>
            <p className="mt-2 text-sm font-bold text-foreground">TISA Kenya</p>
            <p className="text-[11px] text-muted-foreground mt-1">Integrity & Civic Literacy</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Academic Policy</span>
            <p className="mt-2 text-sm font-bold text-foreground">Committee on Fiscal Studies</p>
            <p className="text-[11px] text-muted-foreground mt-1">University of Nairobi</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Public Sector</span>
            <p className="mt-2 text-sm font-bold text-foreground">County Governments</p>
            <p className="text-[11px] text-muted-foreground mt-1">Nakuru, Kilifi, Kakamega, Wajir</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Youth Alliances</span>
            <p className="mt-2 text-sm font-bold text-foreground">BNS Tracker Network</p>
            <p className="text-[11px] text-muted-foreground mt-1">47 Regional Hubs</p>
          </div>
        </div>
      </section>

      {/* 09 — PRESS COVERAGE & MEDIA MENTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
        <div className="mb-8 space-y-2">
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
            08 / Independent Third-Party Validation
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Press Scrutiny & In The News
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ext.pressMentions.map((mention) => (
            <div
              key={mention.headline}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-primary font-bold">
                  <span>{mention.outlet}</span>
                  <span className="text-muted-foreground">{mention.year}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-foreground leading-snug">
                  &ldquo;{mention.headline}&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                <FileText className="size-3.5" />
                <span>Verified Publication</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10 — METHODOLOGY / HOW IT WORKS */}
      {programme.process && programme.process.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
          <div className="mb-8 space-y-2">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              09 / Execution Methodology
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
              From Raw Signal to Sovereign Truth
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programme.process.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-border/60 bg-card/40 p-6">
                <span className="font-mono text-xs font-bold text-primary">STEP 0{i + 1}</span>
                <h3 className="mt-2 font-heading text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11 — FAQ */}
      {programme.faqs && programme.faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border/50">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Desk Context */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-5">
              <EditorialPill dot pulse>
                Desk Intelligence & Advisory
              </EditorialPill>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
                Everything You Need to Know About {programme.name}.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Verified answers directly from the desk leads covering operational protocols, cohort recruitment, research access, and institutional collaboration.
              </p>

              <div className="pt-2">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Have Further Questions?
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our desk directors and public finance researchers are available for partner briefings and citizen inquiries.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <PillButtonGroup
                      href="/contact"
                      label="Contact Desk Lead"
                      variant="primary"
                      size="sm"
                    />
                    <PillButtonGroup
                      href="/programmes"
                      label="All Desks"
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Full-Width Accordion */}
            <div className="lg:col-span-7">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {programme.faqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    value={`item-${i}`}
                    className="rounded-2xl border border-border/60 bg-card/60 px-5 transition-all data-[state=open]:bg-primary/5 data-[state=open]:border-primary/40 data-[state=open]:shadow-xs"
                  >
                    <AccordionTrigger className="text-left text-sm font-bold text-foreground hover:no-underline md:text-base py-5">
                      <span className="leading-snug">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-2 pb-5 pr-2">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* 12 — OTHER PROGRAMMES */}
      <ProgrammeOtherProgrammes currentSlug={programme.slug} />

      {/* 13 — PARTNERSHIP / DIRECT ACTION CALL TO ACTION */}
      <LandingSection>
        <EditorialCtaBand
          eyebrow="The BNS Civic Sovereign Ecosystem"
          title={PROGRAMMES_CLOSING.headline}
          description={PROGRAMMES_CLOSING.body}
          ctaHref={programme.cta?.href || PROGRAMMES_CLOSING.cta.href}
          ctaLabel={programme.cta?.label || PROGRAMMES_CLOSING.cta.label}
          secondaryHref="/contact"
          secondaryLabel="Institutional Partnership"
          images={[
            { src: programme.visual.hero, alt: programme.visual.heroAlt },
            { src: ext.mosaic.q1.src, alt: ext.mosaic.q1.alt },
          ]}
        />
      </LandingSection>
    </div>
  );
}
