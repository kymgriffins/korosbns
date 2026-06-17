import { Metadata } from "next";
import TikTokVideoPage from "@/components/marketing/tiktok-video-page";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "TikTok Video | Budget Ndio Story",
  description: "County budgets explained in under a minute — follow the money where you live.",
  alternates: { canonical: canonicalUrl("/tiktok") },
  openGraph: {
    title: "Budget Ndio Story TikTok",
    description: "County budgets explained in under a minute.",
  },
};

export default function TikTokDetail({ params }: { params: Promise<{ uuid: string }> }) {
  return <TikTokVideoPage params={params} />;
}
