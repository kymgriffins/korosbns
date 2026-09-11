import { describe, it, expect } from "vitest";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";
import { resolveProjectId } from "@/lib/programme-project-ids";
import { R2_CONFIG, getMediaTypeFromKey } from "@/lib/r2-storage";

describe("Blogs as Projects & Universal Editorial Integration", () => {
  it("featured-projects contains valid seed stories with rich prose and media", () => {
    expect(featuredFallback.results).toBeDefined();
    expect(featuredFallback.results.length).toBeGreaterThan(0);

    for (const story of featuredFallback.results) {
      expect(story.id).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.url || story.videoId).toBeTruthy();
      expect(story.thumbnail).toBeTruthy();
    }
  });

  it("resolves Project TERRA and arbitrary project slugs consistently", () => {
    expect(resolveProjectId("project-terra")).toBe("project-terra");
    expect(resolveProjectId("terra")).toBe("project-terra");
    expect(resolveProjectId("illicit-financial-flows-benin-cabo-verde")).toBe("illicit-financial-flows-benin-cabo-verde");
  });

  it("renders rich WYSIWYG markdown prose into clean, safe semantic HTML", () => {
    const rawProse = `## Deep Dive: Fiscal Infrastructure
Platform workers face algorithmic exclusion.

> Key Evidence: Monograph Red Flags (House of Fiscal Wisdom).

- Finding 1: Classification mismatch
- Finding 2: Tax holidays foregone

[Visit Lai-Latif](https://lai-latif.com)`;

    const html = renderWysiwygProseHtml(rawProse);

    expect(html).toContain("<h2");
    expect(html).toContain("Deep Dive: Fiscal Infrastructure");
    expect(html).toContain("<blockquote");
    expect(html).toContain("Monograph Red Flags");
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain("lai-latif.com");
    expect(html).toContain("Visit Lai-Latif");
  });

  it("Project TERRA in featured-projects has full WYSIWYG prose and author attribution", () => {
    const terra = featuredFallback.results.find((s) => s.id === "project-terra");
    expect(terra).toBeDefined();
    expect(terra?.authorName).toBe("Dr. Lyla Latif");
    expect(terra?.wysiwygProse).toBeDefined();
    expect(terra?.wysiwygProse).toContain("Algorithmic Gender Bias");
  });
});

describe("Cloudflare Ecosystem Configuration & Storage Integrity", () => {
  it("has valid Cloudflare R2 bucket and public domain configuration", () => {
    expect(R2_CONFIG.bucketName).toBe("bns");
    expect(R2_CONFIG.accountId).toBeTruthy();
    expect(R2_CONFIG.publicDomain).toContain("r2.dev");
  });

  it("classifies R2 keys for images, videos, and JSON accurately", () => {
    expect(getMediaTypeFromKey("video.mp4").mediaType).toBe("video");
    expect(getMediaTypeFromKey("banner.webp").mediaType).toBe("image");
    expect(getMediaTypeFromKey("briefing.pdf").mediaType).toBe("document");
    expect(getMediaTypeFromKey("cms/featured-projects.json").mediaType).toBe("other");
  });
});
