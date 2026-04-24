import Learn from "@/components/marketing/learn";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Learn Hub | Budget Ndio Story",
    description:
        "Explore Budget Ndio Story's story-first learning hub with swipeable explainers, enhanced motion, and youth-friendly budget literacy content for civic engagement in Kenya.",
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
            "A story-first, swipeable learning journey that makes Kenya's budget understandable, actionable, and relevant for young people.",
        url: "/learn",
        type: "website",
        images: ["/logo.svg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Learn Hub | Budget Ndio Story",
        description:
            "Learn Kenya's budget through enhanced social-style stories and explainers designed for youth action.",
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