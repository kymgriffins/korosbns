import { describe, it, expect } from "vitest";
import { projectsData } from "@/data/projects";
import { resolveProjectId } from "@/lib/programme-project-ids";
import {
  assertProjectPageReady,
  generateProjectWhitePaper,
  hasSubstantialWhitePaper,
  MIN_WHITE_PAPER_CHARS,
} from "@/lib/project-whitepaper";
import { getProjectTranscript } from "@/data/project-transcripts";

describe("project white-paper coverage", () => {
  it(`gives every visible project a body of at least ${MIN_WHITE_PAPER_CHARS} chars`, () => {
    const all = projectsData.get();
    expect(all.length).toBeGreaterThan(5);

    for (const project of all) {
      expect(
        assertProjectPageReady(project.wysiwygProse),
        `${project.id} lacks white-paper documentation`,
      ).toBe(true);
    }
  });

  it("resolves every featured project href to a loadable dossier", () => {
    for (const project of projectsData.getFeatured()) {
      const pathId = project.href.replace(/^\/(bns-project|bns-studio|projects)\//, "");
      const found = projectsData.getById(pathId) || projectsData.getById(project.id);
      expect(found, `featured ${project.id} href ${project.href} is unresolved`).toBeTruthy();
      expect(hasSubstantialWhitePaper(found?.wysiwygProse)).toBe(true);
    }
  });

  it("maps legacy project aliases to live pages (no dead redirects)", () => {
    const aliases = [
      "proj-003",
      "nakuru-citizen-baraza",
      "proj-004",
      "finance-bill-motion-explainer",
      "proj-005",
      "mashinani-field-documentary",
      "terra",
      "proj-terra",
    ];
    for (const alias of aliases) {
      const resolved = resolveProjectId(alias);
      const found = projectsData.getById(resolved);
      expect(found, `alias ${alias} → ${resolved} missing`).toBeTruthy();
      expect(hasSubstantialWhitePaper(found?.wysiwygProse)).toBe(true);
    }
  });

  it("appends TERRA transcript into the white paper when authored body exists", () => {
    const terra = projectsData.getById("project-terra");
    expect(terra).toBeTruthy();
    expect(terra?.wysiwygProse || "").toMatch(/Source film transcript|full transcript|Africa is going digital/i);

    const transcript = getProjectTranscript({ projectId: "project-terra" });
    expect(transcript?.fullTranscript || transcript?.segments?.length).toBeTruthy();
  });

  it("builds a dossier from archive fields when no authored prose exists", () => {
    const md = generateProjectWhitePaper({
      id: "demo",
      slug: "demo",
      title: "Demo Civic Film",
      description: "A short description of the civic film.",
      briefChallenge: "Explain a hard public-finance question without inventing figures.",
      whatWeProduced: "A 10-minute documentary and field stills.",
      outputs: ["Master film", "Social cut-downs"],
      impactEvidence: {
        primaryMetric: "Partner briefing used in two county forums",
        verificationOutcome: "Partner acknowledgment on file",
      },
      videoId: "xxxxxxxxxxx",
      videoUrl: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
      transcript: {
        source: "authored",
        language: "en",
        videoId: "xxxxxxxxxxx",
        fullTranscript: "This is the spoken narration from the film about public money.",
        segments: [
          { start: 0, end: 4, text: "This is the spoken narration" },
          { start: 4, end: 8, text: "from the film about public money." },
        ],
      },
    });

    expect(hasSubstantialWhitePaper(md)).toBe(true);
    expect(md).toContain("## The challenge");
    expect(md).toContain("## Source film transcript");
    expect(md).toContain("spoken narration");
  });

  it("does not attach wrong CABRI YouTube id to the UON featured story", () => {
    const uon = projectsData.getById("story-mty40jp1");
    expect(uon).toBeTruthy();
    expect(uon?.videoId).not.toBe("kWpY4K1uI20");
    expect(uon?.videoUrl || "").not.toContain("kWpY4K1uI20");
  });
});
