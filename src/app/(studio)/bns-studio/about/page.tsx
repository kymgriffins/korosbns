import type { Metadata } from "next";
import About from "@/components/marketing/about";
import { buildPageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About BNS Studios | Commercial Agency Craft Subsidizing Civic Audits",
  description:
    "Meet the creative team, mission, and economic engine powering BNS Studios: how independent media commissions bankroll free citizen budget audits across all 47 counties.",
  path: "/bns-studio/about",
  image: "/og-image.jpg",
  keywords: [
    "About BNS Studios",
    "Kenya creative agency",
    "civic tech Kenya",
    "commercial production agency Nairobi",
    "social enterprise media Kenya",
    "youth-led investigative media",
  ],
});

export default function StudioAboutRoute() {
  return <About />;
}
