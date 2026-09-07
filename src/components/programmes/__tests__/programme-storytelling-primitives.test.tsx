import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransformationStage } from "@/components/motion/transformation-stage";
import { FieldNotebookSpread } from "@/components/motion/field-notebook-spread";
import { ForensicLightTable } from "@/components/motion/forensic-light-table";
import { CinemaTimelineStage } from "@/components/motion/cinema-timeline-stage";
import { ProgrammeChapterBridge } from "@/components/programmes/programme-chapter-bridge";

describe("Programme Storytelling Primitives (Less Generic Cards, Flowing Narrative)", () => {
  it("renders TransformationStage and switches between problem, transformation, and solution", async () => {
    render(<TransformationStage />);
    expect(screen.getByText(/Distillation stage/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Collapsing 400 pages into 3 verified fiscal signals/i,
      }),
    ).toBeInTheDocument();

    const problemBtn = screen.getByRole("button", {
      name: /01 · The 400-Page PDF/i,
    });
    fireEvent.click(problemBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /Where public money disappears into legalistic fog/i,
        }),
      ).toBeInTheDocument();
    });

    const solutionBtn = screen.getByRole("button", {
      name: /03 · 60s Citizen Power/i,
    });
    fireEvent.click(solutionBtn);
    await waitFor(() => {
      expect(
        screen.getByText(/Where the 16% Fuel Tax actually goes/i),
      ).toBeInTheDocument();
    });
  });

  it("renders FieldNotebookSpread and allows county switching", async () => {
    render(<FieldNotebookSpread />);
    expect(screen.getByText(/Field notebook/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Solar borehole and water kiosk/i }),
    ).toBeInTheDocument();

    const nakuruBtn = screen.getByRole("button", { name: /^Nakuru$/i });
    fireEvent.click(nakuruBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Dispensary maternity wing/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders ForensicLightTable and toggles method detail reveal", async () => {
    render(<ForensicLightTable />);
    expect(screen.getByText(/Newsroom light-table/i)).toBeInTheDocument();
    expect(screen.getByText(/DOCUMENT FOCUS/i)).toBeInTheDocument();

    const revealBtn = screen.getByRole("button", {
      name: /Reveal method detail/i,
    });
    fireEvent.click(revealBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Hide method detail/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders CinemaTimelineStage with format switching", async () => {
    render(<CinemaTimelineStage />);
    expect(screen.getByText(/21:9 ANAMORPHIC DCI/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Cinema Documentaries$/i }),
    ).toBeInTheDocument();

    const animBtn = screen.getByRole("button", {
      name: /2D & Motion Explainers/i,
    });
    fireEvent.click(animBtn);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /2D & Motion Explainers/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders ProgrammeChapterBridge with seamless next programme flow", () => {
    render(<ProgrammeChapterBridge currentSlug="connect" />);
    expect(screen.getByText(/Next · Mashinani/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Kakamega\. Kilifi\. Nakuru\. Wajir/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Enter BNS Mashinani/i }),
    ).toBeInTheDocument();
  });
});
