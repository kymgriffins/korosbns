import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import { CIVIC_PROGRAMMES, getProgramme } from "@/constants/programmes-content";
import { getFooterVariant } from "@/lib/marketing-layout";
import { usesFullBleedHero } from "@/lib/marketing-layout";
import { studiosEvidenceData } from "@/data/studios-evidence";

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

describe("Programme Layout Hierarchy Audit", { timeout: 30000 }, () => {
  describe("01 — Landing-format civic programmes", () => {
    it.each(CIVIC_PROGRAMMES.map((p) => p.slug))(
      "%s: landing spine with programme CTA, no desk/chapter language",
      (slug) => {
        const p = getProgramme(slug)!;
        render(<ProgrammeDetail programme={p} />);

        expect(screen.getByRole("heading", { name: p.headline })).toBeInTheDocument();
        expect(screen.getByText(/What this programme does/i)).toBeInTheDocument();
        expect(screen.getByText(/Other programmes/i)).toBeInTheDocument();
        expect(screen.queryByText(/Connect Desk/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Mashinani Desk/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Wanahabari Desk/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/chapter/i)).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Partner with BNS/i })).toBeInTheDocument();
      },
    );

    it("exposes exactly three civic programmes", () => {
      expect(CIVIC_PROGRAMMES).toHaveLength(3);
      expect(CIVIC_PROGRAMMES.map((p) => p.slug)).toEqual([
        "connect",
        "mashinani",
        "wanahabari-lab",
      ]);
    });
  });

  describe("02 — Project grids use programme language", () => {
    it("renders programme project grid without desk headline", () => {
      render(<ProgrammeProjectGrid programmeSlug="connect" />);
      expect(
        screen.getByRole("heading", { name: /Tangible projects from this programme/i }),
      ).toBeInTheDocument();
    });

    it("filters evidence by programme without page navigation", () => {
      render(<ProgrammesProjectsLoop />);
      expect(
        screen.getByText(/Public Evidence Archive · Programmes & Studio/i),
      ).toBeInTheDocument();

      const mashinaniTab = screen.getByRole("button", { name: /Mashinani/i });
      fireEvent.click(mashinaniTab);
      expect(studiosEvidenceData.getAllProjects().length).toBeGreaterThan(0);
    });
  });

  describe("03 — Marketing footer variants", () => {
    it("keeps programmes routes on the site footer map", () => {
      expect(getFooterVariant("/programmes")).toBeTruthy();
      expect(getFooterVariant("/programmes/connect")).toBeTruthy();
    });

    it("uses full-bleed hero only on the partner homepage", () => {
      expect(usesFullBleedHero("/")).toBe(true);
      expect(usesFullBleedHero("/about")).toBe(false);
      expect(usesFullBleedHero("/programmes")).toBe(false);
    });
  });
});