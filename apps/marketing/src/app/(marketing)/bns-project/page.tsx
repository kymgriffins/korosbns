import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSProjectClient } from "@/components/project/BNSProjectClient";

export const metadata: Metadata = buildPageMetadata({
  title: "BNS Project | Budget Ndio Story",
  description:
    "Discover the Budget Ndio Story project — a youth-led civic initiative transforming Kenya's budget process into accessible narratives for democratic participation and fiscal literacy.",
  path: "/bns-project",
});

export default function BNSProjectPage() {
  return <BNSProjectClient />;
}
