"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenText, Users, Radar } from "lucide-react";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";

const STEPS = [
  {
    id: "decode",
    number: "01",
    title: "Decode",
    icon: BookOpenText,
    description:
      "We translate budget statements, appropriations, and fiscal documents into clear stories people can actually understand.",
    highlight: "From policy language to plain language",
  },
  {
    id: "engage",
    number: "02",
    title: "Engage",
    icon: Users,
    description:
      "We run community forums, creator campaigns, and youth conversations that turn awareness into participation.",
    highlight: "From passive readers to active citizens",
  },
  {
    id: "track",
    number: "03",
    title: "Track",
    icon: Radar,
    description:
      "We monitor implementation and flag delivery gaps so citizens can follow where money goes and demand accountability.",
    highlight: "From promises to public evidence",
  },
] as const;

const WhatWeDoSection = () => {
  return (
    <SectionShell className="relative overflow-hidden border-t border-border/40 bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_70%)]" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow="What We Do"
          title={
            <>
              We turn{" "}
              <span className="font-heading italic text-primary">complex budgets</span>{" "}
              into{" "}
              <span className="font-heading italic text-primary">civic action</span>.
            </>
          }
          description="Decode national and county fiscal documents, create spaces for participation, and equip citizens to track execution and demand accountability."
        />

        <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Step-by-step civic workflow</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
                An Apple-like scroll narrative for public finance work.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                As you scroll, each stage of our process appears as a distinct panel: understand the numbers, mobilize communities, and verify delivery.
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.id}
                  className="group min-h-[58vh] rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg md:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm font-semibold tracking-[0.18em] text-primary/80">{step.number}</span>
                    <span className="inline-flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <h4 className="mt-5 text-2xl font-black tracking-tight md:text-4xl">{step.title}</h4>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {step.description}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-primary md:text-base">{step.highlight}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/about">
            <Button
              size="lg"
              variant="white"
              className="gap-2 rounded-full px-10 py-7 text-lg font-bold"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/events">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full px-10 py-7 text-lg font-bold"
            >
              View All Events
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionShell>
  );
};

export default WhatWeDoSection;
