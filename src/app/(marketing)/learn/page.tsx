import Learn from "@/components/marketing/learn";
import { Metadata } from "next";
import { metaDescription } from "@/utils/metadata";
import { Suspense } from "react";

const learnDescription = metaDescription(
    "Explore Kenya's budget through Budget Ndio Story's learn hub: articles, trivia, surveys, and youth-friendly literacy built for civic engagement.",
);

export const metadata: Metadata = {
    title: "Learn Hub | Budget Ndio Story",
    description: learnDescription,
    keywords: [
        "Budget Ndio Story learn hub",
        "Kenya budget explainer videos",
        "youth budget literacy",
        "public budget accountability Kenya",
    ],
    alternates: {
        canonical: "/learn",
    },
    openGraph: {
        title: "Learn Hub | Budget Ndio Story",
        description:
            "Articles, trivia, and explainers that make Kenya's budget understandable, actionable, and relevant for young people.",
        url: "/learn",
        type: "website",
        images: ["/logo.svg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Learn Hub | Budget Ndio Story",
        description:
            "Learn Kenya's budget through articles, trivia, and explainers designed for youth action.",
        images: ["/logo.svg"],
    },
};

const LearnPage = () => {
    return (
        <Suspense fallback={<section className="min-h-screen w-full bg-background" />}>
            <Learn />
        </Suspense>
    );
};

export default LearnPage;