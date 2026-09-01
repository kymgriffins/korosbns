"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  SECTION_SHELL_INNER,
  SECTION_SHELL_PADDING,
} from "@/layouts/section-shell";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { CONSORTIUM_FOUNDERS, CONSORTIUM_SUMMARY } from "@/constants/consortium-founders";
import { cn } from "@/utils";

export default function ConsortiumFoundersSection() {
  return (
    <section
      id="consortium-founders"
      className={cn(SECTION_SHELL_PADDING, "border-y border-border/40 bg-muted/30")}
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapReveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center lg:mb-16">
          <span className={T.eyebrow}>Consortium founders</span>
          <h2 className={T.sectionTitle}>The founding partners behind BNS</h2>
          <p className={cn(T.lead, "text-foreground/75")}>{CONSORTIUM_SUMMARY}</p>
        </GsapReveal>

        <GsapStaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {CONSORTIUM_FOUNDERS.map((founder) => (
            <article
              key={founder.id}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md lg:rounded-3xl lg:p-8"
            >
              <Link
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mb-6 flex h-14 w-full max-w-[200px] items-center transition-transform duration-300 group-hover:scale-105"
              >
                <Image
                  src={founder.logoUrl}
                  alt={`${founder.name} logo`}
                  fill
                  className="object-contain object-left"
                  sizes="200px"
                />
              </Link>

              <h3 className="text-xl font-bold text-foreground">{founder.name}</h3>
              <p className="mt-2 text-sm font-medium text-primary">{founder.role}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {founder.description}
              </p>

              <Link
                href={founder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                Visit website
                <ArrowUpRight className="size-4" />
              </Link>
            </article>
          ))}
        </GsapStaggerReveal>
      </div>
    </section>
  );
}
