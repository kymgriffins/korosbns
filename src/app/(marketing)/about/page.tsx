import { Metadata } from "next";
import About from "@/components/marketing/about";
import { fetchPublicTeam } from "@/lib/org-team";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "About | Budget Ndio Story",
  description:
    "Meet the youth-led team behind Budget Ndio Story making Kenya's budget, Finance Bill, and Appropriation Bill transparent and accessible to everyone.",
  keywords: [
    "Budget Ndio Story",
    "Kenya budget transparency",
    "Finance Bill Kenya",
    "Appropriation Bill",
    "youth civic engagement",
    "public finance Kenya",
    "parliamentary budget process",
  ],
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: {
    title: "About | Budget Ndio Story",
    description:
      "Youth-led initiative increasing budget literacy and civic engagement around Kenya's Finance Bill, Appropriation Bill, and parliamentary budget process.",
    url: "/about",
    images: ["/logo.svg"],
  },
};

export const revalidate = 300;

export default async function AboutPage() {
  const members = await fetchPublicTeam();
  return <About members={members} />;
}
