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
    expect(screen.getByText(/Desk 01: BNS CONNECT/i)).toBeInTheDocument();
  });

  it("renders MashinaniScrollytelling for mashinani", () => {
    const p = getProgramme("mashinani")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByText(/DESK 02: COUNTY ACCOUNTABILITY/i)).toBeInTheDocument();
  });

  it("renders WanahabariScrollytelling for wanahabari-lab", () => {
    const p = getProgramme("wanahabari-lab")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByText(/DESK 03: WANAHABARI LAB/i)).toBeInTheDocument();
  });

  it("renders StudiosScrollytelling for studios", () => {
    const p = getProgramme("studios")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByText(/DESK 04: BNS STUDIOS/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Commercial creative craft/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/budget audits/i).length).toBeGreaterThanOrEqual(1);
  });
});
