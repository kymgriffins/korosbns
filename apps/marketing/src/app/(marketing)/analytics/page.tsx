import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Analytics | Budget Ndio Story",
  description:
    "Public web analytics for Budget Ndio Story — site traffic, device usage, uptime, and civic engagement metrics. Transparent reporting on our digital reach and impact.",
  path: "/analytics",
});

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
