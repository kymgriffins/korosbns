import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProjectTerraEditorial } from "../project-terra-editorial";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("ProjectTerraEditorial", () => {
  it("limits the dossier to five conversion sections", () => {
    render(<ProjectTerraEditorial />);
    const root = screen.getByTestId("project-terra-editorial");
    expect(root.getAttribute("data-section-count")).toBe("5");

    const sections = root.querySelectorAll("[data-project-section]");
    expect(sections.length).toBeLessThanOrEqual(5);
    expect(
      Array.from(sections).map((el) => el.getAttribute("data-project-section")),
    ).toEqual(["what", "media", "outcomes", "cta"]);
  });

  it("does not dump the TERRA transcript as primary body copy", () => {
    const { container } = render(<ProjectTerraEditorial />);
    expect(screen.queryByText(/Verbatim Audio Transcript/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download JSON/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Timed Segments/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/full_transcript/i)).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/project-terra-transcript\.json/i);
    expect(
      screen.getByRole("heading", { name: /Documentary announcement/i }),
    ).toBeInTheDocument();
  });
});
