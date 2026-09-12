import { NextResponse } from "next/server";
import { getLiveFeaturedProjects } from "@/lib/cms-live-data";

/**
 * Featured partner projects — live Cloudflare R2 / CMS data with fallback.
 */
export async function GET() {
  const live = await getLiveFeaturedProjects();
  const projects = (live as any).results || (live as any).projects || [];

  return NextResponse.json({
    projects,
    count: projects.length,
    provenance: (live as any).provenance,
    source: "cms/featured-projects.json",
  });
}
