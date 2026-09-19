import { Metadata } from "next";
import { MagazineAbout } from "@/components/magazine/magazine-about";
import { canonicalUrl } from "@/utils/metadata";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Masthead & Editorial Charter | Budget Ndio Story",
  description:
    "Meet the editorial desk and investigators behind Budget Ndio Story, making Kenya's budget, Finance Bill, and county expenditures transparent to every citizen.",
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
    title: "The Masthead & Editorial Charter | Budget Ndio Story",
    description:
      "Independent civic journalism increasing budget literacy and forensic accountability around Kenya's public wealth.",
    url: "/about",
    images: ["/logo.svg"],
  },
};

export default function AboutPage() {
  return <MagazineAbout />;
}
