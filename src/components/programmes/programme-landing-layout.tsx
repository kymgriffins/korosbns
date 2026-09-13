"use client";

import Image from "next/image";
import Link from "next/link";
import { ReelPlayer } from "@/components/programmes/reel-player";
import {
  EditorialCtaBand,
  EditorialPill,
  PillButtonGroup,
} from "@/components/ui/editorial";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammeThemeScope } from "@/components/programmes/programme-theme-scope";
import {
  LandingSection,
} from "@/layouts/landing-section";
import { MediaEmbed, detectMediaType } from "@/components/ui/media-embed";
import {
  HERO_SECTION_PADDING,
  SECTION_SHELL_INNER,
} from "@/layouts/section-shell";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  CIVIC_PROGRAMMES,
  PROGRAMMES_CLOSING,
  getReelsByProgramme,
  programmeCtaClassName,
  programmeHref,
  sanitizeMediaUrl,
  type ProgrammeBlock,
  type ProgrammeCta,
  type ProgrammeReel,
  type ProgrammeSlug,
} from "@/content";
import type { PartnerPageSectionsContent, ProgrammesContent } from "@/lib/cms-live-data";
import { isSectionVisible } from "@/lib/partner-page-cms";
import { cn } from "@/utils";

const PAGE_ID_BY_SLUG: Record<Exclude<ProgrammeSlug, "studios">, string> = {
  connect: "programmeConnect",
  mashinani: "programmeMashinani",
  "wanahabari-lab": "programmeWanahabari",
};

/**
 * Shared landing-format layout for civic programmes (Connect, Mashinani, Wanahabari).
 * Spine: Hero → body → projects → other programmes → CTA.
 * Quiet editorial surface - hairlines, flat imagery, no card chrome.
 * BNS Studio is separate at /bns-studio. Legacy scrollytelling kept, not rendered.
 */
