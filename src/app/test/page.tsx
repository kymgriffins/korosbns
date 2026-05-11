import Background from "@/components/global/background";
import GustoHero from "@/components/marketing/gusto-hero";
import GustoMotionText from "@/components/marketing/gusto-motion-text";
import GustoInteractiveVideo from "@/components/marketing/gusto-interactive-video";
import GustoArticleSection from "@/components/marketing/gusto-article-section";
import GustoCloudinaryGallery from "@/components/marketing/gusto-cloudinary-gallery";
import UpcomingProjects from "@/components/marketing/upcoming-projects";
import GustoTeamSection from "@/components/marketing/gusto-team-section";
import GustoFooter from "@/components/marketing/gusto-footer";
import SurveyPopup from "@/components/marketing/survey-popup";
import NewsletterPopup from "@/components/marketing/newsletter-popup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gusto Test | Budget Ndio Story",
    description: "Testing the new Studio Gusto inspired UI.",
};

const TestPage = () => {
    return (
        <div className="w-full min-h-dvh">
            <Background />
            
            {/* 1. Hero Section (Video Background) */}
            <GustoHero />

            {/* 2. Motion Text Section */}
            <GustoMotionText />

            {/* 3. Interactive Video Section (Hover Play) */}
            <GustoInteractiveVideo />

            {/* 4. Article-ish Section (What we do) */}
            <GustoArticleSection />

            {/* 5. Animated Image Gallery (Cloudinary) */}
            <GustoCloudinaryGallery />

            {/* 6. Article Grid (Engagement/Projects) */}
            <UpcomingProjects />

            {/* 7. Team Section */}
            <GustoTeamSection />

            {/* 8. Parting Short Video */}
            <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center bg-zinc-900 mx-auto px-8 md:px-16 my-24 md:my-48 rounded-[2rem] md:rounded-[4rem] max-w-[1400px]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-zinc-900/60 z-10 mix-blend-multiply" />
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover grayscale opacity-50"
                    >
                        <source src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute z-10 text-center">
                    <h2 className="gusto-heading text-white">Action <span className="italic font-serif text-primary">Starts</span> Here.</h2>
                </div>
            </section>

            {/* 9. Footer */}
            <GustoFooter />

            <SurveyPopup />
            <NewsletterPopup />
        </div>
    )
};

export default TestPage;
