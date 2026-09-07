import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProgrammeDetail } from "../programme-detail";
import { getProgramme } from "@/constants/programmes-content";

beforeEach(() => {
  vi.clearAllMocks();
  window.IntersectionObserver = vi.fn().mockImplementation(function (this: any) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  }) as any;
});

describe("ProgrammeDetail", () => {
  it("renders ConnectScrollytelling for connect", () => {
    const p = getProgramme("connect")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getAllByText(/BNS CONNECT/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("heading", {
        name: /The budget lands as a PDF\.\s*We put it back on the phone\./i,
      }),
    ).toBeInTheDocument();
  });

  it("renders MashinaniScrollytelling for mashinani", () => {
    const p = getProgramme("mashinani")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getAllByText(/BNS MASHINANI/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("heading", {
        name: /Kakamega\. Kilifi\. Nakuru\. Wajir\.\s*Stay long enough to matter\./i,
      }),
    ).toBeInTheDocument();
  });

  it("renders WanahabariScrollytelling for wanahabari-lab", () => {
    const p = getProgramme("wanahabari-lab")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getAllByText(/WANAHABARI LAB/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("heading", {
        name: /Budget Day is theatre\.\s*The story starts the morning after\./i,
      }),
    ).toBeInTheDocument();
  });

  it("renders StudiosScrollytelling for studios", () => {
    const p = getProgramme("studios")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getAllByText(/BNS STUDIOS/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("heading", {
        name: /High-craft media\.\s*A civic surplus attached\./i,
      }),
    ).toBeInTheDocument();
  });
});
