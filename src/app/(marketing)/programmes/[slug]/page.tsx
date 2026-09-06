import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import { getProgramme, PROGRAMMES } from "@/constants/programmes-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "studios") {
    return buildPageMetadata({
      title: "Desk 04: BNS Studios | Commercial Craft Subsidizing Citizen Audits",
      description:
        "The sovereign economic model of Budget Ndio Story: how independent commercial creative production bankrolls citizen budget audits across 47 counties.",
      path: "/programmes/studios",
    });
  }
  const programme = getProgramme(slug);
  if (!programme) {
    return buildPageMetadata({
      title: "Programmes | Budget Ndio Story",
      description: "Explore Budget Ndio Story programmes.",
      path: "/programmes",
    });
  }
  return buildPageMetadata({
    title: programme.seoTitle,
    description: programme.seoDescription,
    path: `/programmes/${programme.slug}`,
  });
}

export default async function ProgrammeSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();
  return <ProgrammeDetail programme={programme} />;
}
