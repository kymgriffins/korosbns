"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/content";
import { ProgrammePartnerCta } from "@/components/programmes/programme-partner-cta";
import {
  GsapHeroChoreography,
  gsap,
  registerGsap,
  useGSAP,
  usePrefersReducedMotion,
} from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

registerGsap();

function splitBody(body: string): string[] {
  const chunks = body
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (chunks.length <= 1) return [body];
  // Group into readable paragraphs (2–3 sentences)
  const paragraphs: string[] = [];
  for (let i = 0; i < chunks.length; i += 2) {
    paragraphs.push(chunks.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

function formatChips(formats?: string): string[] {
  if (!formats) return [];
  return formats
    .split(/[·•|,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  const storyRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const paragraphs = splitBody(programme.body);
  const chips = formatChips(programme.formats);

  useGSAP(
    () => {
      if (reduced) return;

      const gallery = galleryRef.current;
      if (gallery) {
        const frames = gallery.querySelectorAll("[data-gallery-frame]");
        gsap.fromTo(
          frames,
          { autoAlpha: 0, y: 48, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gallery,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      const story = storyRef.current;
      if (story) {
        const blocks = story.querySelectorAll("[data-story-block]");
        gsap.fromTo(
          blocks,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: story,
              start: "top 80%",
              once: true,
            },
          },
        );

        const rail = story.querySelector("[data-story-rail]");
        if (rail) {
          gsap.fromTo(
            rail,
            { autoAlpha: 0, x: 24 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: story,
                start: "top 75%",
                once: true,
              },
            },
          );
        }
      }
    },
    { dependencies: [reduced, programme.slug] },
  );

  return (
    <div className="w-full bg-background">
      <GsapHeroChoreography className="relative min-h-[62svh] overflow-hidden border-b border-border/40 md:min-h-[72svh]">
        <div data-gsap-hero-media className="absolute inset-0">
          <Image
            src={programme.visual.hero}
            alt={programme.visual.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/45 to-transparent" />
        </div>

        <div
          data-gsap-hero-content
          className={cn(
            SECTION_SHELL_INNER,
            "relative z-10 flex min-h-[62svh] flex-col justify-end pb-12 pt-28 md:min-h-[72svh] md:pb-16",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
            <Link
              href="/programmes"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All programmes
            </Link>
            <p className="text-sm font-medium text-primary/80">{programme.eyebrow}</p>
            <p className="font-heading text-sm font-semibold text-primary">{programme.name}</p>
            <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>{programme.headline}</h1>
          </div>
        </div>
      </GsapHeroChoreography>

      {/* Contact sheet — overlaps hero for denser use of space */}
      <div
        ref={galleryRef}
        className={cn(SECTION_SHELL_INNER, "-mt-8 md:-mt-12")}
      >
        <div className="grid grid-cols-12 gap-2 md:grid-rows-2 md:gap-3 md:min-h-[20rem]">
          {programme.visual.gallery.map((shot, index) => (
            <div
              key={shot.src}
              data-gallery-frame
              className={cn(
                "relative overflow-hidden rounded-xl border border-border/50 md:rounded-2xl",
                index === 0
                  ? "col-span-12 aspect-[16/10] md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-0"
                  : "col-span-6 aspect-[4/3] md:col-span-5 md:aspect-auto md:min-h-0",
              )}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover"
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 58vw"
                    : "(max-width: 768px) 50vw, 40vw"
                }
              />
            </div>
          ))}
        </div>
      </div>

      <section
        ref={storyRef}
        className={cn(SECTION_SHELL_PADDING, "border-b border-border/40")}
        aria-labelledby="programme-story-heading"
      >
        <div className={cn(SECTION_SHELL_INNER, "grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-16")}>
          <div className="flex flex-col gap-5 md:col-span-7 lg:col-span-7">
            <h2 id="programme-story-heading" className="sr-only">
              About {programme.name}
            </h2>
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                data-story-block
                className="max-w-[65ch] text-base leading-relaxed text-foreground/80 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <aside
            data-story-rail
            className="flex flex-col gap-6 md:col-span-5 md:sticky md:top-24 md:self-start lg:col-span-5"
          >
            {chips.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-[10px] border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}

            {programme.highlight ? (
              <p className="rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4 text-sm font-medium leading-relaxed text-foreground md:text-base">
                <span className="text-primary font-semibold">Key stat: </span>
                {programme.highlight}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
                <Link href={programme.cta.href}>
                  {programme.cta.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/programmes">View all programmes</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <ProgrammePartnerCta />
    </div>
  );
}
