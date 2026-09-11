"use client";

import Link from "next/link";
import { ArrowRight, DollarSign, Layers, Sparkles } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

const PATHWAYS = [
  {
    icon: DollarSign,
    eyebrow: "Core Support",
    title: "Programme Co-Funding",
    audience: "Philanthropic & Institutional Foundations",
    description:
      "Fund the core operational backbone of BNS Connect, BNS Mashinani, or Wanahabari Lab across one or multi-year budget cycles.",
    deliverables: "Institutional briefing rights, quarterly impact reporting, and annual youth survey data access.",
    ctaLabel: "Discuss programme grant",
    href: "/contact?intent=partner",
  },
  {
    icon: Layers,
    eyebrow: "Thematic Sprints",
    title: "Sector & Policy Sprints",
    audience: "Bilateral Donors & Research Coalitions",
    description:
      "Co-design dedicated budget tracking and ground-verification sprints focused on health, climate adaptation, education, or sovereign debt.",
    deliverables: "Custom thematic scorecards, policy briefs, and targeted newsroom investigations.",
    ctaLabel: "Propose a thematic sprint",
    href: "/contact?intent=partner",
  },
  {
    icon: Sparkles,
    eyebrow: "Commercial Surplus",
    title: "Commission BNS Studios",
    audience: "Governments, CSOs & Mission-Aligned Companies",
    description:
      "Commission cinema-grade documentaries, animated explainers, podcasts, or town hall facilitation — with production surplus directly cross-subsidizing civic scrutiny.",
    deliverables: "Broadcast-ready media assets with a built-in 2× civic impact surplus.",
    ctaLabel: "Commission BNS Studios",
    href: "/bns-studio#booking",
  },
];

export function ProgrammesInvestorPathways() {
  return (
    <LandingSection
      id="co-invest"
      aria-labelledby="pathways-heading"
      className="border-t border-border/50 bg-muted/10"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill dot pulse variant="default">
            Partnership Pathways
          </EditorialPill>
          <h2 id="pathways-heading" className={T.sectionTitle}>
            How partners work with us
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground md:text-right">
          Whether you fund institutional public finance governance, require thematic field verification, or need high-craft impact storytelling.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PATHWAYS.map((p) => {
          const Icon = p.icon;

          return (
            <div
              key={p.title}
              className="flex flex-col justify-between border border-border/60 bg-background p-6 sm:p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-primary">
                    {p.eyebrow}
                  </span>
                  <div className="flex size-8 items-center justify-center bg-muted/40">
                    <Icon className="size-4 text-foreground/80" aria-hidden="true" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    Target: {p.audience}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-foreground/75">
                  {p.description}
                </p>

                <div className="border-t border-border/30 pt-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Deliverable:</span>{" "}
                    {p.deliverables}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-border/40 pt-4">
                <Link
                  href={p.href}
                  className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {p.ctaLabel}
                  <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
