import type { Metadata } from "next";
import { ProgrammePage } from "@/components/clean-slate/programme-page";
import { getProgrammeContent } from "@/data/marketing";

const content = getProgrammeContent("wanahabari-lab");

export const metadata: Metadata = {
  title: content?.seoTitle,
  description: content?.seoDescription,
  alternates: { canonical: "https://budgetndiostory.org/programmes/wanahabari-lab" },
};

export default function WanahabariLabPage() {
  return <ProgrammePage slug="wanahabari-lab" />;
}
