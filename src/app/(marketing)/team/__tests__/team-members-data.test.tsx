import { describe, it, expect } from "vitest";
import { team } from "@/data/org";
import {
  slugifyName,
  findMemberByParam,
  getMemberUsername,
  getMemberAliases,
} from "@/lib/team";
import { generateStaticParams, generateMetadata } from "../[username]/page";

const EXPECTED_LINKEDIN_SOURCES_OF_TRUTH: Record<string, string> = {
  "Millicent Makina": "https://www.linkedin.com/in/millicentmakina/",
  "James Maingi Mutinda": "https://www.linkedin.com/in/james-maingi-99b76615b/",
  "Movine Omondi": "https://www.linkedin.com/in/movine-omondi/",
  "Shem Odhiambo Ojunga": "https://www.linkedin.com/in/shem-ojunga-731860150/",
  "Peculiar Koros": "https://www.linkedin.com/in/peculiar-langat-24b704411/",
  "Nelly Maina": "https://www.linkedin.com/in/nelly-maina-a7963b210/",
  "Calvina Praise": "https://www.linkedin.com/in/calvinapraise/",
};

describe("Team Members Dataset & Dynamic Routing Integrity", () => {
  it("contains all 7 verified team members with complete data schemas", () => {
    expect(team.length).toBe(7);

    for (const member of team) {
      expect(member.name).toBeDefined();
      expect(member.name.trim().length).toBeGreaterThan(0);
      expect(member.role).toBeDefined();
      expect(member.role.trim().length).toBeGreaterThan(0);
      expect(member.image).toBeDefined();
      expect(member.description).toBeDefined();
      expect(member.bio).toBeDefined();
      expect(member.focusAreas).toBeDefined();
      expect(member.focusAreas?.length).toBeGreaterThan(0);
      expect(member.achievements).toBeDefined();
      expect(member.achievements?.length).toBeGreaterThan(0);
      expect(member.quote).toBeDefined();
      expect(member.socials?.linkedin).toBeDefined();
    }
  });

  it("verifies all member LinkedIn URLs exactly match the sources of truth", () => {
    for (const member of team) {
      const expectedUrl = EXPECTED_LINKEDIN_SOURCES_OF_TRUTH[member.name];
      expect(expectedUrl).toBeDefined();
      expect(member.socials?.linkedin).toBe(expectedUrl);
    }
  });

  it("generates valid static route params for every member", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(7);

    const expectedSlugs = [
      "millicent-makina",
      "james-maingi-mutinda",
      "movine-omondi",
      "shem-odhiambo-ojunga",
      "peculiar-koros",
      "nelly-maina",
      "calvina-praise",
    ];

    const generatedSlugs = params.map((p) => p.username);
    for (const expected of expectedSlugs) {
      expect(generatedSlugs).toContain(expected);
    }
  });

  it("resolves each member by param and aliases via findMemberByParam", () => {
    for (const member of team) {
      const slug = slugifyName(member.name);
      const foundBySlug = findMemberByParam(slug);
      expect(foundBySlug).toBeDefined();
      expect(foundBySlug?.name).toBe(member.name);

      const aliases = getMemberAliases(member);
      for (const alias of aliases) {
        const foundByAlias = findMemberByParam(alias);
        expect(foundByAlias).toBeDefined();
        expect(foundByAlias?.name).toBe(member.name);
      }
    }
  });

  it("returns undefined for non-existent member usernames", () => {
    expect(findMemberByParam("non-existent-user")).toBeUndefined();
    expect(findMemberByParam("unknown-slug-12345")).toBeUndefined();
  });

  it("generates correct SEO metadata for all members", async () => {
    for (const member of team) {
      const slug = slugifyName(member.name);
      const meta = await generateMetadata({ params: Promise.resolve({ username: slug }) });
      expect(meta.title).toBe(`${member.name} | Budget Ndio Story`);
      expect(meta.description).toBeDefined();
      expect(meta.openGraph?.images).toContain(member.image);
    }
  });

  it("returns fallback metadata for invalid member username", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ username: "does-not-exist" }),
    });
    expect(meta.title).toBe("Team Member Not Found");
  });
});
