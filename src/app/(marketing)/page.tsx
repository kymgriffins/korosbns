import Background from "@/components/global/background";
import { 
    HeroSection, 
    ProblemSection, 
    StrategySection, 
    VerificationHub, 
    TownHallSection, 
    CTASection 
} from "@/components/marketing/RedesignComponents";
import TeamHierarchy from "@/components/marketing/team-hierarchy";
import ConsortiumPartners from "@/components/marketing/consortium-partners";
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
        <div className="w-full min-h-dvh">
            <Background />
            <HeroSection />
            <ProblemSection />
            <TownHallSection />
            <VerificationHub />
            <TeamHierarchy />
            <ConsortiumPartners />
            <CTASection />
            <SurveyPopup />
            <NewsletterPopup />
        </div>
    )
};

export default HomePage
