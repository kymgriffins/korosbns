import GustoHero from "@/components/marketing/gusto-hero";
import GustoMotionText from "@/components/marketing/gusto-motion-text";
import GustoInteractiveVideo from "@/components/marketing/gusto-interactive-video";
import ConsortiumPartners from "@/components/marketing/consortium-partners";
import GustoCloudinaryGallery from "@/components/marketing/gusto-cloudinary-gallery";
import UpcomingProjects from "@/components/marketing/upcoming-projects";
import GustoTeamSection from "@/components/marketing/gusto-team-section";
import GustoPartingHero from "@/components/marketing/gusto-parting-hero";
import ScrollChoreographyContainer from "@/components/marketing/scroll-choreography-container";
import CinematicSilence from "@/components/marketing/cinematic-silence";
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
        <ScrollChoreographyContainer className="bg-background">
            {/* 1. Arrival */}
            <GustoHero />
            
            {/* 2. Tension */}
            <div className="relative z-20">
                <GustoMotionText />
            </div>

            {/* 3. Product Proof (Immersive) */}
            <GustoInteractiveVideo />
            
            {/* 4. Editorial Features */}
            <ConsortiumPartners />
            <GustoCloudinaryGallery />
            
            <UpcomingProjects />
            
            {/* 6. Release & Vision */}
            <GustoTeamSection />
            
            {/* 7. Conversion */}
            <GustoPartingHero />
        </ScrollChoreographyContainer>
    )
};

export default HomePage
