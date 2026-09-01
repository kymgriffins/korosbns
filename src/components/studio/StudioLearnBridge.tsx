"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { GsapReveal } from "@/motion/gsap";
import { Routes } from "@/constants";
import { cn } from "@/utils";

const LEARN_PATHS = [
  {
    title: "Civic modules",
    description: "Structured paths on national and county budget cycles.",
  },
  {
    title: "Articles and explainers",
    description: "Readable breakdowns of Finance Bill, BPS, and sector splits.",
  },
  {
    title: "Document repository",
    description: "Primary sources from Treasury, CRA, and county assemblies.",
  },
] as const;

export function StudioLearnBridge() {
  return (
    <LandingSection id="learn-bridge" className="border-t-0 bg-muted/20">
      <LandingSectionHeader
        eyebrow="Free civic learning"
        title={
          <>
            Understand the budget before you{" "}
            <span className={T.highlight}>commission a story</span>
          </>
        }
        description="Impact production works best when audiences already grasp the fiscal context. The Learn Hub is free, open, and built for citizens — no paywall on reading."
      />

      <LandingContent>
        <GsapReveal className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-5 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <GraduationCap className="size-3.5" />
              Learn Hub
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Whether you are briefing a production team or evaluating a
              commission, start with verified civic literacy — then move to
              podcasts, explainers, or town halls with shared vocabulary.
            </p>
            <Link
              href={Routes.Learn}
              className={cn(
                T.btnPrimary,
                "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold",
              )}
            >
              Open Learn Hub
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
            {LEARN_PATHS.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-border/80 bg-card p-4"
              >
                <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </GsapReveal>
      </LandingContent>
    </LandingSection>
  );
}
