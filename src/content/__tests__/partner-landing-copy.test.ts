import { describe, expect, it } from "vitest";
import {
  PARTNER_FEATURED_INTRO,
  PARTNER_HERO_NARRATIVE,
  PARTNER_HERO_PROGRAMME_LINES,
  PARTNER_LANDING_CTA,
  PARTNER_LANDING_STILLS,
  PARTNER_LANDING_THESIS,
  PARTNER_PROGRAMME_EXPLAINS,
  PARTNER_PROGRAMME_VOCAB,
} from "@/content/partner-landing";

/**
 * Copy audit - thesis → who/how → three bets → evidence → CTA must not fight.
 */
describe("partner landing copy audit", () => {
  it("keeps a short brand thesis and who/how path to proof", () => {
    expect(PARTNER_LANDING_THESIS.title.length).toBeLessThan(80);
    expect(PARTNER_LANDING_THESIS.body.length).toBeGreaterThan(80);
    expect(PARTNER_LANDING_THESIS.body.length).toBeLessThan(420);
    expect(PARTNER_LANDING_THESIS.method.length).toBeGreaterThan(5);
    expect(PARTNER_LANDING_THESIS.body).not.toMatch(/\d{1,3}(?:,\d{3})+\s*(?:people|citizens|viewers)/i);
  });

  it("keeps a fixed hero narrative within bounds", () => {
    const { eyebrow, title, lede } = PARTNER_HERO_NARRATIVE;
    expect(eyebrow.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(120);
    const wordCount = lede.trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(60);
    const askBan = [/invest/i, /partner on/i, /fund against/i, /co-fund/i];
    for (const pattern of askBan) {
      expect(title).not.toMatch(pattern);
      expect(lede).not.toMatch(pattern);
    }
    expect(lede).not.toMatch(/\d{1,3}(?:,\d{3})+\s*(?:people|citizens|viewers)/i);
  });

  it("keeps section titles locked to the shared vocabulary phrases", () => {
    for (const explain of PARTNER_PROGRAMME_EXPLAINS) {
      expect(explain.title).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].phrase);
      expect(explain.eyebrow).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].label);
      expect(explain.href).toBe(PARTNER_PROGRAMME_VOCAB[explain.slug].href);
    }
  });

  it("numbers the three programmes and pairs stakes with honest success lines", () => {
    expect(PARTNER_PROGRAMME_EXPLAINS.map((e) => e.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
    for (const explain of PARTNER_PROGRAMME_EXPLAINS) {
      expect(explain.lede.trim().length).toBeGreaterThan(40);
      expect(explain.lede.trim().length).toBeLessThan(280);
      expect(explain.success.trim().length).toBeGreaterThan(40);
      expect(explain.success.trim().length).toBeLessThan(280);
      expect(explain.success.toLowerCase()).toMatch(/success looks like/);
      expect(explain.ctaLabel).toBe("Read more");
      expect(explain).not.toHaveProperty("problem");
      expect(explain).not.toHaveProperty("how");
      expect(explain).not.toHaveProperty("why");
      expect(explain.lede).not.toMatch(/\d{1,3}(?:,\d{3})+\s*(?:people|citizens|viewers)/i);
      expect(explain.success).not.toMatch(/\d{1,3}(?:,\d{3})+\s*(?:people|citizens|viewers)/i);
    }
  });

  it("keeps hero programme anchors as names only (no competing taglines)", () => {
    expect(PARTNER_HERO_PROGRAMME_LINES).toHaveLength(3);
    for (const line of PARTNER_HERO_PROGRAMME_LINES) {
      const vocab = PARTNER_PROGRAMME_VOCAB[line.slug as keyof typeof PARTNER_PROGRAMME_VOCAB];
      if (vocab) {
        expect(line.label).toBe(vocab.label);
      } else {
        expect(line.label).toBeDefined();
      }
      expect(line).not.toHaveProperty("line");
      expect(line).not.toHaveProperty("phrase");
    }
  });

  it("keeps rotating still captions observational - arc lives in PARTNER_HERO_NARRATIVE", () => {
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

  it("uses local event photography - no YouTube hqdefault covers", () => {
    for (const still of PARTNER_LANDING_STILLS) {
      expect(still.src.startsWith("/images/") || still.src.startsWith("http")).toBe(true);
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

  it("aligns CTA and featured intro with the three programme phrases", () => {
    const phrases = Object.values(PARTNER_PROGRAMME_VOCAB).map((p) =>
      p.phrase.toLowerCase(),
    );
    expect(phrases).toEqual([
      "national budget intelligence",
      "county delivery verification",
      "newsroom scrutiny",
    ]);
    const ctaBlob = `${PARTNER_LANDING_CTA.title} ${PARTNER_LANDING_CTA.description}`.toLowerCase();
    for (const phrase of phrases) {
      expect(ctaBlob).toContain(phrase);
    }
    expect(PARTNER_FEATURED_INTRO.eyebrow.toLowerCase()).toMatch(/stories/);
    expect(PARTNER_FEATURED_INTRO.lede.toLowerCase()).toMatch(/afrodad|terra|red flags/);
    expect(PARTNER_FEATURED_INTRO.lede).not.toMatch(
      /\d{1,3}(?:,\d{3})+\s*(?:people|citizens|viewers)/i,
    );
  });
});
