import type { Metadata } from "next";
import { ProgrammePage } from "@/components/clean-slate/programme-page";
import { getProgrammeContent } from "@/data/marketing";

const content = getProgrammeContent("studios");

export const metadata: Metadata = {
  title: content?.seoTitle,
  description: content?.seoDescription,
  alternates: { canonical: "https://budgetndiostory.org/programmes/studios" },
};

export default function StudiosPage() {
  return <ProgrammePage slug="studios" />;
}
