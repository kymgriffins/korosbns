import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProjectDetailClient } from "@/components/project/ProjectDetailClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Project Details | Budget Ndio Story",
  description: "Explore the milestones, timeline, and detailed breakdown of Budget Ndio Story initiatives.",
  path: "/bns-project",
});

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
