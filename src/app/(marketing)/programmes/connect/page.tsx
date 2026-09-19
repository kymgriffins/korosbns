import type { Metadata } from "next";
import { ProgrammePage } from "@/components/clean-slate/programme-page";
import { getProgrammeContent } from "@/data/marketing";

const content = getProgrammeContent("connect");
export const metadata: Metadata = {
  title: content?.seoTitle,
  description: content?.seoDescription,
  alternates: { canonical: "https://budgetndiostory.org/programmes/connect" },
};

export default function BNSConnectPage() {
  return <ProgrammePage slug="connect" />;
}
