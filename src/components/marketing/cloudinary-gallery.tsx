"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { Routes } from "@/constants/routes";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { Marquee } from "@/components/ui/marquee";
import { useCohortImages } from "@/hooks/use-marketing";

const PROJECT_NAMES = [
  "Budget Literacy Programme",
  "County Budget Tracking",
  "Public Participation Hub",
] as const;

interface CloudinaryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const CloudinaryGallery = () => {
  const { data, isLoading } = useCohortImages();
  const images: CloudinaryImage[] = data?.images ?? [];
  const loading = isLoading;

  if (loading) {
    return (
      <LandingSection>
        <div className="flex h-96 items-center justify-center">Loading Gallery...</div>
      </LandingSection>
    );
  }

  return (
    <LandingSection className="overflow-x-hidden" innerClassName="mb-0">
      <LandingSectionHeader
        eyebrow="Visual Impact"
        title={
          <>
            Documenting the{" "}
            <span className={T.highlight}>Movement</span> in the field.
          </>
        }
        description="Explore moments from our civic workshops, townhalls, and community engagements across the country as we empower citizens to take action."
      />

      <LandingContent>
        <Link href={Routes.Projects} className="block cursor-pointer" aria-label="View our projects">
          <div className="py-4">
            <Marquee pauseOnHover className="py-4 [--duration:70s] [--gap:1.5rem]">
              {images.map((image, i) => (
                <GalleryItem key={i} image={image} index={i} />
              ))}
            </Marquee>
          </div>
        </Link>
      </LandingContent>
    </LandingSection>
  );
};

const GalleryItem = ({ image, index }: { image: CloudinaryImage; index: number }) => {
  const projectName = PROJECT_NAMES[index % PROJECT_NAMES.length];

  return (
    <div
      className="relative aspect-[4/5] w-[260px] flex-shrink-0 overflow-hidden rounded-3xl border border-border bg-card md:w-[350px] transition-transform duration-500 hover:scale-[1.02]"
    >
      <Image
        src={image.src}
        alt={projectName}
        fill
        className="object-cover transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 260px, 350px"
      />
      <div className="absolute inset-0 flex items-end bg-black/50 p-6">
        <p className="text-sm font-semibold text-white">{projectName}</p>
      </div>
    </div>
  );
};

export default CloudinaryGallery;
