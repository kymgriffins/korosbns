import { Metadata } from "next";
import About from "@/components/marketing/about";
import { fetchTeamMembers } from "@/lib/team";

export const metadata: Metadata = {
    title: "About | Budget Ndio Story",
    description: "Meet the youth-led team behind Budget Ndio Story. We're on a mission to make Kenya's budget transparent and accessible to everyone.",
};

const AboutPage = async () => {
    const teamData = await fetchTeamMembers();
    return <About teamData={teamData} />;
};

export default AboutPage;
