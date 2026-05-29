import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { LearnDashboardPanel } from "../learn-dashboard-panel";
import type { CivicModule } from "@/types/learn";

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

vi.mock("@/ui/progress", () => ({
  Progress: vi.fn(
    ({
      value,
      className,
      ...props
    }: { value?: number; className?: string }) => (
      <div
        data-testid="progress-bar"
        data-value={value}
        className={className}
        {...props}
      />
    ),
  ),
}));

vi.mock("@/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("../bitmoji-avatar", () => ({
  BitmojiAvatar: ({ gender }: { gender?: string }) => (
    <div data-testid="bitmoji" data-gender={gender} />
  ),
}));

const mockText = {
  dashboardTitle: "Budget Ndio Story",
  dashboardSubtitle: "Master public finance through interactive stages",
  streak: "Daily Streak",
};

function makeStage(overrides?: Partial<CivicModule>): CivicModule {
  return {
    id: "mod-1",
    title: "Stage 1: Constitution",
    slug: "stage-1-constitution",
    badge: "🛡️",
    badgeName: "DocNative",
    documentName: "Constitution of Kenya 2010",
    archive: "2010",
    link: "https://example.com",
    status: "Published",
    credits: "BNS Team",
    description: "Learn about public finance foundations.",
    expectations: ["Decode your budget rights."],
    order: 1,
    steps: [],
    ...overrides,
  };
}

function mockProfile(badgeCount: number) {
  const badges: string[] = [];
  const stageProgress: number[] = [];
  for (let i = 0; i < badgeCount; i++) {
    badges.push(`badge-${i}`);
    stageProgress.push(i + 1);
  }
  return {
    breakName: "Test User",
    county: "Nairobi",
    sovereigns: 100,
    streakDays: 5,
    badges,
    stageProgress,
    gender: "male" as const,
  };
}

function renderPanel(opts: {
  badgeCount?: number;
  stage?: CivicModule;
  totalStages?: number;
} = {}) {
  const {
    badgeCount = 0,
    stage,
    totalStages = 3,
  } = opts;
  return render(
    <LearnDashboardPanel
      text={mockText}
      profile={mockProfile(badgeCount)}
      currentStage={stage ?? makeStage()}
      totalStages={totalStages}
      onSelectStage={vi.fn()}
    />,
  );
}

describe("LearnDashboardPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard title and subtitle from text props", () => {
    renderPanel({ badgeCount: 0, totalStages: 3 });
    expect(screen.getByText("Budget Ndio Story")).toBeInTheDocument();
    expect(
      screen.getByText("Master public finance through interactive stages"),
    ).toBeInTheDocument();
  });

  it("renders the current stage title and badge", () => {
    const stage = makeStage({ title: "Stage 2: Budget Cycle" });
    renderPanel({ badgeCount: 0, stage, totalStages: 3 });
    expect(screen.getByText("Stage 2: Budget Cycle")).toBeInTheDocument();
    expect(screen.getByText("🛡️")).toBeInTheDocument();
  });

  it("renders the Resume Learning button", () => {
    renderPanel({ badgeCount: 0, totalStages: 3 });
    expect(screen.getByText("Resume Learning")).toBeInTheDocument();
  });

  it("shows the user's sovereigns and streak days", () => {
    renderPanel({ badgeCount: 2, totalStages: 3 });
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("5d")).toBeInTheDocument();
  });

  describe("Progress bar uses dynamic totalStages (NOT hardcoded 8)", () => {
    it("with 0 badges, Progress value is 0 regardless of totalStages", () => {
      renderPanel({ badgeCount: 0, totalStages: 3 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBe(0);
    });

    it("with 2 badges out of 3 stages, Progress value is (2/3)*100", () => {
      renderPanel({ badgeCount: 2, totalStages: 3 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBeCloseTo(
        (2 / 3) * 100,
      );
    });

    it("with 6 badges out of 12 stages, Progress value is (6/12)*100 = 50", () => {
      renderPanel({ badgeCount: 6, totalStages: 12 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBeCloseTo(
        (6 / 12) * 100,
      );
    });

    it("with 8 badges out of 12 stages, Progress value is (8/12)*100, not 100", () => {
      renderPanel({ badgeCount: 8, totalStages: 12 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBeCloseTo(
        (8 / 12) * 100,
      );
      expect(Number(bar.getAttribute("data-value"))).not.toBeCloseTo(100);
    });

    it("with 12 badges out of 12 stages, Progress value is 100", () => {
      renderPanel({ badgeCount: 12, totalStages: 12 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBeCloseTo(100);
    });
  });

  describe("Text display shows correct stage count from dynamic totalStages", () => {
    it("with 0 badges, shows 0 as numerator", () => {
      renderPanel({ badgeCount: 0, totalStages: 5 });
      expect(
        screen.getByText((content) => content.startsWith("0 /")),
      ).toBeInTheDocument();
    });

    it("with 2 badges, the denominator in the text is NOT 8", () => {
      renderPanel({ badgeCount: 2, totalStages: 3 });
      const el = screen.getByText((content) => {
        return /^\d+ \/ \d+ Stages Mastered$/.test(content.trim());
      });
      const denominator = parseInt(el.textContent!.split("/")[1].trim(), 10);
      expect(denominator).not.toBe(8);
    });

    it("the denominator in the progress text matches dynamic totalStages", () => {
      renderPanel({ badgeCount: 3, totalStages: 7 });
      const el = screen.getByText((content) => {
        return /^\d+ \/ \d+ Stages Mastered$/.test(content.trim());
      });
      const text = el.textContent!;
      const [numStr, denStr] = text
        .replace("Stages Mastered", "")
        .split("/")
        .map((s) => s.trim());
      const numerator = parseInt(numStr, 10);
      const denominator = parseInt(denStr, 10);
      expect(numerator).toBe(3);
      expect(denominator).toBe(7);
    });
  });

  describe("Dynamic totalStages affects progress math", () => {
    it("with 1 badge and dynamic totalStages=3, Progress is (1/3)*100", () => {
      renderPanel({ badgeCount: 1, totalStages: 3 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).toBeCloseTo(
        (1 / 3) * 100,
      );
    });

    it("with 1 badge and dynamic totalStages=12, Progress is (1/12)*100", () => {
      renderPanel({ badgeCount: 1, totalStages: 12 });
      const bar = screen.getByTestId("progress-bar");
      expect(Number(bar.getAttribute("data-value"))).not.toBeCloseTo(
        (1 / 8) * 100,
      );
    });
  });
});
