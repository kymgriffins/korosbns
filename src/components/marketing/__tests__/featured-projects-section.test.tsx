import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeaturedProjectsSection } from "../featured-projects-section";
import {
  featuredProjectsData,
  setFeaturedProjects,
} from "@/data/featured-projects";
import featuredFallback from "@/data/fallbacks/featured-projects.json";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt ?? ""} src={props.src} data-testid="project-thumb" />
  ),
}));

beforeEach(() => {
  setFeaturedProjects(
    featuredFallback.results.map((row) => ({
      ...row,
      programmeSlug: row.programmeSlug as
        | "wanahabari-lab"
        | "studios"
        | "connect"
        | "mashinani",
    })),
  );
  vi.spyOn(featuredProjectsData, "fetch").mockResolvedValue(
    featuredProjectsData.get(),
  );
});

describe("FeaturedProjectsSection", () => {
  it("renders seeded featured project titles and YouTube thumbs", async () => {
    render(<FeaturedProjectsSection />);

    expect(
      screen.getByRole("heading", { name: /Evidence partners can brief against/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /illicit financial flows in Benin/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Digital PF Reform Stories/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Project Terra/i }),
      ).toBeInTheDocument();
    });

    const thumbs = screen.getAllByTestId("project-thumb");
    expect(thumbs.length).toBe(3);
    for (const thumb of thumbs) {
      expect(thumb.getAttribute("src")).toMatch(/i\.ytimg\.com\/vi\/[\w-]{11}\/hqdefault\.jpg/);
    }
  });
});
