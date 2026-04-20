import { Metadata } from "next";
import Research from "@/components/marketing/research";

export const metadata: Metadata = {
    title: "Research: Budget Policy Statement 2026 | Budget Ndio Story",
    description: "In-depth research and analysis of Kenya's Budget Policy Statement 2026 with interactive graphs and data visualizations.",
};

const ResearchPage = () => {
    return <Research />;
};

export default ResearchPage;