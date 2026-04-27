import Challenges from "@/components/marketing/challenges";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Weekly Challenges | Budget Ndio Story",
    description: "Join our weekly TikTok and YouTube Shorts challenges to decode budget mysteries and win rewards.",
};

export default function ChallengesPage() {
    return <Challenges />;
}
