import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProgrammeDetail } from "@/components/programmes/programme-detail";
import { ProgrammeProjectGrid } from "@/components/programmes/programme-project-grid";
import { ProgrammesProjectsLoop } from "@/components/programmes/programmes-projects-loop";
import { getProgramme } from "@/constants/programmes-content";
import { getFooterVariant } from "@/lib/marketing-layout";
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
  describe("01 — Component Order & CTA as Last Section on Programme Detail Pages", () => {
    it("connect: ends with Join the Desk CTA as the final section, with no bridge trailing", () => {
      const p = getProgramme("connect")!;
      const { container } = render(<ProgrammeDetail programme={p} />);

      // Verify the article root exists
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();

      // Top element is TelemetryHUD / Header
      const header = article?.querySelector("header");
      expect(header).toBeInTheDocument();
      expect(screen.getByText(/The budget lands as a PDF/i)).toBeInTheDocument();

      // Programme Project Grid exists
      expect(
        screen.getByRole("heading", { name: /National Budget Explainers & Series/i }),
      ).toBeInTheDocument();

      // Final child section in article is the CTA
      const lastChild = article?.lastElementChild;
      expect(lastChild).toBeInTheDocument();
      expect(lastChild?.tagName.toLowerCase()).toBe("footer");
      expect(
        screen.getByRole("heading", { name: /Become a Budget Tracker/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Apply as a Budget Tracker/i }),
      ).toBeInTheDocument();

      // Strict check: the cut chapter bridge text MUST NOT be rendered
      expect(screen.queryByText(/Four programmes/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Continue the arc/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Enter Wanahabari Lab/i)).not.toBeInTheDocument();
    });

    it("mashinani: preserves loved scrollytelling animations and ends with County Desk CTA as the final section", () => {
      const p = getProgramme("mashinani")!;
      const { container } = render(<ProgrammeDetail programme={p} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();

      // Scrollytelling elements present
      expect(screen.getAllByText(/BNS MASHINANI/i).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByRole("heading", {
          name: /Kakamega\. Kilifi\. Nakuru\. Wajir\.\s*Stay long enough to matter\./i,
        }),
      ).toBeInTheDocument();

      // Field notebook spread and field voice quote present
      expect(screen.getByText(/Field voice · Coastal hub/i)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /A dashboard is useless when the power is out\./i,
        }),
      ).toBeInTheDocument();

      // Flagship outputs grid is present
      expect(
        screen.getByRole("heading", {
          name: /Devolved Scorecards, Barazas & Field Documentaries/i,
        }),
      ).toBeInTheDocument();

      // Final child is the CTA band
      const lastSection = article?.lastElementChild;
      expect(lastSection).toBeInTheDocument();
      expect(
        screen.getByText(/Follow the shilling where you live\./i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Explore county evidence/i }),
      ).toBeInTheDocument();

      // No noisy chapter bridge text
      expect(screen.queryByText(/Four programmes/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Next · Wanahabari Lab/i)).not.toBeInTheDocument();
    });

    it("wanahabari-lab: ends with Cohort Admissions CTA as the final section", () => {
      const p = getProgramme("wanahabari-lab")!;
      const { container } = render(<ProgrammeDetail programme={p} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();

      // Hero & Light-table
      expect(screen.getAllByText(/WANAHABARI LAB/i).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByRole("heading", { name: /Method first\. Headlines second\./i }),
      ).toBeInTheDocument();

      // Flagship outputs grid
      expect(
        screen.getByRole("heading", {
          name: /Investigative Research & Newsroom Toolkits/i,
        }),
      ).toBeInTheDocument();

      // Final child is the CTA
      const lastChild = article?.lastElementChild;
      expect(lastChild).toBeInTheDocument();
      expect(lastChild?.tagName.toLowerCase()).toBe("footer");
      expect(
        screen.getByRole("heading", {
          name: /Join the next Wanahabari Lab cohort\./i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Submit Lab application/i }),
      ).toBeInTheDocument();

      // No chapter bridge
      expect(screen.queryByText(/Four programmes/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Continue the arc/i)).not.toBeInTheDocument();
    });

    it("studios: ends with Commercial Intake CTA as the final section", () => {
      const p = getProgramme("studios")!;
      const { container } = render(<ProgrammeDetail programme={p} />);

      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();

      // Hero
      expect(screen.getAllByText(/BNS STUDIOS/i).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByRole("heading", {
          name: /High-craft media\.\s*A civic surplus attached\./i,
        }),
      ).toBeInTheDocument();

      // Flagship outputs grid
      expect(
        screen.getByRole("heading", {
          name: /Commissioned Storytelling, Documentaries & Broadcasts/i,
        }),
      ).toBeInTheDocument();

      // Final child is the commission CTA
      const lastChild = article?.lastElementChild;
      expect(lastChild).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Commission the craft\. Fuel the civic work\./i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Commission the Studio/i }),
      ).toBeInTheDocument();

      // No chapter bridge
      expect(screen.queryByText(/Four programmes/i)).not.toBeInTheDocument();
    });
  });

  describe("02 — ProgrammeProjectGrid Non-Fragmentation Invariant", () => {
    it("renders all desk outputs in a unified grid without fragmented '1 Output' headers", () => {
      render(<ProgrammeProjectGrid programmeSlug="connect" />);

      // Should have unified heading
      expect(
        screen.getByRole("heading", { name: /Tangible Projects from This Desk/i }),
      ).toBeInTheDocument();

      // All 3 projects for Connect rendered
      expect(
        screen.getByRole("heading", { name: /Budget Sasa ni Delivery/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Finance Bill Motion Graphics/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Budget Mtaani TikTok Series/i }),
      ).toBeInTheDocument();

      // There should NOT be any isolated "1 Output" headers
      expect(screen.queryByText(/1 Output$/i)).not.toBeInTheDocument();

      // Total count indicator and format filter strip
      expect(screen.getAllByText(/Verified Outputs/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/All Formats/i)).toBeInTheDocument();
    });
  });

  describe("03 — Global All-in-One Projects Explorer on /programmes", () => {
    it("renders all 13 verified productions across all 4 desks simultaneously in Grid View", () => {
      render(<ProgrammesProjectsLoop />);

      // Grid View toggle is active by default
      const gridBtn = screen.getByTestId("view-toggle-grid");
      expect(gridBtn).toBeInTheDocument();
      expect(gridBtn).toHaveAttribute("aria-pressed", "true");

      // Key projects from each of the 4 desks are immediately present in the DOM
      // Desk 1 (Connect)
      expect(
        screen.getByRole("heading", { name: /Budget Sasa ni Delivery/i }),
      ).toBeInTheDocument();
      // Desk 2 (Mashinani)
      expect(
        screen.getByRole("heading", { name: /Nakuru Citizen Budget Baraza/i }),
      ).toBeInTheDocument();
      // Desk 3 (Wanahabari Lab)
      expect(
        screen.getByRole("heading", {
          name: /Illicit Financial Flows & Sovereign Resource Governance/i,
        }),
      ).toBeInTheDocument();
      // Desk 4 (Studios)
      expect(
        screen.getByRole("heading", { name: /Budget Ndio Story Podcast/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Project TERRA/i }),
      ).toBeInTheDocument();

      // Total count of verified productions is 13
      const allProjects = studiosEvidenceData.getAllProjects();
      expect(allProjects.length).toBe(13);
      expect(screen.getByText(/13 Verified Productions/i)).toBeInTheDocument();
    });

    it("filters to specific desk outputs on tab click without page navigation", () => {
      render(<ProgrammesProjectsLoop />);

      // Click Mashinani tab
      const mashinaniTab = screen.getByTestId("filter-tab-mashinani");
      fireEvent.click(mashinaniTab);

      // Mashinani outputs shown
      expect(
        screen.getByRole("heading", { name: /Nakuru Citizen Budget Baraza/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Mashinani: Promise vs Delivery/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          name: /Wajir Community Listening Sessions/i,
        }),
      ).toBeInTheDocument();

      // Connect output should not be shown
      expect(
        screen.queryByRole("heading", { name: /Budget Sasa ni Delivery/i }),
      ).not.toBeInTheDocument();
    });

    it("supports switching to Reel Loop and back to Grid View", () => {
      render(<ProgrammesProjectsLoop />);

      const reelBtn = screen.getByTestId("view-toggle-reel");
      fireEvent.click(reelBtn);
      expect(reelBtn).toHaveAttribute("aria-pressed", "true");

      const gridBtn = screen.getByTestId("view-toggle-grid");
      fireEvent.click(gridBtn);
      expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("04 — Minimalist Footer Route Invariant", () => {
    it("returns 'minimal' footer variant for all programme routes and slug pages", () => {
      expect(getFooterVariant("/programmes")).toBe("minimal");
      expect(getFooterVariant("/programmes/connect")).toBe("minimal");
      expect(getFooterVariant("/programmes/mashinani")).toBe("minimal");
      expect(getFooterVariant("/programmes/wanahabari-lab")).toBe("minimal");
      expect(getFooterVariant("/programmes/studios")).toBe("minimal");
      expect(getFooterVariant("/bns-studio")).toBe("minimal");
      expect(getFooterVariant("/bns-studio/cabri-digital-pfm-reforms")).toBe(
        "minimal",
      );
      expect(getFooterVariant("/help")).toBe("minimal");
      expect(getFooterVariant("/glossary")).toBe("minimal");
    });

    it("preserves full 'marketing' footer exclusively on primary landing and about", () => {
      expect(getFooterVariant("/")).toBe("marketing");
      expect(getFooterVariant("/about")).toBe("marketing");
    });

    it("returns 'none' for learning and story immersive interfaces", () => {
      expect(getFooterVariant("/learn")).toBe("none");
      expect(getFooterVariant("/stories/123")).toBe("none");
    });
  });
});
