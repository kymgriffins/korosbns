import { describe, it, expect } from "vitest";
import {
  parseYouTubeId,
  parseVimeoId,
  detectMediaType,
} from "@/components/ui/media-embed";
import { getMediaTypeFromKey } from "@/lib/r2-storage";
import {
  createDefaultSection,
  ensurePageSections,
  type CustomPageItem,
  type SectionType,
} from "@/lib/headless-page-cms";

describe("Universal Media & Video Embed Parsing", () => {
  it("extracts YouTube video IDs from standard, short, and embed URLs", () => {
    expect(parseYouTubeId("https://www.youtube.com/watch?v=kWpY4K1uI20")).toBe("kWpY4K1uI20");
    expect(parseYouTubeId("https://youtu.be/kWpY4K1uI20")).toBe("kWpY4K1uI20");
    expect(parseYouTubeId("https://www.youtube.com/embed/kWpY4K1uI20")).toBe("kWpY4K1uI20");
    expect(parseYouTubeId("https://www.youtube.com/shorts/kWpY4K1uI20")).toBe("kWpY4K1uI20");
    expect(parseYouTubeId("https://example.com/not-youtube")).toBeNull();
    expect(parseYouTubeId("")).toBeNull();
  });

  it("extracts Vimeo video IDs accurately", () => {
    expect(parseVimeoId("https://vimeo.com/76979871")).toBe("76979871");
    expect(parseVimeoId("https://example.com/other")).toBeNull();
  });

  it("detects media types for videos, youtube links, and static images", () => {
    expect(detectMediaType("https://youtu.be/kWpY4K1uI20")).toBe("youtube");
    expect(detectMediaType("https://vimeo.com/76979871")).toBe("vimeo");
    expect(
      detectMediaType(
        "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/Calvina%20Praise%20Sovereign%20debt.mp4"
      )
    ).toBe("video");
    expect(detectMediaType("https://example.com/hero.webm")).toBe("video");
    expect(detectMediaType("/images/hero.jpg")).toBe("image");
    expect(detectMediaType("https://example.com/avatar.webp")).toBe("image");
  });

  it("classifies Cloudflare R2 bucket keys by media type correctly", () => {
    const video = getMediaTypeFromKey("BNS Studio  MYTH or FACT  game on budget.mp4");
    expect(video.mediaType).toBe("video");
    expect(video.mimeType).toBe("video/mp4");

    const webm = getMediaTypeFromKey("teaser.webm");
    expect(webm.mediaType).toBe("video");
    expect(webm.mimeType).toBe("video/webm");

    const image = getMediaTypeFromKey("infographic.png");
    expect(image.mediaType).toBe("image");
    expect(image.mimeType).toBe("image/png");

    const doc = getMediaTypeFromKey("national-debt-audit.pdf");
    expect(doc.mediaType).toBe("document");
    expect(doc.mimeType).toBe("application/pdf");
  });
});

describe("Dynamic Modular Page Sections Engine", () => {
  const ALL_SECTION_TYPES: SectionType[] = [
    "hero",
    "video_showcase",
    "stats_grid",
    "feature_cards",
    "narrative",
    "faq",
    "cta_banner",
  ];

  it("creates all 7 section types with enabled: true and rich defaults", () => {
    for (const type of ALL_SECTION_TYPES) {
      const section = createDefaultSection(type);
      expect(section.id).toBeDefined();
      expect(section.type).toBe(type);
      expect(section.enabled).toBe(true);

      if (type === "hero" || type === "cta_banner") {
        expect(section.buttons).toBeDefined();
        expect(section.buttons!.length).toBeGreaterThanOrEqual(1);
        expect(section.buttons![0].enabled).toBe(true);
      }

      if (type === "video_showcase") {
        expect(section.media).toBeDefined();
        expect(section.media!.url).toContain(".mp4");
      }

      if (type === "stats_grid" || type === "feature_cards" || type === "faq") {
        expect(section.items).toBeDefined();
        expect(section.items!.length).toBeGreaterThan(0);
      }
    }
  });

  it("ensures legacy custom pages synthesize full modular sections with backwards compatibility", () => {
    const legacyPage: CustomPageItem = {
      slug: "legacy-audit-page",
      title: "Legacy Audit Page",
      headline: "Legacy Forensic Audit",
      body: "Lede paragraph explaining the forensic audit.",
      content: "Paragraph 1\n\nParagraph 2",
      ctaLabel: "Download Report",
      ctaHref: "/reports/audit.pdf",
      secondaryLabel: "Explore Data",
      secondaryHref: "/data",
      stats: [
        { value: "47", label: "Counties" },
        { value: "KES 500B", label: "Audited" },
      ],
      published: true,
    };

    const sections = ensurePageSections(legacyPage);
    expect(sections.length).toBe(4); // Hero, Stats, Narrative, CTA Banner

    const hero = sections.find((s) => s.type === "hero");
    expect(hero).toBeDefined();
    expect(hero!.headline).toBe("Legacy Forensic Audit");
    expect(hero!.buttons).toHaveLength(2);
    expect(hero!.buttons![0].label).toBe("Download Report");
    expect(hero!.buttons![0].enabled).toBe(true);

    const stats = sections.find((s) => s.type === "stats_grid");
    expect(stats).toBeDefined();
    expect(stats!.items).toHaveLength(2);
    expect(stats!.items![0].value).toBe("47");

    const narrative = sections.find((s) => s.type === "narrative");
    expect(narrative).toBeDefined();
    expect(narrative!.content).toContain("Paragraph 1");

    const cta = sections.find((s) => s.type === "cta_banner");
    expect(cta).toBeDefined();
    expect(cta!.buttons![0].label).toBe("Download Report");
  });

  it("preserves explicitly defined modular sections without synthesizing", () => {
    const customModularPage: CustomPageItem = {
      slug: "modular-campaign",
      title: "Modular Campaign",
      headline: "Modular Headline",
      body: "Modular Body",
      published: true,
      sections: [
        {
          id: "custom-video",
          type: "video_showcase",
          enabled: true,
          headline: "Exclusive Investigation Reel",
          media: {
            type: "video",
            url: "https://pub-96ce2eba58694b1da7f540033bdaa464.r2.dev/one%20kenyan%20speaks%20unity%20.mp4",
          },
        },
      ],
    };

    const sections = ensurePageSections(customModularPage);
    expect(sections).toHaveLength(1);
    expect(sections[0].id).toBe("custom-video");
    expect(sections[0].type).toBe("video_showcase");
    expect(sections[0].media?.url).toContain("one%20kenyan%20speaks%20unity");
  });
});
