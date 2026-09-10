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
  it("renders landing-format layout for connect", () => {
    const p = getProgramme("connect")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByRole("heading", { name: p.headline })).toBeInTheDocument();
    expect(screen.getByText(/What this programme does/i)).toBeInTheDocument();
    expect(screen.getByText(/Other programmes/i)).toBeInTheDocument();
  });

  it("renders landing-format layout for mashinani", () => {
    const p = getProgramme("mashinani")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByRole("heading", { name: p.headline })).toBeInTheDocument();
    expect(screen.getByText(p.name)).toBeInTheDocument();
  });

  it("renders landing-format layout for wanahabari-lab", () => {
    const p = getProgramme("wanahabari-lab")!;
    render(<ProgrammeDetail programme={p} />);
    expect(screen.getByRole("heading", { name: p.headline })).toBeInTheDocument();
  });

  it("does not treat studios as a civic programme page", () => {
    const p = getProgramme("studios")!;
    const { container } = render(<ProgrammeDetail programme={p} />);
    expect(container).toBeEmptyDOMElement();
  });
});
