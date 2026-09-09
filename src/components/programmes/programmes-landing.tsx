"use client";

import { useState } from "react";
import { ParallaxWrapper, TelemetryHUD } from "@/components/motion";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import { EditorialCtaBand, PillButtonGroup } from "@/components/ui/editorial";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
} from "@/constants/bns-media-images";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  ArrowDown,
  FileSearch,
  Radio,
  Smartphone,
  Play,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function StudiosEmbedBlock() {
  const [playing, setPlaying] = useState(false);
  const VIDEO_ID = "Ed9lP0-komE";
  const POSTER = "/images/treasury/budget sasa ni delivery.jpg";

  return (
    <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl mt-8">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
          title="Budget Sasa ni Delivery — BNS Studios"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <button
          type="button"
          className="group relative h-full w-full text-left block"
          onClick={() => setPlaying(true)}
          aria-label="Play Budget Sasa ni Delivery"
        >
          <Image
            src={POSTER}
            alt="Budget Sasa ni Delivery thumbnail"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
              <Play className="size-5 fill-current" />
              <span className="font-heading font-bold text-sm tracking-wide">Screen the Flagship Reel</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                National Treasury Explainer · 480K+ Views
              </span>
              <p className="font-heading text-base sm:text-lg font-bold">Budget Sasa ni Delivery</p>
            </div>
            <span className="font-mono text-xs text-zinc-400">BNS Studios · Co-produced with National Treasury</span>
          </div>
        </button>
      )}
    </div>
  );
}

const STUDIO_THUMBS = [
  { videoId: "kWpY4K1uI20", title: "Digital PFM Reform Stories", label: "Documentary", href: "/bns-studio/cabri-digital-pfm-reforms" },
  { videoId: "G5ddu4I6mNs", title: "Illicit Financial Flows", label: "Research", href: "/bns-studio/illicit-financial-flows-benin-cabo-verde" },
  { videoId: "it8rOKSYKnc", title: "Project TERRA", label: "Documentary", href: "/bns-studio/project-terra" },
  { videoId: "Ed9lP0-komE", title: "Budget Sasa ni Delivery", label: "Explainer", href: "/bns-studio/budget-sasa-ni-delivery-explainer" },
];

