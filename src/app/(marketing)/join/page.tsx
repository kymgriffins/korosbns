import { Metadata } from "next";
import { MarketingSurfacePage } from "@/components/marketing/marketing-surface-page";
import { Routes } from "@/constants";

export const metadata: Metadata = {
  title: "Join the network | Budget Ndio Story",
  description:
    "Join Budget Ndio Story’s coalition of storytellers, analysts, and organizers building fiscal literacy in Kenya.",
};

export default function JoinPage() {
  return (
    <MarketingSurfacePage
      eyebrow="People"
      title="Join the Budget Ndio Story network."
      description="We recruit fellows, campus leads, and consortium allies who want budgets told clearly—from TikTok explainers to county town halls. Open roles and collaborations live on our careers hub."
      primary={{ label: "View careers & roles", href: Routes.Careers }}
      secondary={{ label: "Say hello", href: Routes.Contact }}
    />
  );
}
