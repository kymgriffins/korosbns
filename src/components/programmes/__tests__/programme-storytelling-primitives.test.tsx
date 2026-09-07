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
    expect(screen.getByText(/Fiscal Compression/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Collapsing 400 pages into 3 verified fiscal signals/i })).toBeInTheDocument();

    // Click problem tab
    const problemBtn = screen.getByRole("button", { name: /01 · The 400-Page PDF/i });
    fireEvent.click(problemBtn);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Where public money disappears into legalistic fog/i })).toBeInTheDocument();
    });

    // Click solution tab
    const solutionBtn = screen.getByRole("button", { name: /03 · 60s Citizen Power/i });
    fireEvent.click(solutionBtn);
    await waitFor(() => {
      expect(screen.getByText(/Where the 16% Fuel Tax actually goes/i)).toBeInTheDocument();
    });
  });

  it("renders FieldNotebookSpread and allows county coordinate switching", async () => {
    render(<FieldNotebookSpread />);
    expect(screen.getByText(/Field Monitor Dossier/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Solar Hybrid Borehole & Water Kiosk/i })).toBeInTheDocument();

    // Switch to Nakuru
    const nakuruBtn = screen.getByRole("button", { name: /^Nakuru$/i });
    fireEvent.click(nakuruBtn);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Level 3 Dispensary Maternity Wing/i })).toBeInTheDocument();
    });
  });

  it("renders ForensicLightTable and toggles redaction reveal", async () => {
    render(<ForensicLightTable />);
    expect(screen.getByText(/Forensic Newsroom Light-Table/i)).toBeInTheDocument();
    expect(screen.getByText(/OCOB AUDIT DISCREPANCY MEMO/i)).toBeInTheDocument();

    const revealBtn = screen.getByRole("button", { name: /Click to Reveal Unredacted Wire/i });
    fireEvent.click(revealBtn);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Hide Unredacted Evidence/i })).toBeInTheDocument();
    });
  });

  it("renders CinemaTimelineStage with format switching", async () => {
    render(<CinemaTimelineStage />);
    expect(screen.getByText(/21:9 ANAMORPHIC DCI/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Cinema Documentaries$/i })).toBeInTheDocument();

    const animBtn = screen.getByRole("button", { name: /2D & Motion Explainers/i });
    fireEvent.click(animBtn);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /2D & Motion Explainers/i })).toBeInTheDocument();
    });
  });

  it("renders ProgrammeChapterBridge with seamless next chapter flow", () => {
    render(<ProgrammeChapterBridge currentSlug="connect" />);
    expect(screen.getByText(/CHAPTER 02/i)).toBeInTheDocument();
    expect(screen.getByText(/Taking budget tracking from Nairobi boardrooms to the village baraza/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Enter BNS Mashinani/i })).toBeInTheDocument();
  });
});
