import { describe, it, expect } from "vitest";
import { eventData } from "@/data/events";
import { studiosEvidenceData } from "@/data/studios-evidence";

describe("eventsData same-day separate events and aspect ratios", () => {
  it("includes both AFRODAD Debt Conference and Red Flags Book Launch as separate events on the same day", () => {
    const events = eventData.get();

    const afrodad = events.find((e) => e.id === "event-afrodad-debt-conference-2026");
    const bookLaunch = events.find((e) => e.id === "event-red-flags-book-launch");

    expect(afrodad).toBeDefined();
    expect(bookLaunch).toBeDefined();

    // Verify same date
    expect(afrodad?.starts_at.split("T")[0]).toBe("2026-08-14");
    expect(bookLaunch?.starts_at.split("T")[0]).toBe("2026-08-14");

    // Verify separate identities and programmes
    expect(afrodad?.id).not.toBe(bookLaunch?.id);
    expect(afrodad?.programme).toBe("connect");
    expect(bookLaunch?.programme).toBe("wanahabari-lab");

    // Verify aspect ratios
    expect(afrodad?.image_orientation).toBe("landscape");
    expect(bookLaunch?.image_orientation).toBe("portrait");
    expect(bookLaunch?.image_aspect_ratio).toBeCloseTo(1024 / 1534, 2);

    // Verify video on book launch
    expect(bookLaunch?.video_url).toContain("G5ddu4I6mNs");

    // Verify key speakers
    expect(afrodad?.key_speakers?.length).toBeGreaterThan(0);
    expect(bookLaunch?.key_speakers?.some((s) => s.name.includes("Lyla Latif"))).toBe(true);
  });
});

describe("studiosEvidenceData multilingual and pan-african productions", () => {
  it("includes CABRI as a unified multilingual production with English and French tracks", () => {
    const cabri = studiosEvidenceData.getProjectBySlug("cabri-digital-pfm-reforms");
    expect(cabri).toBeDefined();
    expect(cabri?.multilingual?.isMultilingual).toBe(true);
    expect(cabri?.multilingual?.languages).toHaveLength(2);

    const en = cabri?.multilingual?.languages.find((l) => l.code === "en");
    const fr = cabri?.multilingual?.languages.find((l) => l.code === "fr");

    expect(en?.videoId).toBe("kWpY4K1uI20");
    expect(en?.countries).toContain("Kenya");
    expect(fr?.videoId).toBe("GPebC3wHTus");
    expect(fr?.countries).toContain("Bénin");
    expect(cabri?.organization.name).toContain("CABRI");
  });

  it("includes HOFW Illicit Financial Flows forensic investigation", () => {
    const iff = studiosEvidenceData.getProjectBySlug("illicit-financial-flows-benin-cabo-verde");
    expect(iff).toBeDefined();
    expect(iff?.organization.slug).toBe("house-of-fiscal-wisdom");
    expect(iff?.media.videoUrl).toContain("G5ddu4I6mNs");
    expect(iff?.programmeSlug).toBe("wanahabari-lab");
  });
});
