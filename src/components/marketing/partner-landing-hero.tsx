"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { Marquee } from "@/components/ui/marquee";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { PARTNER_LANDING_STILLS } from "@/content/partner-landing";
import { landingContent } from "@/content";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

function ProjectStillCard({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 sm:h-52 sm:w-72 md:h-56 md:w-80">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center opacity-90"
        sizes="320px"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-black/65 px-3 py-2 text-[10px] font-medium leading-snug text-white/90 sm:text-[11px]">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Partner homepage hero — Studio-style moving project stills (no TikTok).
 * Evidence imagery: Maingi, Wajackoyah, Nelly (mic/reel), Latif launch.
 */
export default function PartnerLandingHero() {
  const reduceMotion = useReducedMotion();
  const hero = landingContent.hero;
  const rowA = PARTNER_LANDING_STILLS.filter((_, i) => i % 2 === 0);
  const rowB = PARTNER_LANDING_STILLS.filter((_, i) => i % 2 === 1);

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden border-b border-border/30 bg-zinc-950 text-white"
      aria-labelledby="partner-landing-hero-heading"
    >
      {/* Moving project backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {reduceMotion ? (
          <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 opacity-40 md:grid-cols-3">
            {PARTNER_LANDING_STILLS.slice(0, 6).map((still) => (
              <div key={still.id} className="relative overflow-hidden rounded-2xl">
                <Image
                  src={still.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="33vw"
                  priority={still.id === "maingi-afrodad"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center gap-4 py-8 opacity-45">
            <Marquee pauseOnHover={false} repeat={3} className="[--duration:55s] [--gap:1rem] p-0">
              {rowA.map((still) => (
                <ProjectStillCard
                  key={`a-${still.id}`}
                  src={still.src}
                  alt=""
                  caption={still.caption}
                />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover={false} repeat={3} className="[--duration:65s] [--gap:1rem] p-0">
              {rowB.map((still) => (
                <ProjectStillCard
                  key={`b-${still.id}`}
                  src={still.src}
                  alt=""
                  caption={still.caption}
                />
              ))}
            </Marquee>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/80 to-zinc-950" />
      </div>

      <div
        className={cn(
          SECTION_SHELL_INNER,
          "relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-32",
        )}
      >
        <div className="max-w-3xl space-y-5">
          <EditorialPill
            dot
            pulse
            variant="invert"
          >
            Partner intelligence · three programmes
          </EditorialPill>

          <h1
            id="partner-landing-hero-heading"
            className={cn(T.heroTitle, "text-balance text-white")}
          >
            {hero.headlineBefore}{" "}
            <span className="text-primary">{hero.headlineHighlight}</span>
          </h1>

          <p className={cn(T.lead, "max-w-2xl text-white/75")}>{hero.body}</p>

          <p className="max-w-2xl text-sm font-medium leading-relaxed text-white/55 md:text-base">
            Connect watches the national flow. Mashinani follows money into
            counties. Wanahabari keeps the story alive after Budget Day. BNS
            Studio captures the evidence.
          </p>

          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <PillButtonGroup
              href={hero.primaryCta.href}
              label={hero.primaryCta.label}
              variant="primary"
              className="w-full justify-center sm:w-auto"
            />
            <PillButtonGroup
              href={hero.secondaryCta.href}
              label={hero.secondaryCta.label}
              variant="outline"
              className="w-full justify-center border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
