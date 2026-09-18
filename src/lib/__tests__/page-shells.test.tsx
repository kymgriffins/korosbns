import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  PageShell,
  ArticleShell,
  ProjectShell,
  ProgrammeShell,
  CatalogShell,
  resolveLayoutArchetype,
  LAYOUT_ARCHETYPES,
  LAYOUT_ARCHETYPES_LIST,
  type LayoutArchetype,
} from "@/layouts/page-shells";

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

describe("Page Shells & Layout Archetype Engine", () => {
  describe("01 - Archetype Token Configuration", () => {
    it("defines five distinct archetypes with complete layout tokens", () => {
      const archetypes: LayoutArchetype[] = [
        "sovereign",
        "editorial",
        "cinematic",
        "brutalist",
        "ark",
      ];
      expect(LAYOUT_ARCHETYPES_LIST).toHaveLength(5);

      for (const id of archetypes) {
        const config = LAYOUT_ARCHETYPES[id];
        expect(config).toBeDefined();
        expect(config.id).toBe(id);
        expect(config.label).toBeTruthy();
        expect(config.tagline).toBeTruthy();
        expect(config.containerMeasure).toBeTruthy();
        expect(config.sectionPadding).toBeTruthy();
      }
    });

    it("safely falls back to sovereign when invalid archetype is provided", () => {
      const fallback = resolveLayoutArchetype("non-existent-archetype" as any);
      expect(fallback.id).toBe("sovereign");

      const resolved = resolveLayoutArchetype("cinematic");
      expect(resolved.id).toBe("cinematic");
    });
  });

  describe("02 - Base PageShell", () => {
    it.each(["sovereign", "editorial", "cinematic", "brutalist"] as const)(
      "renders %s archetype with data attribute and custom measure",
      (archetype) => {
        const { container } = render(
          <PageShell archetype={archetype}>
            <div data-testid="child-content">Chassis Body</div>
          </PageShell>
        );

        const shell = container.querySelector(`[data-layout-archetype="${archetype}"]`);
        expect(shell).toBeInTheDocument();
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
      }
    );
  });

  describe("03 - ArticleShell Polymorphism", () => {
    const mockArticle = {
      title: "Public Finance Audit FY2026",
      subtitle: "Forensic breakdown of national debt service",
      eyebrow: "SPECIAL INVESTIGATION",
      content: "Detailed findings on sovereign borrowing ceilings.",
      authorName: "Dr. Lyla Latif",
      publishedAt: "2026-03-01",
      readTime: "6 min read",
    };

    it("renders broadside editorial layout with serif headline", () => {
      render(<ArticleShell article={mockArticle} archetype="editorial" />);
      expect(screen.getByRole("heading", { name: mockArticle.title })).toHaveClass("font-serif");
      expect(screen.getByText(mockArticle.eyebrow)).toBeInTheDocument();
      expect(screen.getByText(/Dr\. Lyla Latif/i)).toBeInTheDocument();
    });

    it("renders cinematic layout with immersive theatre canvas", () => {
      const { container } = render(<ArticleShell article={mockArticle} archetype="cinematic" />);
      expect(container.querySelector(".bg-\\[\\#04060a\\]")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: mockArticle.title })).toBeInTheDocument();
    });

    it("renders brutalist layout with monospace ticker and sharp borders", () => {
      render(<ArticleShell article={mockArticle} archetype="brutalist" />);
      expect(screen.getByText(/REPORT CODE \/\//i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: mockArticle.title })).toHaveClass("font-mono");
    });

    it("renders sovereign layout with institutional grid and golden ratio", () => {
      render(<ArticleShell article={mockArticle} archetype="sovereign" />);
      expect(screen.getByRole("heading", { name: mockArticle.title })).toBeInTheDocument();
      expect(screen.getByText(mockArticle.subtitle)).toBeInTheDocument();
    });
  });

  describe("04 - ProjectShell Polymorphism", () => {
    const mockProject = {
      id: "project-terra",
      title: "Project TERRA",
      subtitle: "Tax and platform algorithmic justice",
      prose: "Investigating how platform algorithms exclude African women.",
      authorName: "Dr. Lyla Latif",
      programmeLabel: "Wanahabari Lab",
      hostInstitution: "House of Fiscal Wisdom",
      metrics: [{ label: "Jurisdictions", value: "10 Nations" }],
    };

    it("renders cinematic project theatre with widescreen media frame", () => {
      const { container } = render(<ProjectShell project={mockProject} archetype="cinematic" />);
      expect(container.querySelector(".bg-\\[\\#04060a\\]")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: mockProject.title })).toBeInTheDocument();
    });

    it("renders brutalist project watchdog dossier with case id", () => {
      render(<ProjectShell project={mockProject} archetype="brutalist" />);
      expect(screen.getByText(/CASE ID \/\/ PROJECT-TERRA/i)).toBeInTheDocument();
      expect(screen.getByText(/DOSSIER INDEX/i)).toBeInTheDocument();
    });

    it("renders sovereign project with two-column case study rail", () => {
      render(<ProjectShell project={mockProject} archetype="sovereign" />);
      expect(screen.getByRole("heading", { name: mockProject.title })).toBeInTheDocument();
      expect(screen.getByText("Case Study Metadata")).toBeInTheDocument();
      expect(screen.getByText("10 Nations")).toBeInTheDocument();
    });
  });

  describe("05 - ProgrammeShell Polymorphism", () => {
    const mockProgramme = {
      slug: "connect",
      title: "BNS Connect",
      headline: "Public Participation in Action",
      description: "Mobilising civic voices across counties.",
      pillars: [
        { title: "Civic Townhalls", description: "Direct dialogue with county assemblies" },
      ],
      reels: [
        { title: "Nairobi Assembly Hearing", url: "https://example.com/reel.mp4" },
      ],
    };

    it("renders cinematic programme with reels spotlight", () => {
      render(<ProgrammeShell programme={mockProgramme} archetype="cinematic" />);
      expect(screen.getByText(/EVIDENCE REELS & FIELD DISPATCHES/i)).toBeInTheDocument();
      expect(screen.getByText("Nairobi Assembly Hearing")).toBeInTheDocument();
    });

    it("renders brutalist programme with operational audit pillars", () => {
      render(<ProgrammeShell programme={mockProgramme} archetype="brutalist" />);
      expect(screen.getByText(/DESK ID \/\//i)).toBeInTheDocument();
      expect(screen.getByText("Civic Townhalls")).toBeInTheDocument();
    });

    it("renders sovereign programme with structured tenets", () => {
      render(<ProgrammeShell programme={mockProgramme} archetype="sovereign" />);
      expect(screen.getByRole("heading", { name: mockProgramme.headline })).toBeInTheDocument();
      expect(screen.getByText("Civic Townhalls")).toBeInTheDocument();
    });
  });

  describe("06 - CatalogShell Polymorphism", () => {
    const mockItems = [
      {
        id: "terra",
        title: "Project TERRA",
        description: "Tax justice research",
        category: "BNS Studios",
        href: "/bns-project/terra",
      },
      {
        id: "iff",
        title: "Illicit Financial Flows",
        description: "Extractive governance",
        category: "Wanahabari Lab",
        href: "/projects/iff",
      },
    ];

    it("renders editorial chronological dossier", () => {
      render(
        <CatalogShell
          title="Evidence Dossiers"
          items={mockItems}
          archetype="editorial"
        />
      );
      expect(screen.getByRole("heading", { name: "Evidence Dossiers" })).toHaveClass("font-serif");
      expect(screen.getByText("Project TERRA")).toBeInTheDocument();
      expect(screen.getAllByText(/View Dossier/i)).toHaveLength(2);
    });

    it("renders brutalist ledger with monospace indexes", () => {
      render(
        <CatalogShell
          title="Evidence Dossiers"
          items={mockItems}
          archetype="brutalist"
        />
      );
      expect(screen.getByText(/INDEX \/\/ \[01\]/i)).toBeInTheDocument();
      expect(screen.getByText("Project TERRA")).toBeInTheDocument();
    });

    it("renders sovereign bento grid", () => {
      render(
        <CatalogShell
          title="Evidence Dossiers"
          items={mockItems}
          archetype="sovereign"
        />
      );
      expect(screen.getByRole("heading", { name: "Evidence Dossiers" })).toBeInTheDocument();
      expect(screen.getByText("Project TERRA")).toBeInTheDocument();
      expect(screen.getByText("Illicit Financial Flows")).toBeInTheDocument();
    });
  });
});
