import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import { CIVIC_PROGRAMMES, getProgramme } from "@/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CIVIC_PROGRAMMES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "studios") {
    return buildPageMetadata({
      title: "BNS Studio | Budget Ndio Story",
      description:
        "Commissioned evidence production that funds Budget Ndio Story programmes.",
      path: "/bns-studio",
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
  if (slug === "studios") {
    redirect("/bns-studio");
  }
  const programme = getProgramme(slug);
  if (!programme || programme.slug === "studios") notFound();
  return <ProgrammeDetail programme={programme} />;
}
