import { redirect } from "next/navigation";
import { studiosEvidenceData } from "@/data/studios-evidence";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = studiosEvidenceData.getProjectBySlug(id);
  if (project) {
    redirect(`/bns-studio/${project.slug}`);
  }
  redirect("/work");
}
