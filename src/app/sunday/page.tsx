import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import SundayClient from "./SundayClient";

export const metadata: Metadata = generateMetadata({
  title: "Sunday — Budget Ndio Story",
  description: "A stark, high-contrast visual system translating Kenya's public budgets into clear, actionable stories with monochromatic precision and neon pulses.",
  noIndex: false,
});

export default function SundayPage() {
  return <SundayClient />;
}
