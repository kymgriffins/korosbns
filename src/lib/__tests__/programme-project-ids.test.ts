import { describe, expect, it } from "vitest";
import {
  ensureUniqueSlug,
  resolveOrganizationId,
  resolveProjectId,
  slugifyProjectId,
} from "@/lib/programme-project-ids";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { PROGRAMMES, getProgramme } from "@/content";

describe("programme project ids", () => {
  it("slugifies titles into readable ids", () => {
    expect(slugifyProjectId("Budget Sasa ni Delivery")).toBe(
      "budget-sasa-ni-delivery",
    );
    expect(slugifyProjectId("CRA Third Basis Formula Spotlight")).toBe(
      "cra-third-basis-formula-spotlight",
    );
  });

  it("ensures uniqueness", () => {
    const taken = new Set(["nakuru-citizen-baraza"]);
    expect(ensureUniqueSlug("nakuru-citizen-baraza", taken)).toBe(
      "nakuru-citizen-baraza-2",
    );
  });

  it("resolves legacy numeric-style project ids to slugs", () => {
    expect(resolveProjectId("proj-001")).toBe(
      "budget-sasa-ni-delivery-explainer",
    );
    expect(resolveProjectId("proj-terra")).toBe("project-terra");
    expect(resolveProjectId("terra")).toBe("project-terra");
    expect(resolveOrganizationId("org-hofw")).toBe("house-of-fiscal-wisdom");
  });

  it("keeps every studio project id equal to its slug", () => {
    const projects = studiosEvidenceData.getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.id).toBe(project.slug);
      expect(project.id).not.toMatch(/^proj-\d+$/);
    }
  });

  it("looks up projects by legacy aliases", () => {
    expect(resolveProjectId("proj-003")).toBe("nakuru-citizen-baraza");
    const byLegacy = studiosEvidenceData.getProjectById("proj-001");
    expect(byLegacy?.slug).toBe("budget-sasa-ni-delivery-explainer");
    expect(studiosEvidenceData.getProjectBySlug("proj-001")?.id).toBe(
      "budget-sasa-ni-delivery-explainer",
    );
  });

  it("keeps programme catalogue ids aligned to slugs", () => {
    for (const programme of PROGRAMMES) {
      expect(programme.id).toBe(programme.slug);
      expect(getProgramme(programme.id)?.name).toBe(programme.name);
    }
  });
});
