import { redirect } from "next/navigation";
import { fetchLearningEditionByUnitYearServer } from "@/lib/learning-units";
import { Routes } from "@/constants/routes";

export const revalidate = 3600;

export default async function LearnUnitEditionPage({
  params,
}: {
  params: Promise<{ unitSlug: string; year: string }>;
}) {
  const { unitSlug, year } = await params;
  const edition = await fetchLearningEditionByUnitYearServer(unitSlug, year).catch(() => null);
  if (!edition?.slug) {
    redirect(Routes.Learn);
  }
  redirect(Routes.LearnPath(edition.slug));
}
