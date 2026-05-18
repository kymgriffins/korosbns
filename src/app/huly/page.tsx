import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import HulyClient from "./HulyClient";

export const metadata: Metadata = generateMetadata({
  title: "Huly — Midnight Command Center",
  description: "Experience Huly - the luminous Midnight Command Center. Empowering civic narrative, public finance audits, and youth leadership in Kenya through state-of-the-art interactive workspaces.",
  noIndex: false,
});

export default function HulyPage() {
  return <HulyClient />;
}
