import type { Metadata } from "next";
import About from "@/components/marketing/about";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "About BNS Studios & Mission | Budget Ndio Story",
  description:
    "Meet the youth-led watchdog behind Budget Ndio Story and BNS Studios: investigative journalism, high-craft civic media, and grassroots budget tracking across Kenya.",
  alternates: { canonical: canonicalUrl("/bns-studio/about") },
};

export default function StudioAboutRoute() {
  return <About />;
}
