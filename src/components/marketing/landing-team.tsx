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
  const featuredMembers = team.slice(0, 3);

  return (
    <LandingSection id="team">
      <LandingSectionHeader
        eyebrow="The Investigators & Strategists"
        title={
          <>
            Meet the people following the{" "}
            <span className={T.highlight}>money</span>
          </>
        }
        description="Public finance analysts, investigative storytellers, and civic organizers dedicated to demystifying Kenya's national and county budgets."
      />

      <GsapStaggerReveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuredMembers.map((member) => {
          const href = `/team/${slugifyName(member.name)}`;
          return (
            <Link
              key={member.name}
              data-gsap-item
              href={href}
              className="group flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 outline-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div>
                <div className="relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/40 bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className={cn(T.cardTitle, "text-xl font-bold transition-colors group-hover:text-primary")}>
                  {member.name}
                </h3>
                <p className={cn(T.role, "mb-3 mt-1 text-xs font-semibold text-primary/90 uppercase tracking-wider")}>
                  {member.role}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {member.description}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                <span>View Profile</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          );
        })}
      </GsapStaggerReveal>

      <LandingSectionCta className="mt-8 flex justify-center">
        <LandingSeeMore
          href="/team"
          label="Meet the entire team behind the stories"
        />
      </LandingSectionCta>
    </LandingSection>
  );
}
