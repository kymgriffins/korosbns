import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("../_components/assignment-status", () => ({
  AssignmentStatus: () => <div data-testid="assignment-status">Assignment Status</div>,
}));
vi.mock("../_components/class-schedule", () => ({
  ClassSchedule: () => <div data-testid="class-schedule">Class Schedule</div>,
}));
vi.mock("../_components/kpi-cards", () => ({
  KpiCards: () => <div data-testid="kpi-cards">KPI Cards</div>,
}));
vi.mock("../_components/performance-highlights", () => ({
  PerformanceHighlights: () => <div data-testid="performance-highlights">Performance Highlights</div>,
}));
vi.mock("../_components/upcoming-events", () => ({
  UpcomingEvents: () => <div data-testid="upcoming-events">Upcoming Events</div>,
}));

import Page from "../page";

describe("AcademyDashboardPage", () => {
  it("renders Academy Dashboard header and subcomponents", () => {
    render(<Page />);
    expect(screen.getByText("Academy Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-cards")).toBeInTheDocument();
    expect(screen.getByTestId("class-schedule")).toBeInTheDocument();
    expect(screen.getByTestId("assignment-status")).toBeInTheDocument();
  });
});
