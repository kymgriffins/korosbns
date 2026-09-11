"use client";

import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { PROGRAMMES, programmeHref, type ProgrammeSlug } from "@/content";
import {
    studiosEvidenceData,
    type StudioContentType
} from "@/data/studios-evidence";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { resolveProjectId } from "@/lib/programme-project-ids";
import {
    ArrowRight,
    ArrowUpRight,
    Clapperboard,
    FileSearch,
    Layers,
    Play,
    Radio,
    ShieldCheck,
    Sparkles,
    Users2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface NextChapterMeta {
  nextSlug: ProgrammeSlug;
  chapterNumber: string;
  leadEyebrow: string;
  hookHeadline: string;
  narrativeBridge: string;
  tagline: string;
}

/** Distinct bridge voice per programme — prose, not pill dumps. */
const CHAPTER_FLOW: Record<ProgrammeSlug, NextChapterMeta> = {
  connect: {
    nextSlug: "mashinani",
    chapterNumber: "Next · Mashinani",
    leadEyebrow: "From the national feed to four counties",
    hookHeadline:
      "Kakamega. Kilifi. Nakuru. Wajir.  Agents bridging gap between Treasury data and Grassroots projects.",
    narrativeBridge:
      "National tables only tell half the story. Mashinani embeds in four counties for the full budget cycle — matching gazette lines to boreholes, maternity wings, and feeder roads people can walk to.",
    tagline: "County desk · Full-cycle embeds · Public scorecards",
  },
  mashinani: {
    nextSlug: "wanahabari-lab",
    chapterNumber: "Next · Wanahabari Lab",
    leadEyebrow: "When communities need a newsroom that stays",
    hookHeadline: "Budget Day is theatre. The story starts the morning after.",
    narrativeBridge:
      "Field findings need journalists who can still read an audit table in August. Wanahabari Lab trains reporters and creators side by side for the eleven months after the briefcase leaves Parliament.",
    tagline: "Newsroom desk · Quarterly labs · Filed drafts",
  },
  "wanahabari-lab": {
    nextSlug: "studios",
    chapterNumber: "Next · Studios",
    leadEyebrow: "Craft that keeps the civic work solvent",
    hookHeadline: "High-craft media. A civic surplus attached.",
    narrativeBridge:
      "Watchdogs fade when funding calendars flip. BNS Studios sells podcasts, documentaries, and town halls — and routes a portion of surplus into Connect, Mashinani, and the Lab.",
    tagline: "Production desk · Client craft · Civic surplus",
  },
  studios: {
    nextSlug: "connect",
    chapterNumber: "Next · Connect",
    leadEyebrow: "Back to the national feed",
    hookHeadline: "The budget lands as a PDF. We put it back on the phone.",
    narrativeBridge:
      "Return to the national desk: youth Budget Trackers translating published Treasury releases into explainers, dashboards, and citizen briefs that still cite the source table.",
    tagline: "National desk · Mobile explainers · Provenance first",
  },
};

function getFormatIcon(contentType: StudioContentType) {
  switch (contentType) {
    case "Explainer Videos":
    case "Documentaries":
      return <Play className="size-3.5 fill-current" />;
    case "Podcast & Audio":
      return <Radio className="size-3.5" />;
    case "Animations":
      return <Clapperboard className="size-3.5" />;
    case "Town Hall Design & Facilitation":
    case "Community Listening Sessions":
      return <Users2 className="size-3.5" />;
    case "Research Spotlights":
      return <FileSearch className="size-3.5" />;
    default:
      return <Sparkles className="size-3.5" />;
  }
}

function getProjectUrl(slug: string) {
  const canonical = resolveProjectId(slug);
  if (canonical === "project-terra") {
    return "/bns-project/terra";
  }
  return `/bns-studio/${canonical}`;
}

export function ProgrammeChapterBridge({
  currentSlug,
}: {
  currentSlug: ProgrammeSlug;
}) {
  const chapter = CHAPTER_FLOW[currentSlug];
  const currentProgramme = PROGRAMMES.find((p) => p.slug === currentSlug);
  const nextProgramme = PROGRAMMES.find((p) => p.slug === chapter?.nextSlug);

  const relatedProjects = useMemo(() => {
    return studiosEvidenceData.getProjectsByProgramme(currentSlug);
  }, [currentSlug]);

  if (!nextProgramme) return null;

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24">
      <div className={SECTION_SHELL_INNER}>
        {/* =========================================================================
         * 01 — RELATED PROJECTS SHOWCASE FOR CURRENT PROGRAMME
         * ========================================================================= */}
        {relatedProjects.length > 0 && (
          <div className="mb-20 pb-16 border-b border-border/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <EditorialPill variant="primary" size="xs" dot>
                    PROGRAMME FIELD DELIVERABLES
                  </EditorialPill>
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    {currentProgramme?.name || "Active Desk"}
                  </span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Related Projects from this Desk.
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Concrete investigative briefs, field scorecards, and media
                  productions produced under{" "}
                  {currentProgramme?.name || "this programme"}.
                </p>
              </div>

              <Link
                href="/bns-studio"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
              >
                <span>View all studio evidence</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project) => {
                const href = getProjectUrl(project.slug);
                return (
                  <article
                    key={project.id}
                    className="group flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                  >
                    {/* Media Poster */}
                    <Link
                      href={href}
                      className="relative aspect-video w-full overflow-hidden bg-muted block"
                    >
                      <Image
                        src={project.media.posterUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Pills */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                          {getFormatIcon(project.contentType)}
                          <span>{project.contentType}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider">
                          {project.year}
                        </span>
                      </div>

                      {/* Bottom Partner Pill */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-[11px] font-mono font-semibold text-white/90 truncate">
                          Partner: {project.organization.name}
                        </p>
                      </div>
                    </Link>

                    {/* Content Body */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={href}>{project.title}</Link>
                        </h3>

                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {project.briefChallenge}
                        </p>
                      </div>

                      {/* Impact Tag & Action */}
                      <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                        {project.impactEvidence?.primaryMetric ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-primary truncate max-w-[190px]">
                            <ShieldCheck className="size-3 shrink-0" />
                            <span className="truncate">
                              {project.impactEvidence.primaryMetric}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {project.deliveryMode}
                          </span>
                        )}

                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors shrink-0"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
         * 02 — PROGRAMME SELECTOR STRIP
         * ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border/40 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="size-3.5 text-primary" />
            <span className="font-bold text-foreground uppercase tracking-widest">
              Four programmes
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PROGRAMMES.map((p, idx) => {
              const isActive = p.slug === currentSlug;
              return (
                <Link
                  key={p.id ?? p.slug}
                  href={programmeHref(p.slug)}
                  className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-xs"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-[10px] opacity-70">0{idx + 1}</span>
                  <span>{p.name.replace("BNS ", "")}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
         * 03 — NEXT PROGRAMME NARRATIVE TRANSITION
         * ========================================================================= */}
        <div className="mt-12 py-8 sm:py-12 border-t border-border/60">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {chapter.chapterNumber}
              </span>
              <span className="text-muted-foreground uppercase tracking-wider">
                Continue the arc
              </span>
              <span className="text-foreground/40">·</span>
              <span className="text-muted-foreground">
                {chapter.leadEyebrow}
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.08] tracking-tight">
              {chapter.hookHeadline}
            </h2>

            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-medium">
              {chapter.narrativeBridge}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={programmeHref(nextProgramme.slug)}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-all group"
              >
                <span>Enter {nextProgramme.name}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs font-mono text-muted-foreground">
                {chapter.tagline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
