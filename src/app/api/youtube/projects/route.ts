import { NextResponse } from "next/server";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import {
  getFeaturedProjects,
  refreshFeaturedProjectsFromYoutube,
  setFeaturedProjects,
} from "@/data/featured-projects";
import { withFallback } from "@/data/adapter";

/**
 * Featured partner projects — oEmbed JSON + channel RSS, with JSON seed fallback.
 * Does not touch Learn Hub content-videos.json.
 */
export async function GET() {
  const projects = await withFallback(
    "featured-projects-api",
    async () => {
      const live = await refreshFeaturedProjectsFromYoutube();
      setFeaturedProjects(live);
      return live;
    },
    () => getFeaturedProjects(),
    {
      accept: (result) =>
        Array.isArray(result) &&
        result.length > 0 &&
        result.every((p) => Boolean(p.videoId && p.thumbnail && p.title)),
    },
  );

  return NextResponse.json({
    projects,
    count: projects.length,
    provenance: featuredFallback.provenance,
    source: "featured-projects.json|youtube-oembed+rss",
  });
}
