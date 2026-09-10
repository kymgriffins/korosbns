import { describe, expect, it } from "vitest";
import {
  PARTNER_HERO_PROGRAMME_LINES,
  PARTNER_LANDING_STILLS,
  PARTNER_PROGRAMME_EXPLAINS,
  PARTNER_PROGRAMME_VOCAB,
} from "@/content/partner-landing";

/**
 * Copy audit — hero moments, programme names, and section ledes must not fight.
 */
describe("partner landing copy audit", () => {
  it("keeps section titles locked to the shared vocabulary phrases", () => {
    for (const explain of PARTNER_PROGRAMME_EXPLAINS) {
      expect(explain.title).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].phrase);
      expect(explain.eyebrow).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].label);
      expect(explain.href).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].href);
    }
  });

  it("keeps hero programme anchors as names only (no competing taglines)", () => {
    expect(PARTNER_HERO_PROGRAMME_LINES).toHaveLength(3);
    for (const line of PARTNER_HERO_PROGRAMME_LINES) {
      expect(line.label).toBe(PARTNER_PROGRAMME_VOCAB[line.slug].label);
      expect(line).not.toHaveProperty("line");
      expect(line).not.toHaveProperty("phrase");
    }
  });

  it("uses one lede per programme with no problem/how fields", () => {
    for (const explain of PARTNER_PROGRAMME_EXPLAINS) {
      expect(explain.lede.trim().length).toBeGreaterThan(40);
      expect(explain.lede.trim().length).toBeLessThan(280);
      expect(explain).not.toHaveProperty("problem");
      expect(explain).not.toHaveProperty("how");
      expect(explain).not.toHaveProperty("why");
    }
  });

  it("keeps hero story copy observational — no investment asks or programme pitches", () => {
    const banned = [
      /invest/i,
      /partner on/i,
      /fund against/i,
      /co-fund/i,
      /national budget intelligence/i,
      /county delivery verification/i,
      /newsroom scrutiny/i,
    ];
    for (const still of PARTNER_LANDING_STILLS) {
      for (const pattern of banned) {
        expect(still.storyTitle).not.toMatch(pattern);
        expect(still.storyLine).not.toMatch(pattern);
      }
      expect(still.storyTitle.split(" ").length).toBeLessThanOrEqual(6);
      expect(still.storyLine.length).toBeLessThan(120);
    }
  });

  it("does not repeat the same story title across slides", () => {
    const titles = PARTNER_LANDING_STILLS.map((s) => s.storyTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses local event photography — no YouTube hqdefault covers", () => {
    for (const still of PARTNER_LANDING_STILLS) {
      expect(still.src.startsWith("/images/")).toBe(true);
      expect(still.src).not.toMatch(/ytimg\.com|hqdefault/);
    }
    const ids = PARTNER_LANDING_STILLS.map((s) => s.id);
    for (const required of [
      "maingi-afrodad",
      "wajackoyah-afrodad",
      "latif-launch",
      "movine-floor",
      "townhall-room",
    ]) {
      expect(ids).toContain(required);
    }
  });

  it("aligns CTA vocabulary with the three programme phrases", () => {
    const phrases = Object.values(PARTNER_PROGRAMME_VOCAB).map((p) =>
      p.phrase.toLowerCase(),
    );
    expect(phrases).toEqual([
      "national budget intelligence",
      "county delivery verification",
      "newsroom scrutiny",
    ]);
  });
});