function StudiosMiniStrip() {
  return (
    <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-none">
      {STUDIO_THUMBS.map((t) => (
        <Link
          key={t.videoId}
          href={t.href}
          className="group relative flex-shrink-0 aspect-video w-[160px] sm:w-[190px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 block"
        >
          <Image
            src={`https://i.ytimg.com/vi/${t.videoId}/mqdefault.jpg`}
            alt={t.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            sizes="190px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-2">
            <span className="font-mono text-[9px] text-primary uppercase tracking-wider font-bold">{t.label}</span>
            <p className="font-heading text-white text-xs font-bold leading-tight line-clamp-2">{t.title}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="rounded-full bg-white/20 backdrop-blur-sm p-2">
              <Play className="size-3.5 text-white fill-white" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function WanahabariStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-rose-500 font-bold">Case Inquiry 01 · County Health Diversions</span>
        <p className="font-heading text-3xl sm:text-4xl font-black text-foreground mt-2 mb-1">KSh 1.84B</p>
        <p className="text-sm text-muted-foreground leading-snug">
          Locked in maternity wings — diverted county health allocations traced to supplier debt via Controller of Budget releases.
        </p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-rose-500 font-bold">Case Inquiry 02 · Consolidated Fund Services</span>
        <p className="font-heading text-3xl sm:text-4xl font-black text-foreground mt-2 mb-1">KSh 1,203B</p>
        <p className="text-sm text-muted-foreground leading-snug">
          Public debt interest appetite — KSh 64 of every KSh 100 KRA collects, swallowed before development funds leave the exchequer.
        </p>
      </div>
    </div>
  );
}

function ConnectPhoneMock() {
  return (
    <div className="relative mx-auto w-[200px] sm:w-[220px]">
      <div className="relative aspect-[9/19] w-full rounded-[2.5rem] border-4 border-foreground/10 bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
        <Image
          src={BNS_COMMUNITY_IMAGES.cohortA}
          alt="BNS Connect TikTok explainer"
          fill
          className="object-cover"
          sizes="220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-3 right-10 space-y-1 text-white">
          <span className="inline-block rounded-full bg-emerald-500/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest font-bold text-white">
            BNS Connect
          </span>
          <p className="font-heading font-bold text-xs leading-snug">Budget Sasa: KSh 4.8T explained in 60 seconds</p>
          <p className="font-mono text-[9px] text-white/60">@budget.ndio.story</p>
        </div>
        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-0.5">
          <div className="rounded-full bg-white/20 backdrop-blur-sm p-1.5">
            <Play className="size-3 text-white fill-white" />
          </div>
          <span className="font-mono text-[8px] text-white/70">480K</span>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-emerald-500/10 blur-2xl -z-10" />
    </div>
  );
}

const COUNTIES = ["Kakamega", "Kilifi", "Nakuru", "Wajir"];

function CountyBadges() {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-6">
      {COUNTIES.map((county) => (
        <span
          key={county}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider"
        >
          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
          {county}
        </span>
      ))}
    </div>
  );
}

export function ProgrammesLanding() {
  return (
    <article className="prog-page min-h-screen bg-background text-foreground selection:bg-primary/20">
      <TelemetryHUD activeDesk="" focusArea="NATIONAL TO  GRASSROOTS" badgeLabel="SOVEREIGN " />

      <nav aria-label="Programmes Navigation" className="border-b border-border/40 bg-muted/20 py-2.5">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-muted-foreground uppercase tracking-wider text-[11px]">Programmes:</span>
              <Link href="/programmes/connect" className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold transition-colors hover:bg-emerald-500/20">01 Connect</Link>
              <Link href="/programmes/mashinani" className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold transition-colors hover:bg-amber-500/20">02 Mashinani</Link>
              <Link href="/programmes/wanahabari-lab" className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-bold transition-colors hover:bg-rose-500/20">03 Wanahabari Lab</Link>
              <Link href="/programmes/studios" className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold transition-colors hover:bg-primary/20">04 Studios</Link>
            </div>
            <a href="#public-evidence-loop" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-mono font-bold text-[11px] transition-all">
              <span>Explore All Projects</span>
              <ArrowDown className="size-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* DESK 01: BNS CONNECT */}
      <section id="desk-01" className="py-14 sm:py-20 md:py-24 border-b border-border/40 bg-emerald-500/[0.02]">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Desk 01 · BNS Connect</span>
            <span className="h-px w-12 bg-emerald-500/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Youth Digital Mobilization</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.06] tracking-tight">
                Translating 400-page accounting sheets into 60-second mobile power.
              </h2>
              <div className="pl-5 border-l-2 border-emerald-500/80 space-y-1.5">
                <blockquote className="text-base sm:text-lg font-normal italic text-foreground leading-snug">
                  &ldquo;We don&rsquo;t summarize the budget for archives. We translate the data into immediate leverage for citizen action.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">— BNS Digital Desk, Nairobi</p>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-foreground/85 leading-relaxed">
                <p>When Treasury drops the annual Budget Policy Statement, accountability historically vanished inside 400-page PDF tables written in impenetrable bureaucratic jargon.</p>
                <p>BNS Connect flips this dynamic. We ingest raw exchequer tables, debt amortization schedules, and tax bills, distilling them into rapid-fire 60-second video explainers, swipeable TikTok carousels, and verified WhatsApp infographics.</p>
              </div>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <Smartphone className="size-4 text-emerald-500 shrink-0" />
                  <span>Direct integration with our TikTok &amp; Reels format</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/90">
                  <FileSearch className="size-4 text-emerald-500 shrink-0" />
                  <span>80-page citizen memorandum submitted to Finance Committee</span>
                </div>
                <div className="pt-2">
                  <Link href="/programmes/connect" className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white">
                    Open BNS Connect Dossier <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex items-center justify-center py-4">
              <ConnectPhoneMock />
            </div>
          </div>
        </div>
      </section>

      {/* DESK 02: BNS MASHINANI */}
      <section id="desk-02" className="py-14 sm:py-20 md:py-24 bg-amber-500/[0.03] border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Desk 02 · BNS Mashinani</span>
            <span className="h-px w-12 bg-amber-500/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">The Devolved Grassroots Engine</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black text-foreground leading-[1.06] tracking-tight">
                Taking budget tracking from Nairobi boardrooms to the village baraza.
              </h2>
              <CountyBadges />
              <div className="pl-5 border-l-2 border-amber-500/80 space-y-1.5">
                <blockquote className="text-base sm:text-lg font-normal italic text-foreground leading-snug">
                  &ldquo;In the village, the budget isn&rsquo;t numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.&rdquo;
                </blockquote>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">— Subukia Ward Community Baraza, Nakuru County</p>
              </div>
              <div className="space-y-3 text-sm sm:text-base text-foreground/85 leading-relaxed">
                <p>BNS Mashinani deploys embedded civic field leads across Kakamega, Kilifi, Nakuru, and Wajir. We train residents with waterproof audit scorecards to cross-check county gazette budgets against actual physical contractor work.</p>
                <p>Through weekly vernacular radio broadcasts and open-air barazas, we empower farmers, youth groups, and artisanal fisherfolk to challenge ghost allocations before completion certificates are rubber-stamped.</p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/programmes/mashinani" className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 transition-all hover:bg-amber-500 hover:text-white">
                  Open BNS Mashinani Dossier <ArrowUpRight className="size-3.5" />
                </Link>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Radio className="size-4 shrink-0" />
                  <span>800K+ Vernacular Listeners</span>
                </div>
              </div>
            </div>
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
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Kilifi County Field Baraza</span>
                    <p className="text-xs sm:text-sm font-medium leading-snug">Artisanal fisherfolk cross-referencing blue economy devolved funds with actual landing site infrastructure.</p>
                  </div>
                </div>
              </ParallaxWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* DESK 03: WANAHABARI LAB */}
      <section id="desk-03" className="py-14 sm:py-20 md:py-24 bg-background border-b border-border/40">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Desk 03 · Wanahabari Lab</span>
            <span className="h-px w-12 bg-rose-500/40" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">The 364-Day Investigative Newsroom</span>
          </div>
          <div className="max-w-4xl space-y-4 mb-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.06] tracking-tight">
              The budget speech is theatre. The real story begins the morning after.
            </h2>
            <p className="text-base sm:text-lg text-foreground/80 font-normal leading-relaxed max-w-3xl">
              Kenyan commercial media concentrates 90% of fiscal reportage on Budget Day in June. Wanahabari Lab equips investigative reporters to track exchequer requisitions and forensic procurement for the other 364 days.
            </p>
          </div>
          <WanahabariStatCards />
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
                <p className="text-xs uppercase tracking-widest font-bold text-rose-400">Newsroom Fellowship Cohort</p>
                <p className="text-xs sm:text-sm font-medium leading-snug">Fellows cross-referencing exchequer requisition tables with Auditor-General audit queries.</p>
              </div>
            </div>
          </ParallaxWrapper>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <Link href="/programmes/wanahabari-lab" className="inline-flex items-center gap-2 rounded-full border border-rose-500 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 transition-all hover:bg-rose-500 hover:text-white w-full sm:w-auto justify-center">
              Open Wanahabari Lab Dossier <ArrowUpRight className="size-3.5" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">120+ Reporters Trained Annually Across Kenya</span>
          </div>
        </div>
      </section>

      {/* DESK 04: BNS STUDIOS */}
      <section id="desk-04" className="py-14 sm:py-20 md:py-24 bg-black text-white border-b border-zinc-800">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Desk 04 · BNS Studios</span>
            <span className="h-px w-12 bg-primary/40" />
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Commercial Creative Craft</span>
          </div>
          <div className="max-w-4xl space-y-4 mb-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.06] tracking-tight">
              Commercial creative craft that bankrolls citizen budget audits.
            </h2>
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-3xl">
              We operate an independent, top-tier creative production studio producing podcasts, documentaries, 2D animations, and street campaigns for leading civic institutions.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-5 mb-2 border-y border-zinc-800/80">
            <div className="space-y-1"><span className="text-xl sm:text-2xl font-black text-primary tracking-tight">EN / FR</span><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Bilingual Productions</p></div>
            <div className="space-y-1"><span className="text-xl sm:text-2xl font-black text-white tracking-tight">Dual Impact</span><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Craft Supporting Civic Work</p></div>
            <div className="space-y-1"><span className="text-xl sm:text-2xl font-black text-primary tracking-tight">4 Counties</span><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Embedded Grassroots Oversight</p></div>
            <div className="space-y-1"><span className="text-xl sm:text-2xl font-black text-white tracking-tight">21:9</span><p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Cinematic Master Reels</p></div>
          </div>
          <StudiosEmbedBlock />
          <StudiosMiniStrip />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8 pt-6 border-t border-zinc-800/60">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">The Double Impact Covenant</h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Rather than relying solely on donor cycles, BNS Studios sells premium storytelling, motion design, and video production to commercial and development partners. Operating surplus is channeled directly into printing grassroots scorecards and funding investigative fellowships across our focus counties.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:items-start lg:items-end justify-center pt-2">
              <Link href="/programmes/studios" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black w-full sm:w-auto justify-center">
                Open BNS Studios Dossier <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ProgrammesProjectsLoop />

      <section className="py-12 sm:py-16 md:py-20">
        <div className={SECTION_SHELL_INNER}>
          <EditorialCtaBand
            eyebrow="The Sovereign Standard"
            title="Follow the public shilling. Reclaim civic power."
            description="Join millions of Kenyans auditing national debt, tracking county disbursements, and enforcing Article 201."
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
