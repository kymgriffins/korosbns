import { Metadata } from "next";
import FAQ from "@/components/marketing/faq";
import { canonicalUrl } from "@/utils/metadata";

export const metadata: Metadata = {
    title: "FAQ: Budget, Finance Bill & Appropriation Bill | Budget Ndio Story",
    description: "Frequently asked questions about Kenya's Budget Policy Statement, Finance Bill 2026, Appropriation Bill, Division of Revenue Bill, and public finance process in Parliament.",
    keywords: ["Kenya budget FAQ", "Finance Bill questions", "Appropriation Bill explained", "Budget Policy Statement", "public finance Kenya", "parliamentary budget process", "Kenya fiscal policy"],
    alternates: { canonical: canonicalUrl("/faq") },
    openGraph: {
        title: "FAQ: Budget, Finance Bill & Appropriation Bill | Budget Ndio Story",
        description: "Answers to common questions about Kenya's budget process, Finance Bill, Appropriation Bill, and parliamentary budget oversight.",
        url: "/faq",
    },
};

const FAQPage = () => {
    return <FAQ />;
};

export default FAQPage;