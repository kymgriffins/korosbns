import { Metadata } from "next";
import { MarketingSurfacePage } from "@/components/marketing/marketing-surface-page";
import { Routes } from "@/constants";

export const metadata: Metadata = {
  title: "Donate | Budget Ndio Story",
  description:
    "Support youth-led budget literacy and civic education across Kenya. Partner with Budget Ndio Story.",
};

export default function DonatePage() {
  return (
    <MarketingSurfacePage
      eyebrow="Movement"
      title="Fuel transparent budgets."
      description="Donations and institutional partnerships help us produce investigative explainers, campus hubs, and county forums. Tell us how you’d like to give—we’ll align impact with your mandate."
      primary={{ label: "Start a partnership note", href: Routes.Contact }}
      secondary={{ label: "Explore impact", href: Routes.Impact }}
    />
  );
}
