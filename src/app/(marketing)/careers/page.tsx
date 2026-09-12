import { Metadata } from "next";
import { CareersLanding } from "@/components/marketing/careers-landing";
import { canonicalUrl } from "@/utils/metadata";
import {
  getLiveCareersContent,
  getLivePartnerPageSections,
} from "@/lib/cms-live-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers & Creative Network | Budget Ndio Story",
  description:
    "Join Kenya's youth-led civic storytelling and budget literacy movement. Explore open roles for podcast hosts, short-form video creators, animators, scriptwriters, and civic technologists.",
  keywords: [
    "Budget Ndio Story careers",
    "civic media jobs Kenya",
    "youth creator network Kenya",
    "podcast host jobs Nairobi",
    "video editor Kenya",
    "civic tech developer Kenya",
  ],
  alternates: { canonical: canonicalUrl("/careers") },
  openGraph: {
    title: "Careers & Creative Network | Budget Ndio Story",
    description:
      "Join Kenya's youth-led civic storytelling and budget literacy movement. Explore open roles for podcast hosts, video creators, animators, and civic technologists.",
    url: "/careers",
    images: ["/logo.svg"],
  },
};

export default async function CareersPage() {
  const [careersData, sectionsConfig] = await Promise.all([
    getLiveCareersContent(),
    getLivePartnerPageSections(),
  ]);

  return (
    <CareersLanding careersData={careersData} sectionsConfig={sectionsConfig} />
  );
}
