import { Metadata } from "next";
import FAQ from "@/components/marketing/faq";

export const metadata: Metadata = {
    title: "FAQ: Budget Questions | Budget Ndio Story",
    description: "Frequently asked questions about Kenya's Budget Policy Statement and public finance.",
};

const FAQPage = () => {
    return <FAQ />;
};

export default FAQPage;