import React from "react";
import type { Metadata } from "next";
import { ObamaOrgShowcase } from "@/components/marketing/obama-org-showcase";
import { buildPageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Civic Movement Platform · Obama.org Archetype | Budget Ndio Story",
  description:
    "A component-driven, accessible digital platform showcasing people-powered accountability, citizen assemblies, and public wealth tracking across Kenya.",
  path: "/obama-org",
});

export const revalidate = 60;

export default function ObamaOrgPage() {
  return <ObamaOrgShowcase />;
}
