import Background from "@/components/global/background";
import Hero from "@/components/marketing/hero";
import StoriesPromoMarquee from "@/components/marketing/stories-promo-marquee";
import Workflow from "@/components/marketing/workflow";
import Capibilities from "@/components/marketing/capibilities";
import Disconnect from "@/components/marketing/disconnect";
import ROI from "@/components/marketing/roi";
import Integrations from "@/components/marketing/integrations";
import UpcomingProjects from "@/components/marketing/upcoming-projects";
import TeamHierarchy from "@/components/marketing/team-hierarchy";
import ConsortiumPartners from "@/components/marketing/consortium-partners";
import WallOfLove from "@/components/marketing/wall-of-love";
import Gallery from "@/components/marketing/gallery";
import Cta from "@/components/marketing/cta";
import SurveyPopup from "@/components/marketing/survey-popup";
import NewsletterPopup from "@/components/marketing/newsletter-popup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Budget Ndio Story | Bridging Youth Energy & Fiscal Policy",
    description:
        "Budget Ndio Story is a youth-led initiative in Kenya transforming complex national budgets into actionable narratives for democratic participation and fiscal literacy.",
    keywords: [
        "Budget Ndio Story",
        "youth-led civic engagement Kenya",
        "budget transparency Kenya",
        "fiscal literacy",
        "youth fiscal policy",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Budget Ndio Story | Bridging Youth Energy & Fiscal Policy",
        description:
            "Translating Numbers into Narratives. Meeting youth where they are through investigative series, podcasts, and digital explainers.",
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
        <div className="w-full min-h-dvh pt-6 lg:pt-8">
            <Background />
            <Hero />
            <StoriesPromoMarquee />
            <UpcomingProjects />
            <Disconnect />
            <Workflow />
            <Capibilities />
            <ROI />
            <TeamHierarchy />
            <ConsortiumPartners />
            <Cta />
            <SurveyPopup />
            <NewsletterPopup />
        </div>
    )
};

export default HomePage
