import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioAboutPage } from "@/components/studio/theatre/studio-about-page";
import { getProgramme } from "@/constants/programmes-content";

const studios = getProgramme("studios")!;

export const metadata: Metadata = buildPageMetadata({
  title: `About | ${studios.seoTitle}`,
  description: studios.seoDescription,
  path: "/bns-studio/about",
});

export default function StudioAboutRoute() {
  return <StudioAboutPage />;
}
