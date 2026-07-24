import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammesLanding } from "@/components/programmes/programmes-landing";
import { PROGRAMMES_LANDING } from "@/constants/programmes-content";

export const metadata: Metadata = buildPageMetadata({
  title: PROGRAMMES_LANDING.seoTitle,
  description: PROGRAMMES_LANDING.seoDescription,
  path: "/programmes",
});

export default function ProgrammesPage() {
  return <ProgrammesLanding />;
}
