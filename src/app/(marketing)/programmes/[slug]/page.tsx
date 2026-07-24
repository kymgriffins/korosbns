import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildPageMetadata } from "@/utils/page-metadata";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import { getProgramme, PROGRAMMES } from "@/constants/programmes-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROGRAMMES.filter((p) => p.slug !== "studios").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "studios") {
    return buildPageMetadata({
      title: "BNS Studios | Impact Content & Storytelling, Kenya",
      description:
        "Commissioned podcasts, documentaries, and campaigns for governments, funders & CSOs — every project helps fund Kenya's leading youth budget platform.",
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
  if (slug === "studios") redirect("/bns-studio");
  const programme = getProgramme(slug);
  if (!programme || programme.slug === "studios") notFound();
  return <ProgrammeDetail programme={programme} />;
}
