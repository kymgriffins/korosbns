import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AgencyCaseStudyTemplate } from "../agency-case-study-template";
import { studiosEvidenceData } from "@/data/studios-evidence";

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt ?? ""} src={typeof props.src === "string" ? props.src : ""} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/studio/StudioBookingForm", () => ({
  StudioBookingForm: () => null,
}));

describe("AgencyCaseStudyTemplate", () => {
  it("keeps the case study to five conversion sections max", () => {
    const project = studiosEvidenceData.getAllProjects()[0];
    expect(project).toBeTruthy();
    if (!project) return;

    render(<AgencyCaseStudyTemplate project={project} />);
    const root = screen.getByTestId("agency-case-study");
    expect(Number(root.getAttribute("data-section-count"))).toBeLessThanOrEqual(5);

    const sections = root.querySelectorAll("[data-project-section]");
    expect(sections.length).toBeLessThanOrEqual(5);
  });
});
