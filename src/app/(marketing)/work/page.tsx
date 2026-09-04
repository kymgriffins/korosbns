import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioFeaturedWorkPage } from "@/components/studio/theatre/studio-featured-work-page";
import { StudioThemeProvider } from "@/contexts/studio-theme-context";

export const metadata: Metadata = buildPageMetadata({
  title: "Featured Work & Evidence | Budget Ndio Story",
  description:
    "Explore forensic investigations, commissioned media, county scorecards, and viral explainers produced across our 4 operational programmes: BNS Connect, BNS Mashinani, Wanahabari Lab, and BNS Studios.",
  path: "/work",
});

export default function UnifiedWorkPage() {
  return (
    <StudioThemeProvider>
      <StudioFeaturedWorkPage />
    </StudioThemeProvider>
  );
}
