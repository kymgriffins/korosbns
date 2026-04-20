import LearnHub from "@/components/marketing/learn-hub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn | Budget Ndio Story",
  description: "Explore interactive stories, articles, and videos to understand Kenya's budget and fiscal policy.",
};

const LearnPage = () => {
  return <LearnHub />;
};

export default LearnPage;
