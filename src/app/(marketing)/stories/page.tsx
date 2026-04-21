import { Metadata } from "next";
import Stories from "@/components/marketing/stories";

export const metadata: Metadata = {
    title: "Stories | Budget Ndio Story",
    description: "Explore our budget stories - clear explanations of Kenya's budget allocations, policies, and fiscal decisions.",
};

const StoriesPage = () => {
    return <Stories />;
};

export default StoriesPage;
