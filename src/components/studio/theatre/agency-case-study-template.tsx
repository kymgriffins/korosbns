"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Volume2,
  Play,
  ShieldCheck,
} from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PillButtonGroup, PillButton } from "@/components/ui/editorial/pill-button-group";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { BNS_COMMUNITY_IMAGES, BNS_MEDIA_IMAGES } from "@/constants/bns-media-images";
import { cn } from "@/utils";

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

export function AgencyCaseStudyTemplate({ project }: { project: StudioProjectEvidence }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(project.multilingual?.defaultLang || "en");
  const activeLang = project.multilingual?.languages.find((l) => l.code === selectedLang) || project.multilingual?.languages[0];
  const activeVideoUrl = activeLang ? `https://www.youtube.com/watch?v=${activeLang.videoId}` : project.media.videoUrl;
  const embed = activeVideoUrl ? youtubeEmbedUrl(activeVideoUrl) : null;
  const related = studiosEvidenceData.getRelatedProjects(project.id, 3);

  const getProgrammeLabel = (slug: string) => {
    switch (slug) {
      case "connect":
        return "BNS Connect Desk";
      case "mashinani":
        return "BNS Mashinani Desk";
      case "wanahabari-lab":
        return "Wanahabari Lab Desk";
      case "studios":
      default:
        return "BNS Studios Desk";
    }
  };

  const primaryVoice =
    project.formatDetails?.voices?.[0] ?? {
      quote:
        "When public money is tracked line-by-line, communities reclaim their constitutional voice. Transparency is not an abstract theory—it is schools, clinics, and clean water.",
      name: "Frontline Citizen Delegate",
      role: "County Budget Forum",
    };

  return (
    <article className="min-h-screen bg-background text-foreground">
      {/* 01 — WHITEPAPER EXECUTIVE HEADER */}
      <header className="border-b border-border/40 bg-background pt-24 pb-12 md:pt-32 md:pb-16">
        <div className={SECTION_SHELL_INNER}>
          {/* Breadcrumb back to repository */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Work & Evidence</span>
            </Link>
          </nav>

          <div className="space-y-6">
            {/* Standardized Editorial Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse size="xs">
                {project.contentType}
              </EditorialPill>
              <EditorialPill variant="outline" size="xs">
                {getProgrammeLabel(project.programmeSlug)}
              </EditorialPill>
              <EditorialPill variant="muted" size="xs">
                {project.organization.name}
              </EditorialPill>
              <EditorialPill variant="muted" size="xs">
                {project.year}
              </EditorialPill>
            </div>

            {/* Document Title & Lede */}
            <h1 className={cn(T.heroTitle, "max-w-4xl text-balance text-foreground")}>
              {project.title}
            </h1>

            {project.subtitle ? (
              <p className={cn(T.lead, "max-w-3xl text-balance text-foreground/85")}>
                {project.subtitle}
              </p>
            ) : (
              <p className={cn(T.lead, "max-w-3xl text-balance text-foreground/85")}>
                {project.briefChallenge}
              </p>
            )}

            {/* Executive Briefing Ledger Strip */}
            <div className="grid grid-cols-2 gap-6 border-y border-border/50 py-6 sm:grid-cols-4 md:gap-8">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Partner Organization
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground truncate">
                  {project.organization.name}
                </p>
                <p className="text-xs text-muted-foreground">{project.organization.location}</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Sector & Mode
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground capitalize">
                  {project.organization.sector}
                </p>
                <p className="text-xs text-primary capitalize">{project.deliveryMode.replace("-", " ")}</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Primary Scrutiny Metric
                </p>
                <p className="mt-1 text-sm font-bold text-primary truncate">
                  {project.impactEvidence.primaryMetric || "Verified Ground Evidence"}
                </p>
                <p className="text-xs text-muted-foreground">Constitutional Oversight</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Outputs Verified
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {project.outputs.length} Deliverables
                </p>
                <p className="text-xs text-muted-foreground">Syndicated Media</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 02 — CINEMATIC WIDESCREEN MEDIA CANVAS */}
      <section className="border-b border-border/30 bg-muted/20 py-8 md:py-12">
        <div className={SECTION_SHELL_INNER}>
          <div className="mx-auto max-w-5xl space-y-4">
            {/* Multilingual Track Selector if available */}
            {project.multilingual?.isMultilingual && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/70 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">
                    Multilingual Edition Track:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {project.multilingual.languages.map((lang) => {
                    const isCurrent = activeLang?.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                          isCurrent
                            ? "bg-primary text-primary-foreground shadow-xs scale-[1.02]"
                            : "bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        <span className="text-[10px] font-mono opacity-85">({lang.duration})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {embed ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-black shadow-xl md:rounded-3xl">
                <iframe
                  key={embed}
                  src={`${embed}?rel=0&modestbranding=1`}
                  title={activeLang?.title || project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : project.media.audioUrl ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-8 text-center shadow-lg md:rounded-3xl md:p-14">
                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Volume2 className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                  {project.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Official audio documentary dispatch recorded live with citizen assemblies.
                </p>
                <audio controls className="mt-6 w-full max-w-lg">
                  <source src={project.media.audioUrl} type="audio/mpeg" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-xl md:aspect-[21/9] md:rounded-3xl">
                <Image
                  src={project.media.posterUrl || BNS_MEDIA_IMAGES.productionA}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="rounded-full bg-primary/90 p-5 text-white shadow-2xl backdrop-blur-sm">
                    {project.contentType === "Podcast & Audio" ? (
                      <Volume2 className="size-8" />
                    ) : (
                      <Play className="size-8 fill-current" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Multilingual Country Pills if available */}
            {activeLang?.countries && activeLang.countries.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                  Featured Nations ({activeLang.label}):
                </span>
                {activeLang.countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                  >
                    {country}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 03 — FLUENT EDITORIAL WHITEPAPER PROSE */}
      <main className="py-16 md:py-24">
        <div className={SECTION_SHELL_INNER}>
          <div className="mx-auto max-w-3xl space-y-16">
            {/* Chapter 1: The Fiscal Context & Challenge */}
            <section className="space-y-6">
              <div className="space-y-2">
                <EditorialPill variant="muted" size="xs">
                  Chapter 01 · The Public Finance Tension
                </EditorialPill>
                <h2 className={cn(T.sectionTitle, "text-foreground")}>
                  The Challenge & Fiscal Secrecy
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-base leading-relaxed text-foreground/80 sm:text-lg">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-5xl first-letter:font-bold first-letter:text-primary">
                  {project.briefChallenge}
                </p>
                <p>
                  {project.description}
                </p>
              </div>
            </section>

            {/* Photojournalism In-Line Breakout */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-md md:rounded-3xl">
                <Image
                  src={BNS_COMMUNITY_IMAGES.forumA}
                  alt="Citizen town hall discussion on public budget allocations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
              <p className="text-xs text-muted-foreground italic">
                Grassroots budget forum: Community listening sessions translate complex line items into citizen oversight.
              </p>
            </div>

            {/* Chapter 2: Ground Reality & Stakeholder Voice */}
            <section className="space-y-6">
              <div className="space-y-2">
                <EditorialPill variant="muted" size="xs">
                  Chapter 02 · Ground Testimony
                </EditorialPill>
                <h2 className={cn(T.sectionTitle, "text-foreground")}>
                  Voices From the Community
                </h2>
              </div>

              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 space-y-3 bg-muted/20 rounded-r-2xl pr-4">
                <p className="font-heading text-xl font-medium italic text-foreground md:text-2xl leading-relaxed">
                  &ldquo;{primaryVoice.quote}&rdquo;
                </p>
                <footer className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  — {primaryVoice.name}
                  {primaryVoice.role ? `, ${primaryVoice.role}` : ""}
                </footer>
              </blockquote>

              <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
                By grounding fiscal forensics in real human lived experience, the production dismantled the myth that budgets are too technical for ordinary citizens. The documentation exposed how delayed disbursements and uncollected county revenues directly crippled local public services.
              </p>
            </section>




          </div>
        </div>
      </main>

      {/* 04 — UNIFIED ACTION CTA & ADJACENT INVESTIGATIONS */}
      <footer className="border-t border-border/40 bg-muted/10 py-16 md:py-24">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-16">
            <div className="rounded-3xl border border-border/60 bg-card p-8 sm:p-12 lg:p-16 shadow-xs">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7 space-y-4">
                  <EditorialPill dot pulse>
                    Commission & Collaborate
                  </EditorialPill>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
                    Commission forensic civic storytelling that moves public policy.
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                    We partner with development institutions, county assemblies, and grassroots organizations to translate public finance data into high-impact media.
                  </p>
                </div>
                <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4">
                  <div className="flex flex-wrap gap-3">
                    <PillButton
                      onClick={() => setBookingOpen(true)}
                      label="Commission the Studio"
                      size="lg"
                      icon={<Send className="size-4" />}
                    />
                    <PillButtonGroup
                      href="/work"
                      label="All Work & Evidence"
                      variant="outline"
                      size="lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground lg:text-right">
                    Operating studio surplus supports grassroots civic tracking across our focus counties.
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </footer>

      {/* Commission Booking Drawer Modal */}
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </article>
  );
}
