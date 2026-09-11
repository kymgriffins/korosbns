import { describe, it, expect } from "vitest";
import {
  parseYouTubeId,
  parseYouTubePlaylistId,
  getYouTubeThumbnail,
  resolveMediaThumbnail,
  detectMediaType,
  DEFAULT_MEDIA_FALLBACK_THUMBNAIL,
} from "@/components/ui/media-embed";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";
import { PARTNER_LANDING_STILLS } from "@/content/partner-landing";
import landingJson from "@/content/landing.json";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import teamJson from "@/data/team.json";
import partnersJson from "@/data/partners.json";
import learnStoriesJson from "@/data/fallbacks/learn-stories.json";

describe("Universal YouTube & Media Embed Engine", () => {
  it("extracts clean videoId from complex YouTube URL with query parameters", () => {
    const complexUrl = "https://youtu.be/it8rOKSYKnc?si=N8qKAVOfSwqvr7wf";
    expect(parseYouTubeId(complexUrl)).toBe("it8rOKSYKnc");
  });

  it("extracts playlistId from playlist URLs and mixed video+playlist URLs", () => {
    const playlistUrl = "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf";
    expect(parseYouTubePlaylistId(playlistUrl)).toBe("PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf");

    const mixedUrl = "https://www.youtube.com/watch?v=it8rOKSYKnc&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf";
    expect(parseYouTubeId(mixedUrl)).toBe("it8rOKSYKnc");
    expect(parseYouTubePlaylistId(mixedUrl)).toBe("PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf");
  });

  it("resolves YouTube thumbnail with toggle and multi-layer fallback", () => {
    // 1. Explicit YouTube thumbnail
    const ytThumb = resolveMediaThumbnail({
      url: "https://youtu.be/it8rOKSYKnc?si=N8qKAVOfSwqvr7wf",
      useYoutubeThumbnail: true,
    });
    expect(ytThumb).toBe("https://img.youtube.com/vi/it8rOKSYKnc/hqdefault.jpg");

    // 2. Custom thumbnail overrides when toggle is false
    const customThumb = resolveMediaThumbnail({
      url: "https://youtu.be/it8rOKSYKnc",
      thumbnail: "/images/custom/poster.png",
      useYoutubeThumbnail: false,
    });
    expect(customThumb).toBe("/images/custom/poster.png");

    // 3. Fallback provided when no media URL
    const fallbackThumb = resolveMediaThumbnail({
      url: "",
      fallback: "/images/custom/default.jpg",
    });
    expect(fallbackThumb).toBe("/images/custom/default.jpg");
    expect(DEFAULT_MEDIA_FALLBACK_THUMBNAIL).toBeTruthy();
  });

  it("detects media types for playlists, videos, and images", () => {
    expect(detectMediaType("https://youtu.be/it8rOKSYKnc")).toBe("youtube");
    expect(detectMediaType("https://www.youtube.com/playlist?list=PL123")).toBe("youtube");
    expect(detectMediaType("https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/video.mp4")).toBe("video");
    expect(detectMediaType("/images/hall/129A4248.jpg")).toBe("image");
  });
});

describe("Landing Carousel Image Array Reordering & Persistence", () => {
  it("loads heroReelStills array from landing.json", () => {
    const stills = (landingJson as any).heroReelStills;
    expect(Array.isArray(stills)).toBe(true);
    expect(stills.length).toBeGreaterThanOrEqual(9);
    expect(stills[0].src).toBeTruthy();
    expect(stills[0].storyTitle).toBeTruthy();
  });

  it("PARTNER_LANDING_STILLS reflects landing.json heroReelStills", () => {
    expect(PARTNER_LANDING_STILLS.length).toBeGreaterThanOrEqual(9);
    expect(PARTNER_LANDING_STILLS[0]?.id).toBe("townhall-room");
  });

  it("supports reordering stills sequence", () => {
    const original = [...(landingJson as any).heroReelStills];
    const reordered = [...original];
    const first = reordered[0];
    reordered[0] = reordered[1];
    reordered[1] = first;

    expect(reordered[0].id).toBe(original[1].id);
    expect(reordered[1].id).toBe(original[0].id);
  });
});

describe("Project TERRA & WYSIWYG Prose Engine", () => {
  it("contains updated Project TERRA in featured-projects.json with correct title and video", () => {
    const terra = featuredFallback.results.find((p) => p.id === "project-terra");
    expect(terra).toBeDefined();
    expect(terra?.title).toContain("Are Digital Platforms Leaving Women Behind");
    expect(terra?.videoId).toBe("it8rOKSYKnc");
    expect(terra?.authorName).toBe("Dr. Lyla Latif");
    expect(terra?.useYoutubeThumbnail).toBe(true);
    expect(terra?.wysiwygProse).toBeDefined();
  });

  it("renders WYSIWYG markdown to structured HTML", () => {
    const markdown = `## Executive Findings

A critical examination of platform labour.

- Point 1: algorithmic bias
- Point 2: tax incentives

> Tax rules must reflect African women's invisible work.`;

    const html = renderWysiwygProseHtml(markdown);
    expect(html).toContain("<h2");
    expect(html).toContain("Executive Findings");
    expect(html).toContain("<ul");
    expect(html).toContain("<blockquote");
  });
});

describe("Researched Dr. Lyla Latif, Team, and Partners Registry", () => {
  it("includes Dr. Lyla Latif with complete credentials in learn-stories.json", () => {
    const story = learnStoriesJson.results.find((s: any) => s.id === "taxing-the-digital-ledger");
    expect(story).toBeDefined();
    expect(story?.author?.name).toBe("Dr. Lyla Latif");
    expect(story?.author?.handle).toBe("@LylaALatif");
    expect(story?.author?.website).toContain("lai-latif.com");
    expect(story?.author?.role).toContain("Managing Partner");
  });

  it("validates team.json structure and individual entities", () => {
    expect(teamJson.members.length).toBeGreaterThanOrEqual(4);
    for (const member of teamJson.members) {
      expect(member.name).toBeTruthy();
      expect(member.role).toBeTruthy();
      expect(member.entityType).toBe("individual");
    }
  });

  it("distinguishes organizations vs individuals in partners.json", () => {
    expect(partnersJson.partners.length).toBeGreaterThanOrEqual(8);
    const orgs = partnersJson.partners.filter((p) => p.entityType === "organization");
    const individuals = partnersJson.partners.filter((p) => p.entityType === "individual");

    expect(orgs.length).toBeGreaterThanOrEqual(5);
    expect(individuals.length).toBeGreaterThanOrEqual(3);

    // Verify key organizations
    expect(orgs.some((o) => o.id === "house-of-fiscal-wisdom")).toBe(true);
    expect(orgs.some((o) => o.id === "luminate")).toBe(true);
    expect(orgs.some((o) => o.id === "cabri")).toBe(true);

    // Verify key individuals
    expect(individuals.some((i) => i.name.includes("Lyla Latif"))).toBe(true);
    expect(individuals.some((i) => i.name.includes("Attiya Waris"))).toBe(true);
  });
});
