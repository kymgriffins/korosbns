"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Clapperboard } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

const PATHWAYS = [
  {
    icon: BookOpen,
    eyebrow: "Learn",
    title: "Explore the programmes",
    audience: "Citizens, students & civic groups",
    description:
      "Follow BNS Connect, BNS Mashinani, or Wanahabari Lab to see how national tracking, county embeds, and newsroom labs work year-round.",
    deliverables: "Programme pages, field evidence, and free learning modules.",
    ctaLabel: "Explore programmes",
    href: "/programmes",
  },
  {
    icon: Layers,
    eyebrow: "Evidence",
    title: "Read reports & investigations",
    audience: "Journalists, researchers & communities",
    description:
      "Browse published investigations, county scorecards, and civic briefings grounded in Treasury, CoB, and Auditor-General records.",
    deliverables: "Reports bulletin, featured projects, and open learning content.",
    ctaLabel: "Read reports",
    href: "/reports",
  },
  {
    icon: Clapperboard,
    eyebrow: "Studios",
    title: "Commission BNS Studios",
    audience: "Civil society & public agencies",
    description:
      "Commission documentaries, animated explainers, podcasts, or town hall facilitation that translate complex policy into civic media.",
    deliverables: "Broadcast-ready media assets for public audiences.",
    ctaLabel: "Explore Studios",
    href: "/bns-studio",
  },
];

export function ProgrammesInvestorPathways() {
  return (
    <LandingSection
      id="collaborate"
      aria-labelledby="pathways-heading"
      className="border-t border-border/50 bg-muted/10"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill variant="default">Ways to engage</EditorialPill>
          <h2 id="pathways-heading" className={T.sectionTitle}>
            How communities work with us
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground md:text-right">
          Learn the programmes, read the evidence, or commission civic storytelling — never a fundraising ask.
        </p>
      </div>

      <div className="divide-y divide-border/50 border-y border-border/50">
        {PATHWAYS.map((p) => {
          const Icon = p.icon;

          return (
            <div
              key={p.title}
              className="flex flex-col justify-between gap-6 py-8 sm:flex-row sm:items-start sm:gap-10"
            >
              <div className="flex flex-1 gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center bg-muted/40">
                  <Icon className="size-4 text-foreground/80" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className={T.eyebrow}>{p.eyebrow}</span>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground">
                      {p.audience}
                    </p>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-foreground/75">
                    {p.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">You get:</span>{" "}
                    {p.deliverables}
                  </p>
                </div>
              </div>

              <Link
                href={p.href}
                className="inline-flex shrink-0 items-center text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {p.ctaLabel}
                <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
