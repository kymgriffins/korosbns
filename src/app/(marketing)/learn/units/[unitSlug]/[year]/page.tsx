import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";
import { learningData } from "@/data/learning";
import type { LearningEditionDetail } from "@/lib/learning-units";

export const revalidate = 3600;

export default async function LearnUnitEditionPage({
  params,
}: {
  params: Promise<{ unitSlug: string; year: string }>;
}) {
  const { unitSlug, year } = await params;
  const edition = await learningData.courses.fetchByUnitYear(unitSlug, year) as LearningEditionDetail | null;
  if (!edition?.slug) {
    redirect(Routes.Learn);
  }
  redirect(Routes.LearnPath(edition.slug));
}
