import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import HulyClient from "./HulyClient";

export const metadata: Metadata = generateMetadata({
  title: "Huly — Midnight Command Center",
  description:
    "Experience Huly: a civic workspace for budget narratives, public finance audits, and youth leadership tools built for Kenya.",
  noIndex: false,
});

export default function HulyPage() {
  return <HulyClient />;
}
