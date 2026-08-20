import { describe, it, expect } from "vitest";
import { metadata } from "../page";
import { Routes } from "@/constants/routes";

describe("Careers Page Routing & Metadata", () => {
  it("defines metadata for /careers with SEO title and canonical URL", () => {
    expect(metadata.title).toContain("Careers & Creative Network");
    expect(metadata.description).toBeDefined();
    expect(metadata.alternates?.canonical).toBeDefined();
  });

  it("ensures Routes.Careers points to /careers", () => {
    expect(Routes.Careers).toBe("/careers");
  });
});
