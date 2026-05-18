import { Metadata } from "next";
import { generateMetadata } from "@/utils";
import SequelClient from "./SequelClient";

export const metadata: Metadata = generateMetadata({
  title: "Sequel — Budget Ndio Story",
  description: "An immersive, high-end visual showcase translating the architectural blueprint of Kenya's budgets into dramatic editorial storytelling.",
  noIndex: false,
});

export default function SequelPage() {
  return <SequelClient />;
}
