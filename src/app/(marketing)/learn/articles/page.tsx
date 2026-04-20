import ArticlesPage from "@/components/marketing/articles-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Budget Ndio Story",
  description: "In-depth articles and analysis on Kenya's budget, fiscal policy, and public finance.",
};

const ArticlesRoute = () => {
  return <ArticlesPage />;
};

export default ArticlesRoute;
