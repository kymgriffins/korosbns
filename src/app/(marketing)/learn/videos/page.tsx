import VideosPage from "@/components/marketing/videos-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Budget Ndio Story",
  description: "Visual explainers and tutorials on Kenya's budget, BPS, and fiscal policy.",
};

const VideosRoute = () => {
  return <VideosPage />;
};

export default VideosRoute;
