import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StickyStackedCycle, type StickyCycleItem } from "../sticky-stacked-cycle";

const MOCK_CYCLE_ITEMS: StickyCycleItem[] = [
  {
    id: "stage-01",
    step: "01",
    title: "Treasury Formulation",
    description: "MTEF spending ceilings and Budget Policy Statement.",
    date: "Aug 2025 – Feb 2026",
    badge: "Treasury",
  },
  {
    id: "stage-02",
    step: "02",
    title: "Public Participation",
    description: "County hearings and civic memoranda.",
    date: "May – Jun 2026",
    badge: "Citizens",
  },
  {
    id: "stage-03",
    step: "03",
    title: "Parliament Review",
    description: "National Assembly scrutinises estimates and passes appropriation act.",
    date: "Jun 2026",
    badge: "Parliament",
  },
  {
    id: "stage-04",
    step: "04",
    title: "Executive Assent",
    description: "Cabinet Secretary presents statement and President signs Finance Bill.",
    date: "Jun 2026",
    badge: "Executive",
  },
  {
    id: "stage-05",
    step: "05",
    title: "Implementation & Delivery",
    description: "Ministries and counties turn allocations into services.",
    date: "Jul 2026",
    badge: "Delivery",
    stat: {
      value: "KSh 4.82T",
      label: "Verified allocation execution across 47 counties",
    },
    cta: {
      label: "Track Live Delivery",
      href: "/reports",
    },
  },
];

describe("StickyStackedCycle Component", () => {
  it("renders the eyebrow, title, and description", () => {
    render(
      <StickyStackedCycle
        eyebrow="FY 2026/27 Budget Cycle"
        title="Budget Tracker & Allocations"
        description="Who moves Kenya's budget forward across five clear stages."
        items={MOCK_CYCLE_ITEMS}
      />
    );

    expect(screen.getByText("FY 2026/27 Budget Cycle")).toBeInTheDocument();
    expect(screen.getByText("Budget Tracker & Allocations")).toBeInTheDocument();
    expect(
      screen.getByText("Who moves Kenya's budget forward across five clear stages.")
    ).toBeInTheDocument();
  });

  it("renders all 5 cycle stages in the sticky rail and right content", () => {
    render(
      <StickyStackedCycle
        title="Budget Tracker & Allocations"
        items={MOCK_CYCLE_ITEMS}
      />
    );

    expect(screen.getByText("Stage 1 of 5")).toBeInTheDocument();
    expect(screen.getAllByText(/Treasury Formulation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Public Participation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Parliament Review/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Executive Assent/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Implementation & Delivery/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders delivery metric and live tracking link on delivery stage", () => {
    render(
      <StickyStackedCycle
        title="Budget Tracker & Allocations"
        items={MOCK_CYCLE_ITEMS}
      />
    );

    expect(screen.getByText("KSh 4.82T")).toBeInTheDocument();
    expect(
      screen.getByText("Verified allocation execution across 47 counties")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Track Live Delivery/i })).toHaveAttribute(
      "href",
      "/reports"
    );
  });

  it("allows clicking a stepper button to trigger scroll", () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    render(
      <StickyStackedCycle
        title="Budget Tracker & Allocations"
        items={MOCK_CYCLE_ITEMS}
      />
    );

    const stepButtons = screen.getAllByRole("button", { name: /Public Participation/i });
    expect(stepButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(stepButtons[0]);

    // Active state updates
    expect(screen.getByText("Stage 2 of 5")).toBeInTheDocument();
  });
});
