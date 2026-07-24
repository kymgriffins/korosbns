"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { PROGRAMMES_CLOSING } from "@/constants/programmes-content";
import TeamSection from "@/components/marketing/team-section";
import ConsortiumFoundersSection from "@/components/marketing/consortium-founders-section";
import { cn } from "@/utils";

const openCallRoles = [
  "Podcast hosts",
  "Storytellers",
  "Animators",
  "Videographers",
  "Photographers",
  "Script writers",
  "Social media managers",
  "Facilitators",
];

/** About — Civic Studio system: image-led, no glow orbs, same landing grammar. */
const About = () => {
  return (
    <div className="w-full bg-background">
      <section className="relative min-h-[70svh] overflow-hidden border-b border-border/40 md:min-h-[85svh]">
        <Image
          src={BNS_COMMUNITY_IMAGES.stakeholdersB}
          alt="Budget Ndio Story team and partners in a stakeholder session"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/45 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-end px-6 pb-14 pt-28 md:min-h-[85svh] md:px-16 md:pb-20">
          <div className="flex max-w-3xl flex-col gap-5">
            <p className="font-heading text-sm font-semibold text-foreground">About</p>
            <h1 className={cn(T.heroTitle, "max-w-3xl")}>
              Youth-led transparency for Kenya&apos;s budget
            </h1>
            <p className={cn(T.lead, "max-w-2xl text-base text-foreground/80 md:text-lg")}>
              Budget Ndio Story transforms how Kenyans understand national and county budgets —
              turning complex fiscal documents into stories, data, and training people actually use.
            </p>
          </div>
        </div>
      </section>

      <LandingSection spacing="default">
        <LandingContent className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <h2 className={T.sectionTitle}>Our mission</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              Every young Kenyan has the right to understand how public money is spent. We break
              down Budget Policy Statements and related fiscal documents into digestible content —
              so a new generation can hold leaders accountable and participate meaningfully in
              governance.
            </p>
          </div>
        </LandingContent>
      </LandingSection>

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-2 px-6 pb-6 md:grid-cols-4 md:gap-3 md:px-16">
        {[
          BNS_COMMUNITY_IMAGES.forumA,
          BNS_COMMUNITY_IMAGES.cohortA,
          BNS_COMMUNITY_IMAGES.forumD,
          BNS_COMMUNITY_IMAGES.stakeholdersC,
        ].map((src) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/40 md:rounded-2xl"
          >
            <Image
              src={src}
              alt="Budget Ndio Story community and civic engagement"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      <ConsortiumFoundersSection />
      <TeamSection />

      <LandingSection spacing="default" className="bg-muted/30" id="join-us">
        <LandingContent className="flex max-w-3xl flex-col gap-5">
          <h2 className={T.sectionTitle}>Open call: young creatives wanted (18–34)</h2>
          <p className={cn(T.lead, "max-w-2xl text-base text-foreground/75")}>
            Space for young creators who care about civic storytelling and public accountability.
            If you are ready to shape how Kenya talks about budgets, join our creative network.
          </p>
          <ul className="flex flex-wrap gap-2">
            {openCallRoles.map((role) => (
              <li
                key={role}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {role}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className={cn(T.btnPrimary, "gap-2")}>
              <Link href="/contact">
                Contact us to apply
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={PROGRAMMES_CLOSING.cta.href}>Partner with BNS</Link>
            </Button>
          </div>
        </LandingContent>
      </LandingSection>
    </div>
  );
};

export default About;
