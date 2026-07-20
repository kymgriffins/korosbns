import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StageDetailDrawer } from "../stage-detail-drawer";
import type { CivicModule } from "@/types/learn";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWithClient(ui: React.ReactElement) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/contexts/learn-context", () => ({
  useLearn: () => ({
    totalStages: 8,
    updateCurrentStep: vi.fn(),
  }),
}));

vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({ open: true, setOpen: vi.fn() }),
  useOptionalSidebar: () => ({ open: true, setOpen: vi.fn() }),
}));

vi.mock("../curriculum-sidebar", () => ({
  CurriculumSidebar: () => <div data-testid="curriculum-sidebar" />,
}));

vi.mock("../rating-section", () => ({
  RatingSection: () => <div data-testid="rating-section" />,
}));

vi.mock("../step-content", () => ({
  StepContent: ({ step, onStartTrivia }: { step: { title: string }; onStartTrivia: () => void }) => (
    <div data-testid="step-content">
      <span>{step.title}</span>
      <button onClick={onStartTrivia}>Start Knowledge Check</button>
    </div>
  ),
}));

vi.mock("../trivia-section", () => ({
  TriviaSection: () => <div data-testid="trivia-section" />,
}));

vi.mock("../mastery-page", () => ({
  MasteryPage: () => <div data-testid="mastery-page" />,
}));

vi.mock("../youtube-player", () => ({
  YouTubePlayer: () => <div data-testid="youtube-player" />,
}));

vi.mock("@/lib/module-progress", () => ({
  readProgress: vi.fn(() => ({ currentStep: 1, stepsCompleted: {}, triviaRewards: [] })),
  writeProgress: vi.fn(),
}));

vi.mock("@/lib/learn-trivia", () => ({
  triviaForStep: (_stage: any, step: any, _idx: number) => {
    if (step?.trivia?.length) return step.trivia;
    return [];
  },
}));

vi.mock("@/lib/learn-hub", () => ({
  learnHubApi: { completeChapter: vi.fn(), markProgress: vi.fn() },
}));

vi.mock("@/hooks/use-budget-data", () => ({
  useBudgetData: () => ({ budgetAllocations: [], budgetKpis: [], budgetHighlights: [], budgetLoading: false, budgetReportProfile: null }),
}));

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes("min-width: 768"), media: query, onchange: null, addListener: vi.fn(),
    removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}

const mockStage: CivicModule = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  slug: "constitution",
  order: 1,
  title: "Stage 1: Constitution",
  badge: "shield",
  badgeName: "DocNative",
  documentName: "Constitution of Kenya 2010",
  archive: "2010",
  link: "https://kenyalaw.org",
  status: "published",
  credits: "Credits: BNS Team",
  description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution.",
  expectations: [
    "Decode your 5 core budget rights in Kenya.",
  ],
  steps: [
    {
      id: "step-1",
      order: 1,
      title: "1. Public Finance Principles",
      youtube_url: "https://youtube.com/watch?v=Ed9lP0-komE",
      audio_url: "/audio/stage1_step1.mp3",
      transcript: "Hello citizens, welcome to Budget Ndio Story...",
      text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve.",
      takeaways: [],
      is_completed: false,
      is_locked: false,
      trivia: [{
          type: "multiple-choice",
        question: "Which article of the Kenyan Constitution details the principles of public finance?",
        options: ["Article 201", "Article 217", "Article 221", "Article 35"],
        answer: 0,
        explanation: "Article 201 sets out the principles of public finance.",
      }],
    },
    {
      id: "step-2",
      order: 2,
      title: "2. Budget Cycle Overview",
      youtube_url: "https://youtube.com/watch?v=abc123",
      audio_url: "/audio/stage1_step2.mp3",
      transcript: "Step 2 transcript...",
      text: "The budget cycle has four main phases.",
      takeaways: [],
      is_completed: false,
      is_locked: false,
      trivia: [{
          type: "multiple-choice",
        question: "How many phases are in the budget cycle?",
        options: ["Three", "Four", "Five", "Six"],
        answer: 1,
        explanation: "The budget cycle has four phases.",
      }],
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
  let mockOnClose: () => void;
  let mockOnUpdateProfile: (p: Record<string, unknown>) => void;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnUpdateProfile = vi.fn();
    localStorage.clear();
  });

  it("renders the stage title and breadcrumb", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getAllByText("Stage 1: Constitution")[0]).toBeInTheDocument();
    expect(screen.getByText(mockStage.documentName)).toBeInTheDocument();
  });

  it("shows the lesson count", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getByText(`${mockStage.steps.length} lessons`)).toBeInTheDocument();
  });

  it("renders Read tab as active by default", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getAllByText("Read").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Watch").length).toBeGreaterThanOrEqual(1);
  });

  it("switches to Watch tab and shows YouTubePlayer", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getAllByText("Watch")[0]);
    expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
  });

  it("shows Start Knowledge Check button on Quiz tab when trivia available", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={{
          ...mockStage,
          steps: [{
            ...mockStage.steps[0],
              trivia: [{
                type: "multiple-choice",
              question: "Test?",
              options: ["A", "B"],
              answer: 0,
              explanation: "E",
            }],
          }],
        }}
        profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    const quizButtons = screen.getAllByText("Quiz");
    fireEvent.click(quizButtons[0]);
    expect(screen.getByText("Start Knowledge Check")).toBeInTheDocument();
  });

  it("shows curriculum sidebar", () => {
    renderWithClient(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getByTestId("curriculum-sidebar")).toBeInTheDocument();
  });

  it("calls onClose when back button is clicked", () => {
    renderWithClient(
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
