import Background from "@/components/global/background";
import Hero from "@/components/marketing/hero";
import StoriesPromoMarquee from "@/components/marketing/stories-promo-marquee";
import Workflow from "@/components/marketing/workflow";
import Capibilities from "@/components/marketing/capibilities";
import Integrations from "@/components/marketing/integrations";
import UpcomingProjects from "@/components/marketing/upcoming-projects";
import TeamHierarchy from "@/components/marketing/team-hierarchy";
import ConsortiumPartners from "@/components/marketing/consortium-partners";
import WallOfLove from "@/components/marketing/wall-of-love";
import Cta from "@/components/marketing/cta";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Budget Ndio Story | Youth-Led Budget Literacy in Kenya",
    description:
        "Budget Ndio Story is a youth-led initiative in Kenya translating public budgets into accessible, actionable information that drives civic engagement and accountability.",
    keywords: [
        "Budget Ndio Story",
        "youth-led civic engagement Kenya",
        "budget transparency Kenya",
        "public finance education",
        "county budget accountability",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Budget Ndio Story | Youth-Led Budget Literacy in Kenya",
        description:
            "Making national and county budgets understandable and relevant to young people through explainers, videos, and community action.",
        url: "/",
        type: "website",
        images: ["/logo.svg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Budget Ndio Story",
        description:
            "A youth-led Kenyan initiative turning budgets into actionable civic knowledge.",
        images: ["/logo.svg"],
    },
};

const HomePage = () => {
    return (
        <div className="w-full min-h-dvh pt-18">
            <Background />
            <StoriesPromoMarquee />
            <Hero />
            <Workflow />
            <Capibilities />
            <Integrations />
            <UpcomingProjects />
            <TeamHierarchy />
            <ConsortiumPartners />
            <WallOfLove />
            <Cta />
        </div>
    )
};

export default HomePage
