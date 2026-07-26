"use client";

import Link from "next/link";
import Image from "next/image";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { landingContent } from "@/content";
import {
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import {
  LandingSeeMore,
  LandingSectionCta,
} from "@/components/marketing/landing-see-more";
import { GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

export default function LandingTeam() {
  return (
    <LandingSection>
      <LandingSectionHeader
        eyebrow={landingContent.team.eyebrow}
        title={
          <>
            {landingContent.team.titleBefore}{" "}
            <span className={T.highlight}>{landingContent.team.titleHighlight}</span>
            {landingContent.team.titleAfter}
          </>
        }
        description={landingContent.team.description}
      />

      <GsapStaggerReveal className="hidden gap-x-8 gap-y-12 md:grid md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => {
          const href = `/team/${slugifyName(member.name)}`;
          return (
            <Link
              key={member.name}
              data-gsap-item
              href={href}
              className="group block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-3xl border border-border/40 bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className={cn(T.cardTitle, "transition-colors group-hover:text-primary")}>
                {member.name}
              </h3>
              <p className={cn(T.role, "mb-3 mt-1")}>{member.role}</p>
              <p className={T.caption}>{member.description}</p>
            </Link>
          );
        })}
      </GsapStaggerReveal>

      <GsapStaggerReveal className="flex w-full flex-col gap-6 md:hidden">
        {team.map((member) => {
          const href = `/team/${slugifyName(member.name)}`;
          return (
            <Link
              key={member.name}
              data-gsap-item
              href={href}
              className="flex w-full flex-col gap-4 rounded-3xl border border-border bg-card p-5 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/20 bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="100vw"
                />
              </div>
              <div>
                <h3 className={T.cardTitle}>{member.name}</h3>
                <p className={cn(T.role, "mb-2.5 mt-0.5")}>{member.role}</p>
                <p className={T.caption}>{member.description}</p>
              </div>
            </Link>
          );
        })}
      </GsapStaggerReveal>

      <LandingSectionCta>
        <LandingSeeMore
          href={landingContent.team.seeMoreHref}
          label={landingContent.team.seeMoreLabel}
        />
      </LandingSectionCta>
    </LandingSection>
  );
}
