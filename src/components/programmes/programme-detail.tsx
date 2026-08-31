"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import type { ProgrammeBlock } from "@/content";
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
    <div className="w-full bg-background scroll-smooth">
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-neutral-900/50 via-background to-background py-16 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className={cn(SECTION_SHELL_INNER, "relative z-10")}>
          <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
            <Link
              href="/programmes"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All programmes
            </Link>
            <p className="text-sm font-medium text-primary/80">{programme.eyebrow}</p>
            <p className="font-heading text-sm font-semibold text-primary">{programme.name}</p>
            <h1 className={cn(T.heroTitle, "max-w-3xl text-balance text-foreground")}>{programme.headline}</h1>
          </div>
        </div>
      </section>

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

      {/* Dedicated Mashinani Live Reports & Scorecards Section */}
      {programme.slug === "mashinani" && (
        <section className={cn(SECTION_SHELL_PADDING, "bg-muted/10 border-b border-border/40")}>
          <div className={cn(SECTION_SHELL_INNER, "space-y-8")}>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live County Output
                </p>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  BNS Mashinani Field Reports & Scorecards
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl mt-1">
                  Direct intelligence from our embedded tracking cohorts in Kakamega, Kilifi, Nakuru, and Wajir. Fully verified against County Assembly Hansards and COB implementation audits.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
                <Link href="/reports">
                  <span>Explore All Reports Bulletin</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  code: "037",
                  name: "Kakamega",
                  governor: "H.E. Fernandes Barasa, FCPA",
                  website: "https://kakamega.go.ke",
                  budgetUrl: "https://kakamega.go.ke/budget-documents/",
                  allocation: "KES 19.45B",
                  execution: "92.1%",
                  focus: "Sugar belt roads (34%) & Healthcare (33.2%)",
                  slug: "kakamega-county-budget-execution-2026",
                },
                {
                  code: "003",
                  name: "Kilifi",
                  governor: "H.E. Gideon Mung'aro, OGW",
                  website: "https://kilifi.go.ke",
                  budgetUrl: "https://kilifi.go.ke/county-treasury/",
                  allocation: "KES 16.89B",
                  execution: "89.1%",
                  focus: "Blue Economy marine gear & UHC clinics",
                  slug: "kilifi-county-blue-economy-devolution",
                },
                {
                  code: "032",
                  name: "Nakuru",
                  governor: "H.E. Susan Kihika",
                  website: "https://nakuru.go.ke",
                  budgetUrl: "https://nakuru.go.ke/finance-economic-planning/",
                  allocation: "KES 22.18B",
                  execution: "93.5%",
                  focus: "CAIPs agro-industrial parks & OSR automation",
                  slug: "nakuru-county-revenue-agro-industrial-growth",
                },
                {
                  code: "008",
                  name: "Wajir",
                  governor: "H.E. Ahmed Abdullahi, FCPA",
                  website: "https://wajir.go.ke",
                  budgetUrl: "https://wajir.go.ke/county-treasury/",
                  allocation: "KES 14.25B",
                  execution: "87.8%",
                  focus: "Equalisation Fund (KES 1.2B) & Solar water pans",
                  slug: "wajir-county-equalisation-fund-climate-resilience",
                },
              ].map((c) => (
                <div
                  key={c.code}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-black text-primary border border-primary/20">
                        {c.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        {c.execution} Absorbed
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {c.name} County
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                        {c.governor}
                      </p>
                      <p className="font-heading text-xl font-extrabold text-foreground mt-1.5">
                        {c.allocation}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {c.focus}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                      >
                        Official Site ↗
                      </a>
                      <span className="text-muted-foreground/40">·</span>
                      <a
                        href={c.budgetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
                      >
                        Budget Portal ↗
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/40">
                    <Button asChild variant="ghost" size="sm" className="w-full justify-between p-0 h-auto text-xs font-bold text-primary group-hover:underline">
                      <Link href={`/reports/${c.slug}`}>
                        <span>Read Field Dossier</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
