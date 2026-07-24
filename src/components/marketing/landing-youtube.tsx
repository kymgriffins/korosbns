"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_YOUTUBE_EMBED } from "@/constants/cloudinary";
import { BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

/** Split intro + dual image strip, then cinematic YouTube — Mason rhythm, BNS colors. */
export default function LandingYoutube() {
  return (
    <LandingSection>
      <div className="mb-10 grid items-center gap-8 md:mb-14 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col gap-5 md:col-span-5">
          <h2 className={T.sectionTitle}>
            Find the story near you
          </h2>
          <p className={cn(T.lead, "max-w-md text-base text-foreground/75")}>
            See how we translate complex fiscal policy into stories that meet youth where they are —
            from town halls to short-form feeds.
          </p>
          <Button asChild className={cn(T.btnPrimary, "w-fit gap-2 rounded-full")}>
            <Link href="/learn">
              Get started
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-7 md:gap-4">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] border border-border/50 md:rounded-[1.5rem]">
            <Image
              src={BNS_COMMUNITY_IMAGES.forumB}
              alt="Budget Ndio Story town hall engagement"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 30vw"
            />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] border border-border/50 md:rounded-[1.5rem]">
            <Image
              src={BNS_COMMUNITY_IMAGES.cohortA}
              alt="Youth cohort during a Budget Ndio Story session"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 30vw"
            />
          </div>
        </div>
      </div>

      <LandingContent>
        <p className="mb-4 font-heading text-sm font-semibold text-foreground">
          The Budget <span className={T.highlight}>Mtaani</span> Series
        </p>
        <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted md:rounded-[2rem]">
          <iframe
            src={LANDING_YOUTUBE_EMBED}
            title="Budget Ndio Story overview"
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </LandingContent>
    </LandingSection>
  );
}
