import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioFeaturedWorkPage } from "@/components/studio/theatre/studio-featured-work-page";

export const metadata: Metadata = buildPageMetadata({
  title: "Featured work | BNS Studios",
  description: "Commissioned podcasts, explainers, documentaries, and civic productions from BNS Studios.",
  path: "/bns-studio/work",
});

export default function StudioWorkPage() {
  return <StudioFeaturedWorkPage />;
}
