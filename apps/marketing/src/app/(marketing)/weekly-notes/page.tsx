import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { WeeklyNotesClient } from "./weekly-notes-client";

export const metadata: Metadata = buildPageMetadata({
  title: "Weekly Notes | Budget Ndio Story",
  description:
    "Follow our weekly journey as we break down Kenya's budget process, share insights from the National Assembly, and track fiscal policy developments.",
  path: "/weekly-notes",
});

export default function WeeklyNotesPage() {
  return <WeeklyNotesClient />;
}