export function ProgrammeLandingLayout({
  programme,
  civicProgrammes = CIVIC_PROGRAMMES,
  closing = PROGRAMMES_CLOSING,
  sectionsConfig,
  reels,
  projectCtaLabels,
}: {
  programme: ProgrammeBlock;
  civicProgrammes?: ProgrammeBlock[];
  closing?: ProgrammesContent["closing"];
  sectionsConfig?: PartnerPageSectionsContent | null;
  reels?: ProgrammeReel[];
  projectCtaLabels?: {
    openProjectLabel?: string;
    watchReelLabel?: string;
  };
}) {
  if (programme.slug === "studios") {
    return null;
  }

  const pageId = PAGE_ID_BY_SLUG[programme.slug];
  const others = civicProgrammes.filter((p) => p.slug !== programme.slug);
  const primaryCta = programme.cta;
  const secondaryCta: ProgrammeCta = programme.secondaryCta ?? {
    label: "Discuss Co-Funding",
    href: `/contact?intent=partner&programme=${programme.slug}`,
    showOnMobile: false,
    showOnDesktop: true,
  };
  const allProgrammesCta: ProgrammeCta = programme.allProgrammesCta ?? {
    label: "All programmes",
    href: "/programmes",
    showOnMobile: false,
    showOnDesktop: true,
  };
  const show = (sectionId: string) =>
    isSectionVisible(pageId, sectionId, sectionsConfig);
  const programmeReels =
    reels !== undefined
      ? reels.filter((r) => r.programmeSlug === programme.slug)
      : getReelsByProgramme(programme.slug);

  const heroMediaUrl = sanitizeMediaUrl(programme.featuredMedia?.url);
  const resolvedHeroType =
    !programme.featuredMedia?.type || programme.featuredMedia.type === "auto"
      ? heroMediaUrl
        ? detectMediaType(heroMediaUrl)
        : undefined
      : programme.featuredMedia.type;
  const heroMediaType =
    resolvedHeroType === "vimeo" ? "video" : resolvedHeroType;
  const mobileMediaUrl = sanitizeMediaUrl(programme.featuredMedia?.mobileUrl);
  const resolvedMobileType =
    !programme.featuredMedia?.mobileType || programme.featuredMedia.mobileType === "auto"
      ? mobileMediaUrl
        ? detectMediaType(mobileMediaUrl)
        : undefined
      : programme.featuredMedia.mobileType;
  const mobileMediaType =
    resolvedMobileType === "vimeo" ? "video" : resolvedMobileType;
  const hideDesktopOnMobile =
    programme.featuredMedia?.hideDesktopOnMobile ?? Boolean(mobileMediaUrl);
  const mobileStill = programme.visual.heroMobile;

  const heroAspect =
    heroMediaType === "tiktok"
      ? "portrait"
      : heroMediaType === "image"
        ? "auto"
        : "video";

  return (
    <ProgrammeThemeScope theme={programme.theme}>
    <div className="w-full min-h-dvh bg-background overflow-x-clip text-foreground">
      {show("hero") ? (
        <section
          className={cn(HERO_SECTION_PADDING, "border-b border-border/50 bg-background")}
          aria-labelledby={`programme-${programme.slug}-heading`}
        >
          <div className={SECTION_SHELL_INNER}>
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="flex flex-col items-start gap-4 lg:col-span-5">
                <EditorialPill variant="default">
                  {programme.eyebrow}
                </EditorialPill>
                <p className={cn(T.caption, "font-semibold uppercase tracking-wider text-muted-foreground")}>
                  {programme.name}
                </p>
                <h1
                  id={`programme-${programme.slug}-heading`}
                  className={cn(T.heroTitle, "text-balance text-foreground")}
                >
                  {programme.headline}
                </h1>
                <p className={cn(T.lead, "max-w-md text-foreground/75")}>
                  {programme.body}
                </p>
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  {!secondaryCta.hidden ? (
                    <div className={programmeCtaClassName(secondaryCta, "w-full sm:w-auto")}>
                      <PillButtonGroup
                        href={secondaryCta.href}
                        label={secondaryCta.label}
                        variant="primary"
                        className="w-full justify-center sm:w-auto"
                      />
                    </div>
                  ) : null}
                  {!primaryCta.hidden ? (
                    <div className={programmeCtaClassName(primaryCta, "w-full sm:w-auto")}>
                      <PillButtonGroup
                        href={primaryCta.href}
                        label={primaryCta.label}
                        variant="outline"
                        className="w-full justify-center sm:w-auto"
                      />
                    </div>
                  ) : null}
                  {!allProgrammesCta.hidden ? (
                    <div className={programmeCtaClassName(allProgrammesCta, "w-full sm:w-auto")}>
                      <PillButtonGroup
                        href={allProgrammesCta.href}
                        label={allProgrammesCta.label}
                        variant="outline"
                        className="w-full justify-center sm:w-auto"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <figure className="space-y-2.5 lg:col-span-7">
                {heroMediaUrl || mobileMediaUrl || mobileStill ? (
                  <>
                    {/* Desktop / wide hero — optionally hidden on mobile when a mobile asset exists */}
                    {heroMediaUrl ? (
                      <div
                        className={cn(
                          "overflow-hidden",
                          hideDesktopOnMobile ? "hidden sm:block" : "",
                          heroMediaType === "tiktok"
                            ? ""
                            : "rounded-lg border border-border/60 shadow-lg",
                        )}
                      >
                        <MediaEmbed
                          src={heroMediaUrl}
                          type={heroMediaType}
                          title={programme.featuredMedia?.title}
                          caption={programme.featuredMedia?.caption}
                          poster={programme.featuredMedia?.poster || programme.visual.hero}
                          controls
                          aspectRatio={heroAspect}
                        />
                      </div>
                    ) : null}

                    {/* Mobile-specific media */}
                    {mobileMediaUrl ? (
                      <div
                        className={cn(
                          "overflow-hidden sm:hidden",
                          mobileMediaType === "tiktok"
                            ? ""
                            : "rounded-lg border border-border/60 shadow-lg",
                        )}
                      >
                        <MediaEmbed
                          src={mobileMediaUrl}
                          type={mobileMediaType}
                          title={programme.featuredMedia?.title}
                          caption={programme.featuredMedia?.caption}
                          poster={
                            programme.featuredMedia?.mobilePoster ||
                            programme.featuredMedia?.poster ||
                            mobileStill ||
                            programme.visual.hero
                          }
                          controls
                          aspectRatio={
                            mobileMediaType === "tiktok"
                              ? "portrait"
                              : mobileMediaType === "image"
                                ? "auto"
                                : "video"
                          }
                        />
                      </div>
                    ) : mobileStill && hideDesktopOnMobile ? (
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted sm:hidden">
                        <Image
                          src={mobileStill}
                          alt={programme.visual.heroAlt}
                          fill
                          priority
                          className="object-cover object-center"
                          sizes="100vw"
                        />
                      </div>
                    ) : null}

                    {!heroMediaUrl && !mobileMediaUrl ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-[16/10]">
                        <Image
                          src={mobileStill && hideDesktopOnMobile ? programme.visual.hero : programme.visual.hero}
                          alt={programme.visual.heroAlt}
                          fill
                          priority
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-[16/10]">
                    <Image
                      src={programme.visual.hero}
                      alt={programme.visual.heroAlt}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  </div>
                )}
                {heroMediaType !== "tiktok" && mobileMediaType !== "tiktok" ? (
                  <figcaption className={cn(T.caption, "text-muted-foreground")}>
                    {programme.featuredMedia?.caption || programme.visual.heroAlt}
                  </figcaption>
                ) : null}
              </figure>
            </div>
          </div>
        </section>
      ) : null}

      {show("body") ? (
        <LandingSection
          aria-labelledby={`programme-${programme.slug}-body`}
          className="border-t border-border/50"
        >
          {/* Header & Mandate */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Mandate
              </span>
              {programme.mandateFit ? (
                <>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {programme.mandateFit}
                  </span>
                </>
              ) : null}
            </div>
            <h2
              id={`programme-${programme.slug}-body`}
              className={cn(T.sectionTitle, "text-balance text-foreground")}
            >
              What this programme does
            </h2>
            <p className={cn(T.lead, "text-foreground/75")}>
              Why this bet matters & what it delivers
            </p>
          </div>

          {/* Why & What (Minimalist scannable lines) */}
          {(programme.investorThesis || programme.whatWeDo) ? (
            <div className="mt-8 grid gap-6 border-y border-border/50 py-8 md:grid-cols-2 md:gap-10">
              <div className="space-y-2 border-l-2 border-border pl-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  The Systemic Problem (Why):
                </span>
                <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                  {programme.investorThesis || programme.highlight}
                </p>
              </div>
              <div className="space-y-2 border-l-2 border-primary/60 pl-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  The Core Intervention (What):
                </span>
                <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                  {programme.whatWeDo || programme.body}
                </p>
              </div>
            </div>
          ) : null}

          {/* Key Scale Stats */}
          {programme.stats && programme.stats.length > 0 ? (
            <dl className="mt-8 grid gap-0 border-b border-border/50 sm:grid-cols-3">
              {programme.stats.map((stat) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="border-border/50 px-0 py-6 sm:border-r sm:px-6 sm:py-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <dt className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className={cn(T.caption, "mt-2 text-muted-foreground")}>
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {/* 4-Stage Operational Process (How We Execute) */}
          {programme.process && programme.process.length > 0 ? (
            <div className="mt-14 space-y-6">
              <div className="space-y-1">
                <p className={cn(T.eyebrow, "text-muted-foreground")}>Operational Lifecycle</p>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  How this programme operates
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {programme.process.map((step, idx) => (
                  <div
                    key={step.title}
                    className="flex flex-col justify-between border border-border/60 bg-muted/10 p-5"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">
                        0{idx + 1}
                      </span>
                      <h4 className="mt-2 font-heading text-base font-bold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/75 md:text-sm">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Tangible Investor Deliverables */}
          {programme.deliverables && programme.deliverables.length > 0 ? (
            <div className="mt-14 space-y-6">
              <div className="space-y-1">
                <p className={cn(T.eyebrow, "text-muted-foreground")}>Partner Assets</p>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Deliverables partners fund & cite
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {programme.deliverables.map((item) => (
                  <div
                    key={item.title}
                    className="border border-border/60 bg-background p-6 space-y-2"
                  >
                    <h4 className="font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-foreground/75 md:text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Core Operating Pillars */}
          {programme.pillars && programme.pillars.length > 0 ? (
            <div className="mt-14 space-y-6">
              <div className="space-y-1">
                <p className={cn(T.eyebrow, "text-muted-foreground")}>Programme Infrastructure</p>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Core pillars
                </h3>
              </div>
              <ul className="divide-y divide-border/50 border-y border-border/50">
                {programme.pillars.slice(0, 4).map((pillar) => (
                  <li
                    key={pillar.title}
                    className="grid gap-3 py-6 md:grid-cols-12 md:gap-8 md:py-8"
                  >
                    <h4
                      className={cn(
                        "font-heading text-base font-bold text-foreground md:col-span-4 md:text-lg",
                      )}
                    >
                      {pillar.title}
                    </h4>
                    <p
                      className={cn(
                        T.lead,
                        "max-w-2xl text-foreground/75 md:col-span-8 md:text-base",
                      )}
                    >
                      {pillar.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </LandingSection>
      ) : null}

      {show("projects") ? (
        <ProgrammeProjectGrid
          programmeSlug={programme.slug}
          openProjectLabel={projectCtaLabels?.openProjectLabel}
          watchReelLabel={projectCtaLabels?.watchReelLabel}
        />
      ) : null}

      {show("reels") ? (
        <ProgrammeReelsSection
          programmeSlug={programme.slug}
          reels={programmeReels}
        />
      ) : null}

      {show("otherProgrammes") && others.length > 0 ? (
        <LandingSection
          aria-labelledby="other-programmes-heading"
          className="border-t border-border/50"
        >
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 id="other-programmes-heading" className={T.sectionTitle}>
                Other programmes
              </h2>
            </div>
            <p className={cn(T.lead, "max-w-sm md:text-right")}>
              Same format across Connect, Mashinani, and Wanahabari - pick the next programme.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={programmeHref(item.slug)}
                className="group flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={item.visual.hero}
                    alt={item.visual.heroAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                </div>
                <p className={cn(T.eyebrow, "text-muted-foreground")}>{item.name}</p>
                <p className={cn(T.itemTitle, "text-balance text-foreground")}>
                  {item.headline}
                </p>
                <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  View programme
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </LandingSection>
      ) : null}

      {show("cta") ? (
        <EditorialCtaBand
          eyebrow="Next step"
          title={closing.headline}
          description={closing.body}
          ctaHref={closing.cta.href}
          ctaLabel={closing.cta.label}
          images={[
            { src: programme.visual.hero, alt: programme.visual.heroAlt },
            ...others.slice(0, 1).map((p) => ({
              src: p.visual.hero,
              alt: p.visual.heroAlt,
            })),
          ]}
        />
      ) : null}
    </div>
    </ProgrammeThemeScope>
  );
}

function ProgrammeReelsSection({
  programmeSlug,
  reels,
}: {
  programmeSlug: ProgrammeSlug;
  reels: ProgrammeReel[];
}) {
  if (reels.length === 0) return null;

  return (
    <LandingSection
      className="border-t border-border/50"
      aria-labelledby={`reels-heading-${programmeSlug}`}
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className={cn(T.eyebrow, "text-muted-foreground")}>Social Reels</p>
          <h2
            id={`reels-heading-${programmeSlug}`}
            className={cn(T.sectionTitle, "text-balance text-foreground")}
          >
            Short-form civic content
          </h2>
          <p className={cn(T.lead, "text-foreground/75")}>
            Quick-hit explainers, citizen voices, and field recordings from this programme.
          </p>
        </div>
        <p className={cn(T.caption, "shrink-0 text-muted-foreground md:text-right")}>
          <span className="font-semibold text-foreground">{reels.length}</span>{" "}
          {reels.length === 1 ? "reel" : "reels"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reels.map((reel) => (
          <ReelPlayer key={reel.id} reel={reel} size="sm" showControls={false} />
        ))}
      </div>
    </LandingSection>
  );
}
