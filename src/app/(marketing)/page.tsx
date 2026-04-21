import Background from "@/components/global/background";
import Hero from "@/components/marketing/hero";
import Workflow from "@/components/marketing/workflow";
import Capibilities from "@/components/marketing/capibilities";
import Integrations from "@/components/marketing/integrations";
import WallOfLove from "@/components/marketing/wall-of-love";
import Cta from "@/components/marketing/cta";

const HomePage = () => {
    return (
        <div className="w-full min-h-dvh pt-18">
            <Background />
            <Hero />
            <Workflow />
            <Capibilities />
            <Integrations />
            <WallOfLove />
            <Cta />
        </div>
    )
};

export default HomePage
