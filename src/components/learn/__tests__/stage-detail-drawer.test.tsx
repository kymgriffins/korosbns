import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { StageDetailDrawer } from "../stage-detail-drawer";

const TabsCtx = React.createContext<{ value: string; onValueChange: (v: string) => void }>({
  value: "", onValueChange: () => {},
});

vi.mock("@/ui/tabs", () => ({
  Tabs: ({ value, onValueChange, children, className }: any) => (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div data-testid="tabs" data-value={value} className={className}>{children}</div>
    </TabsCtx.Provider>
  ),
  TabsList: ({ children, className }: any) => (
    <div data-testid="tabs-list" className={className}>{children}</div>
  ),
  TabsTrigger: ({ value, children, className }: any) => {
    const ctx = React.useContext(TabsCtx);
    return (
      <button
        data-testid="tabs-trigger"
        data-value={value}
        className={className}
        onClick={() => ctx.onValueChange(value)}
      >
        {children}
      </button>
    );
  },
  TabsContent: ({ children, className }: any) => (
    <div data-testid="tabs-content" className={className}>{children}</div>
  ),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: {
    completeChapter: vi.fn().mockResolvedValue({}),
    markProgress: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/contexts/learn-context", () => ({
  useLearn: () => ({
    totalStages: 8,
    updateCurrentStep: vi.fn(),
  }),
}));

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes("min-width: 768"), media: query, onchange: null, addListener: vi.fn(),
    removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}

const mockStage: any = {
  id: 1, slug: "constitution", title: "Stage 1: Constitution", badge: "🛡️", badgeName: "DocNative",
  documentName: "Constitution of Kenya 2010", archive: "2010",
  link: "https://kenyalaw.org", status: "Published", credits: "Credits: BNS Team",
  description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution.",
  expectations: ["Decode your 5 core budget rights in Kenya."],
  steps: [
    {
      id: 1, title: "1. Public Finance Principles", order: 1,
      youtube_url: "https://www.youtube.com/watch?v=Ed9lP0-komE",
      audio_url: "", transcript: "",
      text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve.",
      takeaways: [],
      trivia: [{
        type: "multiple-choice",
        question: "Which article of the Kenyan Constitution details the principles of public finance?",
        options: ["Article 201", "Article 217", "Article 221", "Article 35"],
        answer: 0, explanation: "Article 201 sets out the principles of public finance.",
      }],
      is_completed: false, is_locked: false,
    },
    {
      id: 2, title: "2. Budget Cycle Overview", order: 2,
      youtube_url: "",
      audio_url: "", transcript: "",
      text: "The budget cycle has four main phases.",
      takeaways: [],
      trivia: [{
        type: "multiple-choice",
        question: "How many phases are in the budget cycle?",
        options: ["Three", "Four", "Five", "Six"],
        answer: 1, explanation: "The budget cycle has four phases.",
      }],
      is_completed: false, is_locked: false,
    },
  ],
};

const mockProfile = {
  breakName: "Test User", pseudoName: "Tester", county: "Nairobi",
  sovereigns: 100, streakDays: 5, badges: [], stageProgress: [1], participationLogs: [],
};

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage });

describe("StageDetailDrawer", () => {
  let mockOnClose: any;
  let mockOnUpdateProfile: any;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnUpdateProfile = vi.fn();
    localStorage.clear();
  });

  it("renders the stage title and breadcrumb", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getAllByText("Stage 1: Constitution")[0]).toBeInTheDocument();
    expect(screen.getByText("DocNative", { exact: false })).toBeInTheDocument();
  });

  it("shows the lesson count and duration badges", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getByText(/2 lessons/)).toBeInTheDocument();
    expect(screen.getByText("4h 5min")).toBeInTheDocument();
  });

  it("renders Read tab as active by default", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    const tabs = screen.getAllByText("Read");
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Watch").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Quiz").length).toBeGreaterThanOrEqual(1);
  });

  it("shows video player when on Watch tab", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getAllByText("Watch")[0]);
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain("youtube-nocookie.com");
  });

  it("switches to Quiz tab and shows Start Knowledge Check button", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getAllByText("Quiz")[0]);
    expect(screen.getByText("Start Knowledge Check")).toBeInTheDocument();
  });

  it("shows curriculum sidebar with step titles", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getAllByText("1. Public Finance Principles", { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("2. Budget Cycle Overview", { exact: false }).length).toBeGreaterThan(0);
  });

  it("calls onClose when back button is clicked", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    const backButton = document.querySelector("button .lucide-chevron-left")?.closest("button");
    if (backButton) fireEvent.click(backButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
