import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BUDGET_GLOSSARY, GLOSSARY_CATEGORIES } from "@/data/budget-glossary";
import { HELP_FAQS, HELP_TOPICS } from "@/data/help-faq-data";
import { NAV_LINKS, footerLinks } from "@/constants/links";
import { Routes } from "@/constants/routes";
import { shouldShowMarketingFooter } from "@/lib/marketing-layout";
import { categorizePath } from "@/lib/page-categories";

describe("Cookie Consent Copy & Banner Compliance", () => {
  it("matches the exact requested cookie consent copy with privacy policy and terms links", () => {
    const file = join(
      process.cwd(),
      "src/components/shadcn-space/blocks/cookie-consent-01/index.tsx"
    );
    const content = readFileSync(file, "utf8");

    // Must contain the user's required wording
    expect(content).toContain(
      "This website uses cookies to improve your experience and analyze site usage. See our"
    );
    expect(content).toContain("Privacy Policy");
    expect(content).toContain("Terms & Conditions");
    expect(content).toContain("to learn more.");
    expect(content).toContain('href="/privacy"');
    expect(content).toContain('href="/terms"');
  });

  it("is enabled in CookieConsentWrapper", () => {
    const file = join(
      process.cwd(),
      "src/components/global/cookie-consent-wrapper.tsx"
    );
    const content = readFileSync(file, "utf8");
    expect(content).toContain("<CookieConsent />");
    expect(content).not.toContain("return null;");
  });
});

describe("Budget Glossary Specifications", () => {
  it("has comprehensive verified budget terms", () => {
    expect(BUDGET_GLOSSARY.length).toBeGreaterThanOrEqual(30);
  });

  it("ensures all glossary items have required fields and unique slugs", () => {
    const slugs = new Set<string>();
    for (const entry of BUDGET_GLOSSARY) {
      expect(entry.slug).toBeTruthy();
      expect(slugs.has(entry.slug)).toBe(false);
      slugs.add(entry.slug);

      expect(entry.term).toBeTruthy();
      expect(entry.shortDefinition.length).toBeGreaterThan(20);
      expect(entry.fullExplanation.length).toBeGreaterThan(40);
      expect(entry.category).toBeTruthy();
    }
  });

  it("covers all expected categories", () => {
    const categories = new Set(BUDGET_GLOSSARY.map((e) => e.category));
    expect(categories.has("national")).toBe(true);
    expect(categories.has("county")).toBe(true);
    expect(categories.has("debt-fiscal")).toBe(true);
    expect(categories.has("oversight")).toBe(true);
    expect(categories.has("legal")).toBe(true);
  });

  it("is linked strictly in footer only (NOT in top navigation)", () => {
    // Top navigation check
    const inTopNav = NAV_LINKS.some(
      (link) => (link.href as string) === "/glossary" || link.label.toLowerCase().includes("glossary")
    );
    expect(inTopNav).toBe(false);

    // Footer check
    const inFooter = footerLinks.resources.some(
      (link) => link.href === "/glossary" || link.label.includes("Glossary")
    );
    expect(inFooter).toBe(true);
  });
});

describe("Help Center & FAQ (/help)", () => {
  it("covers all 4 BNS core programmes", () => {
    const programmeFaqs = HELP_FAQS.filter((f) => f.topicId === "programmes");
    expect(programmeFaqs.length).toBeGreaterThanOrEqual(4);

    const questionsJoined = programmeFaqs.map((f) => f.question + " " + f.answer).join(" ");
    expect(questionsJoined).toMatch(/Mashinani/i);
    expect(questionsJoined).toMatch(/Connect/i);
    expect(questionsJoined).toMatch(/Wanahabari/i);
    expect(questionsJoined).toMatch(/Studios/i);
  });

  it("covers Kakamega, Kilifi, Nakuru, and Wajir under Mashinani", () => {
    const mashinaniFaq = HELP_FAQS.find((f) => f.id === "prog-mashinani");
    expect(mashinaniFaq).toBeDefined();
    expect(mashinaniFaq?.answer).toContain("Kakamega");
    expect(mashinaniFaq?.answer).toContain("Kilifi");
    expect(mashinaniFaq?.answer).toContain("Nakuru");
    expect(mashinaniFaq?.answer).toContain("Wajir");
  });

  it("includes all 6 primary help topics", () => {
    const topicIds = HELP_TOPICS.map((t) => t.id);
    expect(topicIds).toContain("programmes");
    expect(topicIds).toContain("budget");
    expect(topicIds).toContain("learning");
    expect(topicIds).toContain("reports");
    expect(topicIds).toContain("studios");
    expect(topicIds).toContain("community");
  });

  it("defines Help and Glossary in Routes constant", () => {
    expect(Routes.Help).toBe("/help");
    expect(Routes.Glossary).toBe("/glossary");
  });
});

describe("Route and Layout Configuration", () => {
  it("enables marketing footer for /help and /glossary", () => {
    expect(shouldShowMarketingFooter("/help")).toBe(true);
    expect(shouldShowMarketingFooter("/glossary")).toBe(true);
  });

  it("categorizes /help and /glossary as marketing pages", () => {
    expect(categorizePath("/help")).toBe("marketing");
    expect(categorizePath("/glossary")).toBe("marketing");
  });
});
