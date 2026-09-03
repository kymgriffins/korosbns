import { describe, expect, it } from "vitest";
import { studiosEvidenceData } from "@/data/studios-evidence";
import {
  NARRATIVE_BY_CONTENT_TYPE,
  resolveNarrative,
  validateStudioProject,
} from "@/lib/studio-content-laws";

describe("studio content laws", () => {
  it("covers every content type with a narrative kind", () => {
    for (const project of studiosEvidenceData.getAllProjects()) {
      expect(
        NARRATIVE_BY_CONTENT_TYPE[project.contentType],
        `${project.slug} has no narrative kind`,
      ).toBeDefined();
    }
  });

  it("seed projects comply with universal + narrative laws", () => {
    for (const project of studiosEvidenceData.getAllProjects()) {
      expect(
        validateStudioProject(project),
        `${project.slug} violations`,
      ).toEqual([]);
    }
  });

  it("rejects placeholder copy and bad slugs", () => {
    const [base] = studiosEvidenceData.getAllProjects();
    const violations = validateStudioProject({
      ...base,
      slug: "Bad Slug!",
      title: "Short",
      description: "Lorem ipsum dolor sit amet, coming soon TBD xxx todo fixme. ".repeat(3),
      outputs: [],
    });
    const laws = violations.map((v) => v.law);
    expect(laws).toContain("slug-kebab");
    expect(laws).toContain("title-length");
    expect(laws).toContain("outputs-count");
    expect(laws).toContain("no-placeholders");
  });

  it("rejects undeclared narrative structures", () => {
    const [base] = studiosEvidenceData.getAllProjects();
    const violations = validateStudioProject({
      ...base,
      formatDetails: { seasons: [] } as unknown as typeof base.formatDetails,
    });
    expect(violations.map((v) => v.law)).toContain("no-undeclared-structures");
  });

  it("derives honest narrative defaults from outputs", () => {
    const [base] = studiosEvidenceData.getAllProjects();
    const narrative = resolveNarrative({ ...base, formatDetails: undefined });
    expect(narrative.chapters.length).toBe(base.outputs.length);
    expect(narrative.credits.length).toBeGreaterThanOrEqual(3);
    expect(narrative.voices[0]?.name).toBe(base.organization.name);
  });
});
